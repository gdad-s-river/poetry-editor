import React from "react";
import Draft from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { ChromePicker } from "react-color";
import debounce from "lodash.debounce";

// import importedStyles from "./importedStyles.js";
import "./reset.css";
import "draft-js/dist/Draft.css";

const { Editor, EditorState, getDefaultKeyBinding, RichUtils } = Draft;

const styles = {
  editor: {
    border: "1px solid #ccc",
    cursor: "text",
    minHeight: 80,
    padding: 10
  },
  html: {
    position: "fixed",
    top: "120px"
  },
  colorpickerWrapper: {
    position: "relative",
    top: "200px",
    left: "50%"
  },
  canvas: {
    border: "3px solid black"
  }
};

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      canvasBg: "#fff",
      isDragging: false,
      imgPos: {
        x: 0,
        y: 0
      }
    };

    this.handleColorChange = debounce(this.handleColorChange.bind(this), 150);
    this.handleColorCompleteChange = this.handleColorCompleteChange.bind(this);
    this.onChange = editorState =>
      this.setState({
        editorState
      });

    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    this.handleCanvasMouseDown = this.handleCanvasMouseDown.bind(this);
    this.handleCanvasMouseMove = this.handleCanvasMouseMove.bind(this);
    this.handleCanvasMouseUp = this.handleCanvasMouseUp.bind(this);
    this.handleCanvasMouseOut = this.handleCanvasMouseOut.bind(this);
  }

  getPixelRatio() {
    let ctx = this.refs.canvas.getContext("2d"),
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

  createHiDPICanvas = function(w, h, ratio) {
    if (!ratio) {
      ratio = this.getPixelRatio();
    }
    let c = this.refs.canvas;
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

    // You must manually set the xmlns if you intend to immediately serialize
    // the HTML document to a string as opposed to appending it to a
    // <foreignObject> in the DOM
    doc.documentElement.setAttribute("xmlns", doc.documentElement.namespaceURI);

    // Get well-formed markup
    let xhtml = new XMLSerializer().serializeToString(doc.documentElement);

    let imprintData = `
      <svg xmlns="http://www.w3.org/2000/svg" width="500" height="500">
        <style>
          html, p {
            margin: 0;
            padding: 0;
          },

          body {
            margin: 0;
            padding: 100px;
          }
        </style>
        <foreignObject width="100%" height="100%">
          ${xhtml || ""}
        </foreignObject>
      </svg>
    `;
    // console.log(imprintData);
    return imprintData;
  }

  componentDidUpdate() {
    console.log("I Updated!");
    // remove previous image
    this.myCanvas.ctx.clearRect(
      0,
      0,
      this.myCanvas.width,
      this.myCanvas.height
    );
    this.drawUpdatedImage();
  }

  drawUpdatedImage() {
    let myCanvas = this.createHiDPICanvas(500, 500);
    this.myCanvas = myCanvas;
    this.myCanvas.ctx.fillStyle = this.state.canvasBg;
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.width, this.myCanvas.height);

    let data = this.getImprintData(this.createMarkup().__html);

    let DOMURL = window.URL || window.webkitURL || window;

    let img = new Image(500, 500);
    this.img = img;
    let svg = new Blob([data], { type: "image/svg+xml" });
    let url = DOMURL.createObjectURL(svg);
    let { x, y } = this.state.imgPos;

    // myCanvas.ctx.font = "40px sans-serif";
    // myCanvas.ctx.fillText('Hello world', 10, 100);

    img.onload = function() {
      myCanvas.ctx.drawImage(img, x, y);

      DOMURL.revokeObjectURL(url);
    };

    img.src = url;
  }

  componentDidMount() {
    this.drawUpdatedImage();
  }

  _handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }

    return false;
  }

  createMarkup() {
    let contentState = this.state.editorState.getCurrentContent();
    let html = stateToHTML(contentState);
    return { __html: html };
  }

  handleColorCompleteChange(color) {
    // console.log(color.hex, this);
    this.setState(prevState => {
      return { canvasBg: color.hex };
    });

    // this.setCanvasBg(color);
  }

  setCanvasBg(color) {
    this.myCanvas.ctx.fillStyle = color.hex;
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.width, this.myCanvas.height);
  }

  handleColorChange(color) {
    this.setState(prevState => {
      return { canvasBg: color.hex };
    });
    this.setCanvasBg(color);
  }

  handleCanvasMouseDown(e) {
    // let cDimensions = this.myCanvas.getBoundingClientRect();
    // let offsetX = cDimensions.left + document.body.scrollLeft;
    // let offsetY = cDimensions.top + document.body.scrollTop;

    this.setState({ isDragging: true });
    this.setCanvasMouseState(e);

    // these are the mouse coordinates with respect to top left canvas corner
    // console.log(e.clientX - offsetX, ", ", e.clientY - offsetY);
  }

  handleCanvasMouseUp(e) {
    this.setState({ isDragging: false });
    this.setCanvasMouseState(e);
  }

  setCanvasMouseState(e) {
    let cDimensions = this.myCanvas.getBoundingClientRect();
    let offsetX = cDimensions.left + document.body.scrollLeft;
    let offsetY = cDimensions.top + document.body.scrollTop;

    this.setState({
      imgPos: {
        x: e.clientX - offsetX,
        y: e.clientY - offsetY
      }
    });
  }

  handleCanvasMouseMove(e) {
    if (this.state.isDragging) {
      // let { cWidth, cHeight, ctx } = this.myCanvas;

      this.setCanvasMouseState(e);

      // ctx.clearRect(0, 0, cWidth, cHeight);
      // ctx.drawImage(this.img, e.clientX - offsetX, e.clientY - offsetY);
    }
  }

  handleCanvasMouseOut() {
    this.setState({ isDragging: false });
  }

  render() {
    const canvasStyles = {
      ...styles.canvas
    };

    return [
      <div key="1" style={styles.editor}>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          keyBindingFn={getDefaultKeyBinding}
          handleKeyCommand={this.handleKeyCommand}
          placeholder={`Writecha Poem Here!`}
        />
        <div style={styles.html}>
          <div className="html" dangerouslySetInnerHTML={this.createMarkup()} />
          <div>{this.createMarkup().__html}</div>
          <canvas
            id="canvas"
            ref="canvas"
            style={canvasStyles}
            onMouseDown={this.handleCanvasMouseDown}
            onMouseUp={this.handleCanvasMouseUp}
            onMouseMove={this.handleCanvasMouseMove}
            onMouseOut={this.handleCanvasMouseOut}
          />
        </div>
      </div>,
      <div
        key="2"
        className="colorpicker-wrapper"
        style={styles.colorpickerWrapper}
      >
        <ChromePicker
          onChangeComplete={this.handleColorCompleteChange}
          onChange={this.handleColorChange}
          color={this.state.canvasBg}
        />
      </div>
    ];
  }
}

export default MyEditor;
