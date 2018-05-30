import React from "react";
import g from "glamorous";

import closeModalBtn from "../assets/images/closeModalBtn";

const StyledCloseBox = g.div({
  position: "absolute",
  top: "5px",
  left: "5px",
  width: "35px",
  height: "35px"
});

function CloseButton({ toggleModal }) {
  return (
    <StyledCloseBox className="close-btn-container">
      <div
        className="close-btn-wrapper"
        style={{ width: "100%", height: "100%" }}
        dangerouslySetInnerHTML={{
          __html: closeModalBtn({
            width: "35px",
            height: "35px",
            strokeWidth: 30,
            strokeColor: "#fff"
          })
        }}
      />
    </StyledCloseBox>
  );
}
export default CloseButton;
