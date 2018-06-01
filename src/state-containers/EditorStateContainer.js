import { Container } from 'unstated';
import getEditorStateFromLS from '../utils/getEditorStateFromLS';

class EditorFocusContainer extends Container {
  state = {
    editorFocus: false,
    editorState: getEditorStateFromLS(),
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
}

export default EditorFocusContainer;
