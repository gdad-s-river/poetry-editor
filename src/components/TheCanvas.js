import React, { Component } from "react";
// import { stateToHTML } from "draft-js-export-html";

import { getLSItem, setLSItem } from "../utils/localStorage";

/**
 * had not been able to extract css string from glamor/reset using
 * different options such as css-to-string-loader or extract-loader
 * hence copying it manually until I figure it out
 */
// import resetCssString from "../reset";

class MyCanvas extends Component {
  state = {
    isDragging: false
  };

  constructor(props) {
    super(props);
    this.dragHeight =
      document.querySelector("div[data-contents]").getBoundingClientRect()
        .height / 2;

    const blockMap = this.props.editorState.getCurrentContent().getBlockMap();

    const lengthOfBlocks = blockMap
      .map(contentBlock => contentBlock.getLength())
      .toJS();

    const maxLength = Math.max(...Object.values(lengthOfBlocks));

    const selectorKey =
      blockMap
        .filter((contentBlock, key, iter) => {
          return contentBlock.getLength() === maxLength;
        })
        .keySeq()
        .first() + "-0-0";

    const constituents = document.querySelector(
      `div[data-offset-key="${selectorKey}"] div[data-offset-key="${selectorKey}"]`
    ).childNodes;

    const longestHorizontalLength = Array.from(
      constituents
    ).reduce((acc, val) => {
      return acc + val.getBoundingClientRect().width;
    }, 0);

    this.dragWidth = longestHorizontalLength / 2;
  }

  componentDidMount() {
    this.drawImage();
  }

  getPixelRatio() {
    let ctx = this.canvas.getContext("2d"),
      dpr = window.devicePixelRatio || 1,
      bsr =
        ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio ||
        1;
    return dpr / bsr;
  }

  createHiDPICanvas = function(w = 500, h = 500, ratio) {
    if (!ratio) {
      ratio = this.getPixelRatio();
    }
    let c = this.canvas;
    c.width = w * ratio;
    c.height = h * ratio;
    c.style.width = w + "px";
    c.style.height = h + "px";
    c.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    c.ctx = c.getContext("2d");
    return c;
  };

  getImprintData(html) {
    var doc = document.implementation.createHTMLDocument("");
    doc.documentElement.innerHTML = html;
    doc.documentElement.setAttribute("xmlns", doc.documentElement.namespaceURI);

    // Get well-formed xthml markup for svg
    let xhtml = new XMLSerializer().serializeToString(doc.documentElement);

    let imprintData = `
      <svg xmlns="http://www.w3.org/2000/svg" width="500" height="500">
        <style>
          html, body {
            padding:0;
            margin: 0;
            width: 100%;
            height: 100%;
          }

          body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        </style>
        <foreignObject width="100%" height="100%">
          ${xhtml || ""}
        </foreignObject>
      </svg>
    `;
    return imprintData;
  }

  drawImage() {
    /**
     * these constant will vary when 
     * canvas drag to change its size
     * is given as a functionality
     */
    const WIDTH = 500;
    const HEIGHT = 500;

    this.WIDTH = WIDTH;
    this.HEIGHT = HEIGHT;

    // myC as in myCanvas
    let myC = this.createHiDPICanvas(WIDTH, HEIGHT);
    this.myC = myC;

    const { width, height } = myC;

    this.myC.ctx.fillStyle = getLSItem("editorBgColor");

    /**
     * canvas clearing up method
     * it fills with the fillStyle prop above
     */
    this.myC.ctx.fillRect(0, 0, width, height);

    let draftMarkupWithStyles = this.createMarkup();
    let canvasImprintData = this.getImprintData(draftMarkupWithStyles);

    let DOMURL = window.URL || window.webkitURL || window;

    let img = new Image(WIDTH, HEIGHT);
    this.img = img;

    let svg = new Blob([canvasImprintData], { type: "image/svg+xml" });
    let url = DOMURL.createObjectURL(svg);

    img.onload = () => {
      this.drawImg();
      DOMURL.revokeObjectURL(url);
    };

    img.src = url;
  }

  createMarkup() {
    // const { editorState, cPickerUtil } = this.props;
    // const contentState = editorState.getCurrentContent();
    // const inlineStyles = cPickerUtil.exporter(editorState);
    // const html = stateToHTML(contentState, { inlineStyles });

    const html = document.querySelector(".DraftEditor-root").innerHTML;
    return html;
  }

  handleMouseDown = e => {
    this.setState({ isDragging: true });
    this.props.setDraggingStatusForOverlay(true);
  };

  handleMouseUp = () => {
    this.stopDragging();
  };

  stopDragging = () => {
    this.setState({ isDragging: false });
    this.props.setDraggingStatusForOverlay(false);
  };

  setCanvasMouseState(e) {
    let cDimensions = this.myC.getBoundingClientRect();
    /**
     * @TODO: understand what is .left and clientX and stuff
     * because this is heavily copied, and I don't like
     * using things which I do not understand
     */

    let offsetX = cDimensions.left + document.body.scrollLeft + this.dragWidth;
    let offsetY = cDimensions.top + document.body.scrollTop + this.dragHeight;

    this.imgX = e.clientX - offsetX;
    this.imgY = e.clientY - offsetY;

    setLSItem(
      "textDragPos",
      JSON.stringify({ imgX: this.imgX, imgY: this.imgY })
    );
  }

  drawImg() {
    let storedTextPos = JSON.parse(getLSItem("textDragPos"));

    const { width, height } = this.myC;
    this.myC.ctx.fillRect(0, 0, width, height);
    this.myC.ctx.drawImage(
      this.img,
      this.imgX || (storedTextPos ? storedTextPos.imgX : 10),
      this.imgY || (storedTextPos ? storedTextPos.imgY : 10),
      this.WIDTH,
      this.HEIGHT
    );

    if (this.state.isDragging) {
      requestAnimationFrame(this.drawImg.bind(this));
    }
  }

  handleMouseMove = e => {
    const { isDragging } = this.state;
    const { editorState } = this.props;
    const editorHasText = editorState.getCurrentContent().hasText();

    if (isDragging && editorHasText) {
      this.setCanvasMouseState(e);
      this.drawImg();
    }
  };

  render() {
    return (
      <canvas
        id="canvas"
        style={canvasStyles}
        ref={ref => (this.canvas = ref)}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
      />
    );
  }
}

export default MyCanvas;

/*
  Because for some reason glamorous isn't 
  forwarding width and height native canvas element
  I've make a factory for the canvas
*/

// function Canvas(props) {
//   return <canvas {...props} />;
// }

// const StyledCanvas = g(Canvas)({
//   border: "2px solid white",
//   cursor: "pointer"
// });

const canvasStyles = {
  cursor: "pointer"
};
