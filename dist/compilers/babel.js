'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})

var _babelCore = require('babel-core')

var _trim = require('trim')

var _trim2 = _interopRequireDefault(_trim)

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

exports.default = function(code) {
  return (0, _babelCore.transform)((0, _trim2.default)(code), {
    babelrc: false,
    presets: ['env'],
    plugins: ['transform-object-rest-spread']
  }).code
}
//# sourceMappingURL=babel.js.map
