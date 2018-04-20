import {
  MapView,
} from 'react-native-amap3d';

export default class MyMapView extends MapView {
  static map = null;

  constructor(props) {
    super(props);

    MyMapView.map = this;
  }
}