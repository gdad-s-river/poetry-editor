import g from 'glamorous';
import find from 'lodash/find';
import PropTypes from 'prop-types';
import React from 'react';
import Select from 'react-select';

const customStyles = {
  control: base => ({
    ...base,
    width: 200,
    // TODO: see how to disable cursor style
  }),
};

const testOptions = [
  { value: 'arial', label: 'Arial' },
  { value: 'timesNewRoman', label: 'Times New Roman' },
  { value: 'courier', label: 'Courier' },
];

class FontSelector extends React.Component {
  static propTypes = {
    setCurrentFontFamily: PropTypes.func.isRequired,
    currentFontFamily: PropTypes.string.isRequired,
  };

  handleChange = ({ value, label }, { action }) => {
    const { addFontFamily } = this.props;

    this.props.setCurrentFontFamily(label);
    addFontFamily(label);
  };

  render() {
    return (
      <FontSelectorWrapper>
        <Select
          styles={customStyles}
          options={testOptions}
          placeholder={`Apply Font`}
          onChange={this.handleChange}
          value={find(testOptions, ['label', this.props.currentFontFamily])}
        />
      </FontSelectorWrapper>
    );
  }
}

const FontSelectorWrapper = g.div({
  margin: '100px 0',
});

export default FontSelector;
