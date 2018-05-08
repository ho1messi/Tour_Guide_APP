import React, {Component} from 'react';
import {
  BackHandler,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default class SpotDetail extends Component {
  constructor(props) {
    super(props);

    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
      return true;
    })

  }

  render() {
    return (
      <View>
        <Text> area details </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({

});