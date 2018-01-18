import { RichUtils, getDefaultKeyBinding, KeyBindingUtil } from "draft-js";

const { hasCommandModifier } = KeyBindingUtil;

export default () => {
  return {
    customStyleMap: {
      STRIKETHROUGH: {
        textDecoration: "line-through"
      }
    },

    keyBindingFn: e => {
      // e = synthetic keyboard event
      /* cltr + shift + s (83) = strikethrough*/
      if (e.shiftKey && hasCommandModifier(e)) {
        switch (e.keyCode) {
          case 83:
            return "yo-strikethrough";
          default:
            return getDefaultKeyBinding(e);
        }
      }
      return getDefaultKeyBinding(e);
    },

    handleKeyCommand: (
      command,
      editorState,
      { getEditorState, setEditorState }
    ) => {
      if (command === "yo-strikethrough") {
        setEditorState(
          RichUtils.toggleInlineStyle(editorState, "STRIKETHROUGH")
        );

        return true;
      } else {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
          setEditorState(newState);
          return true;
        }
      }

      return false;
    }
  };
};
