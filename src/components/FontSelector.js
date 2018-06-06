import g from 'glamorous';
import find from 'lodash/find';
import PropTypes from 'prop-types';
import React from 'react';
import Select from 'react-select';

const customStyles = {
  control: base => ({
    ...base,
    width: 200,
  }),
  option: (styles, { data }) => {
    // Apply the same font to the option as well, which it intends to apply in the editor
    return { ...styles, fontFamily: data.label };
  },
};

function doesFontExist(fontName) {
  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');
  let text = "I'm going to get hired because of this poetry editor";
  // specifying the baseline font
  context.font = '72px monospace';
  let baselineSize = context.measureText(text).width;
  context.font = "72px '" + fontName + "', monospace";
  let newSize = context.measureText(text).width;
  canvas = null;

  if (newSize === baselineSize) {
    return false;
  } else {
    return true;
  }
}

const fontOptionsToCheck = [
  { value: 'arial', label: 'Arial' },
  { value: 'timesNewRoman', label: 'Times New Roman' },
  { value: 'helvetica', label: 'Helvetica' },
  { value: 'times', label: 'Times' },
  { value: 'garamond', label: 'Garamond' },
];

const falsePositiveNecessaryOptions = [
  { value: 'veranda', label: 'Veranda' },
  { value: 'monospace', label: 'monospace' },
  { value: 'courier', label: 'Courier' },
  { value: 'courierNew', label: 'Courier New' },
  { value: 'consolas', label: 'Consolas' },
];

const filteredAvailableOptions = fontOptionsToCheck.filter(fontObject => {
  return doesFontExist(fontObject.label);
});

const allAvailableOptions = filteredAvailableOptions.concat(
  falsePositiveNecessaryOptions,
);

class FontSelector extends React.Component {
  static propTypes = {
    setCurrentFontFamily: PropTypes.func.isRequired,
    addFontFamily: PropTypes.func.isRequired,
  };

  handleChange = ({ value, label }, { action }) => {
    if (action === 'select-option') {
      const { addFontFamily, editorRef, setCurrentFontFamily } = this.props;

      if (window.requestAnimationFrame) {
        requestAnimationFrame(() => {
          editorRef.focus();

          requestAnimationFrame(() => {
            setCurrentFontFamily(label);
            addFontFamily(label);
          });
        });
      }
    }
  };

  render() {
    const { currentFontFamily } = this.props;

    const value = currentFontFamily
      ? find(allAvailableOptions, ['label', this.props.currentFontFamily])
      : find(allAvailableOptions, ['label', 'Arial']);

    return (
      <FontSelectorWrapper>
        <Select
          styles={customStyles}
          options={allAvailableOptions}
          placeholder={`Apply Font`}
          onChange={this.handleChange}
          value={value}
          onFocus={this.handleFocus}
        />
      </FontSelectorWrapper>
    );
  }
}

const FontSelectorWrapper = g.div({
  margin: '100px 0',
});

export default FontSelector;
