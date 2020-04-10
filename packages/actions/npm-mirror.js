const path = require('path')
const fs = require('fs')
const inquirer = require('inquirer')
// var program = require('commander')
const npm = require('npm')
const ini = require('ini')
// var echo = require('node-echo')
const extend = require('extend')
const chalk = require('chalk')
// var open = require('open')
// var async = require('async')
// var request = require('request')
// var only = require('only')

const registries = require('./registries.json')
const YRMRC = path.join(process.env.HOME, '.yrmrc')
const YARNRC = path.join(process.env.HOME, '.yarnrc')


module.exports = async args => {
  if (args === 'ls') {
    onList()
  } else if (args === 'use') {
    let keys = Object.keys(getAllRegistry())
    let answers = await inquirer.prompt([
      {
        name: 'name',
        type: 'list',
        message: 'Select Project type?',
        choices: keys,
      }
    ])
    onUse(answers.name)
  } else {
    console.log(chalk.red('commond invalid [ls / use]'))
  }
}

// 查看源列表
function onList() {
  getCurrentRegistry(function (cur) {
    var info = ['']
    var allRegistries = getAllRegistry()

    Object.keys(allRegistries).forEach(function (key) {
      var item = allRegistries[key]
      var prefix = item.registry === cur ? '* ' : '  '
      info.push(prefix + key + line(key, 8) + item.registry)
    })

    info.push('')
    printMsg(info)
  })
}

// 使用源
function onUse(name) {
  var allRegistries = getAllRegistry()
  if (allRegistries.hasOwnProperty(name)) {
    var registry = allRegistries[name]

    fs.writeFile(YARNRC, 'registry "' + registry.registry + '"', function (err) {
      if (err) throw err
      // console.log('It\'s saved!')

      printMsg([
        '', '   YARN Registry has been set to: ' + registry.registry, ''
      ])
    })

    // 同时更改npm的源
    npm.load(function (err) {
      if (err) return exit(err)

      npm.commands.config(['set', 'registry', registry.registry], function (err, data) {
        if (err) return exit(err)
        console.log('                        ')
        var newR = npm.config.get('registry')
        printMsg([
          '', '   NPM Registry has been set to: ' + newR, ''
        ])
      })
    })
  } else {
    printMsg([
      '', '   Not find registry: ' + name, ''
    ])
  }
}

function getCurrentRegistry(cbk) {
  npm.load(function (err, conf) {
    if (err) return exit(err)
    cbk(npm.config.get('registry'))
  })
}

function getAllRegistry() {
  return extend({}, registries, getCustomRegistry())
}

function getCustomRegistry() {
  return fs.existsSync(YRMRC) ? ini.parse(fs.readFileSync(YRMRC, 'utf-8')) : {}
}

function printMsg(infos) {
  infos.forEach(function (info) {
    console.log(info)
  })
}

function line(str, len) {
  var line = new Array(Math.max(1, len - str.length)).join('-')
  return ' ' + line + ' '
}