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
} from 'native-base';

import ModalDropdown from 'react-native-modal-dropdown';

import {
  StackNavigator,
} from 'react-navigation';

import BaseComponent from './src/BaseComponent';
import ArticleScene from './src/ArticleScene';
import CommentScene from './src/DiscussionScene';
import MapScene from './src/MapScene';
import UserScene from './src/UserScene';

import ArticleDetail from './src/AticleDetail';
import DiscussionDetail from './src/DiscussionDetail';
import PublicArticle from './src/PublicArticle';
import ChooseArea from './src/ChooseArea';

const tabs = [
  'article',
  'comment',
  'map',
  'mine'
];

class HomeScreen extends Component {
  static screen = null;
  static ContentStack = null;

  constructor(props) {
    super(props);
    this.state = {selectedTab: 3};
    this.user = {userName: '', userId: 0};

    this.onHeaderButton = this.onHeaderButton.bind(this);
    this.jumpToArticleDetail = this.jumpToArticleDetail.bind(this);
    this.jumpToCommentDetail = this.jumpToCommentDetail.bind(this);
    this.setLoginState = this.setLoginState.bind(this);

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
        initialRouteParams: {setLoginState: this.setLoginState, updateFlag: true, user: this.user},
      },
    );

  }

  setLoginState(u) {
    this.user = u;
    this.setState({selectedTab: this.state.selectedTab});
  }

  onHeaderButton() {
    switch (this.state.selectedTab) {
      case 0:
        this.props.navigation.navigate('PublicArticle');
        break;
      case 1:
      case 2:
      case 3:
        break;
    }
  }

  onHeaderDorpdown_1(index, value) {
    alert(value);
  }

  onHeaderDorpdown_2(index, value) {
    alert(value);
  }

  jumpToArticleDetail(id) {
    this.props.navigation.navigate('Article', {
      id: id,
    });
  }

  jumpToCommentDetail(id) {
    this.props.navigation.navigate('Comment', {
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
            <ModalDropdown options={['评论景区', '评论景点']}
                           style={styles.headerMenu}
                           dropdownStyle={[styles.headerMenuItem]}
                           dropdownTextStyle={styles.headerMenuText}
                           dropdownTextHighlightStyle={styles.headerMenuText}
                           onSelect={(index, value) => this.onHeaderDorpdown_1(index, value)}>
              <Icon style={styles.headerIconBig}
                    name={'ios-add-outline'} />
            </ModalDropdown>
        );
      case 2:
      case 3:
        return (
            <ModalDropdown options={['拍照', '上传']}
                           style={styles.headerMenu}
                           dropdownStyle={[styles.headerMenuItem]}
                           dropdownTextStyle={styles.headerMenuText}
                           dropdownTextHighlightStyle={styles.headerMenuText}
                           onSelect={(index, value) => this.onHeaderDorpdown_2(index, value)}>
              <Icon style={styles.headerIcon}
                    name={'ios-qr-scanner'} />
            </ModalDropdown>
        );
    }
  }

  render() {

    return (
      <View style={styles.container}>

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
                      BaseComponent.scene.nav().navigate('Comment', {onJump: this.jumpToCommentDetail})
                    }}>
              <Icon name={'ios-text'}
                    style={
                      this.state.selectedTab === 1 ? [styles.footerIconBig, styles.footerIconActive] : styles.footerIconBig
                    }/>
            </Button>
            <Button onPress={() => {
                      this.setState({selectedTab: 2});
                      BaseComponent.scene.nav().navigate('Map')
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
    Article: {
      screen: ArticleDetail,
    },
    Comment: {
      screen: DiscussionDetail,
    },
    PublicArticle: {
      screen: PublicArticle,
    },
    ChooseArea: {
      screen: ChooseArea,
    }
  },
  {
    headerMode: 'none',
    initialRouteName: 'Home',
    //initialRouteName: 'ChooseArea',
  },
);

export default class App extends Component {
  render() {
    return <RootStack/>;
  }
}

