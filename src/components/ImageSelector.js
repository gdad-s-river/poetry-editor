import React, { Component } from "react";
import Dropzone from "react-dropzone";
import g from "glamorous";

const StyledDropzone = g(Dropzone)({
  width: "578px",
  height: "578px",
  borderStyle: "dotted",
  background: "gray"
});

const StyledSection = g.section({
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
});

class ImageSelector extends Component {
  constructor() {
    super();
    this.state = {
      accepted: [],
      rejected: []
    };
  }

  render() {
    return (
      <StyledSection>
        <div className="dropzone">
          <StyledDropzone
            accept="image/jpeg, image/png"
            multiple={false}
            onDrop={(accepted, rejected) => {
              this.setState({ accepted, rejected });
            }}
          >
            {this.state.accepted.map((f, i) => {
              console.log(f);
              return null;
            })}
          </StyledDropzone>
        </div>
      </StyledSection>
    );
  }
}

export default ImageSelector;
