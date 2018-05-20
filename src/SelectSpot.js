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

export default class SelectSpot extends Component {
  constructor(props) {
    super(props);

    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
      return true;
    });

    this.state = {spots: []};

    const {params} = this.props.navigation.state;
    this.area_id = params.area_id;

    fetch (baseUrl + 'scenic/spot_list/' + params.area_id, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((json) => {
        this.setState({spots: this.addFirstNullSpot(json.obj)});
      })
      .catch((err) => alert(err));
  }

  addFirstNullSpot(spots) {
    let nullSpot = {id: 0, name: '不选择景点', area_id: this.area_id}
    return [nullSpot].concat(spots);
  }

  _pressRow(spot_id, area_id) {
    const {params} = this.props.navigation.state;
    switch (params.op) {
      case 'PublishArticle':
        this.props.navigation.navigate('PublishArticle', {
          spot_id: spot_id,
          area_id: area_id,
        });
        break;
      case 'PublishDiscussion':
        this.props.navigation.navigate('PublishDiscussion', {
          spot_id: spot_id,
          area_id: area_id,
        });
        break;
    }
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
              选择景点
            </Text>
          </View>
        </Header>
        <Content style={styles.content}>
          <List dataArray={this.state.spots} renderRow={(d) =>
            <ListItem onPress={() => this._pressRow(d.id, d.area_id)}>
              <Text>{d.name}</Text>
            </ListItem>
          } />
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