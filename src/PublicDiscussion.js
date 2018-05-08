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
  ListItem,
} from 'native-base';

const baseUrl = 'http://ho1messi.in.8866.org:8629/';

export default class PublicDiscussion extends Component {
  constructor(props) {
    super(props);

    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
      return true;
    });

    this.state = {data: {
      area: {id: 0, name: ''},
      spot: {id: 0, name: ''},
    }};

    this.content = '';

    this.public = this.public.bind(this);
    this.getAreaAndSpot = this.getAreaAndSpot.bind(this);
    this.renderAreaAndSpot = this.renderAreaAndSpot.bind(this);

    const {params} = this.props.navigation.state;
    this.getAreaAndSpot(params.area_id, params.spot_id)
  }

  public() {
    //------------------------------------------
    alert(this.title);
  }

  getAreaAndSpot(area_id, spot_id) {
    if (area_id) {
      if (spot_id) {
        fetch(baseUrl + 'scenic/detail/area_and_spot/' + spot_id, {
          method: 'GET',
        })
          .then((response) => response.json())
          .then((json) => {
            this.setState({data: json.obj})
          })
          .catch((err) => alert(err));
      } else {
        fetch(baseUrl + 'scenic/detail/area/' + area_id, {
          method: 'GET',
        })
          .then((response) => response.json())
          .then((json) => {
            this.setState({data: {
              area: {id: json.obj.id, name: json.obj.name},
              spot: {id: 0, name: ''}
            }})
          })
          .catch((err) => alert(err));
      }
    } else {
      alert('未选择景区')
    }

  }

  renderAreaAndSpot() {
    console.log(this.state);
    if (this.state.data.area.id) {
      return (
        <View>
          <ListItem>
            <Text>{this.state.data.area.name} {this.state.data.spot.name}</Text>
          </ListItem>
        </View>
      );
    }
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header style={styles.header}>
          <Button transparent style={styles.headerButton} onPress={() => this.props.navigation.goBack()}>
            <Icon name={'ios-arrow-back'} style={styles.headerIconBig}/>
          </Button>
          <Text style={styles.headerText}>
            添加讨论
          </Text>
          <Button transparent style={styles.headerButton} onPress={this.public}>
            <Icon name={'md-send'} style={styles.headerIcon}/>
          </Button>
        </Header>
        {this.renderAreaAndSpot()}
        <View style={styles.content}>
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
  inputContent: {
    fontSize: 18,
  },
});
