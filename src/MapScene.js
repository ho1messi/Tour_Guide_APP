import React, { Component } from 'react';
import {
  BackHandler,
  ListView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import {
  Icon,
} from 'native-base';

/*
import {
  Initializer,
//  MapView,
} from 'react-native-baidumap-sdk';
*/

import {MapView} from 'react-native-amap3d';

import BaseComponent from './BaseComponent';

const baseUrl = 'http://ho1messi.in.8866.org:8629/';

export default class MapScene extends BaseComponent {
  constructor(props) {
    super(props);

    BackHandler.addEventListener('hardwareBackPress', () => true);

    this.renderMarker = this.renderMarker.bind(this);
    this.renderMarkers = this.renderMarkers.bind(this);

    //Initializer.init('Yk87phEBwxPOAyYx7WdEooBkV4NKwTjY').catch((e) => console.error(e));

    this.state = {marker: -1};
    this.markers = [];
    this.coord = {
      latitude: 0,
      longitude: 0,
    };

    fetch (baseUrl + 'scenic/scenic_areas/', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((json) => {
        this.markers = json.obj;
        this.setState({marker: this.findNearestMarker(json.obj).id});
      })
      .catch((err) => alert(err));
  }

  updateCoord(latitude, longitude) {

  }

  findNearestMarker(markers) {
    let length = markers.length;
    let minDist = 100000.0;
    let minIndex = 0;
    for (let i = 0; i < length; i++) {
      let dist = this.distanceToMarker(markers[i]);
      if (dist < minDist) {
        minDist = dist;
        minIndex = i;
      }
    }
    return markers[minIndex];
  }

  distanceToMarker(marker) {
    let a = this.coord.latitude - marker.coord.latitude;
    let b = this.coord.longitude - marker.coord.longitude;
    return a * a + b * b;
  }
  
  _onPressMarker(id) {
    this.setState({marker: id});
  }

  renderMarker(marker) {
    return (
      <MapView.Marker icon={() =>
        <Icon name={'ios-pin'}
              style={marker.id === this.state.marker ? styles.markIconActive : styles.markIcon}/>}
                      coordinate={marker.coord}
                      active={marker.id === this.state.marker}
                      onPress={() => this._onPressMarker(marker.id)}
                      key={marker.id + marker.name}>
        <View style={styles.markInfo}>
          <Text style={styles.markInfoText}>
            {marker.name}
          </Text>
        </View>
      </MapView.Marker>
    );
  }

  renderMarkers() {
    let markList = [];
    this.markers.forEach((marker) => {
      markList.push(this.renderMarker(marker));
    });

    return markList;
  }

  render() {
    //<MapView setellite/>
    return (
      <View style={styles.content}>
        <MapView style={styles.map}
                 locationEnabled
                 //locationInterval={10000}
                 showsLocationButton
                 showsScale
                 rotateEnabled={false}
                 zoomLevel={13}
                 onLocation={({nativeEvent}) => {
                   this.coord.latitude = nativeEvent.latitude;
                   this.coord.longitude = nativeEvent.longitude;
                   //console.log(`${nativeEvent.latitude}, ${nativeEvent.longitude}`);
                 }} >
          {this.renderMarkers()}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
  map: {
    flexGrow: 1,
  },
  markIcon: {
    color: '#09f',
    fontSize: 40,
  },
  markIconActive: {
    color: '#f36',
    fontSize: 40,
  },
  markInfo: {
    backgroundColor: '#f36',
    padding: 5,
  },
  markInfoText: {
    color: '#fff',
  },
});