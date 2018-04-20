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
  Header,
  Icon,
} from 'native-base';

export default class PublicArticle extends Component {
  constructor(props) {
    super(props);

    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
      return true;
    });

    this.title = '';
    this.content = '';

    this.public = this.public.bind(this);
  }

  public() {
    //------------------------------------------
    alert(this.title);
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header style={styles.header}>
          <Button transparent style={styles.headerButton} onPress={() => this.props.navigation.goBack()}>
            <Icon name={'ios-arrow-back'} style={styles.headerIconBig}/>
          </Button>
          <Text style={styles.headerText}>
            发表
          </Text>
          <Button transparent style={styles.headerButton} onPress={this.public}>
            <Icon name={'md-send'} style={styles.headerIcon}/>
          </Button>
        </Header>
        <View style={styles.content}>
          <TextInput style={styles.inputTitle}
                     multiline={true}
                     onChangeText={(t) => this.title = t}
                     placeholder={'添加标题'}/>
          <TextInput style={styles.inputContent}
                     multiline={true}
                     onChangeText={(t) => this.content = t}
                     placeholder={'添加正文'}
                     underlineColorAndroid={'#fff'}/>
        </View>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#09f',
  },
  headerButton: {

  },
  headerIcon: {
    fontSize: 30,
  },
  headerIconBig: {
    fontSize: 40,
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
  },
  content: {
    flexGrow: 1,
    paddingTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
  },
  inputTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputContent: {
    fontSize: 18,
  },
});