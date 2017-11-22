import React from "react";
import g from "glamorous";

const StyledModalOpener = g.button({
  color: "#222",
  fontWeight: "600",
  border: "solid #222 2px",
  display: "inline-block",
  borderRadius: "5px",
  padding: "6px 12px",
  cursor: "pointer",
  backgroundColor: "#83ffcd",
  boxShadow: "4px 4px 0 #222",
  ":hover": {
    boxShadow: "2px 2px 0 #222"
  },
  ":active": {
    boxShadow: "none"
  }
});

function ModalOpener({ toggleModal }) {
  return <StyledModalOpener onClick={toggleModal}>Customize</StyledModalOpener>;
}

export default ModalOpener;
