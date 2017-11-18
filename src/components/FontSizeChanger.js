import React, { PureComponent } from "react";

class FontSizeChanger extends PureComponent {
  handleOnChange = e => {
    this.intFontSize = `${Math.floor(e.target.value)}px`;
    this.props.addFontSize(this.intFontSize);
  };

  render() {
    return (
      <div>
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
        <span>{this.intFontSize}</span>
      </div>
    );
  }
}

export default FontSizeChanger;
