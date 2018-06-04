import g from 'glamorous';
import React, { Component, Fragment } from 'react';
import Loadable from 'react-loadable';
import AwesomeEditor from './components/AwesomeEditor';
import ColorPicker from './components/ColorPicker';
import ColorPickerSwitch from './components/ColorPickerSwitch';
// import CustomiseOverlay from './components/CustomiseOverlay';
import FontSizeChanger from './components/FontSizeChanger';
import LoadableLoading from './components/LoadableLoading';
import Logo from './components/Logo';
import ModalOpener from './components/ModalOpener';
import './css/overrides.css';
import createCustomStylesUtils from './utils/customStylesUtils';

const LazyCanvasOverlay = Loadable({
  loader: () => import('./components/CustomiseOverlay'),
  render(loaded, props) {
    let CustomiseOverlay = loaded.default;
    return <CustomiseOverlay {...props} />;
  },
  loading: LoadableLoading,
});

class PoetryEditor extends Component {
  constructor(...args) {
    super(...args);
    this.customStylesUtils = () => {};

    this.customStylesUtils = createCustomStylesUtils(
      this.props.setEditorState,
      this.props.getEditorState,
    );
  }

  state = {
    currentFontSize: 16,
    isModal: false,
  };

  componentDidMount() {
    document
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

  toggleModal = () => {
    this.setState((prevState, props) => {
      return { isModal: !prevState.isModal };
    });
  };

  handleCurrentFontSizeChange(fontSize) {
    this.setState({ currentFontSize: fontSize });
    this.customStylesUtils.addFontSize(fontSize);
  }

  setCurrentFontSize = fontSize => {
    if (!fontSize) {
      throw new Error('You need to pass font size');
    }

    this.setState({
      currentFontSize: fontSize,
    });
  };

  render() {
    const {
      state: {
        editorFocus,
        editorState,
        editorBackground,
        colorHandle,
        currentColor,
      },
      setEditorFocus,
      setEditorState,
      switchColorHandle,
      setCurrentColor,
      handleCurrentColorChange,
      setEditorBackground,
    } = this.props;

    return (
      <Fragment>
        {this.state.isModal ? (
          <LazyCanvasOverlay
            toggleModal={this.toggleModal}
            editorState={editorState}
            customStylesUtils={this.customStylesUtils}
            editorBackground={editorBackground}
          />
        ) : null}
        <TopWrapper>
          <SideKicks hasEditorFocus={editorFocus}>
            <ModalOpener toggleModal={this.toggleModal} />
          </SideKicks>
          <SuperHero>
            <CenterKick hasEditorFocus={editorFocus}>
              <Logo hasEditorFocus={editorFocus} />
            </CenterKick>
            <AwesomeEditor
              customStylesUtils={this.customStylesUtils}
              currentColor={currentColor}
              setCurrentColor={setCurrentColor}
              colorHandle={colorHandle}
              switchColorHandle={switchColorHandle}
              setCurrentFontSize={this.setCurrentFontSize}
              hasEditorFocus={editorFocus}
              setEditorFocus={setEditorFocus}
              editorState={editorState}
              setEditorState={setEditorState}
              editorBackground={editorBackground}
              setEditorBackground={setEditorBackground}
            />
            <CenterKick hasEditorFocus={editorFocus} />
          </SuperHero>
          <SideKicks hasEditorFocus={editorFocus}>
            <SideKickRightWrapper>
              <FontSizeChanger
                currentFontSize={this.state.currentFontSize}
                handleCurrentFontSizeChange={this.handleCurrentFontSizeChange}
                addFontSize={this.customStylesUtils.addFontSize}
                setCurrentFontSize={this.setCurrentFontSize}
                hasEditorFocus={editorFocus}
              />
            </SideKickRightWrapper>
            <SideKickRightWrapper>
              <ColorPicker
                color={currentColor}
                colorHandle={colorHandle}
                handleColorChange={() =>
                  handleCurrentColorChange(this.customStylesUtils)
                }
                setEditorBackground={setEditorBackground}
                setCurrentColor={setCurrentColor}
              />
            </SideKickRightWrapper>

            <SideKickRightWrapper>
              <ColorPickerSwitch
                colorHandle={colorHandle}
                switchColorHandle={switchColorHandle}
                setCurrentColor={setCurrentColor}
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
