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
import { getLSItem } from "../utils/localStorage";

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

    this.setEditorState(editorState);

    this.syncCurrentFontColorWithPicker(editorState);
  };

  focus = () => this.editor.focus();

  handleFocus = (e, { getEditorState }) => {
    this.props.toggleFocus(true);
    this.props.switchColorPicker("fontColor");

    this.syncCurrentFontColorWithPicker(getEditorState());
  };

  handleBlur = () => {
    this.props.toggleFocus(false);
  };

  syncCurrentFontColorWithPicker(editorState) {
    const currentStyles = editorState.getCurrentInlineStyle();
    const BLACK = "#000";

    if (!currentStyles.size) {
      this.props.setCurrentColor(BLACK);
    }

    const COLOR_PREFIX = DYNAMIC_STYLES_PREFIX + "COLOR_";

    if (this.props.colorSwitch === "fontColor") {
      let filteredStyle = currentStyles.filter(val => {
        return val.startsWith(COLOR_PREFIX);
      });

      const firstNOnlyPrefixedStyle = filteredStyle.first();

      if (firstNOnlyPrefixedStyle) {
        let currentSelectionStyle = firstNOnlyPrefixedStyle.replace(
          COLOR_PREFIX,
          ""
        );
        this.props.setCurrentColor(currentSelectionStyle);
      } else {
        this.props.setCurrentColor(BLACK);
      }
    } else {
      this.props.setCurrentColor(this.bgColor);
    }
  }

  render() {
    const { hasFocus } = this.props;

    let bgColor =
      this.props.colorSwitch === "fontColor" ? "#fff" : this.props.currentColor;

    return (
      <EditorWrapper
        className="editor-wrapper"
        onClick={this.focus}
        hasFocus={hasFocus}
        bgColor={bgColor}
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
  ({ hasFocus, bgColor }) => {
    const storedEditorBgColor = getLSItem("editorBgColor");
    return {
      boxShadow: hasFocus ? "0px 0px 25px 0px #000" : "none",
      border: hasFocus ? "none" : "2px solid #bdbdbd",
      background: storedEditorBgColor
        ? storedEditorBgColor
        : bgColor ? bgColor : "#fff"
    };
  }
);
