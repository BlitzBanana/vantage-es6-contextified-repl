import test from 'ava'
import Vantage from 'vantage'
import stripAnsi from 'strip-ansi'
import repl from '../src'

// TODO: find a way to test formatter output from vantage instance

// TODO: find a ES+ that is not supported in Nodejs to test that
test('Using a custom compiler', async t => {
  const vantage = new Vantage().use(repl, { compiler: code => code })

  const result = await vantage.exec('repl').then(() => {
    return vantage.exec('1+1')
  })

  t.is(stripAnsi(result), 2)
})

test('Using no compiler', async t => {
  const vantage = new Vantage().use(repl, { compiler: null })

  const result = await vantage.exec('repl').then(() => {
    return vantage.exec('1+1')
  })

  t.is(stripAnsi(result), 2)
})

test('Using a custom output formatter', async t => {
  const vantage = new Vantage().use(repl, { formatter: val => val + 'test' })

  const result = await vantage.exec('repl').then(() => {
    return vantage.exec('10')
  })

  t.is(stripAnsi(result), 10)
})

test('Using a predefined ouput formatter', async t => {
  const vantage = new Vantage().use(repl, { formatter: 'highlight' })

  const result = await vantage.exec('repl').then(() => {
    return vantage.exec('10')
  })

  t.is(stripAnsi(result), 10)
})

test('Using an unkown predefined output fomatter', async t => {
  const vantage = new Vantage().use(repl, { formatter: 'invalid formatter' })

  const result = await vantage.exec('repl').then(() => {
    return vantage.exec('10')
  })

  t.is(stripAnsi(result), 10)
})

test('Call a variable set to undefined', async t => {
  const vantage = new Vantage().use(repl, { context: { awesome: undefined } })

  const result = await vantage.exec('repl').then(() => {
    return vantage.exec('awesome')
  })

  t.is(stripAnsi(result), undefined)
})

test('Call an undefined variable', async t => {
  const vantage = new Vantage().use(repl)

  const error = await t.throws(
    vantage.exec('repl').then(() => {
      return vantage.exec('foobar')
    })
  )

  t.is(error.constructor.name, ReferenceError.name)
  t.is(error.message, 'foobar is not defined')
})

test('Using another command name', async t => {
  const vantage = new Vantage().use(repl, {
    mode: 'awesome-repl',
    context: { awesome: '9000' }
  })

  const result = await vantage.exec('awesome-repl').then(() => {
    return vantage.exec('Promise.resolve(awesome)')
  })

  t.is(stripAnsi(result), '9000')
})

test('Using no defined context', async t => {
  const vantage = new Vantage().use(repl)

  const result = await vantage.exec('repl').then(() => {
    return vantage.exec('_.random(54, 54, false)')
  })

  t.is(stripAnsi(result), 54)
})

test('Get a string from context', async t => {
  const vantage = new Vantage().use(repl, { context: { awesome: '9000' } })

  const result = await vantage.exec('repl').then(() => {
    return vantage.exec('Promise.resolve(awesome)')
  })

  t.is(stripAnsi(result), '9000')
})

test('Get a number from context', async t => {
  const vantage = new Vantage().use(repl, { context: { awesome: 9000 } })

  const result = await vantage.exec('repl').then(() => {
    return vantage.exec('Promise.resolve(awesome)')
  })

  t.is(stripAnsi(result), 9000)
})

test('Get an array from context', async t => {
  const vantage = new Vantage().use(repl, {
    context: { awesome: [{ a: 9000 }] }
  })

  const result = await vantage.exec('repl').then(() => {
    return vantage.exec('Promise.resolve(awesome)')
  })

  t.is(typeof result, 'object')
  t.true(Array.isArray(result))
  t.is(result[0].a, 9000)
})

test('Get an object from context', async t => {
  const vantage = new Vantage().use(repl, { context: { awesome: { a: 9000 } } })

  const result = await vantage.exec('repl').then(() => {
    return vantage.exec('Promise.resolve(awesome)')
  })

  t.is(typeof result, 'object')
  t.is(result.a, 9000)
})

test('Get a function from context', async t => {
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

  t.is(typeof result, 'function')
  t.is(result(2, 3), 6)
})

test('Using a function from context', async t => {
  const vantage = new Vantage().use(repl, {
    context: {
      awesome(a, b) {
        return a * b
      }
    }
  })

  const result = await vantage.exec('repl').then(() => {
    return vantage.exec('Promise.resolve(awesome(2, 3))')
  })

  t.is(result, 6)
})

test('Define a variable using let', async t => {
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

test('Define a variable using const', async t => {
  const vantage = new Vantage().use(repl)

  const result = await vantage
    .exec('repl')
    .then(() => {
      return vantage.exec('const a = 100')
    })
    .then(() => {
      return vantage.exec('a')
    })

  t.is(stripAnsi(result), 100)
})

test('Define a variable using var', async t => {
  const vantage = new Vantage().use(repl)

  const result = await vantage
    .exec('repl')
    .then(() => {
      return vantage.exec('var a = 100')
    })
    .then(() => {
      return vantage.exec('a')
    })

  t.is(stripAnsi(result), 100)
})

test('Define a variable using object destructuring', async t => {
  const vantage = new Vantage().use(repl)

  const result = await vantage
    .exec('repl')
    .then(() => {
      return vantage.exec('const {a, ...data} = {a:1, b:2, c:3}')
    })
    .then(() => {
      return vantage.exec('a')
    })

  t.is(stripAnsi(result), 1)
})

test('Use console.log', async t => {
  const vantage = new Vantage().use(repl)

  const result = await vantage.exec('repl').then(() => {
    return vantage.exec("console.log('test', 100)")
  })

  t.is(result, undefined)
})

test('Using lodash', async t => {
  const vantage = new Vantage().use(repl)

  const result = await vantage.exec('repl').then(() => {
    return vantage.exec('_.random(1, 100)')
  })

  t.true(result > 0)
})

test('Using Promise', async t => {
  const vantage = new Vantage().use(repl)

  const result = await vantage.exec('repl').then(() => {
    return vantage.exec(
      'Promise.all([Promise.resolve(1), Promise.resolve(2).delay(1000)])'
    )
  })

  t.is(typeof result, 'object')
  t.true(Array.isArray(result))
  t.is(result[0], 1)
  t.is(result[1], 2)
})
