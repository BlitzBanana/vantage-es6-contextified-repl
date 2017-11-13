'use strict'

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i]
      descriptor.enumerable = descriptor.enumerable || false
      descriptor.configurable = true
      if ('value' in descriptor) descriptor.writable = true
      Object.defineProperty(target, descriptor.key, descriptor)
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps)
    if (staticProps) defineProperties(Constructor, staticProps)
    return Constructor
  }
})()

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

var autoBind = require('auto-bind')

var Script = (function() {
  function Script(config) {
    _classCallCheck(this, Script)

    config = Object.assign({}, config)
    this._name = config.name || 'script'

    autoBind(this)
  }

  _createClass(Script, [
    {
      key: 'renderName',
      value: function renderName() {
        return this._name
      }
    }
  ])

  return Script
})()

module.exports = Script
