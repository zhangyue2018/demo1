import React, { Component } from "react";
import throttle from "lodash/throttle";
import styles from "./style/style.module.scss";

class ControllerUnit extends Component {
  constructor() {
    super();
    //节流
    this.handleClick = throttle(this.handleClick, 500);
  }
  handleClick = e => {
    let props = this.props;
    if (props.arrange && props.arrange.isCenter) {
      props.inverse();
    } else {
      props.center();
    }
  };

  render() {
    let { arrange } = this.props;

    return (
      <span
        className={`${styles["controller-unit"]} ${
          arrange.isCenter ? styles["is-center"] : ""
        } ${arrange.isInverse ? styles["is-inverse"] : ""}`}
        onClick={this.handleClick}
      />
    );
  }
}

export default ControllerUnit;
