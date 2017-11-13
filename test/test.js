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

test('vantage', async t => {
  const vantage = new Vantage()
  vantage.use(repl, { context: { awesome: 9000 } }).listen(8888)

  const result = await vantage.exec('repl').then(() => {
    return vantage.exec('Promise.resolve(awesome)')
  })

  t.is(result, chalk.white('9000'))
})
