function getLSItem(itemName) {
  if (window) {
    return window.localStorage.getItem(itemName);
  }
}

function setLSItem(itemName, value) {
  if (window) {
    window.localStorage.setItem(itemName, value);
  }
}

export { getLSItem, setLSItem };
