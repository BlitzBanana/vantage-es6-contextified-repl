const Promise = require('bluebird')
const Vantage = require('vantage')
const figlet = require('figlet')
const chalk = require('chalk')
const _ = require('lodash')
const repl = require('../dist')

const users = {
  1: {
    id: 1,
    account_id: 4,
    shortid: 'B1-JRnYyM',
    first_name: 'John',
    last_name: 'Doe',
    created_at: '2017-11-15T13:15:05.035Z',
    updated_at: '2017-11-15T13:15:05.035Z'
  },
  2: {
    id: 2,
    account_id: 5,
    shortid: 'A39cZzsDd',
    first_name: 'Jane',
    last_name: 'Doe',
    created_at: '2017-12-15T13:15:05.035Z',
    updated_at: '2017-11-17T09:12:28.230Z'
  }
}

const infos = {
  name: 'main-server',
  version: '1.0.1'
}

let prevCount = 50

const app = {
  requests: {
    count() {
      prevCount = _.random(prevCount + 1, prevCount + _.random(10, 100))
      return prevCount
    }
  }
}

const db = {
  users() {
    return Promise.resolve(Object.values(users)).delay(1000)
  },
  user(id) {
    if (users[id]) {
      return Promise.resolve(users[id]).delay(1000)
    }
    return Promise.reject(new Error(`User ${id} not found.`)).delay(500)
  }
}

new Vantage()
  .use(repl, {
    delimiter: chalk.red('repl:'),
    description: 'Server REPL with access to app and db objects !',
    banner: 'Have fun !',
    context: { infos, app, db },
    formatter: 'highlight'
  })
  .banner(figlet.textSync('MAIN SERVER'))
  .delimiter(chalk.green('main-server~$'))
  .listen(8080)
  .show()
