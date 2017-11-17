import React, { Component } from "react";
import { ChromePicker } from "react-color";
import PropTypes from "prop-types";

class ColorPicker extends Component {
  render() {
    const { color, handleColorChange } = this.props;
    return (
      <ChromePicker
        disableAlpha={true}
        onChange={handleColorChange}
        color={color}
      />
    );
  }
}

ColorPicker.propTypes = {
  color: PropTypes.string.isRequired,
  handleColorChange: PropTypes.func.isRequired
};

export default ColorPicker;
