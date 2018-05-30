function reverseString(str) {
  var splitString = str.split("");
  var reverseArray = splitString.reverse();
  var joinArray = reverseArray.join("");

  return joinArray; // "olleh"
}

export default reverseString;

function hasString(string) {
  var regex = /\d/g;
  return regex.test(string);
}

export { reverseString, hasString };
