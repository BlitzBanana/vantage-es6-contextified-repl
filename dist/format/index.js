'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})

var _chalk = require('chalk')

var _chalk2 = _interopRequireDefault(_chalk)

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

exports.default = function(input) {
  return input && input.toString
    ? _chalk2.default.white(input.toString())
    : input
}
//# sourceMappingURL=index.js.map
