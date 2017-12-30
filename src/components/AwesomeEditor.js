import React, { Component } from "react";
import { convertToRaw } from "draft-js";
import Editor from "draft-js-plugins-editor";
import createEmojiPlugin from "draft-js-emoji-plugin";
import "draft-js-emoji-plugin/lib/plugin.css";
import g from "glamorous";
import debounce from "lodash.debounce";
import camelCase from "lodash.camelcase";

import { reverseString } from "../utils/stringUtils";
import { isEmptyObject } from "../utils/objectUtils";

import createColorPickerUtil from "../utils/colorPickerUtil";

import createBlockStylesPlugin from "../plugins/blockStyles";
import getEditorStateFromLS from "../utils/getEditorStateFromLS";

import { DYNAMIC_STYLES_PREFIX } from "../utils/colorPickerUtil";
import { getLSItem } from "../utils/localStorage";

import "draft-js/dist/Draft.css";

const blockStylesPlugin = createBlockStylesPlugin();

const emojiPlugin = createEmojiPlugin();
const { EmojiSuggestions } = emojiPlugin;

class AwesomeEditor extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      editorState: getEditorStateFromLS()
    };

    this.cPickerUtil = createColorPickerUtil(
      this.setEditorState,
      this.getEditorState
    );

    // this.props.setAddColor(color => this.cPickerUtil.addColor(color));
    this.props.setcPickerUtilOnApp(this.cPickerUtil);

    // this.props.setAddFontSize(fontSize =>
    //   this.cPickerUtil.addFontSize(fontSize)
    // );
  }

  componentDidUpdate() {
    const contentState = this.state.editorState.getCurrentContent();
    this.saveToLocalStorage(contentState);
  }

  getEditorState = () => {
    return this.state.editorState;
  };

  saveToLocalStorage = debounce(content => {
    window.localStorage.setItem(
      "content",
      JSON.stringify(convertToRaw(content))
    );
  }, 100);

  setEditorState = editorState => {
    this.setState({ editorState: editorState });
  };

  onChange = editorState => {
    // const contentState = editorState.getCurrentContent();
    // this.saveToLocalStorage(contentState);

    this.setEditorState(editorState);
    this.props.setAppEditorState(editorState);

    this.syncCurrentDynamicStylesWithSources(editorState);
  };

  focus = () => this.editor.focus();

  handleFocus = (e, { getEditorState }) => {
    this.props.toggleFocus(true);
    this.props.switchColorPicker("fontColor");

    this.syncCurrentDynamicStylesWithSources(getEditorState());
  };

  handleBlur = () => {
    this.props.toggleFocus(false);
  };

  syncCurrentDynamicStylesWithSources(editorState) {
    const currentStyles = editorState.getCurrentInlineStyle();
    const BLACK = "#000";

    if (!currentStyles.size) {
      this.props.setCurrentColor(BLACK);
    }

    const COLOR_PREFIX = DYNAMIC_STYLES_PREFIX + "COLOR_";
    const regex = /_(.+)/;

    /*
      All this map, split, filter, map, reverse exercise so that I could I could use DRY
      still haven't used this effort because I'm still manually setting at hinge = 1
      TODO
    */
    const dynamicStyles = currentStyles
      .filter(val => val.startsWith(DYNAMIC_STYLES_PREFIX))
      .map(val => {
        const withoutPrevixVal = val.replace(`${DYNAMIC_STYLES_PREFIX}`, "");
        const saneArray = reverseString(withoutPrevixVal)
          .split(regex)
          .filter(val => val.trim() !== "")
          .map(val => reverseString(val))
          .reverse();

        return saneArray;
      })
      .reduce((acc, value) => {
        acc[camelCase(value[0])] = value[1];
        return acc;
      }, {});

    if (!isEmptyObject(dynamicStyles)) {
      Object.keys(dynamicStyles).forEach(val => {
        if (val === "fontSize") {
          this.props.setCurrentFontSize(
            parseInt(dynamicStyles[val].replace("px", ""), 10)
          );
        }
      });
    } else {
      this.props.setCurrentFontSize(16);
    }

    /* hinge: 1*/
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
