import React, { PureComponent } from "react";
import Draft from "draft-js";

const { EditorState, Modifier } = Draft;

class FontSizeChanger extends PureComponent {
  state = {
    rangeVal: 0
  };

  handleOnChange = e => {
    // console.log("button released");
    this.setState({
      rangeVal: e.target.value
    });
  };

  handleOnInput = e => {
    // console.log(Math.floor(e.target.value));
    // const { editorState, changeEditorState } = this.props;
    // const contentState = editorState.getCurrentContent();
    // let newContentState = contentState.createEntity("CHANGED_FONT", "MUTABLE");

    // const entityKey = newContentState.getLastCreatedEntityKey();

    // const selectionState = editorState.getSelection();

    // newContentState = Modifier.applyEntity(
    //   newContentState,
    //   selectionState,
    //   entityKey
    // );

    // const newEditorState = EditorState.push(
    //   editorState,
    //   newContentState,
    //   "apply-entity"
    // );

    // changeEditorState(newEditorState);

    // const newEditorState = EditorState.set(editorState, {
    //   currentContent: contentStateWithEntity
    // });

    // console.log("new editor state ", newEditorState.toJS());

    // changeEditorState(newEditorState);

    this.props.addFontSize(`${Math.floor(e.target.value)}px`);
    this.props.resetCanvas();
  };

  render() {
    return (
      <div>
        <label htmlFor="font-size-changer" />
        <input
          type="range"
          id="font-size-changer"
          min="0"
          max="100"
          step="any"
          value={this.state.rangeVal}
          onChange={this.handleOnChange}
          style={{
            WebkitAppearance: "slider-vertical",
            writingMode: "bt-lr"
          }}
          orient="vertical"
          onInput={this.handleOnInput}
        />
      </div>
    );
  }
}

export default FontSizeChanger;
