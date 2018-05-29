import React, { Component } from 'react';
import {
  BackHandler,
  ListView,
  NativeEventEmitter,
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

import Markdown from 'react-native-simple-markdown';

const baseUrl = 'http://ho1messi.in.8866.org:8629/';

//let Markdown = require('react-native-markdown');

export default class ArticleDetail extends Component {
  constructor(props) {
    super(props);

    this.speak = this.speak.bind(this);
    this.vote = this.vote.bind(this);
    this.comment = this.comment.bind(this);

    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
      return true;
    });

    const {params} = this.props.navigation.state;
    //params = {id: 10}
    let article = {id: 0, title: '', vote: 0, comment: 0, author: '', voted: false, content: ''};
    this.state = {article: article};

    let startFlag = false;
    let playFlag = false;


    Synthesizer.init('5adaf59b');
    this.SynthesizerEventEmitter = new NativeEventEmitter(Synthesizer);
    this.SynthesizerEventEmitter.addListener('onSynthesizerBufferCompletedEvent', this.onSynthesizerBufferCompletedEvent);
    this.SynthesizerEventEmitter.addListener('onSynthesizerSpeakCompletedEvent', this.onSynthesizerBufferCompletedEvent);
    //Synthesizer.start('开始');

    fetch (baseUrl + 'form/detail/article/' + params.id + '/')
      .then((response) => response.json())
      .then((json) => {
        this.setState({article: json.obj});
      })
      .catch((err) => {
        alert(err);
      });
  }

  componentDidMount() {
  }

  onSynthesizerBufferCompletedEvent() {
    console.log('begin');
    this.playFlag = true;
  }

  onSynthesizerSpeakCompletedEvent() {
    console.log('speak');
    this.playFlag = false;
  }

  speak() {
    if (this.startFlag) {
      if (this.playFlag) {
        Synthesizer.pause();
        this.playFlag = false;
      }
      else {
        Synthesizer.resume();
        this.playFlag = true;
      }
    }
    else {
      Synthesizer.start(this.state.article.content);
      this.startFlag = true;
      this.playFlag = true;
    }

    /*
    Tts.getInitStatus()
      .then(() => {
        alert('speak');
        Tts.speak('Hello, world!')
      });
    */
  }

  vote() {
    let article = this.state.article;

    let formData = new FormData();
    formData.append('article', article.id);

    fetch (baseUrl + 'form/publish/vote/', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.err)
          alert(json.err);
        else {
          if (article.voted)
            article.vote--;
          else
            article.vote++;
          article.voted = !article.voted;
          this.setState({article: article});
        }
      })
  }

  comment() {
    const {params} = this.props.navigation.state;
    this.props.navigation.navigate('CommentDetail', {
      id: params.id,
      type: 'article',
    });
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

        <ScrollView style={styles.contentMain}>
          <Text style={styles.contentAuthor}>{article.author}:</Text>
          <Markdown style={styles.contentText} styles={markdownStyles}>
            {article.content}
            </Markdown>
        </ScrollView>

        <Footer style={styles.footer}>
          <View style={styles.footerContent}>
            <Button transparent onPress={this.vote}>
              <Icon name={article.voted ? 'md-heart' : 'md-heart-outline'} style={styles.footerIcon}/>
            </Button>
            <Text style={styles.footerText}>
              {article.vote}
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
  contentMain: {
    marginLeft: 10,
    marginRight: 10,
  },
  contentAuthor: {
    fontSize: 26,
    marginBottom: 20,
    //paddingLeft: 10,
    //paddingRight: 10,
    padding: 10,
  },
  contentText: {
    marginLeft: 20,
    marginRight: 20,
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

const markdownStyles = {
  heading1: {
    color: '#09f',
    fontSize: 30,
    marginTop: 30,
    marginBottom: 30,
  },
  header2: {
    fontSize: 26,
    marginTop: 25,
    marginBottom: 25,
  },
  image: {
    width: 320,
    height: 320,
    resizeMode: 'contain',
    margin: 10,
  },
  text: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
  }

};
