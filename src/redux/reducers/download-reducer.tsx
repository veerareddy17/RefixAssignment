import { DOWNLOAD_START, DOWNLOAD_PROGRESS, DOWNLOAD_SUCCESS, DOWNLOAD_FAILURE } from '../actions/action-types';
import { Action } from '../../models/generic-action';
import { initialState } from '../../models/initial-download-file-state';

export default function downloadReducer(state = initialState, action: { type: string, progress: number, task?: any }) {
    switch (action.type) {
        case DOWNLOAD_START:
            return {
                ...state,
                isLoading: true,
            };
        case DOWNLOAD_PROGRESS:
            return {
                ...state,
                progress: action.progress,
                isLoading: true,
                error: '',
                task: action.task,
            };
        case DOWNLOAD_SUCCESS:
            return {
                ...state,
                progress: action.progress,
                isLoading: false,
                error: '',
                task: null,
            };
        case DOWNLOAD_FAILURE:
            return {
                ...state,
                progress: 0,
                isLoading: false,
                error: 'Download canceled by user',
                task: null,
            };
        default:
            return state;
    }
}