import { convertFromRaw, EditorState } from "draft-js";
import { getLSItem } from "./localStorage";

function getEditorStateFromLS() {
  const storedEditorContentString = getLSItem("content");

  if (!storedEditorContentString) {
    return EditorState.createEmpty();
  }

  const storedEditorContent = JSON.parse(storedEditorContentString);

  // If content is an object and it has some content
  if (
    storedEditorContent.constructor === Object &&
    !!Object.keys(storedEditorContent).length
  ) {
    return EditorState.createWithContent(convertFromRaw(storedEditorContent));
  } else {
    return EditorState.createEmpty();
  }
}

export default getEditorStateFromLS;
