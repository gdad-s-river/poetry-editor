import { Container } from 'unstated';

class ColorSelectContainer extends Container {
  state = {
    currentColor: '#000000',
    colorHandle: 'imgBg', // 'fontColor', 'imgBg'
  };

  // val = 'fontColor' || 'imgBg'
  switchColorHandle = val => {
    this.setState({
      colorHandle: val,
    });
  };

  setCurrentColor = color => {
    if (!color) {
      throw new Error('You need to pass in some color');
    }

    this.setState({
      currentColor: color,
    });
  };

  handleCurrentColorChange = customStylesUtils => color => {
    this.setCurrentColor(color.hex);
    customStylesUtils.addColor(color.hex);
  };
}

export default ColorSelectContainer;
