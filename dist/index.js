'use strict'

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
}

var vm = _interopDefault(require('vm'))
var Promise$1 = _interopDefault(require('bluebird'))
var _ = _interopDefault(require('lodash'))
var babelCore = require('babel-core')
var trim = _interopDefault(require('trim'))
var emphasize = require('emphasize')
var stringify = _interopDefault(require('json-stringify-safe'))

var babel = function(code) {
  return babelCore.transform(trim(code), {
    babelrc: false,
    presets: ['env'],
    plugins: ['transform-object-rest-spread']
  }).code
}

var none = function(input) {
  return input
}

var _typeof =
  typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
    ? function(obj) {
        return typeof obj
      }
    : function(obj) {
        return obj &&
          typeof Symbol === 'function' &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? 'symbol'
          : typeof obj
      }

var highlight = function(input) {
  switch (typeof input === 'undefined' ? 'undefined' : _typeof(input)) {
    case 'function':
      return emphasize.highlightAuto(input.toString()).value
    case 'object':
      return emphasize.highlightAuto(stringify(input, null, 2)).value
    default:
      return emphasize.highlightAuto(String(input)).value
  }
}

var formatters = {
  none: none,
  highlight: highlight
}

var consoleProxy = function consoleProxy(commandInstance) {
  return {
    log: function log() {
      commandInstance.log.apply(commandInstance, arguments)
    }
  }
}

var formatter = function formatter(name) {
  if (typeof name === 'function') return name
  var formatter = formatters[name]
  return formatter ? formatter : formatters.highlight
}

var getContext = function getContext(commandInstance, context) {
  return Object.assign(context, { console: consoleProxy(commandInstance) })
}

var run = function run(js, context, compiler, timeout) {
  return new Promise$1(function(resolve, reject) {
    try {
      var transformed = typeof compiler === 'function' ? compiler(js) : js
      var script = vm.createScript(transformed, {
        filename: 'vantage-repl',
        displayErrors: true
      })

      var result = script.runInContext(context, {
        displayErrors: true,
        timeout: timeout
      })

      resolve(result)
    } catch (err) {
      reject(err)
    }
  })
}

var index = function(vantage) {
  var options =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}

  var mode = options.mode || 'repl'
  var description = options.description || 'Enters REPL mode.'
  var banner = options.banner || "Entering REPL Mode. To exit, type 'exit'"
  var delimiter = options.delimiter || 'repl:'
  var timeout = options.timeout || 15000
  var compiler = options.compiler === undefined ? babel : options.compiler
  var baseContext = { _: _, Promise: Promise$1 }
  var extContext = options.context || {}
  var sandbox = Object.assign({}, baseContext, extContext)
  var context = vm.createContext(sandbox)
  var format = formatter(options.formatter || 'highlight')

  vantage
    .mode(mode, description)
    .delimiter(delimiter)
    .init(function(args, cb) {
      this.log(banner)
      cb()
    })
    .action(function(command) {
      var _this = this

      var tmpContext = getContext(this, context)
      return run(command, tmpContext, compiler, timeout)
        .timeout(timeout)
        .tap(function(output) {
          return _this.log(format(output))
        })
    })
}

module.exports = index
