import React, { Component } from "react";
import debounce from "lodash/debounce";

import styles from './style/style.module.scss';



class ImageFigure extends Component {
  constructor() {
    super();

    //防抖
    this.handleClick = debounce(this.handleClick, 100);
  }

  /**
   * imgfigure的点击处理函数
   */
  handleClick = e => {
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
  };


  render() {
    let { data, id, setRef, arrange, styleRef } = this.props,
      styleObj = {};
    let isInverse = arrange && arrange.isInverse;

    if (arrange && arrange.pos) {
      styleObj = arrange.pos;
    }

    // //如果图片的旋转角度有值并且不为0，添加旋转角度
    // if(arrange && arrange.rotate) {
    //   (['-moz-', '-ms-', '-webkit-', '']).forEach((value) => {
    //     styleObj[value + "transform"] = "rotate(" + arrange.rotate + "deg)";
    //   });
    // }

    //设置每张图片的旋转角度
    if (arrange && styleRef) {
      ["MozTransform", "msTransform", "WebkitTransform", "transform"].forEach(
        value => {
          styleRef[value] = "rotate(" + arrange.rotate + "deg)";
        }
      );
      if (arrange.isCenter) {
        styleRef.zIndex = 11;
      } else {
        styleRef.zIndex = 10;
      }
    }


    return (
      <figure
        className={`${styles["img-figure"]} ${isInverse ? styles["is-inverse"] : ""}`}
        ref={element => {
          setRef(id, element);
        }}
        style={styleObj}
        onClick={this.handleClick}
      >
        <img src={data.imageURL} alt={data.title} />
        <figcaption>
          <h2 className={styles["img-title"]}>{data.title}</h2>
        </figcaption>
        <div className={styles["img-back"]} onClick={this.handleClick}>
          <p>{data.desc}</p>
        </div>
      </figure>
    );
  }
}

export default ImageFigure;
