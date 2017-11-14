import React, { PureComponent } from "react";
// import debounce from "lodash.debounce";

class FontSizeChanger extends PureComponent {
  state = {
    rangeVal: 0
  };

  handleOnChange = e => {
    console.log("button released");
    this.setState({
      rangeVal: e.target.value
    });
  };

  handleOnInput = e => {
    // console.log(Math.floor(e.target.value));
    this.props.addFontSize(`${Math.floor(e.target.value)}px`);
    this.props.resetCanvas();
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
          value={this.state.rangeVal}
          onChange={this.handleOnChange}
          style={{
            WebkitAppearance: "slider-vertical",
            writingMode: "bt-lr"
          }}
          orient="vertical"
          onInput={this.handleOnInput}
        />
      </div>
    );
  }
}

export default FontSizeChanger;
