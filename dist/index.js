'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})

exports.default = function(vantage) {
  var options =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}

  var mode = options.mode || 'repl'
  var description = options.description || 'Enters REPL mode.'
  var banner = options.banner || "Entering REPL Mode. To exit, type 'exit'"
  var delimiter = options.delimiter || 'repl:'
  var timeout = options.timeout || 15000
  var compiler = options.compiler || _babel2.default
  var baseContext = {
    _: _lodash2.default,
    Promise: _bluebird2.default,
    console: consoleProxy(vantage)
  }
  var extContext = options.context || {}
  var sandbox = Object.assign({}, baseContext, extContext)
  var context = _vm2.default.createContext(sandbox)

  vantage
    .mode(mode, description)
    .delimiter(delimiter)
    .init(function(args, cb) {
      this.log(banner)
      cb()
    })
    .action(function(command) {
      var _this = this

      return run(command, context, compiler, timeout)
        .timeout(timeout)
        .tap(function(output) {
          return _this.log((0, _format2.default)(output))
        })
    })
}

var _vm = require('vm')

var _vm2 = _interopRequireDefault(_vm)

var _bluebird = require('bluebird')

var _bluebird2 = _interopRequireDefault(_bluebird)

var _lodash = require('lodash')

var _lodash2 = _interopRequireDefault(_lodash)

var _babel = require('./compilers/babel')

var _babel2 = _interopRequireDefault(_babel)

var _format = require('./format')

var _format2 = _interopRequireDefault(_format)

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

var consoleProxy = function consoleProxy(vantage) {
  return {
    log: function log() {
      vantage.log.apply(vantage, arguments)
    }
  }
}

var run = function run(js, context, compiler, timeout) {
  return new _bluebird2.default(function(resolve, reject) {
    try {
      var transformed = compiler(js)
      var script = _vm2.default.createScript(transformed, {
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
//# sourceMappingURL=index.js.map
