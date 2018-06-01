import { convertToRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import 'draft-js/dist/Draft.css';
import g from 'glamorous';
import camelCase from 'lodash.camelcase';
import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import createBlockStylesPlugin from '../plugins/blockStyles';
import { DYNAMIC_STYLES_PREFIX } from '../utils/colorPickerUtil';
import { getLSItem } from '../utils/localStorage';
import { isEmptyObject } from '../utils/objectUtils';
import { reverseString } from '../utils/stringUtils';

const blockStylesPlugin = createBlockStylesPlugin();

class AwesomeEditor extends Component {
  static propTypes = {
    cPickerUtil: PropTypes.object.isRequired,
    currentColor: PropTypes.string.isRequired,
    setCurrentColor: PropTypes.func.isRequired,
    colorHandle: PropTypes.string.isRequired,
    switchColorHandle: PropTypes.func.isRequired,
    setCurrentFontSize: PropTypes.func.isRequired,
    hasEditorFocus: PropTypes.bool.isRequired,
    setEditorFocus: PropTypes.func.isRequired,
    editorState: PropTypes.object.isRequired,
    setEditorState: PropTypes.func.isRequired,
  };

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
  };

  syncCurrentDynamicStylesWithSources(editorState) {
    const currentStyles = editorState.getCurrentInlineStyle();
    const BLACK = '#000';

    if (!currentStyles.size) {
      this.props.setCurrentColor(BLACK);
    }

    const COLOR_PREFIX = DYNAMIC_STYLES_PREFIX + 'COLOR_';
    const regex = /_(.+)/;

    /*
      All this map, split, filter, map, reverse exercise so that I could I could use DRY
      still haven't used this effort because I'm still manually setting at hinge = 1
      TODO
    */
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

    if (!isEmptyObject(dynamicStyles)) {
      Object.keys(dynamicStyles).forEach(val => {
        if (val === 'fontSize') {
          this.props.setCurrentFontSize(
            parseInt(dynamicStyles[val].replace('px', ''), 10),
          );
        }
      });
    } else {
      this.props.setCurrentFontSize(16);
    }

    /* hinge: 1*/
    if (this.props.colorHandle === 'fontColor') {
      let filteredStyle = currentStyles.filter(val => {
        return val.startsWith(COLOR_PREFIX);
      });

      const firstNOnlyPrefixedStyle = filteredStyle.first();

      if (firstNOnlyPrefixedStyle) {
        let currentSelectionStyle = firstNOnlyPrefixedStyle.replace(
          COLOR_PREFIX,
          '',
        );
        this.props.setCurrentColor(currentSelectionStyle);
      } else {
        this.props.setCurrentColor(BLACK);
      }
    } else {
      this.props.setCurrentColor(this.bgColor);
    }
  }

  render() {
    const { hasEditorFocus, editorState, cPickerUtil } = this.props;

    let bgColor =
      this.props.colorHandle === 'fontColor' ? '#fff' : this.props.currentColor;

    return (
      <EditorWrapper
        className="editor-wrapper"
        onClick={this.focus}
        hasEditorFocus={hasEditorFocus}
        bgColor={bgColor}
      >
        <Editor
          editorState={editorState}
          onChange={this.onChange}
          ref={ref => (this.editor = ref)}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          placeholder={`Writecha Poem Here!`}
          stripPastedStyles={true}
          customStyleFn={cPickerUtil.customStyleFn}
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
  ({ hasEditorFocus, bgColor }) => {
    const storedEditorBgColor = getLSItem('editorBgColor');
    return {
      boxShadow: hasEditorFocus ? '0px 0px 25px 0px #000' : 'none',
      background: storedEditorBgColor
        ? storedEditorBgColor
        : bgColor
          ? bgColor
          : '#fff',
    };
  },
);

EditorWrapper.displayName = 'EditorWrapper';
EditorWrapper.propTypes = {
  hasEditorFocus: PropTypes.bool.isRequired,
};
