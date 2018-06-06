import createStyles from 'draft-js-custom-styles';

const DYNAMIC_STYLES_PREFIX = 'CUSTOM_';

const { styles, customStyleFn, exporter } = createStyles(
  ['color', 'font-size', 'font-family'],
  DYNAMIC_STYLES_PREFIX,
);

// TODO: convert all of this in a wrapping function to avoid repetition
const addColor = (updateEditorState, getEditorState) => color => {
  return updateEditorState(styles.color.add(getEditorState(), color));
};

const removeColor = (updateEditorState, getEditorState) => () => {
  return updateEditorState(styles.color.remove(getEditorState()));
};

// const currentColor = getEditorState => () =>
//   styles.color.current(getEditorState());

const addFontSize = (updateEditorState, getEditorState) => fontSize => {
  return updateEditorState(styles.fontSize.add(getEditorState(), fontSize));
};

// const currentFontSize = getEditorState => () =>
//   styles.fontSize.current(getEditorState());

const addFontFamily = (updateEditorState, getEditorState) => fontFamily => {
  return updateEditorState(styles.fontFamily.add(getEditorState(), fontFamily));
};

const colorPickerUtil = (updateEditorState, getEditorState) => ({
  addColor: addColor(updateEditorState, getEditorState),
  removeColor: removeColor(updateEditorState, getEditorState),
  // currentColor: currentColor(getEditorState), // TODO: is not being used anywhere (check and remove)
  addFontSize: addFontSize(updateEditorState, getEditorState),
  addFontFamily: addFontFamily(updateEditorState, getEditorState),
  // currentFontSize: currentFontSize(getEditorState), // TODO: is not being used anywhere (check and remove)
  customStyleFn,
  exporter,
});

export default colorPickerUtil;
export { DYNAMIC_STYLES_PREFIX };
