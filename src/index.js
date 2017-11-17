import vm from 'vm'
import Promise from 'bluebird'
import _ from 'lodash'
import babel from './compilers/babel'
import formatters from './formatters/index'

const consoleProxy = commandInstance => ({
  log() {
    commandInstance.log(...arguments)
  }
})

const formatter = name => {
  if (typeof name === 'function') return name
  const formatter = formatters[name]
  return formatter ? formatter : formatters.highlight
}

const getContext = (commandInstance, context) =>
  Object.assign(context, { console: consoleProxy(commandInstance) })

const run = (js, context, compiler, timeout) =>
  new Promise((resolve, reject) => {
    try {
      const transformed = typeof compiler === 'function' ? compiler(js) : js
      const script = vm.createScript(transformed, {
        filename: 'vantage-repl',
        displayErrors: true
      })

      const result = script.runInContext(context, {
        displayErrors: true,
        timeout
      })

      resolve(result)
    } catch (err) {
      reject(err)
    }
  })

export default function(vantage, options = {}) {
  const mode = options.mode || 'repl'
  const description = options.description || 'Enters REPL mode.'
  const banner = options.banner || "Entering REPL Mode. To exit, type 'exit'"
  const delimiter = options.delimiter || 'repl:'
  const timeout = options.timeout || 15000
  const compiler = options.compiler === undefined ? babel : options.compiler
  const baseContext = { _, Promise }
  const extContext = options.context || {}
  const sandbox = Object.assign({}, baseContext, extContext)
  const context = vm.createContext(sandbox)
  const format = formatter(options.formatter || 'highlight')

  vantage
    .mode(mode, description)
    .delimiter(delimiter)
    .init(function(args, cb) {
      this.log(banner)
      cb()
    })
    .action(function(command) {
      const tmpContext = getContext(this, context)
      return run(command, tmpContext, compiler, timeout)
        .timeout(timeout)
        .tap(output => this.log(format(output)))
    })
}
