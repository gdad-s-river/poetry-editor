import React, { Component } from "react";
import g from "glamorous";

import AwesomeEditor from "./components/AwesomeEditor";
import Logo from "./components/Logo";
import ColorPicker from "./components/ColorPicker";
import ColorPickerSwitch from "./components/ColorPickerSwitch";
import FontSizeChanger from "./components/FontSizeChanger";
import CustomiseOverlay from "./components/CustomiseOverlay";
import ModalOpener from "./components/ModalOpener";

import { setLSItem } from "./utils/localStorage";

import getEditorStateFromLS from "./utils/getEditorStateFromLS";

import "./css/overrides.css";

class PoetryEditor extends Component {
  constructor(...args) {
    super(...args);
    this.addColor = () => {};
    this.addFontSize = () => {};
    this.addColor = this.addColor.bind(this);
    this.addFontSize = this.addFontSize(this);
  }

  state = {
    hasEditorFocus: false,
    currentColor: "#000",
    colorSwitch: "fontColor",
    editorBgColor: "#fff",
    currentFontSize: 16,
    isModal: false,
    editorState: getEditorStateFromLS()
  };

  componentDidMount() {
    document
      .querySelector("body")
      .addEventListener("keydown", this.closeModalOnEscape);
  }

  componentWillUnmount() {
    document
      .querySelector("body")
      .removeEventListener("keydown", this.closeModalOnEscape);
  }

  setAppEditorState = editorState => {
    this.setState({ editorState });
  };

  setcPickerUtilOnApp = cPickerUtil => {
    this.cPickerUtil = cPickerUtil;
  };

  closeModalOnEscape = e => {
    if (e.keyCode === 27 && this.state.isModal) {
      this.toggleModal();
    }
  };

  toggleFocus = newFocusVal => {
    this.setState((prevState, props) => {
      if (prevState.hasEditorFocus !== newFocusVal) {
        return { hasEditorFocus: newFocusVal };
      } else {
        return;
      }
    });
  };

  /* setAddColor (from colorPicker to change text color)*/
  setAddColor = addColorFn => {
    // this.setState({
    //   addColor: addColorFn
    // });

    this.addColor = addColorFn;
  };

  /* from editor inlinestyle color to keep in sync with colorpicker*/
  setCurrentColor = color => {
    this.setState({
      currentColor: color
    });
  };

  handleCurrentColorChange = (color, event) => {
    this.setState({ currentColor: color.hex });
    // if (this.addColor) {
    this.addColor(color.hex);
    // }
  };

  handleEditorBgChange = (color, event) => {
    this.setState({ currentColor: color.hex });
    setLSItem("editorBgColor", color.hex);
  };

  switchColorPicker = val => {
    this.setState({
      colorSwitch: val
    });
  };

  toggleModal = () => {
    this.setState((prevState, props) => {
      return { isModal: !prevState.isModal };
    });
  };

  handleCurrentFontSizeChange(fontSize) {
    this.setState({ currentFontSize: fontSize });
    // if (this.addFontSize) {
    this.addFontSize(fontSize);
    // }
  }

  setAddFontSize = addFontSizeFn => {
    // this.setState({ addFontSize: addFontSizeFn });
    this.addFontSize = addFontSizeFn;
  };

  setCurrentFontSize = fontSize => {
    this.setState({
      currentFontSize: fontSize
    });
  };

  render() {
    const { hasEditorFocus, colorSwitch } = this.state;
    switch (colorSwitch) {
      case "fontColor":
        this.handleColorChange = this.handleCurrentColorChange;
        break;
      case "imgBg":
        this.handleColorChange = this.handleEditorBgChange;
        break;
      default:
        this.handleColorChange = this.handleCurrentColorChange;
        break;
    }

    return [
      this.state.isModal ? (
        <CustomiseOverlay
          key="1"
          toggleModal={this.toggleModal}
          canvasBg={this.state.editorBgColor}
          editorState={this.state.editorState}
          cPickerUtil={this.cPickerUtil}
        />
      ) : null,
      <TopWrapper key="2">
        <SideKicks hasEditorFocus={hasEditorFocus}>
          <ModalOpener toggleModal={this.toggleModal} />
        </SideKicks>
        <SuperHero>
          <CenterKick hasEditorFocus={hasEditorFocus}>
            <Logo />
          </CenterKick>
          <AwesomeEditor
            toggleFocus={this.toggleFocus}
            hasEditorFocus={hasEditorFocus}
            currentColor={this.state.currentColor}
            setAddColor={this.setAddColor}
            setAddFontSize={this.setAddFontSize}
            setCurrentColor={this.setCurrentColor}
            setcPickerUtilOnApp={this.setcPickerUtilOnApp}
            editorBgColor={this.state.editorBgColor}
            colorSwitch={this.state.colorSwitch}
            switchColorPicker={this.switchColorPicker}
            setCurrentFontSize={this.setCurrentFontSize}
            setAppEditorState={this.setAppEditorState}
          />
          <CenterKick hasEditorFocus={hasEditorFocus} />
        </SuperHero>
        <SideKicks hasEditorFocus={hasEditorFocus}>
          <SideKickRightWrapper>
            <FontSizeChanger
              currentFontSize={this.state.currentFontSize}
              handleCurrentFontSizeChange={this.handleCurrentFontSizeChange}
              addFontSize={this.addFontSize}
              setCurrentFontSize={this.setCurrentFontSize}
              hasEditorFocus={this.state.hasEditorFocus}
            />
          </SideKickRightWrapper>
          <SideKickRightWrapper>
            <ColorPicker
              color={this.state.currentColor}
              handleColorChange={this.handleColorChange}
            />
          </SideKickRightWrapper>

          <SideKickRightWrapper>
            <ColorPickerSwitch
              colorSwitch={colorSwitch}
              switchColorPicker={this.switchColorPicker}
              setCurrentColor={this.setCurrentColor}
            />
          </SideKickRightWrapper>
        </SideKicks>
      </TopWrapper>
    ];
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

TopWrapper.displayName = "TopWrapper";

export { TopWrapper };

const SuperHero = g.section({
  height: "100%",
  display: "flex",
  flexDirection: "column"
});

SuperHero.displayName = "SuperHero";

const kicksCommonStyles = {
  transition: "background 0.4s"
};

const sideKicksStyle = {
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
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
  ({ hasEditorFocus }) => ({
    background: hasEditorFocus ? FOCUSSED_BACKGROUND : "#A7B8C9"
  })
);

CenterKick.display = "CenterKick";

const SideKicks = g.section(sideKicksStyle, ({ hasEditorFocus }) => ({
  background: hasEditorFocus ? FOCUSSED_BACKGROUND : "#d4d4d4"
}));

SideKicks.displayName = "SideKick";

const SideKickRightWrapper = g.div({
  padding: "10px 0"
});
