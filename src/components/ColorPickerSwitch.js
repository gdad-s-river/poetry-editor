import React, { PureComponent } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import "react-select/dist/react-select.css";

import { getLSItem } from "../utils/localStorage";

const options = [
  { value: "fontColor", label: "Font Color" },
  { value: "imgBg", label: "Image Background" }
];

class ColorPickerSwitch extends PureComponent {
  handleChange = val => {
    console.log(val);
    if (val) {
      this.props.switchColorPicker(val.value);
    }

    const storedEditorBgColor = getLSItem("editorBgColor");

    this.props.setCurrentColor(
      storedEditorBgColor ? storedEditorBgColor : "#fff"
    );
  };

  render() {
    return (
      <Select
        name="switch-color-picker"
        value={this.props.colorSwitch}
        options={options}
        onChange={this.handleChange}
      />
    );
  }
}

ColorPickerSwitch.propTypes = {
  switchColorPicker: PropTypes.func.isRequired
};

export default ColorPickerSwitch;
