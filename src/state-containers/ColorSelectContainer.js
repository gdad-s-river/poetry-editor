import { Container } from 'unstated';
import { setLSItem } from '../utils/localStorage';

class ColorSelectContainer extends Container {
  state = {
    currentColor: '#000',
    colorHandle: 'fontColor', // 'fontColor', 'imgBg'
  };

  // val = 'fontColor' || 'imgBg'
  switchColorHandle = val => {
    this.setState({
      colorHandle: val,
    });
  };

  setCurrentColor = color => {
    this.setState({
      currentColor: color,
    });
  };

  handleCurrentColorChange = cPickerUtil => color => {
    this.setCurrentColor(color.hex);
    cPickerUtil.addColor(color.hex);
  };

  handleEditorBgChange = color => {
    this.setCurrentColor(color.hex);
    setLSItem('editorBgColor', color.hex);
  };
}

export default ColorSelectContainer;
