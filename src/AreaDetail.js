import React, {Component} from 'react';
import {
  BackHandler,
  ListView,
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

const baseUrl = 'http://ho1messi.in.8866.org:8629/';

export default class AreaDetail extends Component {
  constructor(props) {
    super(props);

    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
      return true;
    });

    const {params} = this.props.navigation.state;
    this.state = {data: null, area: params.area};

    this.onJumpArticle = this.onJumpArticle.bind(this);
    this.onJumpDiscussion = this.onJumpDiscussion.bind(this);
    this.getAreaSelectionInfo = this.getAreaSelectionInfo.bind(this);

    //let params = {id: 1};
    fetch (baseUrl + 'scenic/detail/area/' + params.id, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((json) => {
        this.setState({data: json.obj, area: this.state.area})
      })
      .catch((err) => alert(err));
  }

  getAreaName() {
    if (this.state.data) {
      return this.state.data.name;
    } else {
      return '';
    }
  }

  getAreaSelectionInfo() {
    const {params} = this.props.navigation.state;
    if (this.state.area === params.id)
      return (
        <ListItem style={styles.listAbout}>
          <Text>
            已选择当前景区
          </Text>
        </ListItem>
      );
    else
      return (
        <ListItem style={styles.listAbout} onPress={() => {
          this.setState({data: this.state.data, area: params.id});
          params.onSelect(this.state.data.id, this.state.data.name);
        }}>
          <Text>
            切换到该景区
          </Text>
        </ListItem>
      );
  }

  onJumpArticle() {
    const {params} = this.props.navigation.state;
    this.props.navigation.navigate('ArticleList', {
      id: params.id,
      type: 'area',
    })
  }

  onJumpDiscussion() {

  }

  _onPressRow(id) {
    this.props.navigation.navigate('SpotDetail', {
      id: id,
    })
  }

  renderAreaDetail() {
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let data = ds.cloneWithRows(this.state.data.spot_list);
    const {params} = this.props.navigation.state;
    return (
      <View style={styles.content}>
        <ListView style={styles.list} dataSource={data} renderHeader={() =>
          <List style={styles.listHeader}>
            <ListItem style={styles.listAbout}>
              <Text>
                {this.state.data.about}
              </Text>
            </ListItem>
            {this.getAreaSelectionInfo()}
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
            <Separator bordered style={styles.separator}>
              <Text style={styles.separatorText}>
                景点
              </Text>
            </Separator>
          </List>
        } renderRow={(d) =>
          <ListItem style={styles.listRow} onPress={() => this._onPressRow(d.id)}>
            <Text style={styles.listRowText}>
              {d.name}
            </Text>
          </ListItem>
        }/>
      </View>
    );
  }

  renderContent() {
    if (this.state.data) {
      return this.renderAreaDetail();
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
        <Header style={styles.header}>
          <Button transparent style={styles.headerButton} onPress={() => this.props.navigation.goBack()}>
            <Icon name={'ios-arrow-back'} style={styles.headerIcon}/>
          </Button>
          <View style={styles.headerContent}>
            <Text style={styles.headerText}>
              {this.getAreaName()}
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

  },
  listHeader: {

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
  separator: {
    backgroundColor: '#ddd',
  },
  separatorText: {

  },
  listRow: {

  },
  listRowText: {

  },
});
