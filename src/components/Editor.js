import React, { Component } from "react";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import Editor from "draft-js-plugins-editor";
import createEmojiPlugin from "draft-js-emoji-plugin";
import "draft-js-emoji-plugin/lib/plugin.css";
import g from "glamorous";
import debounce from "lodash/debounce";

import createBlockStylesPlugin from "../plugins/blockStyles";

import "draft-js/dist/Draft.css";

const blockStylesPlugin = createBlockStylesPlugin();

const emojiPlugin = createEmojiPlugin();
const { EmojiSuggestions } = emojiPlugin;

class AwesomeEditor extends Component {
  constructor(props) {
    super(props);

    const content = window.localStorage.getItem("content");

    this.state = (() => {
      /* check if there is saved content in localstorage*/
      if (content) {
        return {
          editorState: EditorState.createWithContent(
            convertFromRaw(JSON.parse(content))
          )
        };
      } else {
        return { editorState: EditorState.createEmpty() };
      }
    })();
  }

  saveToLocalStorage = debounce(content => {
    window.localStorage.setItem(
      "content",
      JSON.stringify(convertToRaw(content))
    );
  }, 500);

  onChange = editorState => {
    const contentState = editorState.getCurrentContent();
    this.saveToLocalStorage(contentState);
    this.setState({ editorState: editorState });
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
