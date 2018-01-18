function getLSItem(itemName) {
  if (window) {
    return window.localStorage.getItem(itemName);
  } else {
    return "";
  }
}

function setLSItem(itemName, value) {
  if (window) {
    window.localStorage.setItem(itemName, value);
  } else {
    return "";
  }
}

export { getLSItem, setLSItem };
