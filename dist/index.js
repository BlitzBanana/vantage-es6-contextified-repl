'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.run = exports.formatResult = exports.compiler = undefined

exports.default = function(vantage) {
  var _this = this

  var options =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}

  var mode = options.mode || 'repl'
  var delimiter = options.delimiter || 'repl:'
  var sandbox = Object.assign(
    {},
    { _: _lodash2.default, Promise: _bluebird2.default },
    options.context
  )
  var vm = new _vm.VM({ sandbox: sandbox, compiler: compiler })

  vantage
    .mode(mode, 'Enters REPL mode.')
    .delimiter(delimiter)
    .init(function(args, cb) {
      this.log("Entering REPL Mode. To exit, type 'exit'")
      cb(undefined, "Entering REPL Mode. To exit, type 'exit'.")
    })
    .action(function(command) {
      return run(vm, command)
        .then(function(result) {
          return _bluebird2.default.resolve(formatResult(result))
        })
        .tap(function(output) {
          return _this.log(output)
        })
    })
}

var _bluebird = require('bluebird')

var _bluebird2 = _interopRequireDefault(_bluebird)

var _vm = require('vm2')

var _babelCore = require('babel-core')

var _isPromise = require('is-promise')

var _isPromise2 = _interopRequireDefault(_isPromise)

var _chalk = require('chalk')

var _chalk2 = _interopRequireDefault(_chalk)

var _jsome = require('jsome')

var _jsome2 = _interopRequireDefault(_jsome)

var _cardinal = require('cardinal')

var _jsBeautify = require('js-beautify')

var _lodash = require('lodash')

var _lodash2 = _interopRequireDefault(_lodash)

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

var wrapCode = function wrapCode(code) {
  return ';(() => {return ' + code + '})()'
}

var compiler = (exports.compiler = function compiler(content) {
  return (0, _babelCore.transform)(wrapCode(content), {
    babelrc: false,
    presets: ['env']
  }).code
})

var beautifyJs = function beautifyJs(input) {
  return (0, _jsBeautify.js_beautify)(input, { indent_size: 2 })
}
var formatString = function formatString(input) {
  return _chalk2.default.white(input)
}
var formatObject = function formatObject(input) {
  return (0, _jsome2.default)(input)
}
var formatArray = function formatArray(input) {
  return formatObject(input)
}
var formatFunction = function formatFunction(input) {
  return (0, _cardinal.highlight)(beautifyJs(input.toString()))
}

var formatResult = (exports.formatResult = function formatResult(result) {
  if (_lodash2.default.isString(result)) {
    return formatString(result)
  } else if (_lodash2.default.isFunction(result)) {
    return formatFunction(result)
  } else if (_lodash2.default.isArray(result)) {
    return formatArray(result)
  } else if (_lodash2.default.isObject(result)) {
    return formatObject(result)
  }
  return formatString(result)
})

var run = (exports.run = function run(vm, command) {
  return new _bluebird2.default(function(resolve, reject) {
    try {
      var result = vm.run(command)
      if ((0, _isPromise2.default)(result)) {
        result.then(resolve).catch(reject)
      } else {
        resolve(result)
      }
    } catch (err) {
      reject(err)
    }
  })
})
