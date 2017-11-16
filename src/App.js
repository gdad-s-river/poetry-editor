import React from "react";
// import ReactDOM from "react-dom";
import Draft from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { ChromePicker } from "react-color";
import FontColorPicker, { colorPickerPlugin } from "./comps/ColorPickerPlugin";

import FontSizeChanger from "./comps/FontSizeChanger";

import "./reset.css";
import "draft-js/dist/Draft.css";

const styleMap = {
  STRIKETHROUGH: {
    textDecoration: "line-through"
  }
};

const {
  Editor,
  EditorState,
  getDefaultKeyBinding,
  RichUtils,
  KeyBindingUtil,
  Modifier
} = Draft;

const { hasCommandModifier } = KeyBindingUtil;

function customKeyBindingFn(e) {
  // e = synthetic keyboard event
  if (e.shiftKey && hasCommandModifier(e)) {
    switch (e.keyCode) {
      case 83:
        return "yo-strikethrough";
      default:
        return getDefaultKeyBinding(e);
    }
  }
  return getDefaultKeyBinding(e);
}

const styles = {
  editor: {
    border: "1px solid #ccc",
    cursor: "text",
    minHeight: 80,
    padding: 10,
    maxHeight: "10vh",
    overflow: "auto",
    maxWidth: "80vw"
  },
  html: {
    position: "fixed",
    top: "120px"
  },
  colorpickerWrapper: {
    position: "relative",
    top: "50px",
    width: "50vw",
    left: "60%"
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
            padding: 0;
            /* this improved the font rendering a little (not much visible change on small font sizes, 
              had to see at 500% zoom to see the difference)
              The above was checked with two separate backgrounds : white and some color
              the improvment might have been disguise. So I have to check the above on same background
              before I can claim anything
            */
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          /* https://meyerweb.com/eric/tools/css/reset/ */
          html, body, div, span, applet, object, iframe,
          h1, h2, h3, h4, h5, h6, p, blockquote, pre,
          a, abbr, acronym, address, big, cite, code,
          del, dfn, em, img, ins, kbd, q, s, samp,
          small, strike, strong, sub, sup, tt, var,
          b, u, i, center,
          dl, dt, dd, ol, ul, li,
          fieldset, form, label, legend,
          table, caption, tbody, tfoot, thead, tr, th, td,
          article, aside, canvas, details, embed, 
          figure, figcaption, footer, header, hgroup, 
          menu, nav, output, ruby, section, summary,
          time, mark, audio, video {
            margin: 0;
            padding: 0;
            border: 0;
            font-size: 100%;
            font: inherit;
            vertical-align: baseline;
          }
          /* HTML5 display-role reset for older browsers */
          article, aside, details, figcaption, figure, 
          footer, header, hgroup, menu, nav, section {
            display: block;
          }
          body {
            line-height: 1;
          }
          ol, ul {
            list-style: none;
          }
          blockquote, q {
            quotes: none;
          }
          blockquote:before, blockquote:after,
          q:before, q:after {
            content: '';
            content: none;
          }
          table {
            border-collapse: collapse;
            border-spacing: 0;
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
    this.resetCanvas();

    this.drawUpdatedImage();
  }

  resetCanvas = () => {
    this.myCanvas.ctx.clearRect(
      0,
      0,
      this.myCanvas.width,
      this.myCanvas.height
    );
  };
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
      // console.log("have drawn");
    };

    let that = this;
    function draw() {
      // myCanvas.ctx.drawImage(img, that.imgX, that.imgY);
      /*
        using this instead of the above, because the difference is visible 
        when we use range input selector to switch font size very fast (
          it ends in multiple font-ed text on the canvas which looks weird.
          This happens because of unscheduled repaints (in dev tools performance timeline
          the green "bar" before the image renders on canvas is always "composite layers")
           (I think?) because of which requestAnimationFrame was made at the first place
        )

        update: read this: https://jakearchibald.com/2013/solving-rendering-perf-puzzles/
      */
      that.redrawImg();
      DOMURL.revokeObjectURL(url);
    }

    img.src = url;

    // window.requestAnimationFrame(this.drawUpdatedImage.bind(this));
  }

  componentDidMount() {
    this.drawUpdatedImage();
  }

  _handleKeyCommand(command, editorState) {
    if (command === "yo-strikethrough") {
      // get a new editorstate using selected text and strikethrouging it
      const { editorState } = this.state;
      const selectionState = editorState.getSelection();
      const currentContent = editorState.getCurrentContent();
      const newContentState = Modifier.applyInlineStyle(
        currentContent,
        selectionState,
        "STRIKETHROUGH"
      );

      /* 
      I could have used the draftjs-custom-styles package utility
      like I have for changing font and color of text, but it would
      involve writing this in multiple files and passing around props (I think)
      besides I wanted to have hands on how change inline styles myself so 😉
      */

      const newState = EditorState.push(
        editorState,
        newContentState,
        "change-inline-style"
      );
      if (newState) {
        this.onChange(newState);
      }

      return true;
    } else {
      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        this.onChange(newState);
        return true;
      }
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
    this.myCanvas.ctx.drawImage(this.img, this.imgX, this.imgY, 500, 500);
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

  handleBeforeInput(chars, state) {
    /*
      below code to revert to default styles on next character enter
    */
    // console.log(state.toJS());

    // const selection = state.getSelection();

    // if (!selection.isCollapsed()) {
    //   return false;
    // }

    // const startOffset = selection.getStartOffset();
    // const content = state.getCurrentContent();
    // const block = content.getBlockForKey(selection.getStartKey());

    // const entity = block.getEntityAt(startOffset);
    // if (entity === null) {
    //   console.log("yeah science");
    //   // const style = state.getCurrentInlineStyle();
    //   const newContent = Modifier.insertText(content, selection, chars, null);
    //   this.onChange(EditorState.push(state, newContent, "insert-characters"));
    //   return "handled";
    // }

    return "not-handled";
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
            keyBindingFn={customKeyBindingFn}
            handleKeyCommand={this.handleKeyCommand}
            placeholder={`Writecha Poem Here!`}
            ref={ref => (this.editor = ref)}
            customStyleFn={this.picker.customStyleFn}
            customStyleMap={styleMap}
            handleBeforeInput={this.handleBeforeInput}
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
        <FontSizeChanger
          font={this.picker.currentFontSize(editorState)}
          addFontSize={fontSize => this.picker.addFontSize(fontSize)}
          resetCanvas={this.resetCanvas}
          editorState={editorState}
          changeEditorState={this.onChange}
        />
        <div
          className="color-pickers"
          style={{
            display: "flex",
            width: "37%",
            justifyContent: "space-around",
            flexDirection: "column"
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
