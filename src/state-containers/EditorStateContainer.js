import { Container } from 'unstated';
import getEditorStateFromLS from '../utils/getEditorStateFromLS';
import { setLSItem } from '../utils/localStorage';

class EditorFocusContainer extends Container {
  state = {
    editorFocus: false,
    editorState: getEditorStateFromLS(),
    editorBackground: '#ffffff',
    editorRef: null,
  };

  setEditorFocus = newFocusVal => {
    this.setState(prevState => {
      if (prevState.editorFocus !== newFocusVal) {
        return { editorFocus: !prevState.editorFocus };
      } else {
        return;
      }
    });
  };

  getEditorState = () => {
    return this.state.editorState;
  };

  setEditorState = editorState => {
    this.setState({ editorState });
  };

  setEditorBackground = background => {
    if (!background) {
      throw new Error('need to give some background');
    }

    let hexColorRegex = /^#[0-9A-F]{6}$/i;
    let isHexColor = hexColorRegex.test(background);

    // background is not an image
    if (isHexColor) {
      this.setState({
        editorBackground: background,
      });

      setLSItem('editorBackground', background);
    }
  };

  setEditorRef = ref => {
    this.setState({ editorRef: ref });
  };
}

export default EditorFocusContainer;
