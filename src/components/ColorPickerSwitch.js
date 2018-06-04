import find from 'lodash/find';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Select from 'react-select';
// import { getLSItem } from '../utils/localStorage';

const customStyles = {
  control: base => ({
    ...base,
    width: 200,
    // TODO: see how to disable cursor style
  }),
};

const options = [
  { value: 'fontColor', label: 'Font Color' },
  { value: 'imgBg', label: 'Background Color' },
];

class ColorPickerSwitch extends PureComponent {
  state = {
    selectedOption: find(options, ['value', this.props.colorHandle]),
  };

  static getDerivedStateFromProps(props, prevState) {
    // if (
    //   prevState.selectedOption &&
    //   props.colorHandle !== prevState.selectedOption.value
    // ) {
    //   console.log(find(options, ['value', props.colorHandle]));
    //   return { selectedOption: find(options, ['value', props.colorHandle]) };
    // }

    /**
     * We need to do this without checking the above commented code
     * because we need to accout for when the user doesn't really change
     * the select option manually, but instead selects the already selected one
     */
    return { selectedOption: find(options, ['value', props.colorHandle]) };

    // return prevState;
  }

  handleChange = val => {
    if (val) {
      this.props.switchColorHandle(val.value);
      this.setState({ selectedOption: find(options, ['value', val]) });
    }
  };

  handleMenuClose() {
    // this.setState(selectedOption: this.state.selectedOption);
  }

  render() {
    const { selectedOption } = this.state;

    return (
      <Select
        name="switch-color-picker"
        defaultValue={options[0]}
        options={options}
        onChange={this.handleChange}
        styles={customStyles}
        value={selectedOption}
        onMenuClose={this.handleMenuClose}
        searchable={false}
      />
    );
  }
}

ColorPickerSwitch.propTypes = {
  switchColorHandle: PropTypes.func.isRequired,
};

export default ColorPickerSwitch;
