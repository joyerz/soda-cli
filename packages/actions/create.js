const figlet = require('figlet')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const ora = require('ora')
const download = require('download')
const compressing = require('compressing')
const shell = require('shelljs')

const { copyDir, mkdirSync, } = require('../../utils/index')
const types = require('../../config').projectTypes

const log = console.log
const spinner = ora('generateing...\n')

let projectName = ''


// 问题列表
const asks = [
  {
    name: 'projectName',
    type: 'input',
    message: 'Project name:',
    validate: function (input) {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
      else return 'Project names can only contain letters, Numbers, and underscores';
    }
  },
  {
    name: 'projectType',
    type: 'list',
    message: 'Select Project type?',
    choices: types.map(item => item.name),
  }
]

/**
 * 创建完成
 */
function complete() {
  spinner.stop()

  log(`
${chalk.green(`[Success] Project ${projectName} init finished, be pleasure to use ! `)}

Install dependencies:
  ${chalk.magenta('cd ' + projectName + ' && npm install / yarn install')}

Check Script Run/Build the app:
  ${chalk.magenta('npm run start or sodacli run')}

${chalk.green('Happy coding 😆 . \n')}
    `)

}

module.exports = async function (args) {
  let answers = await inquirer.prompt(asks)
  let type = answers.projectType
  let { tplPath } = types.filter(item => item.name === type)[0]
  let targetPwd = path.resolve(process.cwd(), answers.projectName)
  if (fs.existsSync(targetPwd)) {
    return log(chalk.red('Directory exists'))
  }
  projectName = answers.projectName
  spinner.start()
  const zipname = `_${+new Date()}h`
  await download(tplPath, projectName)
  let zippath = `${projectName}/${shell.ls(projectName)[0]}`
  await compressing.zip.uncompress(zippath, './' + projectName)
  shell.rm('-f', zippath)
  zippath = shell.ls(projectName)[0]
  shell.cd(projectName + '/')
  shell.mv(zippath + '/.*', './')
  shell.mv(zippath + '/*', './')
  shell.rm('-rf', zippath + '/')
  complete()

  // mkdirSync(targetPwd)
  // clone(tplPath, targetPwd + '/tmp', null, function () {
  //   shell.rm('-rf', targetPwd + `/tmp/.git`)
  //   shell.mv(targetPwd + '/tmp/.*', targetPwd + '/')
  //   shell.mv(targetPwd + '/tmp/*', targetPwd + '/')
  //   shell.rm('-rf', targetPwd + `/tmp/`)
  //   complete()
  // })
}