import React, { Component } from "react";

import ControllerUnit from "./ControllerUnit";

import styles from './style/style.module.scss';

class Controller extends Component {

  constructor(props) {
    super(props);
    this.state = {
      centerControllerInfo: {
        controllerIndex: 0,
        isCenter: true,
        isInverse: false,
      },
      controllerInfos: props.imageDatas.map((value, index) => {
        return {
          controllerIndex: index,
          isCenter: false,
          isInverse: false,
        }
      }), 
    }
  }

  componentDidMount() {
    let {centerControllerInfo, controllerInfos} = this.state;
    controllerInfos[centerControllerInfo.controllerIndex] = centerControllerInfo;
    this.setState({
      controllerInfos
    });
  }

  componentWillReceiveProps(nextProps) {
    let preClickInfo = this.props.clickInfo;
    let { clickInfo } = nextProps;

    let {controllerInfos} = this.state;

    //当点击中心图片以外的图片或者改变window的size时
    if (clickInfo.name === "center") {
      //仅当点击中心图片以外的图片
      if (clickInfo.clickIndex !== preClickInfo.clickIndex) {
        controllerInfos[clickInfo.clickIndex] = {
          controllerIndex: clickInfo.clickIndex,
          isCenter: true,
          isInverse: false
        };
        controllerInfos[preClickInfo.clickIndex] = {
          controllerIndex: preClickInfo.clickIndex,
          isCenter: false,
          isInverse: false
        }
        this.setState({controllerInfos});
      }
    } else if (clickInfo.name === "inverse") {    //当点击中心图片进行翻转或者改变window的size时
      //仅当点击中心图片进行翻转时
      if (clickInfo.isInverse !== preClickInfo.isInverse) {
        //获取点击之前的按钮状态信息
        let tempControllerInfo = Object.assign({}, controllerInfos[clickInfo.clickIndex]);
        controllerInfos[clickInfo.clickIndex] = {
          controllerIndex: clickInfo.clickIndex,
          isCenter: true,
          isInverse: !tempControllerInfo.isInverse,   //点击之后将按钮状态设置为相反值
        };
        this.setState({controllerInfos});
      }
    }
  }

  /**
   * 利用reArrange函数，居中对应index的图片
   * @param index 需要被居中的图片对应的图片信息数组中的index
   * @return {Function}
   */
  doCenter = index => {
    return () => {
      this.props.handleClick({
        name: "center",
        clickIndex: index,
        isCenter: true,
        isInverse: false
      });
    };
  };

  /**
   * 翻转图片
   * @param index 将要执行inverse操作的存储在图片信息数组的index
   * @return {Function} 这是一个函数，是真正的待被执行的函数
   */

  doInverse = index => {
    return () => {
      this.props.handleClick({
        name: "inverse",
        clickIndex: index,
        isCenter: true,
        isInverse: !this.props.clickInfo.isInverse
      });
    };
  };

  render() {
    let controllerUnits = [];
    let { imageDatas } = this.props;
    let {controllerInfos} = this.state;

    imageDatas.forEach((element, index) => {
      controllerUnits.push(
        <ControllerUnit
          key={index}
          arrange={controllerInfos[index]}
          inverse={this.doInverse(index)}
          center={this.doCenter(index)}
        />
      );
    });

    return <div className={styles["controller-nav"]}>{controllerUnits}</div>;
  }
}

export default Controller;
