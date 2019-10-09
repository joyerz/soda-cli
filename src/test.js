#!/usr/bin/env node

const program = require('commander')
const shell = require('shelljs')
const colors = require('colors')

program
  .command('install')
  .action(function(){
    console.log('初始化项目...'.green)
    shell.exec('npm install -verbose')
    console.log('项目安装完成'.green)
  })

program.parse(process.argv)
