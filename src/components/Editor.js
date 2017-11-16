import React, { Component } from "react";
import Draft from "draft-js";
import Editor from "draft-js-plugins-editor";
import createEmojiPlugin from "draft-js-emoji-plugin";
import "draft-js-emoji-plugin/lib/plugin.css";
import g from "glamorous";

import "draft-js/dist/Draft.css";

const emojiPlugin = createEmojiPlugin();
const { EmojiSuggestions } = emojiPlugin;

const { EditorState } = Draft;

class AwesomeEditor extends Component {
  state = {
    editorState: EditorState.createEmpty()
  };

  updateEditorState = editorState => {
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
        boxShadow={this.props.hasFocus}
      >
        <Editor
          editorState={this.state.editorState}
          onChange={this.updateEditorState}
          ref={ref => (this.editor = ref)}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          placeholder={`Writecha Poem Here!`}
          plugins={[emojiPlugin]}
        />
        <EmojiSuggestions />
      </EditorWrapper>
    );
  }
}

export default AwesomeEditor;

const EditorWrapper = g.div(
  {
    border: "2px solid #bdbdbd",
    cursor: "text",
    minHeight: 80,
    padding: 10,
    overflow: "auto",
    maxWidth: "500px",
    maxHeight: "500px",
    height: "500px",
    width: "500px",
    zIndex: "99",
    transition: "box-shadow 0.4s"
  },
  ({ boxShadow }) => ({
    boxShadow: boxShadow ? "-5px 0px 20px 0px rgba(0, 0, 0, 0.75)" : "none"
  })
);
