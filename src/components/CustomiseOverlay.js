import g from 'glamorous';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TopWrapper } from '../PoetryEditor';
import CloseButton from './CloseButton';
import Modal from './Modal';
import TheCanvas from './TheCanvas';

class CustomiseOverlay extends Component {
  static propTypes = {
    toggleModal: PropTypes.func.isRequired,
		editorState: PropTypes.object.isRequired,
		editorBackground: PropTypes.string.isRequired
  };

  handleClick = e => {
    if (e.target.tagName !== 'CANVAS' && !this.isDragging) {
      this.props.toggleModal();
    }
  };

  setDraggingStatusForOverlay = isDragging => {
    this.isDragging = isDragging;
  };

  render() {
    const {
      editorState,
      editorBackground /* customStylesUtils */,
    } = this.props;

    return (
      <Modal>
        <ModalStyledWrapper onClick={this.handleClick}>
          <ModalContentWrapper>
            <CloseButton />
            <TopWrapper>
              <TheCanvas
                editorState={editorState}
                editorBackground={editorBackground}
                // customStylesUtils={customStylesUtils}
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
  backgroundColor: 'rgba(0, 0, 0, 1)',
  position: 'fixed',
  height: '100%',
  width: '100%',
  top: '0',
  left: '0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ModalContentWrapper = g.div({
  width: '100%',
  height: '100%',
  position: 'relative',
});
