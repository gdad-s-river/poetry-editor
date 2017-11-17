import React, { Component } from "react";
import g from "glamorous";

import Editor from "./components/Editor";
import Logo from "./components/Logo";
import ColorPicker from "./components/ColorPicker";
// import SideKick from './components/SideKick'

class PoetryEditor extends Component {
  state = { hasFocus: false, currentColor: "#000", addColor: null };

  toggleFocus = newFocusVal => {
    this.setState((prevState, props) => {
      if (prevState.hasFocus !== newFocusVal) {
        return { hasFocus: newFocusVal };
      } else {
        return;
      }
    });
  };

  /* setAddColor */
  setAddColor = addColorFn => {
    this.setState({
      addColor: addColorFn
    });
  };

  setCurrentColor = color => {
    this.setState({
      currentColor: color
    });
  };

  handleCurrentColorChange = (color, event) => {
    this.setState({ currentColor: color.hex });
    if (this.state.addColor) {
      this.state.addColor(color.hex);
    }
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
          <Editor
            toggleFocus={this.toggleFocus}
            hasFocus={hasFocus}
            currentColor={this.state.currentColor}
            setAddColor={this.setAddColor}
            setCurrentColor={this.setCurrentColor}
          />
          <CenterKick hasFocus={hasFocus} />
        </SuperHero>
        <SideKicks hasFocus={hasFocus}>
          <ColorPicker
            color={this.state.currentColor}
            handleCurrentColorChange={this.handleCurrentColorChange}
          />
        </SideKicks>
      </TopWrapper>
    );
  }
}

export default PoetryEditor;

/* Styles */

const FOCUSSED_BACKGROUND = "#5d5e5f";

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
    background: hasFocus ? FOCUSSED_BACKGROUND : "#7ec6ff"
  })
);

const SideKicks = g.section(sideKicksStyle, ({ hasFocus }) => ({
  background: hasFocus ? FOCUSSED_BACKGROUND : "#d4d4d4"
}));
