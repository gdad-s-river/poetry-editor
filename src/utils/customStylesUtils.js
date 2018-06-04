import createStyles from 'draft-js-custom-styles';

const DYNAMIC_STYLES_PREFIX = 'CUSTOM_';

const { styles, customStyleFn, exporter } = createStyles(
  ['color', 'font-size'],
  DYNAMIC_STYLES_PREFIX,
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
  return updateEditorState(styles.fontSize.add(getEditorState(), fontSize));
};

const currentFontSize = getEditorState => () =>
  styles.fontSize.current(getEditorState());

const colorPickerUtil = (updateEditorState, getEditorState) => ({
  addColor: addColor(updateEditorState, getEditorState),
  removeColor: removeColor(updateEditorState, getEditorState),
  currentColor: currentColor(getEditorState),
  addFontSize: addFontSize(updateEditorState, getEditorState),
  currentFontSize: currentFontSize(getEditorState),
  customStyleFn,
  exporter,
});

export default colorPickerUtil;
export { DYNAMIC_STYLES_PREFIX };
