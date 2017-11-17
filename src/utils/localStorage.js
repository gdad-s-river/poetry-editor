function getLSItem(itemName) {
  return window.localStorage.getItem(itemName);
}

function setLSItem(itemName, value) {
  window.localStorage.setItem(itemName, value);
}

export { getLSItem, setLSItem };
