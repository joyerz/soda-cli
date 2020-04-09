const chalk = require('chalk')
const inquirer = require('inquirer')
const shells = require('../libs/shell')
const { copyDir, mkdirSync } = require('../../utils')
const fs = require('fs')
const { projectTypes } = require('../../config')
const config = require('dotenv').config()
const types = projectTypes.map(item => item.type)
const TaroPageMaker = require('../../template/taro')
const CopyTpl = require('../../template/copy')

module.exports = async function (args) {
  const hasEnv = fs.existsSync('./.env')
  if (!hasEnv) return console.log(chalk.red('config file .env not exists.'))

  const targetExists = fs.existsSync(args)
  if (targetExists) {
    let res = await inquirer.prompt({
      name: 'replace',
      type: 'list',
      message: `${args} existing. Do you want to replace it?`,
      choices: ['Yes', 'No'],
    })
    if (res === 'No') return
  }
  if (!types.includes(config.parsed.TYPE)) {
    return console.log(chalk.red(`.env TYPE is error. (${types.join(',')})`))
  }
  switch (config.parsed.TYPE) {
    case 'TARO': TaroPageMaker(args); break
    case 'BO': CopyTpl(args); break
    case 'MPA':
      if (args.search('/') > -1) {
        return console.log(chalk.red(`args only one level dir.`))
      }
      CopyTpl(args, './mpatpl')
      break
    default:
  }
}