const Vantage = require('vantage')
const figlet = require('figlet')
const chalk = require('chalk')
const repl = require('../dist')

const infos = {
  name: 'main-server',
  version: '1.0.1'
}

const foobar = input => JSON.stringify(input)

new Vantage()
  .use(repl, {
    delimiter: chalk.red('repl:'),
    description: 'Custom REPL mode !',
    context: { infos, foobar },
    formatter: 'highlight'
  })
  .banner(figlet.textSync('MAIN SERVER'))
  .delimiter(chalk.green('main-server~$'))
  .listen(8080)
  .show()
