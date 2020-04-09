
const inquirer = require('inquirer')
const chalk = require('chalk')

const shells = require('../libs/shell')
const { getPkg } = require('../../utils/index')

module.exports = async function () {
  let keys = Object.keys(getPkg(process.cwd()).scripts || {})
  if (!keys.length) return console.log(chalk.red('没有可执行的命令'))
  const answers = await inquirer.prompt([
    {
      name: 'name',
      type: 'list',
      message: 'Select a task to run: (Use arrow keys)',
      choices: keys,
    }
  ])
  shells([`npm run ${answers.name}`])
}