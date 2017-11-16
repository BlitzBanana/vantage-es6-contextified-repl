import vm from 'vm'
import Promise from 'bluebird'
import _ from 'lodash'
import babel from './compilers/babel'
import format from './format'

const consoleProxy = vantage => ({
  log() {
    vantage.log(...arguments)
  }
})

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
  const baseContext = { _, Promise, console: consoleProxy(vantage) }
  const extContext = options.context || {}
  const sandbox = Object.assign({}, baseContext, extContext)
  const context = vm.createContext(sandbox)

  vantage
    .mode(mode, description)
    .delimiter(delimiter)
    .init(function(args, cb) {
      this.log(banner)
      cb()
    })
    .action(function(command) {
      return run(command, context, compiler, timeout)
        .timeout(timeout)
        .tap(output => this.log(format(output)))
    })
}
