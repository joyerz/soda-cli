#!/usr/bin/env node

const clone = require('git-clone')
const program = require('commander')
const shell = require('shelljs')
const colors = require('colors')
const fs = require('fs')
const path = require('path')
const TaroPageMaker = require('../tpl/taro')

program
  .version('0.0.18', '-v, --vers', 'output the current version')
  .description('soda-cli命令行工具')

program
  .command('init <verbose>')
  .description('初始化项目')
  .action(function (verbose) {
    console.log('初始化项目...'.green)
    let pwd = shell.pwd()
    clone(`https://github.com/joyerz/soda-bo-tpl.git`, pwd + '/tmp', null, function () {
      shell.rm('-rf', pwd + `/tmp/.git`)
      console.log((pwd + '/').yellow)
      shell.mv(pwd + '/tmp/.*', pwd + '/')
      shell.mv(pwd + '/tmp/*', pwd + '/')
      shell.rm('-rf', pwd + `/tmp/`)

      console.log('正在安装项目...'.green)
      if (verbose === 'verbose') {
        shell.exec('yarn install --verbose')
      } else {
        shell.exec('yarn install')
      }
      console.log('项目初始化完成'.green)
    })
  })

program
  .command('init-yarn <verbose>')
  .description('初始化项目')
  .action(function (verbose) {
    console.log('初始化项目...'.green)
    let pwd = shell.pwd()
    clone(`https://github.com/joyerz/soda-bo-tpl.git`, pwd + '/tmp', null, function () {
      shell.rm('-rf', pwd + `/tmp/.git`)
      shell.mv(pwd + '/tmp/.*', pwd + '/')
      shell.mv(pwd + '/tmp/*', pwd + '/')
      shell.rm('-rf', pwd + `/tmp/`)

      console.log('正在安装项目...'.green)
      if (verbose === 'verbose') {
        shell.exec('yarn install --verbose')
      } else {
        shell.exec('yarn install')
      }
      console.log('项目初始化完成'.green)
    })
  })

program
  .command('page <page>')
  .description('添加模块')
  .action(function (page) {
    console.log('新增页面...'.green)
    const pwd = shell.pwd()
    if (page !== '') {
      if (page.substring(page.length - 1) === '/') {
        page = page.substring(0, page.length - 1)
      }

      clone(`https://github.com/joyerz/soda-bo-tpl-page.git`, pwd + '/tmp', null, function () {
        shell.rm('-rf', pwd + `/tmp/.git`)
        shell.mkdir('-p', `${pwd}/src/pages/${page}/`)
        shell.mv(`${pwd}/tmp/*`, `${pwd}/src/pages/${page}/`)
        shell.rm('-rf', pwd + `/tmp/`)
        console.log('新增页面完成'.green)
      })
    } else {
      console.log('请输入正确的page, 如 soda-bo-cli page PAGENAME'.white)
    }
  })

program
  .command('taroinit <verbose>')
  .description('初始化项目(Taro)')
  .action(function (verbose) {
    let proPath = path.resolve(shell.pwd().toString(), `./${verbose}`)
    if (fs.existsSync(proPath)) {
      return console.log(`'${proPath}' 已存在.`.red)
    }
    fs.mkdirSync(proPath)
    shell.cd(proPath)
    console.log('初始化项目...'.green)
    let pwd = shell.pwd()
    clone(`https://github.com/joyerz/soda-taro-base`, pwd + '/tmp', null, function () {
      shell.rm('-rf', pwd + `/tmp/.git`)
      console.log((pwd + '/').yellow)
      shell.mv(pwd + '/tmp/.*', pwd + '/')
      shell.mv(pwd + '/tmp/*', pwd + '/')
      shell.rm('-rf', pwd + `/tmp/`)

      console.log('正在安装项目...'.green)
      if (verbose === 'verbose') {
        shell.exec('yarn install --verbose')
      } else {
        shell.exec('yarn install')
      }
      console.log('项目初始化完成'.green)
      console.log(`\n\n执行命令查看可执行脚本:\n\n$ cd ${verbose} && npm run\n\n`.green)
    })
  })

program
  .command('taropage <page>')
  .description('添加模块')
  .action(TaroPageMaker)


// program
//   .command('com <component>')
//   .description('添加模块')
//   .action(function(component) {
//     console.log('新增组件...'.green)
//     const pwd = shell.pwd()
//     if (component !== '') {
//       if (component.substring(component.length -1) === '/') {
//         component = component.substring(0, component.length -1)
//       }
//
//       clone(`https://github.com/joyerz/soda-bo-tpl-page.git`, pwd + '/tmp', null, function() {
//         shell.rm('-rf', pwd + `/tmp/.git`)
//         shell.mv(`${pwd}/tmp/.*`,  `${pwd}/components/${component}/`)
//         shell.mv(`${pwd}/tmp/*`,  `${pwd}/components/${component}/`)
//         shell.rm('-rf', pwd + `/tmp/`)
//         console.log('新增页面模块完成...'.green)
//       })
//     } else {
//       console.log('请输入正确的组件名字, 如 soda-bo-cli com COMPONENT'.white)
//     }
//   })

program.parse(process.argv)
