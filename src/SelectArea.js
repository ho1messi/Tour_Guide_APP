import React, {Component} from 'react';
import {
  BackHandler,
  StyleSheet,
  View,
} from 'react-native';

import {
  Button,
  Container,
  Content,
  Header,
  Icon,
  List,
  ListItem,
  Text,
} from 'native-base';

const baseUrl = 'http://ho1messi.in.8866.org:8629/';

export default class SelectArea extends Component {
  constructor(props) {
    super(props);

    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
      return true;
    });

    this.state = {areas: []};

    this._pressRow = this._pressRow.bind(this);

    fetch (baseUrl + 'scenic/area_list/', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((json) => {
        this.setState({areas: json.obj});
      })
      .catch((err) => alert(err));
  }

  _pressRow(id) {
    const {params} = this.props.navigation.state;
    this.props.navigation.navigate('SelectSpot', {
      area_id: id,
      op: params.op,
    })
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
              选择景区
            </Text>
          </View>
        </Header>
        <Content style={styles.content}>
          <List dataArray={this.state.areas} renderRow={(d) =>
            <ListItem onPress={() => this._pressRow(d.id)}>
              <Text>{d.name}</Text>
            </ListItem>
          }>
            <ListItem itemHeader first>
              header
            </ListItem>
          </List>
        </Content>
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
    paddingRight: 50,
    fontSize: 24,
    color: '#fff',
  },
  content: {

  },
});
