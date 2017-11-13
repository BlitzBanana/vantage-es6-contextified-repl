import Promise from 'bluebird'
import { VM } from 'vm2'
import { transform } from 'babel-core'
import isPromise from 'is-promise'
import chalk from 'chalk'
import jsome from 'jsome'
import { highlight } from 'cardinal'
import { js_beautify } from 'js-beautify'
import _ from 'lodash'

const wrapCode = code => `;(() => {return ${code}})()`

export const compiler = content =>
  transform(wrapCode(content), {
    babelrc: false,
    presets: ['env']
  }).code

const beautifyJs = input => js_beautify(input, { indent_size: 2 })
const formatString = input => chalk.white(input)
const formatObject = input => jsome(input)
const formatArray = input => formatObject(input)
const formatFunction = input => highlight(beautifyJs(input.toString()))

export const formatResult = result => {
  if (_.isString(result)) {
    return formatString(result)
  } else if (_.isFunction(result)) {
    return formatFunction(result)
  } else if (_.isArray(result)) {
    return formatArray(result)
  } else if (_.isObject(result)) {
    return formatObject(result)
  }
  return formatString(result.toString())
}

export const run = (vm, command) =>
  new Promise((resolve, reject) => {
    try {
      const result = vm.run(command)
      if (isPromise(result)) {
        result.then(resolve).catch(reject)
      } else {
        resolve(result)
      }
    } catch (err) {
      reject(err)
    }
  })

export default function(vantage, options = {}) {
  const mode = options.mode || 'repl'
  const delimiter = options.mode || 'repl:'
  const sandbox = Object.assign({}, { _, Promise }, options.context)
  const vm = new VM({ sandbox, compiler })

  vantage
    .mode(mode, 'Enters REPL mode.')
    .delimiter(delimiter)
    .init(function(args, cb) {
      this.log("Entering REPL Mode. To exit, type 'exit'")
      cb(undefined, "Entering REPL Mode. To exit, type 'exit'.")
    })
    .action(command =>
      run(vm, command).then(result => Promise.resolve(formatResult(result)))
    )
}
