import React, { Component } from "react";
import g from "glamorous";

import Editor from "./components/Editor";
import Logo from "./components/Logo";
import ColorPicker from "./components/ColorPicker";
// import SideKick from './components/SideKick'

class PoetryEditor extends Component {
  state = { hasFocus: false };

  toggleFocus = newFocusVal => {
    this.setState((prevState, props) => {
      if (prevState.hasFocus !== newFocusVal) {
        return { hasFocus: newFocusVal };
      } else {
        return;
      }
    });
  };

  render() {
    const { hasFocus } = this.state;

    return (
      <TopWrapper>
        <SideKicks hasFocus={hasFocus}>
          <div>One dum </div>
          <div>Two Dum</div>
        </SideKicks>
        <SuperHero>
          <CenterKick hasFocus={hasFocus}>
            <Logo />
          </CenterKick>
          <Editor toggleFocus={this.toggleFocus} hasFocus={hasFocus} />
          <CenterKick hasFocus={hasFocus} />
        </SuperHero>
        <SideKicks hasFocus={hasFocus}>
          <ColorPicker />
        </SideKicks>
      </TopWrapper>
    );
  }
}

export default PoetryEditor;

/* Styles */

const tWrapNSideKicksCommonStyles = {
  flex: 1
};

const TopWrapper = g.div({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  ...tWrapNSideKicksCommonStyles
});

const SuperHero = g.section({
  height: "100%",
  display: "flex",
  flexDirection: "column"
});

const kicksCommonStyles = {
  transition: "background 0.4s"
};

const sideKicksStyle = {
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  ...tWrapNSideKicksCommonStyles,
  ...kicksCommonStyles
};

const CenterKick = g.div(
  {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ...kicksCommonStyles
  },
  ({ hasFocus }) => ({
    background: hasFocus ? "#5d5e5f" : "#7ec6ff"
  })
);

const SideKicks = g.section(sideKicksStyle, ({ hasFocus }) => ({
  background: hasFocus ? "#5d5e5f" : "#d4d4d4"
}));
