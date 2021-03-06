import { LOAD_USER_SUCCESS, LOAD_USER_START, LOAD_USER_FAILURE } from './action-types';
import { ApiResponse } from '../../models/response-model';
import ApiManager from '../../manager/api-manager';
import { Dispatch } from 'redux';
import { ActivationAppResponse } from '../../models/login-model';
import Config from 'react-native-config';
import { Constant } from '../../constant';
import LocalDbManager from '../../manager/localdb-manager';
import { Alert } from 'react-native';
import { DownloadedFilesModel } from '../../models/downloadedfile-model';

export const loadUserRequest = () => {
    return {
        type: LOAD_USER_START,
    };
};
export const loadUserSuccess = (data: ActivationAppResponse) => {
    return {
        type: LOAD_USER_SUCCESS,
        payload: data,
    };
};
export const loadUserFailed = (error: string) => {
    return {
        type: LOAD_USER_FAILURE,
        payload: error,
    };
};
export class LoginResponse {
    public user = new ActivationAppResponse();
    public isLoading: boolean = false;
    public error: string = '';
}
export default function loginApi(pin: string): (dispatch: Dispatch) => Promise<void> {
    return async (dispatch: Dispatch) => {
        await dispatch(loadUserRequest());
        await ApiManager.post<ApiResponse<ActivationAppResponse>>(`${Config.BASE_URL}/${Constant.activateAppURL}`, { iPadPin: pin }, '', async (response, err, isNetworkFail) => {
            console.log('internetfail', isNetworkFail);
            if (!isNetworkFail) {
                if (response) {
                    if (response.Success) {
                        if (Constant.loginName !== response.Data.UserFullName) {
                            LocalDbManager.delete(Constant.downloadedFiles, (error) => { });
                        }
                        LocalDbManager.insert<ActivationAppResponse>(Constant.userDetailes, response.Data, (err) => { });
                        dispatch(loadUserSuccess(response.Data));
                    } else {
                        try {
                            let error = response.Errors[0];
                            await dispatch(loadUserFailed(Constant.validationPin));
                        } catch {
                            await dispatch(loadUserFailed(Constant.networkConnctionFailed));
                        }
                    }
                } else {
                    await dispatch(loadUserFailed(Constant.networkConnctionFailed));
                }
            } else {
                await dispatch(loadUserFailed(Constant.noInternetConnction));
            }
        });
    };
}