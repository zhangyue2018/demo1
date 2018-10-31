import React, { Component } from "react";

import ImageFigure from "./ImageFigure";

import styles from './style/style.module.scss';

let centerPos = {
    left: 0,
    top: 0
  },
  hPosRange = {
    leftSecX: [0, 0], //在舞台的左侧水平方向，图片的left的取值范围，leftSecX[0]是最左端，leftSecX[1]是最右端，初始都为0
    rightSecX: [0, 0], //在舞台的右侧水平方向，图片的left的取值范围，rightSecX[0]是最左端，rightSecX[1]是最右端，初始都为0
    secY: [0, 0] //在舞台左右两侧区域的垂直方向上，图片的top的取值范围，secY[0],是最上端，secY[1]是最下端，初始都为0
  },
  vPosRange = {
    secX: [0, 0], //在舞台的中间上部区域，图片在水平方向上的left的取值范围
    topsecY: [0, 0] //在舞台的中间上部区域，图片在垂直方向上的top的取值范围
  };

class ImageSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //存放图片的状态信息，包括图片位置,旋转角度,图片正反面,图片是否处于中心位置
      imgArrangeArr: props.imageDatas.map((value, index) => {
        return {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        };
      }),
      imageDatas: props.imageDatas
    };
    this.centerIndex = 0;
  }

  componentDidMount() {
    const { imageDatas, stageSize } = this.props;
    Promise.all(
      imageDatas.map((value, index) => {
        return import("../../images/" + value.fileName).then(fullName => {
          value.imageURL = fullName.default;
          return value;
        });
      })
    ).then(imageDatasArr => {
      this.setState({
        imageDatas: imageDatasArr
      });
    });

    this.calcLayout(stageSize);
    this.reArrange(this.centerIndex);
  }

  componentWillReceiveProps(nextProps) {
    let { stageSize, clickInfo } = nextProps;
    let preStageSize = this.props.stageSize,
      preClickInfo = this.props.clickInfo;
      let { imgArrangeArr } = this.state;

    if (
      preStageSize.stageH !== stageSize.stageH ||
      preStageSize.stageW !== stageSize.stageW
    ) {
      
      this.calcLayout(stageSize);

      //这种情况下，处于中心位置位置的图片状态保持不变
      let tempImgInfo = Object.assign({}, imgArrangeArr[clickInfo.clickIndex]);
      this.reArrange(this.centerIndex);
      imgArrangeArr[clickInfo.clickIndex].isInverse = tempImgInfo.isInverse;
      this.setState({
        imgArrangeArr
      });

    }

    //当点击中心图片以外的图片或者改变window的size时
    if (clickInfo.name === "center") {
      //仅当点击中心图片以外的图片
      if (clickInfo.clickIndex !== preClickInfo.clickIndex) {
        this.reArrange(clickInfo.clickIndex);
      }
    } else if (clickInfo.name === "inverse") {     //当点击中心图片进行翻转或者改变window的size时

      //仅当点击中心图片进行翻转时
      if (clickInfo.isInverse !== preClickInfo.isInverse) {

        //this.doInverse(clickInfo.clickIndex);
        let tempImgInfo = Object.assign({}, imgArrangeArr[clickInfo.clickIndex]);
        imgArrangeArr[clickInfo.clickIndex].isInverse = !tempImgInfo.isInverse;
        this.setState({
          imgArrangeArr
        });
      }
    }
  }

  //计算布局
  calcLayout = stageSize => {
    //const stageSize = this.props.stageSize;
    const imgSize = this.getImageSize();

    //计算中心图片的位置点
    centerPos = {
      left: stageSize.halfStageW - imgSize.halfImgW,
      top: stageSize.halfStageH - imgSize.halfImgH
    };

    //左侧区域left取值范围
    hPosRange.leftSecX[0] = -imgSize.halfImgW;
    hPosRange.leftSecX[1] = stageSize.halfStageW - imgSize.halfImgW * 3;

    //右侧区域left取值范围
    hPosRange.rightSecX[0] = stageSize.halfStageW + imgSize.halfImgW;
    hPosRange.rightSecX[1] = stageSize.stageW - imgSize.halfImgW;

    //左右侧区域的top取值范围
    hPosRange.secY[0] = -imgSize.halfImgH;
    hPosRange.secY[1] = stageSize.stageH - imgSize.halfImgH;

    //中间上部区域的left取值范围
    vPosRange.secX[0] = stageSize.halfStageW - imgSize.imgW;
    vPosRange.secX[1] = stageSize.halfStageW;

    //中间上部区域的top的取值范围
    vPosRange.topsecY[0] = -imgSize.halfImgH;
    vPosRange.topsecY[1] = stageSize.halfStageH - imgSize.halfImgH * 3;
  };

  //在此组件(父组件)中设置每个figure（子组件中原生的HTML标签）的ref
  setImgFigureEle = (para, element) => {
    this[para] = element;
  };

  //拿到imageFigure大小
  getImageSize = () => {
    let imgFigDOM = this["imgFig0"];
    let imgW = imgFigDOM.scrollWidth,
      imgH = imgFigDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    return {
      imgW,
      imgH,
      halfImgW,
      halfImgH
    };
  };

  //获取区间内的一个随机值
  getRangeRandom = (low, high) => {
    return Math.ceil(Math.random() * (high - low) + low);
  };

  //获取图片的旋转角度，角度在正负30度之间
  get30DegRandom = () => {
    return (Math.random() > 0.5 ? "" : "-") + Math.ceil(Math.random() * 30);
  };

  //重新布局所有图片
  /*
  *para centerIndex指定居中哪个图片
  */
  reArrange = centerIndex => {
    let imgArrangeArr = this.state.imgArrangeArr,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeSecY = hPosRange.secY,
      vPosRangeSecX = vPosRange.secX,
      vPosRangeTopSecY = vPosRange.topsecY,
      //imgArrangeTopArr存放上部图片的信息
      //topImgNum上部图片放0个或者1个
      //topImgSpliceIndex被放到上方的图片的index
      imgArrangeTopArr = [],
      topImgNum = Math.floor(Math.random() * 2),
      topImgSpliceIndex = 0,
      //选取中心图片
      imgArrangeCenterArr = imgArrangeArr.splice(centerIndex, 1);
    this.centerIndex = centerIndex;

    //居中centerIndex的图片不需要旋转,isCenter设为true
    imgArrangeCenterArr[0].pos = centerPos;
    imgArrangeCenterArr[0].rotate = 0;
    imgArrangeCenterArr[0].isCenter = true;
    imgArrangeCenterArr[0].isInverse = false;

    //取出上部图片的状态信息
    topImgSpliceIndex = Math.floor(Math.random() * imgArrangeArr.length);
    imgArrangeTopArr = imgArrangeArr.splice(topImgSpliceIndex, topImgNum);

    //布局上部的图片
    imgArrangeTopArr.forEach((value, index) => {
      imgArrangeTopArr[index].pos = {
        left: this.getRangeRandom(vPosRangeSecX[0], vPosRangeSecX[1]),
        top: this.getRangeRandom(vPosRangeTopSecY[0], vPosRangeTopSecY[1])
      };
      imgArrangeTopArr[index].rotate = this.get30DegRandom();
      imgArrangeTopArr[index].isCenter = false;
      imgArrangeTopArr[index].isInverse = false;
    });

    //布局左右两侧的图片
    for (let i = 0, j = imgArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX = null;

      //前半部分布局左边，右半部分布局右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }

      imgArrangeArr[i].pos = {
        top: this.getRangeRandom(hPosRangeSecY[0], hPosRangeSecY[1]),
        left: this.getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
      };
      imgArrangeArr[i].rotate = this.get30DegRandom();
      imgArrangeArr[i].isCenter = false;
      imgArrangeArr[i].isInverse = false;
    }

    //将取出的中心图片和上部图片再重新插入到图片数组中
    if (imgArrangeTopArr && imgArrangeTopArr[0]) {
      imgArrangeArr.splice(topImgSpliceIndex, 0, imgArrangeTopArr[0]);
    }

    imgArrangeArr.splice(centerIndex, 0, imgArrangeCenterArr[0]);

    this.setState({
      imgArrangeArr
    });
  };

  /**
   * 利用reArrange函数，居中对应index的图片
   * @param index 需要被居中的图片对应的图片信息数组中的index
   * @return {Function}
   */
  doCenter = index => {
    return () => {
      this.props.handleClick({
        name: 'center',
        clickIndex: index,
        isCenter: true,
        isInverse: false,
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
      let tempImgArrangeArr = this.state.imgArrangeArr;
      let imgInfo = Object.assign({}, tempImgArrangeArr[index]);

      this.props.handleClick({
        name: 'inverse',
        clickIndex: index,
        isCenter: true,
        isInverse: !imgInfo.isInverse
      });
    };
  };

  render() {
    const { imgArrangeArr } = this.state;
    const { imageDatas } = this.props;
    let imageFigures = [];

    //styleRef是获得每个figure的style引用，因为浏览器不支持用js代码直接对style[transform]进行更改，只能通过这种折中方法达到目的
    imageDatas.forEach((element, index) => {
      imageFigures.push(
        <ImageFigure
          data={element}
          key={index}
          id={"imgFig" + index}
          setRef={this.setImgFigureEle}
          arrange={imgArrangeArr[index]}
          styleRef={this["imgFig" + index] && this["imgFig" + index].style}
          inverse={this.doInverse(index)}
          center={this.doCenter(index)}
        />
      );
    });

    return <div className={styles["img-sec"]}>{imageFigures}</div>;
  }
}

export default ImageSection;
