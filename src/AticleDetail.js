import React, { Component } from 'react';
import {
  BackHandler,
  ListView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import {
  Button,
  Container,
  Footer,
  Header,
  Icon,
} from 'native-base';

import Tts from 'react-native-tts';

import {
  Synthesizer,
  SpeechConstant,
} from 'react-native-speech-iflytek';

const baseUrl = 'http://ho1messi.in.8866.org:8629/';

export default class AticleDetail extends Component {
  constructor(props) {
    super(props);

    this.speak = this.speak.bind(this);
    this.favor = this.favor.bind(this);
    this.comment = this.comment.bind(this);

    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
      return true;
    });

    const {params} = this.props.navigation.state;
    //params = {id: 10}
    let article = {id: 0, title: '', favor: 0, comment: 0, author: '', favored: false, content: ''};
    this.state = {article: article};

    Synthesizer.init('5adaf59b');

    fetch (baseUrl + 'form/detail/article/' + params.id + '/')
      .then((response) => response.json())
      .then((json) => {
        this.setState({article: json.obj});
      })
      .catch((err) => {
        alert(err);
      });
  }

  speak() {
    Synthesizer.start(this.state.article.content);

    /*
    Tts.getInitStatus()
      .then(() => {
        alert('speak');
        Tts.speak('Hello, world!')
      });
    */
  }

  favor() {
    let article = this.state.article;
    article.favored = !article.favored;
    this.setState({article: article});
  }

  comment() {
    alert('comment');
  }

  render() {
    const {params} = this.props.navigation.state;

    let article = this.state.article;
    return (
      <Container>

        <Header style={styles.header}>
          <Button transparent style={styles.headerButton} onPress={() => this.props.navigation.goBack()}>
            <Icon name={'ios-arrow-back'} style={styles.headerIconBig}/>
          </Button>
          <View style={styles.headerContent}>
            <Text style={styles.headerText}>
              {article.title}
              </Text>
          </View>
          <Button transparent style={styles.headerButton} onPress={this.speak}>
            <Icon name={'md-headset'} style={styles.headerIcon}/>
          </Button>
        </Header>

        <ScrollView>
          <Text style={styles.contentAuthor}>{article.author}:</Text>
          <Text style={styles.contentText}>{article.content}</Text>
        </ScrollView>

        <Footer style={styles.footer}>
          <View style={styles.footerContent}>
            <Button transparent onPress={this.favor}>
              <Icon name={article.favored ? 'md-heart' : 'md-heart-outline'} style={styles.footerIcon}/>
            </Button>
            <Text style={styles.footerText}>
              {article.favor}
            </Text>
          </View>

          <View style={styles.footerContent}>
            <Text style={styles.footerText}>
              {article.comment}
            </Text>
            <Button transparent onPress={this.comment}>
              <Icon name={'ios-text-outline'} style={[styles.footerIcon, styles.footerIconBig]}/>
            </Button>
          </View>
        </Footer>

      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'flex-start',
    backgroundColor: '#09f',
  },
  headerButton: {
    //flexBasis: 30,
  },
  headerContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
  },
  headerIcon: {
    fontSize: 35,
  },
  headerIconBig: {
    fontSize: 40,
  },
  contentAuthor: {
    fontSize: 26,
    marginBottom: 20,
    //paddingLeft: 10,
    //paddingRight: 10,
    padding: 10,
  },
  contentText: {
    fontSize: 18,
    paddingLeft: 10,
    paddingRight: 10,
  },
  footer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#09f',
  },
  footerIcon: {
    fontSize: 30,
    color: '#fff',
  },
  footerIconBig: {
    fontSize: 35,
  },
  footerContent: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 20,
    color: '#fff',
  },
});
