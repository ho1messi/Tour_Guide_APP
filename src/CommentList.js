import React, {Component} from 'react';
import {
  BackHandler,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  Button,
  Container,
  Content,
  Footer,
  Header,
  Icon,
  List,
  ListItem,
} from 'native-base';

const baseUrl = 'http://ho1messi.in.8866.org:8629/';

export default class CommentList extends Component {
  constructor(props) {
    super(props);

    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
      return true;
    });

    this.state = {data: []};

    const {params} = this.props.navigation.state;

    fetch (baseUrl + 'form/' + params.type + '/comment_list/' + params.id, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((json) => {
        this.setState({data: json.obj});
      })
      .catch((err) => alert(err));

  }

  render() {
    return (
      <Container style={styles.container}>
        <Header style={styles.header}>
          <Button transparent style={styles.headerButton} onPress={() => this.props.navigation.goBack()}>
            <Icon name={'ios-arrow-back'} style={styles.headerIcon}/>
          </Button>
          <View style={styles.headerContent}>
            <Text style={styles.headerText}>
              评论
            </Text>
          </View>
        </Header>

        <Content style={styles.content}>
          <List style={styles.list} dataArray={this.state.data} renderRow={(d) =>
            <ListItem style={styles.listItem}>
              <Text style={styles.itemTitle}>
                {d.name}
                </Text>
              <Text style={styles.itemContent}>
                {d.content}
                </Text>
            </ListItem>
          }/>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {

  },
  header: {
    backgroundColor: '#09f',
    alignItems: 'center',
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
    fontSize: 24,
    paddingRight: 40,
    color: '#fff',
  },

  content: {

  },
  list: {

  },
  listItem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingRight: 10,
  },
  itemTitle: {
    fontSize: 18,
  },
  itemContent: {
    fontSize: 17,
  },

});