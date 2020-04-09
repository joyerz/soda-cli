const clone = require('git-clone')
const shell = require('shelljs')
const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const chalk = require('chalk')
const config = require('dotenv').config()

const qa = $1 => ([
  {
    type: 'list',
    message: `检测到 [${$1}] 已存在, 是否替换？`,
    name: 'exisit',
    choices: ['no', 'yes'],
  }
])

module.exports = function (dirName, defaultTplPwd = './botpl') {
  if (!dirName) {
    console.log(chalk.red(` 请输入路由名称 \n eg: $ sbc new User`))
    process.exit(0)
  }
  const tplpath = config.parsed.TPL_PATH || ''
  const pwd = shell.pwd().toString()
  let constTplpath = path.join(pwd, tplpath)
  const targetPath = path.join(pwd, './src/pages/' + dirName)
  if (tplpath && fs.existsSync(constTplpath)  && shell.ls(constTplpath).length) {
    if (fs.existsSync(targetPath) && shell.ls(targetPath).length) {
      inquirer
        .prompt(qa(dirName))
        .then(({ exisit }) => {
          if (exisit === 'no') {
            return process.exit(0)
          }
          copy()
        })
    } else {
      copy()
    }
  } else {
    constTplpath = path.join(__dirname, defaultTplPwd)
    copy()
  }
  function copy() {
    console.log(chalk.magenta('creating...'))
    if (!fs.existsSync(targetPath)) {
      shell.mkdir('-p', targetPath)
    }
    shell.cp('-r', constTplpath + '/*', targetPath + '/')
    console.log(chalk.green('success!'))
    if (defaultTplPwd === './mpatpl') {
      console.log(chalk.green('server on http://localhost:xxxx/' + dirName + '.html'))
    }
  }
}

