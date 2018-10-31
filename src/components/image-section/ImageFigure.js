import React, { Component } from "react";
import debounce from "lodash/debounce";

import styles from "./style/style.module.scss";

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
    let { data, id, setRef, arrange } = this.props,
      styleObj = {};
    let isInverse = arrange && arrange.isInverse;

    if (arrange && arrange.pos) {
      styleObj = arrange.pos;
    }

    return (
      <figure
        className={`${styles["img-figure"]} ${
          isInverse ? styles["is-inverse"] : ""
        } ${arrange.isCenter ? styles["is-center"] : ""} ${
          styles["rotate" + arrange.rotate]
        }`}
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
