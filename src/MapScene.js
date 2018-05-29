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
  Button,
} from 'native-base';

/*
import {
  Initializer,
//  MapView,
} from 'react-native-baidumap-sdk';
*/

import {
  Initializer,
  MapView,
} from 'react-native-baidumap-sdk';

import BaseComponent from './BaseComponent';

const baseUrl = 'http://ho1messi.in.8866.org:8629/';

export default class MapScene extends BaseComponent {
  constructor(props) {
    super(props);

    BackHandler.addEventListener('hardwareBackPress', () => true);

    this.renderMarker = this.renderMarker.bind(this);
    this.renderMarkers = this.renderMarkers.bind(this);
    this._onPressMarkInfo = this._onPressMarkInfo.bind(this);
    this._onPressSpotMarkInfo = this._onPressSpotMarkInfo.bind(this);

    Initializer.init('Yk87phEBwxPOAyYx7WdEooBkV4NKwTjY').catch((e) => console.error(e));

    this.state = {
      marker: -1,
      coord: { latitude: 37.5340538227, longitude: 122.0833933353 },
      zoom: 13,
      showSpot: false,
    };
    this.markers = [];
    this.spots = [];
    this.coord = {
      latitude: 37.5340538227,
      longitude: 122.0833933353,
    };

    fetch (baseUrl + 'scenic/area_list/', {
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
      let d = this.distanceToMarker(markers[i]);
      if (d < minDist) {
        minDist = d;
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
  
  _onPressMarker(marker) {
    let state = this.state;
    state.marker = marker.id;
    state.coord = marker.coord;
    state.zoom = 17;
    this.spots = marker.spots;
    this.setState(state);
  }

  _onPressMarkInfo(id) {
    const {params} = this.props.navigation.state;
    params.onJumpArea(id);
  }

  _onPressSpotMarkInfo(id) {
    const {params} = this.props.navigation.state;
    params.onJumpSpot(id);
  }

  renderMarker(marker) {
    return (
      <MapView.Marker
        coordinate={marker.coord}
        color={'#09f'}
        onPress={() => this._onPressMarker(marker)}
        key={marker.id + marker.name}
      >
        <MapView.Callout onPress={() => this._onPressMarkInfo(marker.id)}>
          <View style={styles.markInfo}>
            <Text>{marker.name}</Text>
          </View>

        </MapView.Callout>
      </MapView.Marker>
    )
  }

  renderSpotMarker(marker) {
    return (
      <MapView.Marker
        coordinate={marker.coord}
        color={'#f36'}
        key={marker.id + marker.name}
      >
        <MapView.Callout onPress={() => this._onPressSpotMarkInfo(marker.id)}>
          <View style={styles.markInfo}>
            <Text>{marker.name}</Text>
          </View>

        </MapView.Callout>
      </MapView.Marker>
    )
  }

  renderMarkers() {
    let markList = [];
    this.markers.forEach((marker) => {
      markList.push(this.renderMarker(marker));
    });

    return markList;
  }

  renderSpotMarkers() {
    let markList = [];
    if (this.state.marker < 0)
      return (
        <View>

        </View>
      );
    this.spots.forEach((marker) => {
      markList.push(this.renderSpotMarker(marker));
    });

    return markList;
  }

  render() {
    return (
      <View style={styles.content}>
        <MapView style={styles.map}
                 locationEnabled
                 center={this.state.coord}
                 locationInterval={10000}
                 showsLocationButton
                 showsScale
                 rotateEnabled={false}
                 zoomLevel={this.state.zoom}
                 onLocation={({nativeEvent}) => {
                   //this.coord.latitude = nativeEvent.latitude;
                   //this.coord.longitude = nativeEvent.longitude;
                   //console.log(`${nativeEvent.latitude}, ${nativeEvent.longitude}`);
                 }} >
          {this.renderMarkers()}
          {this.renderSpotMarkers()}
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
  markView: {
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
    //backgroundColor: '#f36',
    backgroundColor: '#fff',
    padding: 5,
  },
  markInfoButton: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 5,
    paddingRight: 5,
    maxHeight: 30,
  },
  markInfoText: {
    color: '#fff',
  },
});