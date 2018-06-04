'use strict';

var _require = require('deep-object-diff'),
  detailedDiff = _require.detailedDiff;

var _require2 = require('unstated'),
  __SUPER_SECRET_CONTAINER_DEBUG_HOOK__ =
    _require2.__SUPER_SECRET_CONTAINER_DEBUG_HOOK__;

var UNSTATED = {
  isEnabled: true,
  logStateChanges: true,
  containers: {},
  get states() {
    var ret = {};
    for (
      var _iterator = Object.entries(this.containers),
        _isArray = Array.isArray(_iterator),
        _i = 0,
        _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();
      ;

    ) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var _ref2 = _ref,
        key = _ref2[0],
        value = _ref2[1];

      ret[key] = value.state;
    }
    return ret;
  },
  logState: function logState() {
    for (
      var _iterator2 = Object.entries(this.containers),
        _isArray2 = Array.isArray(_iterator2),
        _i2 = 0,
        _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();
      ;

    ) {
      var _ref3;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref3 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref3 = _i2.value;
      }

      var _ref4 = _ref3,
        key = _ref4[0],
        value = _ref4[1];

      console.log('%c' + key + '\n', 'font-weight:bold', value.state);
    }
  },
};

__SUPER_SECRET_CONTAINER_DEBUG_HOOK__(function(container) {
  if (!UNSTATED.isEnabled) {
    return;
  }

  var name = container.constructor.name;

  UNSTATED.containers[name] = container;

  var prevState = container.state;

  container.subscribe(function() {
    if (!(UNSTATED.isEnabled && UNSTATED.logStateChanges)) {
      return;
    }

    var state = container.state;

    var diff = detailedDiff(prevState, state);

    console.group(name);

    if (diff.added) {
      console.log('Added\n', diff.added);
    }

    if (diff.updated) {
      console.log('Updated\n', diff.updated);
    }

    if (diff.deleted) {
      console.log('Deleted\n', diff.deleted);
    }

    console.log('New state\n', state);
    console.log('Old state\n', prevState);

    console.groupEnd(name);

    prevState = state;
  });
});

window.UNSTATED = UNSTATED;
module.exports = UNSTATED;
