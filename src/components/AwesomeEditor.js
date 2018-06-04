import { convertToRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import 'draft-js/dist/Draft.css';
import g from 'glamorous';
import camelCase from 'lodash/camelCase';
import debounce from 'lodash/debounce';
import has from 'lodash/has';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import '../css/Draftjs-custom.css';
import createBlockStylesPlugin from '../plugins/blockStyles';
import { DYNAMIC_STYLES_PREFIX } from '../utils/customStylesUtils';
import { getLSItem } from '../utils/localStorage';
import { reverseString } from '../utils/stringUtils';

const blockStylesPlugin = createBlockStylesPlugin();

class AwesomeEditor extends Component {
  static propTypes = {
    customStylesUtils: PropTypes.object.isRequired,
    currentColor: PropTypes.string.isRequired,
    setCurrentColor: PropTypes.func.isRequired,
    colorHandle: PropTypes.string.isRequired,
    switchColorHandle: PropTypes.func.isRequired,
    setCurrentFontSize: PropTypes.func.isRequired,
    hasEditorFocus: PropTypes.bool.isRequired,
    setEditorFocus: PropTypes.func.isRequired,
    editorState: PropTypes.object.isRequired,
    setEditorState: PropTypes.func.isRequired,
    setEditorBackground: PropTypes.func.isRequired,
    setCurrentFontFamily: PropTypes.func.isRequired,
  };

  componentDidMount() {
    /* restore already saved editorBackground color if any */
    const storedEditorBgColor = getLSItem('editorBackground');

    let initColor = storedEditorBgColor ? storedEditorBgColor : '#ffffff';

    this.props.setCurrentColor(initColor);

    this.props.setEditorBackground(initColor);
  }

  componentDidUpdate() {
    const contentState = this.props.editorState.getCurrentContent();
    this.saveToLocalStorage(contentState);
  }

  saveToLocalStorage = debounce(content => {
    window.localStorage.setItem(
      'content',
      JSON.stringify(convertToRaw(content)),
    );
  }, 100);

  onChange = editorState => {
    this.props.setEditorState(editorState);
    this.syncCurrentDynamicStylesWithSources(editorState);
  };

  focus = () => this.editor.focus();

  handleFocus = (e, { getEditorState }) => {
    this.props.setEditorFocus(true);
    this.props.switchColorHandle('fontColor');

    this.syncCurrentDynamicStylesWithSources(getEditorState());
  };

  handleBlur = () => {
    this.props.setEditorFocus(false);
    this.props.switchColorHandle('imgBg');
  };

  syncCurrentDynamicStylesWithSources(editorState) {
    const currentStyles = editorState.getCurrentInlineStyle();
    const BLACK = '#000000';

    if (!currentStyles.size) {
      this.props.setCurrentColor(BLACK);
    }

    const COLOR_PREFIX = DYNAMIC_STYLES_PREFIX + 'COLOR_';
    const regex = /_(.+)/;

    const dynamicStyles = currentStyles
      .filter(val => val.startsWith(DYNAMIC_STYLES_PREFIX))
      .map(val => {
        const withoutPrevixVal = val.replace(`${DYNAMIC_STYLES_PREFIX}`, '');
        const saneArray = reverseString(withoutPrevixVal)
          .split(regex)
          .filter(val => val.trim() !== '')
          .map(val => reverseString(val))
          .reverse();

        return saneArray;
      })
      .reduce((acc, value) => {
        acc[camelCase(value[0])] = value[1];
        return acc;
      }, {});

    if (has(dynamicStyles, 'fontSize')) {
      console.log('yeah');
      this.props.setCurrentFontSize(
        parseInt(dynamicStyles['fontSize'].replace('px', ''), 10),
      );
    } else {
      this.props.setCurrentFontSize(16);
    }

    if (has(dynamicStyles, 'fontFamily')) {
      this.props.setCurrentFontFamily(dynamicStyles['fontFamily']);
    } else {
      this.props.setCurrentFontFamily('Arial'); // this will only hold true if default font of editor is set to 'arial'
      // hackish way (DONE RIGHT NOW) — put default font from css ('Arial' word repeated across technologies (css, js))
      // TODO: right way — haven't found it yet
    }

    if (has(dynamicStyles, 'color')) {
      this.props.setCurrentColor(dynamicStyles['color']);
    }
  }

  render() {
    const {
      hasEditorFocus,
      editorState,
      customStylesUtils,
      editorBackground,
    } = this.props;

    return (
      <EditorWrapper
        className="editor-wrapper"
        onClick={this.focus}
        hasEditorFocus={hasEditorFocus}
        editorBackground={editorBackground}
      >
        <Editor
          editorState={editorState}
          onChange={this.onChange}
          ref={ref => (this.editor = ref)}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          placeholder={`Writecha Poem Here!`}
          stripPastedStyles={true}
          customStyleFn={customStylesUtils.customStyleFn}
          plugins={[blockStylesPlugin]}
        />
      </EditorWrapper>
    );
  }
}

export default AwesomeEditor;

const EditorWrapper = g.div(
  {
    cursor: 'text',
    minHeight: 80,
    padding: 10,
    overflow: 'auto',
    maxWidth: '500px',
    maxHeight: '500px',
    height: '500px',
    width: '500px',
    zIndex: '99',
    transition: 'box-shadow 0.4s, border 0.4s',
    border: '2px solid #d4d4d4',
  },
  ({ hasEditorFocus, editorBackground }) => {
    return {
      boxShadow: hasEditorFocus ? '0px 0px 25px 0px #000000' : 'none',
      background: editorBackground,
    };
  },
);

EditorWrapper.displayName = 'EditorWrapper';
EditorWrapper.propTypes = {
  hasEditorFocus: PropTypes.bool.isRequired,
};
