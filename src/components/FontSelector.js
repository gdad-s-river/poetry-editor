import g from 'glamorous';
import camelCase from 'lodash/camelCase';
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

// TODO: array of objects instead of strings, so that fonts can be related to which language they should be used with
const googleFontsToDownload = [
  'Century Gothic',
  'Calibri',
  'Journal',
  'Marguerita',
  'Dylan',
  'Crimson Text',
  'Josefin Sans',
  'Merriweather',
  'Droid Serif',
  'Gloria Hallelujah',
  'Rambla',
  'Satisfy',
  'Catamaran',
  'Glegoo', // hindi font
  'Open Sans',
  'Ubuntu',
  'Baloo Thambi',
  'Cinzel Decorative',
  'Kaushan Script',
  'Lobster',
  'Marcellus',
  'Orbitron',
  'Titillium Web',
  'Arya', // hindi
  'Khand', // hindi
  'Kurale', // hindi
  'Rozha One', // hindi
  'Alex Brush',
  'Barrio',
  'Chewy',
  'Great Vibes',
  'Karma', // hindi
  'Metamorphous',
  'Montserrat Subrayada',
  'Pacifico',
  'Princess Sofia',
  'Righteous',
  'Rochester',
  'Sacramento',
  'Sahitya', // hindi,
  'Shadows Into Light',
  'Tangerine',
  'VT323',
  'Atma',
  'Arima Madurai',
  'Kavivanar',
  'Roboto',
  'Lateef', // urdu
  'Mirza', // urdu
  'Acme',
  'Meera Inimai', // other
];

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
  { value: 'georgia', label: 'Georgia' },
  { value: 'segoeUI', label: 'Segoe UI' },
];

const filteredAvailableOptions = fontOptionsToCheck.filter(fontObject => {
  return doesFontExist(fontObject.label);
});

const allAvailableOptions = filteredAvailableOptions.concat(
  falsePositiveNecessaryOptions,
);

class FontSelector extends React.Component {
  state = {
    fonts: allAvailableOptions,
  };

  static propTypes = {
    setCurrentFontFamily: PropTypes.func.isRequired,
    addFontFamily: PropTypes.func.isRequired,
  };

  async componentDidMount() {
    const WebFontConfig = {
      google: {
        families: googleFontsToDownload,
      },
      fontloading: (familyName, fvd) => {
        // console.log('loading... ', familyName, fvd);
      },
      fontactive: (familyName, fvd) => {
        this.setState((prevState, props) => {
          return {
            fonts: [
              ...prevState.fonts,
              { value: camelCase(familyName), label: familyName },
            ],
          };
        });
      },
      active: () => {
        // console.log(allAvailableOptions);
      },
      classes: false,
    };
    const WebFont = await import('webfontloader');

    WebFont.load(WebFontConfig);
  }

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
    const { fonts } = this.state;

    const value = currentFontFamily
      ? find(fonts, ['label', this.props.currentFontFamily])
      : find(fonts, ['label', 'Arial']);

    return (
      <FontSelectorWrapper>
        <Select
          styles={customStyles}
          options={fonts}
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
