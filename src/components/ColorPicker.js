import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ChromePicker } from 'react-color';

// TODO: this could be a functional component
class ColorPicker extends Component {
  static propTypes = {
    handleColorChange: PropTypes.func.isRequired,
    colorHandle: PropTypes.string.isRequired,
    setEditorBackground: PropTypes.func.isRequired,
    setCurrentColor: PropTypes.func.isRequired,
  };
  static defaultProps = {
    color: '#000000',
    handleColorChange: () => {},
  };

  handleUserChangingColor = (color, event) => {
    const {
      handleColorChange,
      colorHandle,
      setEditorBackground,
      setCurrentColor,
    } = this.props;

    switch (colorHandle) {
      case 'fontColor':
        handleColorChange()(color);
        break;
      case 'imgBg':
        setEditorBackground(color.hex);
        setCurrentColor(color.hex);
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
