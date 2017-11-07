import React from "react";
import { render } from "react-dom";
import Draft from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { ChromePicker } from "react-color";
import debounce from 'lodash.debounce';

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
    left: "30%",
  }
};

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      canvasBg: "#fff"
    };

    this.handleColorChange = debounce(this.handleColorChange, 150);
    this.onChange = editorState =>
      this.setState({
        editorState
      });
    this.handleKeyCommand = this._handleKeyCommand.bind(this);
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

  createHiDPICanvas = function (w, h, bgColor, ratio) {
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
    c.ctx.fillStyle = bgColor;
    c.ctx.fillRect(0, 0, c.width, c.height);
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
            padding: 20px;
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
    this.againNagain();
  }

  againNagain() {
    var myCanvas = this.createHiDPICanvas(500, 500, this.state.canvasBg);
    var data = this.getImprintData(this.createMarkup().__html);
    // let data = this.getImprintData();
    // console.log(data);

    var DOMURL = window.URL || window.webkitURL || window;

    var img = new Image(500, 500);
    var svg = new Blob([data], { type: "image/svg+xml" });
    var url = DOMURL.createObjectURL(svg);

    // myCanvas.ctx.font = "40px sans-serif";
    // myCanvas.ctx.fillText('Hello world', 10, 100);

    img.onload = function () {
      myCanvas.ctx.drawImage(img, 0, 0);

      DOMURL.revokeObjectURL(url);
    };

    img.src = url;
  }

  componentDidMount() {
    this.againNagain();
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

  handleChangeComplete(color) {
    // console.log(color.hex);
    this.setState({ canvasBg: color.hex })
  }

  handleColorChange(color) {
    this.setState({ canvasBg: color.hex })
  }

  render() {
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
          <canvas id="canvas" ref="canvas" />
        </div>
      </div>,
      <div key="2" className="colorpicker-wrapper" style={styles.colorpickerWrapper}>
        <ChromePicker
          onChangeComplete={this.handleChangeComplete}
          onChange={this.handleColorChange}
          color={this.state.canvasBg} />
      </div>
    ];
  }
}


export default MyEditor;