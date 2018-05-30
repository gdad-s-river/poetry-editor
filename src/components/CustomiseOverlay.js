import React, { Component } from "react";
import g from "glamorous";

import { TopWrapper } from "../PoetryEditor";

import Modal from "./Modal";
import CloseButton from "./CloseButton";
import TheCanvas from "./TheCanvas";

class CustomiseOverlay extends Component {
  handleClick = e => {
    if (e.target.tagName !== "CANVAS" && !this.isDragging) {
      this.props.toggleModal();
    }
  };

  setDraggingStatusForOverlay = isDragging => {
    this.isDragging = isDragging;
  };

  render() {
    const { editorState, canvasBg, cPickerUtil } = this.props;

    return (
      <Modal>
        <ModalStyledWrapper onClick={this.handleClick}>
          <ModalContentWrapper>
            <CloseButton />
            <TopWrapper>
              <TheCanvas
                canvasBg={canvasBg}
                editorState={editorState}
                cPickerUtil={cPickerUtil}
                setDraggingStatusForOverlay={this.setDraggingStatusForOverlay}
              />
            </TopWrapper>
          </ModalContentWrapper>
        </ModalStyledWrapper>
      </Modal>
    );
  }
}

export default CustomiseOverlay;

const ModalStyledWrapper = g.div({
  backgroundColor: "rgba(0, 0, 0, 1)",
  position: "fixed",
  height: "100%",
  width: "100%",
  top: "0",
  left: "0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
});

const ModalContentWrapper = g.div({
  width: "100%",
  height: "100%",
  position: "relative"
});
