import React from "react";
import g from "glamorous";
import PropTypes from "prop-types";

function NotDesktop({ minScreenWidth }) {
  return (
    <Wrapper>
      {`If you aren't using desktop/laptop (screens above ${minScreenWidth}px) 
      why not use
     `}
      <a href="https://yourquote.in">Yourquote App</a>
      {" instead ?"}
    </Wrapper>
  );
}

NotDesktop.propTypes = {
  minScreenWidth: PropTypes.number.isRequired
};

const Wrapper = g.div({
  position: "fixed",
  top: "50%",
  left: "50%",
  width: "75%",
  transform: "translateX(-50%) translateY(-50%)",
  fontSize: "2rem"
});

Wrapper.displayName = "Wrapper";

export default NotDesktop;
