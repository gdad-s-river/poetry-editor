import createStyles from "draft-js-custom-styles";
import ColorPicker from "./ColorPicker";

const { styles, customStyleFn, exporter } = createStyles(
  ["color", "font-size"],
  "CUSTOM_"
);

const addColor = (updateEditorState, getEditorState) => color => {
  return updateEditorState(styles.color.add(getEditorState(), color));
};

const removeColor = (updateEditorState, getEditorState) => () => {
  return updateEditorState(styles.color.remove(getEditorState()));
};

const currentColor = getEditorState => () =>
  styles.color.current(getEditorState());

const addFontSize = (updateEditorState, getEditorState) => fontSize => {
  console.log(fontSize);
  return updateEditorState(styles.fontSize.add(getEditorState(), fontSize));
};

const currentFontSize = getEditorState => () =>
  styles.fontSize.current(getEditorState());

export const colorPickerPlugin = (updateEditorState, getEditorState) => ({
  addColor: addColor(updateEditorState, getEditorState),
  removeColor: removeColor(updateEditorState, getEditorState),
  currentColor: currentColor(getEditorState),
  addFontSize: addFontSize(updateEditorState, getEditorState),
  currentFontSize: currentFontSize(getEditorState),
  customStyleFn,
  exporter
});

export default ColorPicker;
