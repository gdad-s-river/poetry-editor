import React, { Component } from "react";
import Rheostat from "rheostat";

import "../css/slider/base.css";
import "../css/slider/vertical.css";

class Slider extends Component {
  constructor(props) {
    super(props);

    this.state = { values: props.values || [0] };
  }

  render() {
    return (
      <div
        style={{
          margin: "10% auto",
          height: "130px",
          width: "50%"
        }}
      >
        <Rheostat {...this.props} values={this.state.values} />
      </div>
    );
  }
}

export default Slider;
