import test from 'ava'
import Vantage from 'vantage'
import chalk from 'chalk'
import repl, { run } from '../src'
import { beforeEach } from './helpers'

test.beforeEach(beforeEach)

test('Sync code', async t => {
  const result = await run(t.context.vm, 'true')
  t.true(result)
})

test('Async code', async t => {
  const result = await run(t.context.vm, 'Promise.resolve(42)')
  t.is(result, 42)
})

test('Invalid code', async t => {
  await t.throws(run(t.context.vm, 'yolo$$$$+=-'))
})

test('vantage without context', async t => {
  const vantage = new Vantage().use(repl)

  const result = await vantage.exec('repl').then(() => {
    return vantage.exec('_.random(54, 54, false)')
  })

  t.is(result, chalk.white('54'))
})

test('vantage string', async t => {
  const vantage = new Vantage().use(repl, { context: { awesome: '9000' } })

  const result = await vantage.exec('repl').then(() => {
    return vantage.exec('Promise.resolve(awesome)')
  })

  t.is(result, chalk.white('9000'))
})

test('vantage undefined', async t => {
  const vantage = new Vantage().use(repl, { context: { awesome: undefined } })

  const result = await vantage.exec('repl').then(() => {
    return vantage.exec('Promise.resolve(awesome)')
  })

  t.is(result, chalk.white('undefined'))
})

test('vantage another mode', async t => {
  const vantage = new Vantage().use(repl, {
    mode: 'awesome-repl',
    context: { awesome: '9000' }
  })

  const result = await vantage.exec('awesome-repl').then(() => {
    return vantage.exec('Promise.resolve(awesome)')
  })

  t.is(result, chalk.white('9000'))
})

test('vantage number', async t => {
  const vantage = new Vantage().use(repl, { context: { awesome: 9000 } })

  const result = await vantage.exec('repl').then(() => {
    return vantage.exec('Promise.resolve(awesome)')
  })

  t.is(result, chalk.white('9000'))
})

test('vantage array', async t => {
  const vantage = new Vantage().use(repl, {
    context: { awesome: [{ a: 9000 }] }
  })

  const result = await vantage.exec('repl').then(() => {
    return vantage.exec('Promise.resolve(awesome)')
  })

  t.truthy(result)
})

test('vantage object', async t => {
  const vantage = new Vantage().use(repl, { context: { awesome: { a: 9000 } } })

  const result = await vantage.exec('repl').then(() => {
    return vantage.exec('Promise.resolve(awesome)')
  })

  t.truthy(result)
})

test('vantage function', async t => {
  const vantage = new Vantage().use(repl, {
    context: {
      awesome(a, b) {
        return a * b
      }
    }
  })

  const result = await vantage.exec('repl').then(() => {
    return vantage.exec('Promise.resolve(awesome)')
  })

  t.truthy(result)
})

// test('define variable', async t => {
//   const vantage = new Vantage().use(repl)

//   const result = await vantage
//     .exec('repl')
//     .then(() => {
//       return vantage.exec('a = 100')
//     })
//     .then(() => {
//       return vantage.exec('a')
//     })

//   t.is(result, chalk.white('100'))
// })
