const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const program = require('commander')

const types = [
  {
    name: 'Backoffice',
    type: 'BO',
    tplPath: 'https://codeload.github.com/joyerz/soda-ts-bo/zip/master'
  },
  {
    name: 'wap/miniapp (Based on the Taro)',
    type: 'TARO',
    tplPath: 'https://codeload.github.com/joyerz/soda-taro-base/zip/master'
  },
  {
    name: 'MPA (Based on the webpack)',
    type: 'MPA',
    tplPath: 'https://codeload.github.com/joyerz/soda-webpage-base/zip/master'
  },
]

const log = console.log

let projectName = ''


// 问题列表
const asks = [
  {
    name: 'projectType',
    type: 'list',
    message: 'Select Project type?',
    choices: types.map(item => item.name),
  }
]

async function Test(args) {
  console.log(args)
  let answers = await inquirer.prompt(asks)
  log(answers)
}
program
  .command('init')
  .description('Generate a project by type (taro 、backoffice...)')
  .action(Test)

program.parse(process.argv)
