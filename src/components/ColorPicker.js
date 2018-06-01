import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ChromePicker } from 'react-color';

class ColorPicker extends Component {
  static propTypes = {
    handleColorChange: PropTypes.func.isRequired,
    colorHandle: PropTypes.string.isRequired,
    handleEditorBgChange: PropTypes.func.isRequired,
  };
  static defaultProps = {
    color: '#000',
    handleColorChange: () => {},
  };

  handleUserChangingColor = (color, event) => {
    const { handleColorChange, colorHandle, handleEditorBgChange } = this.props;
    console.log('color handler is — ', colorHandle);

    switch (colorHandle) {
      case 'fontColor':
        handleColorChange()(color);
        break;
      case 'imgBg':
        handleEditorBgChange(color);
        break;
      default:
        (() => {})();
        break;
    }
  };
  render() {
    const { color } = this.props;
    return (
      <ChromePicker
        disableAlpha={true}
        onChange={this.handleUserChangingColor}
        color={color}
      />
    );
  }
}

export default ColorPicker;
