import {React, Component} from 'react';

export default class BaseComponent extends Component {
  static scene = null;

  constructor(props) {
    super(props);

    BaseComponent.scene = this;
  }

  nav() {
    return this.props.navigation;
  }
}
