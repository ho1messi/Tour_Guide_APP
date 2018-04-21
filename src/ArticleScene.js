import React, { Component } from 'react';
import {
  BackHandler,
  ListView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import BaseComponent from './BaseComponent';

const baseUrl = 'http://ho1messi.in.8866.org:8629/';

export default class ArticleScene extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {jsonData: null};

    this.getData = this.getData.bind(this);
    this._pressRow = this._pressRow.bind(this);

    BackHandler.addEventListener('hardwareBackPress', () => true);

    this.getData(baseUrl + 'form/article_list/')
  }

  getData(url) {
    fetch(url, {method: 'GET'})
      .then((response) => response.json())
      .then((json) => {this.setState({jsonData: json})})
      .catch((err) => alert(err));
  }

  _pressRow(id) {
    const {params} = this.props.navigation.state;
    params.onJump(id);
  }

  render() {

    if (!this.state.jsonData)
      return (<Text> </Text>);
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let data = ds.cloneWithRows(this.state.jsonData.obj);

    return (
      <View style={styles.container}>
        <ListView dataSource={data} renderRow={(d) =>
          <TouchableHighlight style={styles.listButton} onPress={() => this._pressRow(d.id)}>
            <View style={styles.listItem}>
              <Text style={styles.listItemTitle}>{d.title}</Text>
              <Text style={styles.listItemContent}>{d.content}</Text>

              <View style={styles.listFoot}>
                <Text style={styles.listFootText}>{d.vote}赞同</Text>
                <Text style={styles.listFootText}>{d.comment}评论</Text>
              </View>

            </View>
          </TouchableHighlight>
        }/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
  },
  listButton: {
    marginBottom: 5,
  },
  listItem: {
    maxHeight: 200,
    padding: 10,
    //marginBottom: 5,
    backgroundColor: '#fff',
  },
  listItemTitle: {
    fontSize: 24,
  },
  listItemContent: {
    fontSize: 18,
  },
  listFoot: {
    flexDirection: 'row',
    marginTop: 5,
  },
  listFootText: {
    fontSize: 12,
    marginRight: 10,
  },
});
