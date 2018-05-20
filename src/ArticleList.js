import React, {Component} from 'react';

import {
  BackHandler,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import {
  Button,
  Container,
  Header,
  Icon,
  List,
  ListItem,
} from 'native-base';

const baseUrl = 'http://ho1messi.in.8866.org:8629/';

export default class ArticleList extends Component {
  constructor(props) {
    super(props);

    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
      return true;
    });

    const {params} = this.props.navigation.state;

    this.state = {data: null};

    fetch (baseUrl + 'form/' + params.str1 + '/' + params.str2 +  '_list/' + params.id, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((json) => {
        this.setState({data: json.obj});
      })
      .catch((err) => alert(err));

  }

  renderHeader() {
    if (this.state.data)
      return (
        <Header style={styles.header}>
          <Button transparent style={styles.headerButton} onPress={() => this.props.navigation.goBack()}>
            <Icon name={'ios-arrow-back'} style={styles.headerIcon}/>
          </Button>
          <View style={styles.headerContent}>
            <Text style={styles.headerText}>
              {this.state.data.name}
            </Text>
          </View>
        </Header>
      );
    else
      return (
        <Header style={styles.header}>

        </Header>
      );
  }

  _pressRow(id) {
    const {params} = this.props.navigation.state;
    let nextPage = '';
    switch (params.str2) {
      case 'article':
        nextPage = 'ArticleDetail';
        break;
      case 'discussion':
        nextPage = 'DiscussionDetail';
        break;
    }
    this.props.navigation.navigate(nextPage, {
      id: id,
    });
  }

  renderContent() {
    if (this.state.data)
      return (
        <View style={styles.content}>
          <List dataArray={this.state.data.objects} renderRow={(d) =>
            <TouchableHighlight style={styles.listItem} onPress={() => this._pressRow(d.id)}>
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{d.title}</Text>
                <Text numberOfLines={3} style={styles.itemText}>{d.content}</Text>

                <View style={styles.itemFooter}>
                  <Text style={styles.itemFooterText}>{d.vote}赞同</Text>
                  <Text style={styles.itemFooterText}>{d.content}评论</Text>
                </View>
              </View>
            </TouchableHighlight>
          } />
        </View>
      );
    else
      return (
        <View>

        </View>
      );
  }

  render() {
    return (
      <Container>
        {this.renderHeader()}
        {this.renderContent()}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {

  },
  header: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#09f',
  },
  headerButton: {

  },
  headerIcon: {
    fontSize: 40,
  },
  headerContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  headerText: {
    paddingRight: 40,
    fontSize: 24,
    color: '#fff',
  },
  content: {
    backgroundColor: '#ddd',
  },
  contentList: {

  },
  listItem: {
    marginBottom: 5,
  },
  itemContent: {
    padding: 10,
    backgroundColor: '#fff',
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemText: {
    fontSize: 16,
  },
  itemFooter: {
    flexDirection: 'row',
    marginTop: 5,
  },
  itemFooterText: {
    fontSize: 12,
    marginRight: 10,
  },
});
