import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { getLSItem } from '../utils/localStorage';

const options = [
  { value: 'fontColor', label: 'Font Color' },
  { value: 'imgBg', label: 'Image Background' },
];

class ColorPickerSwitch extends PureComponent {
  handleChange = val => {
    if (val) {
      this.props.switchColorHandle(val.value);
    }

    const storedEditorBgColor = getLSItem('editorBgColor');

    this.props.setCurrentColor(
      storedEditorBgColor ? storedEditorBgColor : '#fff',
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
  switchColorHandle: PropTypes.func.isRequired,
};

export default ColorPickerSwitch;
