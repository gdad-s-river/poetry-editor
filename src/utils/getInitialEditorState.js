import { EditorState, convertFromRaw } from "draft-js";

function getInitialEditorState(localStorageContent) {
  if (localStorageContent) {
    return EditorState.createWithContent(
      convertFromRaw(JSON.parse(localStorageContent))
    );
  } else {
    return EditorState.createEmpty();
  }
}

export default getInitialEditorState;
