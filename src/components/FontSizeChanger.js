import React, { PureComponent } from "react";
import g from "glamorous";

function convertToStringPxValue(fontSizeNumber) {
  return `${Math.floor(fontSizeNumber)}px`;
}

class FontSizeChanger extends PureComponent {
  constructor(props) {
    super(props);
    this.intFontSize = convertToStringPxValue(this.props.currentFontSize);
  }

  handleOnChange = e => {
    const fontValue = e.target.value;
    this.intFontSize = `${Math.floor(fontValue)}px`;
    this.props.setCurrentFontSize(fontValue);
    this.props.addFontSize(this.intFontSize);
  };

  componentWillReceiveProps(nextProps) {
    this.intFontSize = convertToStringPxValue(nextProps.currentFontSize);
  }

  render() {
    console.log(this.props.currentFontSize);
    return (
      <FontSizeChangerWrapper>
        <label htmlFor="font-size-changer" />
        <input
          type="range"
          id="font-size-changer"
          min="0"
          max="100"
          step="any"
          value={this.props.currentFontSize}
          onChange={this.handleOnChange}
          style={{
            WebkitAppearance: "slider-vertical",
            writingMode: "bt-lr"
          }}
          orient="vertical"
        />
        <FontSizeDisplay hasFocus={this.props.hasFocus}>
          {this.intFontSize}
        </FontSizeDisplay>
      </FontSizeChangerWrapper>
    );
  }
}

const FontSizeChangerWrapper = g.div({
  display: "flex",
  alignItems: "center"
});

const FontSizeDisplay = g.span(
  {
    fontSize: "20px",
    transition: "color 0.4s"
  },
  ({ hasFocus }) => ({
    color: hasFocus ? "#fff" : "#000"
  })
);
export default FontSizeChanger;
