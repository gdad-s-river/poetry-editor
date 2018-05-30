import React, { Component } from "react";
import { ChromePicker } from "react-color";

class FontColorPicker extends Component {
  state = {
    color: {
      r: "255",
      g: "255",
      b: "255",
      a: "255"
    }
  };
  handleChange = color => {
    const { r, g, b, a } = color.rgb;
    this.props.toggleColor(`rgba(${r},${g},${b},${a})`);
  };

  render() {
    return (
      <ChromePicker
        disableAlpha={true}
        color={this.props.color || this.state.color}
        onChange={this.handleChange}
      />
    );
  }
}

export default FontColorPicker;
