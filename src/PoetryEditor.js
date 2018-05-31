import g from 'glamorous';
import React, { Component, Fragment } from 'react';
import AwesomeEditor from './components/AwesomeEditor';
import ColorPicker from './components/ColorPicker';
import ColorPickerSwitch from './components/ColorPickerSwitch';
import CustomiseOverlay from './components/CustomiseOverlay';
import FontSizeChanger from './components/FontSizeChanger';
import Logo from './components/Logo';
import ModalOpener from './components/ModalOpener';
import './css/overrides.css';
import createColorPickerUtil from './utils/colorPickerUtil';
import { setLSItem } from './utils/localStorage';

class PoetryEditor extends Component {
  constructor(...args) {
    super(...args);
    this.cPickerUtil = () => {};

    this.cPickerUtil = createColorPickerUtil(
      this.props.setEditorState,
      this.props.getEditorState,
    );
  }

  state = {
    currentColor: '#000',
    colorSwitch: 'fontColor',
    editorBgColor: '#fff',
    currentFontSize: 16,
    isModal: false,
  };

  componentDidMount() {
    let doc = document;
    doc
      .querySelector('body')
      .addEventListener('keydown', this.closeModalOnEscape);
  }

  componentWillUnmount() {
    document
      .querySelector('body')
      .removeEventListener('keydown', this.closeModalOnEscape);
  }

  closeModalOnEscape = e => {
    if (e.keyCode === 27 && this.state.isModal) {
      this.toggleModal();
    }
  };

  /* from editor inlinestyle color to keep in sync with colorpicker*/
  setCurrentColor = color => {
    this.setState({
      currentColor: color,
    });
  };

  handleCurrentColorChange = (color, event) => {
    this.setState({ currentColor: color.hex });
    this.cPickerUtil.addColor(color.hex);
  };

  handleEditorBgChange = (color, event) => {
    this.setState({ currentColor: color.hex });
    setLSItem('editorBgColor', color.hex);
  };

  switchColorPicker = val => {
    this.setState({
      colorSwitch: val,
    });
  };

  toggleModal = () => {
    this.setState((prevState, props) => {
      return { isModal: !prevState.isModal };
    });
  };

  handleCurrentFontSizeChange(fontSize) {
    this.setState({ currentFontSize: fontSize });
    this.cPickerUtil.addFontSize(fontSize);
  }

  setCurrentFontSize = fontSize => {
    this.setState({
      currentFontSize: fontSize,
    });
  };

  render() {
    const { colorSwitch, editorBgColor } = this.state;
    const {
      state: { editorFocus, editorState },
      setEditorFocus,
      setEditorState,
    } = this.props;
    switch (colorSwitch) {
      case 'fontColor':
        this.handleColorChange = this.handleCurrentColorChange;
        break;
      case 'imgBg':
        this.handleColorChange = this.handleEditorBgChange;
        break;
      default:
        this.handleColorChange = this.handleCurrentColorChange;
        break;
    }

    return (
      <Fragment>
        {this.state.isModal ? (
          <CustomiseOverlay
            toggleModal={this.toggleModal}
            canvasBg={editorBgColor}
            editorState={editorState}
            cPickerUtil={this.cPickerUtil}
          />
        ) : null}
        <TopWrapper>
          <SideKicks hasEditorFocus={editorFocus}>
            <ModalOpener toggleModal={this.toggleModal} />
          </SideKicks>
          <SuperHero>
            <CenterKick hasEditorFocus={editorFocus}>
              <Logo />
            </CenterKick>
            <AwesomeEditor
              cPickerUtil={this.cPickerUtil}
              currentColor={this.state.currentColor}
              setCurrentColor={this.setCurrentColor}
              editorBgColor={this.state.editorBgColor}
              colorSwitch={this.state.colorSwitch}
              switchColorPicker={this.switchColorPicker}
              setCurrentFontSize={this.setCurrentFontSize}
              hasEditorFocus={editorFocus}
              setEditorFocus={setEditorFocus}
              editorState={editorState}
              setEditorState={setEditorState}
            />
            <CenterKick hasEditorFocus={editorFocus} />
          </SuperHero>
          <SideKicks hasEditorFocus={editorFocus}>
            <SideKickRightWrapper>
              <FontSizeChanger
                currentFontSize={this.state.currentFontSize}
                handleCurrentFontSizeChange={this.handleCurrentFontSizeChange}
                addFontSize={this.cPickerUtil.addFontSize}
                setCurrentFontSize={this.setCurrentFontSize}
                hasEditorFocus={editorFocus}
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
      </Fragment>
    );
  }
}

export default PoetryEditor;

/* Styles */

const FOCUSSED_BACKGROUND = '#5d5e5f';

const tWrapNSideKicksCommonStyles = {
  flex: 1,
};

const TopWrapper = g.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  ...tWrapNSideKicksCommonStyles,
});

TopWrapper.displayName = 'TopWrapper';

export { TopWrapper };

const SuperHero = g.section({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
});

SuperHero.displayName = 'SuperHero';

const kicksCommonStyles = {
  transition: 'background 0.4s',
};

const sideKicksStyle = {
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  ...tWrapNSideKicksCommonStyles,
  ...kicksCommonStyles,
};

const CenterKick = g.div(
  {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...kicksCommonStyles,
  },
  ({ hasEditorFocus }) => ({
    background: hasEditorFocus ? FOCUSSED_BACKGROUND : '#A7B8C9',
  }),
);

CenterKick.display = 'CenterKick';

const SideKicks = g.section(sideKicksStyle, ({ hasEditorFocus }) => ({
  background: hasEditorFocus ? FOCUSSED_BACKGROUND : '#d4d4d4',
}));

SideKicks.displayName = 'SideKick';

const SideKickRightWrapper = g.div({
  padding: '10px 0',
});
