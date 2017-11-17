import React, { Component } from "react";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import Editor from "draft-js-plugins-editor";
import createEmojiPlugin from "draft-js-emoji-plugin";
import "draft-js-emoji-plugin/lib/plugin.css";
import g from "glamorous";
import debounce from "lodash/debounce";

import createColorPickerUtil from "../utils/colorPickerUtil";

import createBlockStylesPlugin from "../plugins/blockStyles";
import getInitialEditorState from "../utils/getInitialEditorState";

import { DYNAMIC_STYLES_PREFIX } from "../utils/colorPickerUtil";

import "draft-js/dist/Draft.css";

const blockStylesPlugin = createBlockStylesPlugin();

const emojiPlugin = createEmojiPlugin();
const { EmojiSuggestions } = emojiPlugin;

class AwesomeEditor extends Component {
  constructor(props) {
    super(props);

    const content = window.localStorage.getItem("content");

    this.state = {
      editorState: getInitialEditorState(content)
    };

    this.cPickerUtil = createColorPickerUtil(
      this.setEditorState,
      this.getEditorState
    );

    this.props.setAddColor(color => this.cPickerUtil.addColor(color));
  }

  getEditorState = () => {
    return this.state.editorState;
  };

  saveToLocalStorage = debounce(content => {
    window.localStorage.setItem(
      "content",
      JSON.stringify(convertToRaw(content))
    );
  }, 500);

  setEditorState = editorState => {
    this.setState({ editorState: editorState });
  };

  onChange = editorState => {
    const contentState = editorState.getCurrentContent();
    this.saveToLocalStorage(contentState);

    /* 
      @description: 1. Map over all currentStyles (with is an Immutable OrderedSet)
      2. Find the dynamically changed color style value
      3. extract color from it and set currentColor (which is passed to colorpicker so that it would sync)
    */

    const currentStyles = editorState.getCurrentInlineStyle();
    console.log(currentStyles.size);

    if (!currentStyles.size) {
      this.props.setCurrentColor("#000");
    }

    currentStyles.map((value, key, iter) => {
      const COLOR_PREFIX = DYNAMIC_STYLES_PREFIX + "COLOR_";
      if (value.startsWith(COLOR_PREFIX)) {
        const color = value.replace(COLOR_PREFIX, "");
        this.props.setCurrentColor(color);
      } else {
        this.props.setCurrentColor("#000");
      }
      return value;
    });

    this.setEditorState(editorState);
  };

  focus = () => this.editor.focus();

  handleFocus = () => {
    this.props.toggleFocus(true);
  };

  handleBlur = () => {
    this.props.toggleFocus(false);
  };

  render() {
    return (
      <EditorWrapper
        className="editor-wrapper"
        onClick={this.focus}
        hasFocus={this.props.hasFocus}
      >
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          ref={ref => (this.editor = ref)}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          placeholder={`Writecha Poem Here!`}
          stripPastedStyles={true}
          customStyleFn={this.cPickerUtil.customStyleFn}
          plugins={[emojiPlugin, blockStylesPlugin]}
        />
        <EmojiSuggestions />
      </EditorWrapper>
    );
  }
}

export default AwesomeEditor;

const EditorWrapper = g.div(
  {
    cursor: "text",
    minHeight: 80,
    padding: 10,
    overflow: "auto",
    maxWidth: "500px",
    maxHeight: "500px",
    height: "500px",
    width: "500px",
    zIndex: "99",
    transition: "box-shadow 0.4s, border 0.4s"
  },
  ({ hasFocus }) => ({
    boxShadow: hasFocus ? "0px 0px 25px 0px #000" : "none",
    border: hasFocus ? "none" : "2px solid #bdbdbd"
  })
);
