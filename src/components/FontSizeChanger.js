import g from 'glamorous';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Slider from './Slider';

class FontSizeChanger extends PureComponent {
  static propTypes = {
    hasEditorFocus: PropTypes.bool.isRequired,
    currentFontSize: PropTypes.number.isRequired,
    addFontSize: PropTypes.func.isRequired,
    setCurrentFontSize: PropTypes.func.isRequired,
  };

  static defaultProps = {
    hasEditorFocus: false,
  };

  constructor(...args) {
    super(...args);

    this.strPixieFontSize = `${this.props.currentFontSize}px`;
  }

  updateFontSize = sliderState => {
    const { setCurrentFontSize, addFontSize } = this.props;

    const fontSize = sliderState.values[0];
    setCurrentFontSize(fontSize);
    this.strPixieFontSize = `${fontSize}px`;
    addFontSize(this.strPixieFontSize);
  };

  componentWillReceiveProps(nextProps) {
    this.strPixieFontSize = `${nextProps.currentFontSize}px`;
  }

  render() {
    const { hasEditorFocus, currentFontSize } = this.props;

    return (
      <FontSizeChangerWrapper>
        <Slider
          handle={MyHandleMaker(hasEditorFocus)}
          hasEditorFocus={hasEditorFocus}
          orientation="vertical"
          onValuesUpdated={this.updateFontSize}
          values={[currentFontSize]}
          min={16}
        />
        <FontSizeDisplay hasEditorFocus={this.props.hasEditorFocus}>
          {this.strPixieFontSize}
        </FontSizeDisplay>
      </FontSizeChangerWrapper>
    );
  }
}

const FontSizeChangerWrapper = g.div({
  display: 'flex',
  alignItems: 'center',
});

const FontSizeDisplay = g.span(
  {
    fontSize: '20px',
    transition: 'color 0.4s',
  },
  ({ hasEditorFocus }) => ({
    color: hasEditorFocus ? '#ffffff' : '#000000',
  }),
);

FontSizeDisplay.propTypes = {
  hasEditorFocus: PropTypes.bool.isRequired,
};

function MyHandleMaker(hasEditorFocus) {
  function CircleHandle({ style, ...passProps }) {
    return (
      <div
        {...passProps}
        style={{
          ...style,
          backgroundColor: '#ffffff',
          border: hasEditorFocus ? '3px solid #48DBDB' : '3px solid #6D6D6D',
          borderRadius: '100%',
          cursor: 'ns-resize',
          height: 24,
          width: 24,
          zIndex: 3,
        }}
      />
    );
  }

  CircleHandle.propTypes = {
    style: PropTypes.object,
  };
  CircleHandle.defaultProps = {
    style: null,
  };

  return CircleHandle;
}
export default FontSizeChanger;
