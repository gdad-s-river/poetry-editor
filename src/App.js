import React from "react";
// import ReactDOM from "react-dom";
import Draft from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { ChromePicker } from "react-color";
import FontColorPicker, {
  colorPickerPlugin
} from "./components/ColorPickerPlugin";
// import debounce from "lodash.debounce";

// import importedStyles from "./importedStyles.js";
import "./reset.css";
import "draft-js/dist/Draft.css";

// function log(name, val) {
//   console.log(`${name}: `, val);
// }

const { Editor, EditorState, getDefaultKeyBinding, RichUtils } = Draft;

const styles = {
  editor: {
    border: "1px solid #ccc",
    cursor: "text",
    minHeight: 80,
    padding: 10,
    maxHeight: "10vh",
    overflowY: "scroll"
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
    border: "3px solid black",
    cursor: "pointer",
    marginLeft: "40px"
  }
};

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      canvasBg: "#fff",
      isDragging: false,
      styleMap: {}
    };

    this.focus = () => this.editor.focus();

    this.imgX = 0;
    this.imgY = 0;

    this.handleColorChange = this.handleColorChange.bind(this);
    this.handleColorCompleteChange = this.handleColorCompleteChange.bind(this);
    this.onChange = editorState =>
      this.setState({
        editorState
      });

    this.getEditorState = () => this.state.editorState;
    this.picker = colorPickerPlugin(this.onChange, this.getEditorState);

    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    this.handleCanvasMouseDown = this.handleCanvasMouseDown.bind(this);
    this.handleCanvasMouseMove = this.handleCanvasMouseMove.bind(this);
    this.handleCanvasMouseUp = this.handleCanvasMouseUp.bind(this);
    this.handleCanvasMouseOut = this.handleCanvasMouseOut.bind(this);

    this.toggleColor = toggledColor => this._toggleColor(toggledColor);

    // this.handleFontColorCompleteChange = this.handleFontColorCompleteChange.bind(
    //   this
    // );
    // this.handleFontColorChange = this.handleFontColorChange.bind(this);
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
            padding: 200px;
            /* this improved the font rendering a little (not much visible change on small font sizes, 
              had to see at 500% zoom to see the difference)
              The above was checked with two separate backgrounds : white and some color
              the improvment might have been disguise. So I have to check the above on same background
              before I can claim anything
            */
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
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
    // console.log("cDU fired!");
    // remove previous image
    this.myCanvas.ctx.clearRect(
      0,
      0,
      this.myCanvas.width,
      this.myCanvas.height
    );

    this.drawUpdatedImage();
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   // if (nextState.isDragging === true) {
  //   //   console.log("shouldn't update");
  //   //   return false;
  //   // }
  //   // console.log(
  //   //   "sCU: prev, next state ",
  //   //   this.state.isDragging,
  //   //   nextState.isDragging
  //   // );

  //   return true;
  // }

  drawUpdatedImage() {
    // console.log("drawing updated");
    let myCanvas = this.createHiDPICanvas(500, 500);
    // let load = false;
    this.myCanvas = myCanvas;
    this.myCanvas.ctx.fillStyle = this.state.canvasBg;
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.width, this.myCanvas.height);

    let draftMarkup = this.createMarkup().__html;
    let data = this.getImprintData(draftMarkup);

    let DOMURL = window.URL || window.webkitURL || window;

    let img = new Image(500, 500);
    this.img = img;
    let svg = new Blob([data], { type: "image/svg+xml" });
    let url = DOMURL.createObjectURL(svg);
    // let { x, y } = this.state.imgPos;

    // console.log(this.htmled.querySelectorAll("p"));

    // Array.from(this.htmled.querySelectorAll("p")).forEach(el => {
    //   console.log(el.clientWidth);
    // });
    // console.log(dumEl.getBoundingClientRect());

    // myCanvas.ctx.font = "40px sans-serif";
    // myCanvas.ctx.fillText('Hello world', 10, 100);

    img.onload = function() {
      // load = true;
      /*
        followed this: https://stackoverflow.com/questions/11506619/image-flickers-during-drag-in-canvas
        but didn't get what I wanted, keeping it here as is for now.

        firefox goes bonkerse with trailing parts of previous images as tails,
        need to do something about it.
      */
      draw();
    };

    let that = this;
    function draw() {
      myCanvas.ctx.drawImage(img, that.imgX, that.imgY);
      DOMURL.revokeObjectURL(url);
    }

    img.src = url;

    // window.requestAnimationFrame(this.drawUpdatedImage.bind(this));
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
    const { editorState } = this.state;
    let contentState = editorState.getCurrentContent();
    const inlineStyles = this.picker.exporter(editorState);
    let html = stateToHTML(contentState, { inlineStyles });
    return { __html: html };
  }

  handleColorCompleteChange(color) {
    // console.log( , this);
    this.setState(prevState => {
      return { canvasBg: color.hex };
    });

    this.setCanvasBg(color);
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
    // console.log("mouse down happened");
    // let cDimensions = this.myCanvas.getBoundingClientRect();
    // let offsetX = cDimensions.left + document.body.scrollLeft;
    // let offsetY = cDimensions.top + document.body.scrollTop;

    this.setState({ isDragging: true }, () => {
      // console.log("in mousedown after isDragging set to true");
    });
    // this.setCanvasMouseState(e);

    // these are the mouse coordinates with respect to top left canvas corner
    // console.log(e.clientX - offsetX, ", ", e.clientY - offsetY);
  }

  handleCanvasMouseUp(e) {
    this.setState({ isDragging: false });
    // this.setCanvasMouseState(e);
  }

  setCanvasMouseState(e) {
    let cDimensions = this.myCanvas.getBoundingClientRect();
    let offsetX = cDimensions.left + document.body.scrollLeft;
    let offsetY = cDimensions.top + document.body.scrollTop;

    this.imgX = e.clientX - offsetX;
    this.imgY = e.clientY - offsetY;

    // console.log(this.imgX, this.imgY);

    // this.setState({
    //   imgPos: {
    //     x: e.clientX - offsetX,
    //     y: e.clientY - offsetY
    //   }
    // });
  }

  redrawImg() {
    this.myCanvas.ctx.fillRect(0, 0, this.myCanvas.width, this.myCanvas.height);
    this.myCanvas.ctx.drawImage(this.img, this.imgX, this.imgY);
    requestAnimationFrame(this.redrawImg.bind(this));
  }

  handleCanvasMouseMove(e) {
    if (
      this.state.isDragging &&
      this.state.editorState.getCurrentContent().hasText()
    ) {
      // let { cWidth, cHeight, ctx } = this.myCanvas;

      this.setCanvasMouseState(e);
      this.redrawImg();

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

    const { editorState } = this.state;

    return [
      <div key="1">
        <div
          style={styles.editor}
          className="editor-wrapper"
          onClick={this.focus}
        >
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            keyBindingFn={getDefaultKeyBinding}
            handleKeyCommand={this.handleKeyCommand}
            placeholder={`Writecha Poem Here!`}
            ref={ref => (this.editor = ref)}
            customStyleFn={this.picker.customStyleFn}
          />
        </div>
        <div style={styles.html}>
          <div
            className="html"
            ref={htmled => (this.htmled = htmled)}
            dangerouslySetInnerHTML={this.createMarkup()}
            style={{ display: "none" }}
          />
          <div style={{ display: "none" }}>{this.createMarkup().__html}</div>
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
        <div
          className="color-pickers"
          style={{
            display: "flex",
            width: "37%",
            justifyContent: "space-around"
          }}
        >
          <ChromePicker
            onChangeComplete={this.handleColorCompleteChange}
            onChange={this.handleColorChange}
            color={this.state.canvasBg}
            disableAlpha={true}
          />

          <FontColorPicker
            color={this.picker.currentColor(editorState)}
            toggleColor={color => this.picker.addColor(color)}
          />
          {/* 
          <ChromePicker
            disableAlpha={true}
            style={{ padding: "10px" }}
            onChangeComplete={this.handleFontColorCompleteChange}
            onChange={this.handleFontColorChange}
          /> */}
        </div>
      </div>
    ];
  }

  // handleFontColorCompleteChange(color) {
  //   // this.setState({
  //   //   currentColor: {
  //   //     color: `${color.hex}`
  //   //   }
  //   // });
  //   this.toggleColor(color.hex);
  // }

  // handleFontColorChange(color) {
  //   // this.setState({
  //   //   currentColor: {
  //   //     color: `${color.hex}`
  //   //   }
  //   // });
  //   this.toggleColor(color.hex);
  // }
}

export default MyEditor;
