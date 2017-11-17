import React, { Component } from "react";
import { ChromePicker } from "react-color";
import PropTypes from "prop-types";

class ColorPicker extends Component {
  render() {
    const { handleCurrentColorChange, color } = this.props;

    return (
      <ChromePicker
        disableAlpha={true}
        onChange={handleCurrentColorChange}
        color={color}
      />
    );
  }
}

ColorPicker.propTypes = {
  color: PropTypes.string.isRequired,
  handleCurrentColorChange: PropTypes.func.isRequired
};

export default ColorPicker;
