import React from "react";
import g from "glamorous";

const StyledModalOpener = g.button({});

function ModalOpener({ toggleModal }) {
  return <StyledModalOpener onClick={toggleModal}>Customize</StyledModalOpener>;
}

export default ModalOpener;
