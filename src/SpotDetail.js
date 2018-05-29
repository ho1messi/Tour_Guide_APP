import React, {Component} from 'react';
import {
  BackHandler,
  Dimensions,
  Image,
  ListView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Button,
  Container,
  Header,
  List,
  ListItem,
  Icon,
  Separator,
} from 'native-base';

import PopupDialog from 'react-native-popup-dialog';

import StarRating from './StarRating';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

const baseUrl = 'http://ho1messi.in.8866.org:8629/';

export default class AreaDetail extends Component {
  constructor(props) {
    super(props);

    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
      return true;
    });

    this.state = {data: null};

    this.onJumpArticle = this.onJumpArticle.bind(this);
    this.onJumpDiscussion = this.onJumpDiscussion.bind(this);

    const {params} = this.props.navigation.state;
    //let params = {id: 1};
    fetch (baseUrl + 'scenic/detail/area_and_spot/' + params.id, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((json) => {
        this.setState({data: json.obj})
      })
      .catch((err) => alert(err));
  }

  getSpotName() {
    if (this.state.data) {
      return this.state.data.spot.name;
    } else {
      return '';
    }
  }

  onJumpArticle() {
    const {params} = this.props.navigation.state;
    this.props.navigation.navigate('ArticleList', {
      id: params.id,
      str1: 'spot',
      str2: 'article',
    })
  }

  onJumpDiscussion() {
    const {params} = this.props.navigation.state;
    this.props.navigation.navigate('ArticleList', {
      id: params.id,
      str1: 'spot',
      str2: 'discussion',
    })
  }

  _onSetRating(star) {
    this._popupDialog.dismiss();

    fetch (baseUrl + 'scenic/score/spot/' + this.state.data.spot.id + '/' + star, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.err) {
          alert(json.err);
        } else {
          //this._starRating.stars = json.obj.score;
          let state = this.state;
          state.data.spot.score = json.obj.score;
          this.setState(state);
        }
      })
  }

  renderPopupDialog() {
    let array = [0, 1, 2, 3, 4, 5];
    return (
      <List dataArray={array} renderRow={(d) =>
        <ListItem onPress={() => this._onSetRating(d)}>
          <Text>
            {d}
          </Text>
        </ListItem>
      }/>
    )
  }

  renderSpotDetail() {
    return (
      <View style={styles.content}>
        <ScrollView style={styles.list}>
          <Separator style={styles.separator}>
            <Text style={styles.separatorText}>
              {this.state.data.area.name}
            </Text>
          </Separator>
          <ListItem style={styles.listAbout}>
            <Text style={styles.listAboutText}>
              {this.state.data.area.about}
            </Text>
          </ListItem>
          <Separator style={styles.separator}>
            <Text style={styles.separatorText}>
              景点介绍
            </Text>
          </Separator>
          <ListItem>
            <Image style={styles.image}
                   source={{uri: this.state.data.spot.image}}
            />
          </ListItem>
          <ListItem style={styles.listAbout}>
            <Text>
              {this.state.data.spot.about}
            </Text>
          </ListItem>
          <ListItem onPress={() => this._popupDialog.show()}>
            <StarRating total={5}
                        starSpacing={3}
                        stars={parseInt(this.state.data.spot.score + 0.5)}/>
          </ListItem>
          <ListItem style={styles.listContent}>
            <Button style={styles.listContentButton} onPress={this.onJumpArticle}>
              <Text style={styles.listContentText}>
                攻略
              </Text>
            </Button>
            <Button style={styles.listContentButton} onPress={this.onJumpDiscussion}>
              <Text style={styles.listContentText}>
                讨论
              </Text>
            </Button>
          </ListItem>
        </ScrollView>
      </View>
    );
  }

  renderContent() {
    if (this.state.data) {
      return this.renderSpotDetail();
    } else {
      return (
        <View style={styles.content}>

        </View>
      )
    }
  }

  render() {
    return (
      <Container style={styles.container}>

        <PopupDialog ref={(popupDialog) => this._popupDialog = popupDialog} >
          {this.renderPopupDialog()}
        </PopupDialog>

        <Header style={styles.header}>
          <Button transparent style={styles.headerButton} onPress={() => this.props.navigation.goBack()}>
            <Icon name={'ios-arrow-back'} style={styles.headerIcon}/>
          </Button>
          <View style={styles.headerContent}>
            <Text style={styles.headerText}>
              {this.getSpotName()}
            </Text>
          </View>
        </Header>

        {this.renderContent()}

      </Container>
    )
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

  },
  list: {
    marginBottom: 100,
  },
  image: {
    height: 200,
    width: screenWidth - 40,
  },
  separator: {
    backgroundColor: '#ddd',
    flexBasis: 35,
  },
  separatorText: {

  },
  listAbout: {

  },
  listAboutText: {

  },
  listContent: {

  },
  listContentButton: {
    backgroundColor: '#09f',
    flexBasis: 70,
    justifyContent: 'center',
    marginRight: 20,
  },
  listContentText: {
    color: '#fff',
  },
});