/**
 * Created by rainy on 2016/10/26.
 * 主要原理是通过两层图片的叠加，底层为空星星，上层为填充后的星星，从而达到星级评分的效果。
 */

import React,{Component} from 'react';
import {
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

export default class StarRating extends Component {

  constructor(props) {
    super(props);
    this.total = this.props.total || 3; //星星的数量
    this.starSize = this.props.starSize || 20; //星星的大小
    this.starSpacing = this.props.starSpacing || 0; //星星之间的间隔
    this.starColor = this.props.starColor || 'gold'; //星星的颜色
    let stars = this.props.stars || 0; //评分
    if (stars > this.total) {
      stars = this.total;
    }
    this.state = {
      stars: stars,
    }
  }

  render() {
    return <View>
      {this.renderEmptyStar()}
      {this.renderFullStar()}
    </View>
  }

  icons(params) {
    return (
      <Icon name={params.name} style={params.style}/>
    )
  }

  renderEmptyStar() {
    //先展现一层空的星星，这里的icons方法参考下面一段代码
    let stars = [];
    for (let i = 0; i < this.total; i++) {
      stars.push(<View key={"star-o-"+i}>{this.icons({
        name: 'star-o',
        style: {
          fontSize: this.starSize,
          color: '#aaa',
          marginHorizontal: this.starSpacing,
          width: this.starSize * 0.93
        }
      })}</View>);
    }
    return <View style={{flexDirection:'row'}}>{stars}</View>
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.stars !== this.props.stars) {
      let stars = nextProps.stars || 0;
      if (stars > this.total) {
        stars = this.total;
      }
      this.setState({
        stars: stars
      });
    }
  }

  renderFullStar() {
    //按评分填充星星
    let stars = [];
    let width = Math.floor(this.state.stars) * (this.starSize * 0.93 + 2 * this.starSpacing);
    if (this.state.stars > Math.floor(this.state.stars)) {
      width += this.starSpacing;
      width += this.starSize * 0.93 * (this.state.stars - Math.floor(this.state.stars));
    }
    for (let i = 0; i < this.state.stars; i++) {
      stars.push(<View key={"star-"+i}>{this.icons({
        name: 'star',
        style: {
          fontSize: this.starSize,
          color: this.starColor,
          marginHorizontal: this.starSpacing,
          width: this.starSize * 0.93
        }
      })}</View>);
    }
    return <View
      style={{flexDirection:'row',position:'absolute',top:0,left:0,width:width, overflow: 'hidden'}}>{stars}</View>
  }
}