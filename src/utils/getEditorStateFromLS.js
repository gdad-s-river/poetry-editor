import { convertFromRaw } from "draft-js";
import { getLSItem } from "./localStorage";

function getEditorStateFromLS() {
  return convertFromRaw(JSON.parse(getLSItem("content")));
}

export default getEditorStateFromLS;
