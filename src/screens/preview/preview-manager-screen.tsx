import React, { Component } from 'react';
import { View, Text, Button, Container, Content, Header, Left, Icon, Body, Right, Spinner } from 'native-base';
import { WebView, StyleSheet } from 'react-native';
import { NavigationScreenProp, SafeAreaView } from 'react-navigation';
import Config from 'react-native-config';
import styles from './preview-manager-style';
import Video from 'react-native-video';
import { FileType, Constant } from '../../constant';
import PreviewManager from '../../manager/preview-manager';

interface Props {
    // tslint:disable-next-line:no-any
    navigation: NavigationScreenProp<any>;
}

interface State {
    isLoading: boolean;
    path: string;
    dirPath: string;
    resourceId: number;
    fileType: string;
    videoPath: string;
}
export default class PreviewManagerScreen extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: true,
            path: '',
            dirPath: '',
            resourceId: 0,
            fileType: '',
            videoPath: '',
        };
    }

    public async componentDidMount() {
        const dirPath = this.props.navigation.getParam('dir');
        const launcherFile = this.props.navigation.getParam('launcherFile') as string;
        const fileName = this.props.navigation.getParam('fileName') as string;
        const fileType = this.props.navigation.getParam('fileType') as string;
        const resourceId = this.props.navigation.getParam('resourceId') as number;
        await PreviewManager.previewZipOrVideoFile(dirPath, launcherFile, fileName, fileType, resourceId, async (path, isLoading, type) => {
            if (type === FileType.video) {
                this.setState({
                    isLoading: isLoading,
                    videoPath: path,
                    fileType: fileType,
                });
            } else {
                const htmlPath = Constant.platform === 'android' ? `file://${path}` : path;
                console.log('html path', htmlPath);
                this.setState({
                    path: htmlPath,
                    isLoading: isLoading,
                    fileType: fileType,
                });
            }
        });
    }

    public renderVideoOrHtmlFile(fileType: string) {
        if (fileType === FileType.video) {
            return (
                <Video
                    source={{ uri: this.state.videoPath }}
                    resizeMode='cover'
                    style={StyleSheet.absoluteFill}
                />
            );
        } else {
            return (
                <WebView
                    originWhitelist={['*']}
                    allowFileAccess={true}
                    source={{ uri: this.state.path }}
                />
            );
        }
    }
    public renderIndicator() {
        return (
            <View style={styles.container}>
                <Spinner style={styles.spinnerConatiner} size={'large'} color='#000' />
            </View>
        );
    }
    public render() {
        const fileName = this.props.navigation.getParam('fileName') as string;
        return (
            <SafeAreaView style={styles.contentContainer} forceInset={{ top: 'never' }}>
                <Container>
                    <Header noShadow style={styles.headerContainer} androidStatusBarColor={Config.PRIMARY_COLOR} iosBarStyle={'light-content'}>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.pop()}>
                                <Icon name='arrow-back' style={styles.iconColor} />
                            </Button>
                        </Left>
                        <Body>
                            <Text>{fileName}</Text>
                        </Body>
                        <Right />
                    </Header>
                    <Content contentContainerStyle={styles.contentContainer}>
                        {this.state.isLoading ? this.renderIndicator()
                            : <View style={styles.contentContainer}>
                                {this.renderVideoOrHtmlFile(this.state.fileType)}
                            </View>
                        }
                    </Content>
                </Container>
            </SafeAreaView>
        );
    }
}
