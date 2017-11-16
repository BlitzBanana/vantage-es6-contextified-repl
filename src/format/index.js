import chalk from 'chalk'

export default input =>
  input && input.toString ? chalk.white(input.toString()) : input
