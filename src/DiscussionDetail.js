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

const baseUrl = 'http://ho1messi.in.8866.org:8629/';

export default class DiscussionDetail extends Component {
  constructor(props) {
    super(props);

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

    fetch (baseUrl + 'form/detail/discussion/' + params.id + '/')
      .then((response) => response.json())
      .then((json) => {
        this.setState({article: json.obj});
      })
      .catch((err) => {
        alert(err);
      });
  }

  vote() {
    let article = this.state.article;

    let formData = new FormData();
    formData.append('discussion', article.id);

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
      type: 'discussion',
    });
  }

  render() {
    const {params} = this.props.navigation.state;

    let article = this.state.article;
    return (
      <Container>

        <Header style={styles.header}>
          <Button transparent style={styles.headerButton} onPress={() => this.props.navigation.goBack()}>
            <Icon name={'ios-arrow-back'} style={styles.headerIcon}/>
          </Button>
          <View style={styles.headerContent}>
            <Text style={styles.headerText}>
              {article.title}
              </Text>
          </View>
        </Header>

        <ScrollView>
          <Text style={styles.contentAuthor}>{article.author}:</Text>
          <Text style={styles.contentText}>{article.content}</Text>
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
