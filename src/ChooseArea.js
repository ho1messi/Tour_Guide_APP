import React, {Component} from 'react';
import {
  StyleSheet,
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

export default class ChooseArea extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let obj = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    //let ds = new List.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    //let data = ds.cloneWithRows(obj);
    return (
      <Container style={styles.container}>
        <Header style={styles.header}>
          <Button transparent style={styles.headerButton} onPress={() => this.props.navigation.goBack()}>
            <Icon name={'ios-arrow-back'} style={styles.headerIcon}/>
          </Button>
          <Text style={styles.headerText}>
            选择景区
          </Text>
          <Button transparent style={styles.headerButton}>
            <Icon name={'ios-arrow-forward'} style={styles.headerIcon}/>
          </Button>
        </Header>
        <Content style={styles.content}>
          <List dataArray={obj} renderRow={(d) =>
            <ListItem>
              <Text>{d}</Text>
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
    justifyContent: 'space-between',
    backgroundColor: '#09f',
  },
  headerButton: {

  },
  headerIcon: {
    fontSize: 40,
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
  },
  content: {

  },
});
