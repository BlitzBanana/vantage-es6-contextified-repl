import test from 'ava'
import Vantage from 'vantage'
import stripAnsi from 'strip-ansi'
import repl from '../src'

test('vantage undefined', async t => {
  const vantage = new Vantage().use(repl, { context: { awesome: undefined } })

  const result = await vantage.exec('repl').then(() => {
    return vantage.exec('awesome')
  })

  t.is(stripAnsi(result), undefined)
})

test('vantage not defined', async t => {
  const vantage = new Vantage().use(repl)

  const error = await t.throws(
    vantage.exec('repl').then(() => {
      return vantage.exec('foobar')
    })
  )

  t.is(error.constructor.name, ReferenceError.name)
  t.is(error.message, 'foobar is not defined')
})

test('vantage another mode', async t => {
  const vantage = new Vantage().use(repl, {
    mode: 'awesome-repl',
    context: { awesome: '9000' }
  })

  const result = await vantage.exec('awesome-repl').then(() => {
    return vantage.exec('Promise.resolve(awesome)')
  })

  t.is(stripAnsi(result), '9000')
})

test('vantage without context', async t => {
  const vantage = new Vantage().use(repl)

  const result = await vantage.exec('repl').then(() => {
    return vantage.exec('_.random(54, 54, false)')
  })

  t.is(stripAnsi(result), 54)
})

test('vantage string', async t => {
  const vantage = new Vantage().use(repl, { context: { awesome: '9000' } })

  const result = await vantage.exec('repl').then(() => {
    return vantage.exec('Promise.resolve(awesome)')
  })

  t.is(stripAnsi(result), '9000')
})

test('vantage number', async t => {
  const vantage = new Vantage().use(repl, { context: { awesome: 9000 } })

  const result = await vantage.exec('repl').then(() => {
    return vantage.exec('Promise.resolve(awesome)')
  })

  t.is(stripAnsi(result), 9000)
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

test('define variable', async t => {
  const vantage = new Vantage().use(repl)

  const result = await vantage
    .exec('repl')
    .then(() => {
      return vantage.exec('let a = 100')
    })
    .then(() => {
      return vantage.exec('a')
    })

  t.is(stripAnsi(result), 100)
})

test('console.log', async t => {
  const vantage = new Vantage().use(repl)

  const result = await vantage.exec('repl').then(() => {
    return vantage.exec("console.log('test', 100)")
  })

  t.is(result, undefined)
})
