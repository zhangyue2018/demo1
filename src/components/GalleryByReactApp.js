import React, { Component } from "react";
import { debounce } from "lodash";
import ImageSection from "./image-section/ImageSection";
import ControllerSection from "./controller-section/ControllerSection";
import styles from '../styles/main.module.scss';
import imageDatas from "../data/imageDatas";

class GalleryByReactApp extends Component {
  constructor() {
    super();
    this.state = {
      imageDatas: imageDatas || [],
      stageSize: {
        stageW: 0,
        stageH: 0,
        halfStageW: 0,
        halfStageH: 0
      },
      clickInfo: {
        name: "noClick", //标识是居中操作还是翻转操作,属性值是center,inverse,noClick之一
        clickIndex: 0,
        isCenter: true,
        isInverse: false
      }
    };
    //防抖
    this.resize = debounce(this.resize, 200);
  }

  handleClick = clickInfo => {
    this.setState({
      clickInfo
    });
  };

  resize = () => {
    this.setState({
      stageSize: this.getStageSize()
    });
  };

  //取到舞台的大小
  getStageSize = () => {
    let stageW = this.stage.scrollWidth,
      stageH = this.stage.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    return {
      stageW,
      stageH,
      halfStageW,
      halfStageH
    };
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  componentDidMount() {
    window.addEventListener("resize", this.resize);

    const stageSize = this.getStageSize();
    this.setState({
      stageSize
    });
  }

  render() {
    const { imageDatas, stageSize, clickInfo } = this.state;

    return (
      <section className={styles["stage"]} ref={stage => (this.stage = stage)}>
        {imageDatas[0] && (
          <ImageSection
            imageDatas={imageDatas}
            stageSize={stageSize}
            handleClick={this.handleClick}
            clickInfo={clickInfo}
          />
        )}
        {imageDatas[0] && (
          <ControllerSection
            imageDatas={imageDatas}
            handleClick={this.handleClick}
            clickInfo={clickInfo}
          />
        )}
      </section>
    );
  }
}

export default GalleryByReactApp;
