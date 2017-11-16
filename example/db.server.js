const Vantage = require('vantage')
const figlet = require('figlet')
const chalk = require('chalk')
const repl = require('../dist').default

const infos = {
  name: 'db-server',
  version: '1.6.0'
}

const add = (a, b) => a + b

new Vantage()
  .use(repl, { delimiter: chalk.red('repl:'), context: { infos, add } })
  .banner(figlet.textSync('DATABASE SERVER'))
  .delimiter(chalk.green('db-server~$'))
  .listen(8081)
