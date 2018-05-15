import React, { Component } from 'react';
import {
  BackHandler,
  ListView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';

import {
  Button,
  Container,
  Content,
  Form,
  Input,
  Item,
  List,
  ListItem,
  Separator,
} from 'native-base';

import BaseComponent from './BaseComponent';

const baseUrl = 'http://ho1messi.in.8866.org:8629/';

class Scene1 extends Component {
  constructor(props) {
    super(props);
  }

  getAreaInfo() {
    if (this.props.area === '')
      return (
        <ListItem style={styles.listItem}>
          <Text style={styles.listText}>
            无
          </Text>
        </ListItem>
      );
    else
      return (
        <ListItem style={styles.listItem}>
          <Text style={styles.listText}>
            {this.props.area}
          </Text>
        </ListItem>
      );
  }

  render() {
    return (
      <Content style={styles.content}>
        <Separator bordered style={styles.separator}>
          <Text style={styles.separatorText}>
            当前景区
          </Text>
        </Separator>
        {this.getAreaInfo()}
        <Separator bordered style={styles.separator}>
          <Text style={styles.separatorText}>
            用户
          </Text>
        </Separator>
        <ListItem style={styles.listItem}>
          <Text style={styles.listText}>
            我的关注
          </Text>
        </ListItem>
        <ListItem style={styles.listItem}>
          <Text style={styles.listText}>
            我的文章
          </Text>
        </ListItem>
        <ListItem style={styles.listItem}>
          <Text style={styles.listText}>
            我的讨论
          </Text>
        </ListItem>
        <ListItem style={styles.listItem}>
          <Text style={styles.listText}>
            我的回复
          </Text>
        </ListItem>
        <ListItem style={styles.listItem}>
          <Text style={styles.listText}>
            修改密码
          </Text>
        </ListItem>
        <ListItem style={styles.listItem} onPress={this.props.onFunc}>
          <Text style={styles.listText}>
            退出
          </Text>
        </ListItem>


      </Content>
    )
  }
}

class Scene2 extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <Content style={styles.content}>
          <Form style={styles.form}>
            <Item style={styles.formItem}>
              <Input placeholder={'用户名'} style={styles.textInput} onChangeText={this.props.userNameInput}/>
            </Item>
            <Item style={styles.formItem}>
              <Input secureTextEntry placeholder={'密码'} style={styles.textInput} onChangeText={this.props.passwordInput}/>
            </Item>
          </Form>
          <Content style={styles.buttonContainer}>
            <Button full style={styles.button} onPress={this.props.login}>
              <Text style={styles.buttonText}>
                登录
              </Text>
            </Button>
            <Button full style={styles.button} onPress={this.props.signUp}>
              <Text style={styles.buttonText}>
                注册
              </Text>
            </Button>
          </Content>
        </Content>
    );
  }
}

export default class UserScene extends BaseComponent {
  constructor(props) {
    super(props);

    const {params} = this.props.navigation.state;
    this.state = {jsonData: false};
    this.area = params.area;

    this.checkState = this.checkState.bind(this);
    this.login = this.login.bind(this);
    this.signUp = this.signUp.bind(this);
    this.logout = this.logout.bind(this);
    this.userNameInput = this.userNameInput.bind(this);
    this.passwordInput = this.passwordInput.bind(this);

    BackHandler.addEventListener('hardwareBackPress', () => true);

    this.usernameT = '';
    this.passwordT = '';
    this.user = {userName: '', userId: 0};

    if (params.updateFlag) {
      this.checkState();
    } else {
      this.user = params.user;
    }
  }

  checkState() {

    const {params} = this.props.navigation.state;
    fetch(baseUrl + 'form/check_login/', {method: 'GET'})
      .then((response) => response.json())
      .then((json) => {
        this.user = json.obj;
        this.setState({jsonData: json});
        params.setLoginState(json.obj);
      })
      .catch((err) => alert(err));
  }

  login() {

    const {params} = this.props.navigation.state;
    let formData = new FormData();
    formData.append('username', this.usernameT);
    formData.append('password', this.passwordT);

    fetch(baseUrl + 'form/login/', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.err)
          alert(json.err);
        else {
          this.user = json.obj;
          this.setState({jsonData: json});
          params.setLoginState(json.obj);
        }})
      .catch((err) => alert(err));
  }

  signUp() {

    const {params} = this.props.navigation.state;
    let formData = new FormData();
    formData.append('username', this.usernameT);
    formData.append('password', this.passwordT);

    fetch(baseUrl + 'form/register/', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.err)
          alert(json.err);
        else {
          this.user = json.obj;
          this.setState({jsonData: json});
          params.setLoginState(json.obj);
        }})
      .catch((err) => alert(err));
  }

  logout() {

    const {params} = this.props.navigation.state;

    fetch(baseUrl + 'form/logout/', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((json) => {
        this.user = json.obj;
        this.setState({jsonData: json});
        params.setLoginState(json.obj);
      })
      .catch((err) => alert(err));
  }

  userNameInput(text) {
    this.usernameT = text;
  }

  passwordInput(text) {
    this.passwordT = text;
  }

  render() {

    if (this.user.userName)
      return (
        <Scene1
          area={this.area}
          onFunc={this.logout}
        />);
    else
      return (
        <Scene2
          login={this.login}
          signUp={this.signUp}
          userNameInput={this.userNameInput}
          passwordInput={this.passwordInput}
        />);
  }
}

const styles = StyleSheet.create({
  content: {
    /*
    padding: 2,
    borderColor: 'red',
    borderStyle: 'solid',
    borderWidth: 1,
    */
  },
  form: {
    marginTop: 40,
  },
  formItem: {

  },
  textInput: {

  },
  buttonContainer: {
    marginTop: 40,
    paddingLeft: 20,
    paddingRight: 20,
  },
  button: {
    backgroundColor: '#09f',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },

  separator: {
    backgroundColor: '#ddd',
  },
  separatorText: {

  },
  listItem: {

  },
  listText: {
    fontSize: 20,
  },
});