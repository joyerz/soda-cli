#!/usr/bin/env node

const clone = require('git-clone')
const program = require('commander')
const shell = require('shelljs')
const colors = require('colors')
const request = require('request')
const fs = require('fs')
const compressing = require('compressing')
const path = require('path')
const TaroPageMaker = require('../tpl/taro')

function download(uri, filename, callback) {
  const stream = fs.createWriteStream(filename)
  request(uri).pipe(stream).on('close', callback)
}

program
  .version('0.0.19', '-v, --vers', 'output the current version')
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
      if (verbose === 'verbose' || verbose === 'v') {
        shell.exec('yarn install --verbose')
      }
      else {
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
      if (verbose === 'verbose' || verbose === 'v') {
        shell.exec('yarn install --verbose')
      }
      else {
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
    }
    else {
      console.log('请输入正确的page, 如 soda-bo-cli page PAGENAME'.white)
    }
  })

// 新建ts项目
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
//   .command('tsinit <verbose>')
//   .description('初始化ts项目')
//   .action(function(verbose) {
//     console.log('初始化ts项目...'.green)
//     let pwd = shell.pwd()
//     clone(`https://github.com/joyerz/soda-ts-bo.git`, pwd + '/tmp', null, function() {
//       console.log(('当前安装目录: ' + pwd + '/').yellow)
//       shell.rm('-rf', pwd + `/tmp/.git`)
//       shell.mv(pwd + '/tmp/.*', pwd + '/')
//       shell.mv(pwd + '/tmp/*', pwd + '/')
//       shell.rm('-rf', pwd + `/tmp/`)
//
//       console.log('正在安装项目...'.green)
//       if (verbose === 'verbose' || verbose === 'v') {
//         shell.exec('yarn install --verbose')
//       }
//       else {
//         shell.exec('yarn install')
//       }
//       console.log('项目初始化完成'.green)
//     })
//   })
program
  .command('tsinit')
  .description('初始化ts项目')
  .action(function(verbose) {
    console.log('初始化ts项目...'.green)
    let pwd = shell.pwd()

    const path = pwd + '/tmp'
    const file = path + '/tmp.zip'
    shell.mkdir('-p', path)
    download('https://codeload.github.com/joyerz/soda-ts-bo/zip/master', file, function() {
      compressing
        .zip
        .uncompress(file, path)
        .then(() => {
          console.log(('当前安装目录: ' + pwd + '/').yellow)
          shell.mv(path + '/soda-ts-bo-master/.*', pwd + '/')
          shell.mv(path + '/soda-ts-bo-master/*', pwd + '/')
          shell.rm('-rf', pwd + '/src/pages/tpl') // 删除样板目录
          shell.rm('-rf', path)

          console.log('正在安装项目...'.green)
          if (verbose === 'verbose' || verbose === 'v') {
            shell.exec('yarn install --verbose')
          }
          else {
            shell.exec('yarn install')
          }
          console.log('项目初始化完成'.green)
        })
        .catch(() => {
          console.log('项目初始化失败!'.red)
        })
    })

    // clone(`https://github.com/joyerz/soda-ts-bo.git`, pwd + '/tmp', null, function() {
    //   console.log(('当前安装目录: ' + pwd + '/').yellow)
    //   shell.rm('-rf', pwd + `/tmp/.git`)
    //   shell.mv(pwd + '/tmp/.*', pwd + '/')
    //   shell.mv(pwd + '/tmp/*', pwd + '/')
    //   shell.rm('-rf', pwd + `/tmp/`)
    //
    //   console.log('正在安装项目...'.green)
    //   if (verbose === 'verbose' || verbose === 'v') {
    //     shell.exec('yarn install --verbose')
    //   }
    //   else {
    //     shell.exec('yarn install')
    //   }
    //   console.log('项目初始化完成'.green)
    // })
  })

// 新建ts模块
program
  .command('tspage <page>')
  .description('添加模块')
  .action(function(page) {
    console.log('新增页面...'.green)
    const pwd = shell.pwd()
    const path = pwd + '/tmp'
    const file = path + '/tmp.zip'

    if (page !== '') {
      if (page.substring(page.length - 1) === '/') {
        page = page.substring(0, page.length - 1)
      }

      shell.mkdir('-p', path)
      download('https://codeload.github.com/joyerz/soda-ts-bo/zip/master', file, function() {
        compressing
          .zip
          .uncompress(file, path)
          .then(() => {
            const pagePath = `${pwd}/src/pages/${page}/`
            shell.mkdir('-p', pagePath)
            shell.mv(path + '/soda-ts-bo-master/src/pages/tpl/*', pagePath)
            shell.rm('-rf', path)

            console.log('新增页面完成'.green)
          })
          .catch(() => {
            console.log('新增页面失败!'.red)
          })
      })

      // clone(`https://github.com/joyerz/soda-ts-bo.git`, pwd + '/tmp', null, function() {
      //   shell.rm('-rf', pwd + `/tmp/.git`)
      //   shell.mkdir('-p', `${pwd}/src/pages/${page}/`)
      //   shell.mv(`${pwd}/tmp/pages/home/*`, `${pwd}/src/pages/${page}/`)
      //   shell.rm('-rf', pwd + `/tmp/`)
      //   console.log('新增页面完成'.green)
      // })
    }
    else {
      console.log('请输入正确的page, 如 soda-bo-cli page PAGENAME'.white)
    }
  })


program.parse(process.argv)
