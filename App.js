/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  BackHandler,
  Image,
  ListView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';

import {
  Button,
  Footer,
  FooterTab,
  Header,
  Icon,
  List,
  ListItem,
} from 'native-base';

import ModalDropdown from 'react-native-modal-dropdown';

import {
  StackNavigator,
} from 'react-navigation';

import AwesomeAlert from 'react-native-awesome-alerts';
import PopupDialog, {
  DialogButton,
} from 'react-native-popup-dialog';

import BaseComponent from './src/BaseComponent';
import ArticleScene from './src/ArticleScene';
import CommentScene from './src/DiscussionScene';
import MapScene from './src/MapScene';
import UserScene from './src/UserScene';

import ArticleDetail from './src/ArticleDetail';
import DiscussionDetail from './src/DiscussionDetail';
import CommentDetail from './src/CommentDetail';
import AreaDetial from './src/AreaDetail';
import SpotDetial from './src/SpotDetail';
import PublishArticle from './src/PublishArticle';
import PublishDiscussion from './src/PublishDiscussion';
import SelectArea from './src/SelectArea';
import SelectSpot from './src/SelectSpot';
import ArticleList from './src/ArticleList';


const baseUrl = 'http://ho1messi.in.8866.org:8629/';

const tabs = [
  'article',
  'content',
  'map',
  'mine'
];

let ImagePicker = require('react-native-image-picker');

const imagePickerOptions = {
  title: '选择图片',
  cancelButtonTitle: '取消',
  takePhotoButtonTitle: '拍照',
  chooseFromLibraryButtonTitle: '相册',
  maxHeight: 400,
  maxWidth: 400,
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

class HomeScreen extends Component {
  static screen = null;
  static ContentStack = null;

  constructor(props) {
    super(props);
    this.state = {selectedTab: 3};
    this.user = {userName: '', userId: 0};
    this.area = {name: '', id: -1};
    this.recognizeResult = {name: '', id: -1};
    this.recognizeProb = -1;
    this.recognizeOptions = [];

    this.onHeaderButton = this.onHeaderButton.bind(this);
    this.jumpToArticleDetail = this.jumpToArticleDetail.bind(this);
    this.jumpToDiscussionDetail = this.jumpToDiscussionDetail.bind(this);
    this.jumpToAreaDetail = this.jumpToAreaDetail.bind(this);
    this.jumpToSpotDetail = this.jumpToSpotDetail.bind(this);
    this.setLoginState = this.setLoginState.bind(this);
    this.setArea = this.setArea.bind(this);

    HomeScreen.screen = this;
    HomeScreen.ContentStack = StackNavigator({
        Article: {
          screen: ArticleScene,
        },
        Comment: {
          screen: CommentScene,
        },
        Map: {
          screen: MapScene,
        },
        User: {
          screen: UserScene,
        }
      },
      {
        headerMode: 'none',
        initialRouteName: 'User',
        initialRouteParams: {
          setLoginState: this.setLoginState,
          updateFlag: true,
          user: this.user,
          area: this.area.name
        },
      },
    );

  }

  setLoginState(u) {
    this.user = u;
    this.setState({selectedTab: this.state.selectedTab});
  }

  setArea(id, name) {
    this.area = {id: id, name: name};
  }

  onHeaderButton() {
    switch (this.state.selectedTab) {
      case 0:
        if (this.user.userId)
          this.props.navigation.navigate('SelectArea', {op: 'PublishArticle'});
        else
          alert('请先登录');
        break;
      case 1:
        if (this.user.userId)
          this.props.navigation.navigate('SelectArea', {op: 'PublishDiscussion'});
        else
          alert('请先登录');
        break;
      case 2:
      case 3:
        if (this.area.id >= 0)
          ImagePicker.showImagePicker(imagePickerOptions, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            } else {
              console.log('ImagePicker URI: ', response.uri);

              let formData = new FormData();
              let file = {uri: response.uri, type: 'multipart/form-data', name: 'a.jpg'}

              formData.append('img', file);

              fetch (baseUrl + 'scenic/upload_image/' + this.area.id, {
                method: 'POST',
                headers: {
                  'Content-type': 'multipart/form-data',
                },
                body: formData,
              })
                .then((response) => response.json())
                .then((json) => {
                  console.log('response json: ', json);

                  let recognizeResult = json.obj;
                  this.recognizeResult = {name: recognizeResult.names[0], id: recognizeResult.id[0]};
                  this.recognizeProb = recognizeResult.probs[0];
                  this.recognizeOptions = [];
                  for (let i = 0; i < recognizeResult.names.length; i++)
                    this.recognizeOptions.push({
                      name: recognizeResult.names[i],
                      id: recognizeResult.id[i],
                    });

                  this.setState(this.state);
                  this._popupDialog.show();
                })
                .catch((err) => alert(err));
            }
          });
        else
          alert('请先选择景区');
        break;
    }
  }

  jumpToArticleDetail(id) {
    this.props.navigation.navigate('ArticleDetail', {
      id: id,
    });
  }

  jumpToDiscussionDetail(id) {
    this.props.navigation.navigate('DiscussionDetail', {
      id: id,
    });
  }

  jumpToAreaDetail(id) {
    this.props.navigation.navigate('AreaDetail', {
      id: id,
      area: this.area.id,
      onSelect: this.setArea,
    });
  }

  jumpToSpotDetail(id) {
    this.props.navigation.navigate('SpotDetail', {
      id: id,
    });
  }

  returnHeaderButton() {
    switch (this.state.selectedTab) {
      case 0:
        return (
            <Icon style={styles.headerIconBig}
                  name={'ios-add-outline'} />
        );
      case 1:
        return (
          <Icon style={styles.headerIconBig}
                name={'ios-add-outline'} />
        );
      case 2:
      case 3:
        return (
          <Icon style={styles.headerIcon}
                name={'ios-qr-scanner'} />
        );
    }
  }

  renderPopupDialog() {
    if (this.recognizeProb > 80) {
      return (
        <View style={styles.recognizeContent}>
          <Text style={styles.recognizeTitle}>
            识别成功
          </Text>
          <Button style={styles.recognizeButton} onPress={() => this.jumpToSpotDetail(this.recognizeResult.id)}>
            <Text style={styles.recognizeButtonText}>
              {this.recognizeResult.name}
              </Text>
          </Button>
          <Text style={styles.recognizeText}>
            也可能是：
          </Text>
          <List style={styles.recognizeList}
                dataArray={this.recognizeOptions.slice(1)} renderRow={(d) =>
            <ListItem style={styles.recognizeListItem} onPress={() => this.jumpToSpotDetail(d.id)}>
              <Text style={styles.recognizeListText}>
                {d.name}
              </Text>
            </ListItem>
          } />
        </View>
      );
    } else if (this.recognizeProb > 0) {
      return (
        <View style={styles.recognizeContent}>
          <Text style={styles.recognizeTitle}>
            识别失败
          </Text>
          <Text style={styles.recognizeText}>
            识别可信度较低，请手动选择
          </Text>
          <List style={styles.recognizeList}
                dataArray={this.recognizeOptions} renderRow={(d) =>
            <ListItem style={styles.recognizeListItem} onPress={() => this.jumpToSpotDetail(d.id)}>
              <Text style={styles.recognizeListText}>
                {d.name}
                </Text>
            </ListItem>
          } />
        </View>
      );
    } else {
      return (
        <View style={styles.recognizeContent}>
          <Text style={styles.recognizeText}>
            识别失败
          </Text>
        </View>
      );
    }
  }

  render() {

    return (
      <View style={styles.container}>

        <PopupDialog height={370}
                     ref={(popupDialog) => this._popupDialog = popupDialog} >
          {this.renderPopupDialog()}
        </PopupDialog>

        <Header style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerText}>
              {this.user.userName ? this.user.userName : '请登录'}
            </Text>
          </View>
          <Button transparent style={styles.headerButton} onPress={this.onHeaderButton}>
            {this.returnHeaderButton()}
          </Button>
        </Header>

        <HomeScreen.ContentStack/>

        <Footer>
          <FooterTab style={styles.footer}>
            <Button onPress={() => {
                      this.setState({selectedTab: 0});
                      BaseComponent.scene.nav().navigate('Article', {onJump: this.jumpToArticleDetail})}
                    }>
              <Icon name={'ios-paper'}
                    style={
                      this.state.selectedTab === 0 ? [styles.footerIcon, styles.footerIconActive] : styles.footerIcon
                    }/>
            </Button>
            <Button onPress={() => {
                      this.setState({selectedTab: 1});
                      BaseComponent.scene.nav().navigate('Comment', {onJump: this.jumpToDiscussionDetail})
                    }}>
              <Icon name={'ios-text'}
                    style={
                      this.state.selectedTab === 1 ? [styles.footerIconBig, styles.footerIconActive] : styles.footerIconBig
                    }/>
            </Button>
            <Button onPress={() => {
                      this.setState({selectedTab: 2});
                      BaseComponent.scene.nav().navigate('Map', {onJump: this.jumpToAreaDetail})
                    }}>
              <Icon name={'md-compass'}
                    style={
                      this.state.selectedTab === 2 ? [styles.footerIcon, styles.footerIconActive] : styles.footerIcon
                    }/>
            </Button>
            <Button onPress={() => {
                      this.setState({selectedTab: 3});
                      BaseComponent.scene.nav().navigate('User', {
                        setLoginState: this.setLoginState,
                        updateFlag: false,
                        user: this.user,
                        area: this.area.name,
                      })
                    }}>
              <Icon name={'md-contact'}
                    style={
                      this.state.selectedTab === 3 ? [styles.footerIcon, styles.footerIconActive] : styles.footerIcon
                    }/>
            </Button>
          </FooterTab>
        </Footer>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },

  recognizeContent: {
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 20,
    paddingBottom: 20,
  },
  recognizeTitle: {
    alignSelf: 'center',
    fontSize: 26,
    marginBottom: 10,
  },
  recognizeText: {
    alignSelf: 'center',
    fontSize: 20,
  },
  recognizeButton: {
    alignSelf: 'center',
    flexBasis: 40,
    paddingLeft: 15,
    paddingRight: 15,
    margin: 20,
    backgroundColor: '#09f',
  },
  recognizeButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  recognizeList: {
    margin: 10,
  },
  recognizeListItem: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  recognizeListText: {
    fontSize: 18,
  },

  header: {
    backgroundColor: '#09f',
  },
  headerContent: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
  },
  headerButton: {

  },
  headerIcon: {
    color: '#fff',
    fontSize: 30,
  },
  headerIconBig: {
    color: '#fff',
    fontSize: 50,
  },
  headerMenu: {

  },
  headerMenuItem: {
    backgroundColor: '#fff',
    height: -1,
  },
  headerMenuText: {
    fontSize: 18,
    color: '#666',
  },
  footer: {
    backgroundColor: '#09f',
  },
  footerIcon: {
    fontSize: 30,
  },
  footerIconBig: {
    fontSize: 35,
  },
  footerIconActive: {
    color: '#fff',
  },

  icon: {
    height: 30,
    width: 30,
  },
  tab: {
    height: 60,
    alignItems: 'center',
  },
  topBar: {
  },
  content: {
    flexGrow: 1,
    flexShrink: 1,
  },
});

const RootStack = StackNavigator({
    Home: {
      screen: HomeScreen,
    },
    ArticleDetail: {
      screen: ArticleDetail,
    },
    DiscussionDetail: {
      screen: DiscussionDetail,
    },
    CommentDetail: {
      screen: CommentDetail,
    },
    AreaDetail: {
      screen: AreaDetial,
    },
    SpotDetail: {
      screen: SpotDetial,
    },
    PublishArticle: {
      screen: PublishArticle,
    },
    PublishDiscussion: {
      screen: PublishDiscussion,
    },
    SelectArea: {
      screen: SelectArea,
    },
    SelectSpot: {
      screen: SelectSpot,
    },
    ArticleList: {
      screen: ArticleList,
    },
  },
  {
    headerMode: 'none',
    initialRouteName: 'Home',
    //initialRouteName: 'CommentDetail',
    //initialRouteParams: {id: 2, type: 'discussion'},
  },
);

export default class App extends Component {
  render() {
    return <RootStack/>;
  }
}

