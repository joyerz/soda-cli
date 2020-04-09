/**
 * 生成路由生成脚本，命令 npm run tpl 'routername'
 * 包括 page、redux、saga、Link
 */
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const inquirer = require('inquirer')
const shell = require('shelljs')
const config = require('dotenv').config()

module.exports = function (dirName) {
  // const dirName = process.argv[2]
  if (!dirName) {
    console.log(chalk.red(` 请输入路由名称 \n eg: $ sbc new User`))
    process.exit(0)
  }

  /**
   * 默认模板
   */
  const funName = toHump(dirName).replace(/\-/g, '_')
  let tsxTpl = `import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect, } from '@tarojs/redux'
import { Actions } from 'store/helper/actions'

import style from './index.module.scss'

interface Props {
  list: InitState<Entries>
}

interface State {
  state1: string
}

@connect((state: TState) => ({
  list: state.${funName}.list
}))
class ${funName} extends Component<Props, State> {

  config = {
    navigationBarTitleText: '${funName}'
  }

  componentDidMount() {
    Actions.${funName}.start()
  }

  render() {
    return (
      <View className={style.index}>
        ${dirName.toLocaleLowerCase()} created.
      </View>
    )
  }
}

export default ${funName}

`

  let scssTpl = `// @import '../../assets/style/index';

.index {
  color: black;
}`

  let reduxTpl = `import { buildRedux } from 'store/helper'
import { combineReducers } from 'redux'
import api from 'config/api'

export type DemoPayload = Payload<{
  id: number
  page: number
}>

export const list = buildRedux('${funName}')({
  url: api.login,  // * (payload, {getState}) => '/url'
  method: 'get',
  // *data(payload, { put }) { return {} },  // * 请求发送的数据处理，返回一个新的
  // *onResult(res, payload: DemoPayload, { put }) { return {} },   // * 处理数据返回一个新的数据
  // *onAfter() {},  // * action.success 后 执行的操作
  // *onError() {},  // *  错误处理
})

export default combineReducers({
  list: list.reducer,
})
`

  const pageTplConf = [
    {
      filename: 'index.tsx',
      tplFilename: config.parsed.TPL_TSX_PATH || '',
      tplstr: tsxTpl,
    },
    {
      filename: 'index.module.scss',
      tplFilename: config.parsed.TPL_SCSS_PATH || '',
      tplstr: scssTpl,
    },
    {
      filename: 'redux.ts',
      tplFilename: config.parsed.TPL_REDUX_PATH || '',
      tplstr: reduxTpl,
    },
  ].map(item => {
    item.tplFilename = path.join(shell.pwd().toString(), item.tplFilename)
    return item
  })

  const _dirPwd = path.resolve(`./src/pages/${dirName.replace(/^\//, '')}`)
  const reducerPwd = path.resolve(`./src/store/reducers.ts`)

  if (fs.existsSync(`${_dirPwd}/index.tsx`)) {
    inquirer
      .prompt([
        {
          type: 'list',
          message: `检测到 [${_dirPwd}] 已存在, 是否替换？`,
          name: 'exisit',
          choices: ['no', 'yes'],
        }
      ])
      .then(({ exisit }) => {
        if (exisit === 'no') {
          process.exit(0)
          return
        }
        run(true)
      })
  } else {
    run()
  }

  /**
   * 执行生成过程
   * @param {*} exisit 目录是否存在（存在则忽略app.js 和link.js的追加）
   */
  function run(exisit) {
    console.log(chalk.magenta('creating...'))
    if (!exisit) {
      // 新增src/app.js路由配置
      replaceTpl('./src/app.tsx', `'pages/${dirName}/index',\n\t\t\t// __PUSH_DATA`)

      // 新增src/utils/link.js配置
      replaceTpl('./src/utils/link.ts', {
        '// __PUSH_DATA': `${dirName.toLocaleUpperCase().replace('/', '_')}: '/pages/${dirName}/index',\n\t// __PUSH_DATA`
      })

      // 新增src/@types/state.d.ts 中的默认接口
      replaceTpl('./src/@types/state.d.ts', `${funName}: {\n\t\tlist: InitState<Entries>\n\t}\n\t// __PUSH_DATA`)

      // 新增src/@types/actions.d.ts 中的默认接口
      replaceTpl('./src/@types/actions.d.ts', `${funName}: CommonActions<Payload<{ name: string }>>\n\t// __PUSH_DATA`)

      // 替换config 中的  h5自定义路由 （如果是h5项目的情况下） '/pages/index/index': '/index',
      replaceTpl(
        './config/index.js',
        {
          '// __PUSH_CUSTOMROUTERS': `'/pages/${dirName}/index': '/${dirName.toLocaleLowerCase()}',\n\t\t\t\t// __PUSH_CUSTOMROUTERS`,
        },
        () => {
          // console.log(chalk.bgMagenta('\n  自定义路由已更新，需要重启服务!  \n'))
        }
      )
    }

    // 创建切换至${dirName}目录
    if (!fs.existsSync(_dirPwd)) {
      mkdirsSync(_dirPwd)
    }
    process.chdir(_dirPwd)

    let msg = exisit ? chalk.blue('[已更新] ') : chalk.green('[已创建] ')

    // 写入模板
    for (let tpl of pageTplConf) {
      if (fs.existsSync(tpl.tplFilename) && fs.lstatSync(tpl.tplFilename).isFile()) {
        let _str = fs.readFileSync(tpl.tplFilename, 'utf-8')
        if (_str) {
          tpl.tplstr = _str.replace(/\$\{funName\}/g, funName)
            .replace(/\$\{dirName\}/g, dirName.toLocaleLowerCase())
        }
      } else {
        console.log(chalk.red(`[错误] ${tpl.tplFilename}不存在/不是一个文件，将使用默认模板.`))
      }
      fs.writeFileSync(tpl.filename, tpl.tplstr)
      console.log(msg + chalk.green(`/src/pages/${dirName}/` + tpl.filename))
    }


    // 更新./src/store/reducers.js
    try {
      let _reduxTxt = fs.readFileSync(reducerPwd)
      _reduxTxt = _reduxTxt.toString()
      fs.writeFileSync(reducerPwd, _reduxTxt + ' ')
      console.log(chalk.blue(`[已更新] `) + chalk.green(`reducer`))
    } catch (e) {
      console.log(chalk.red(`[错误] ` + e.message))
    }
    process.exit(0)
  }





  /**
   * 替换目标文件多处内容（或单一内容替换）
   * @param {String} filePwd 目标文件
   * @param {Object|String} content 替换的键值对或替换内容（如果为字符串，则默认替换'// __PUSH_DATA'）
   *
    ```javascript
      # eg:
      replaceTpl(
          './src/app.js',
          {
            '// __PUSH_DATA': `'pages/${dirName}/index',\n\t\t\t// __PUSH_DATA`,
          }
      )
  
      or
      replaceTpl('./src/app.js', `'pages/${dirName}/index',\n\t\t\t// __PUSH_DATA`)
    ```
   */
  function replaceTpl(filePwd, content, fn) {
    let initPwd = filePwd
    filePwd = path.join(shell.pwd().toString(), filePwd)
    const isExist = fs.existsSync(filePwd)
    
    if (!isExist) {
      return console.log(chalk.red(`[错误] ${filePwd} 不存在`))
    }
    let _txt = fs.readFileSync(filePwd)
    _txt = _txt.toString()
    if (Object.prototype.toString.call(content) === '[object Object]') {  // 多处替换
      Object.keys(content).forEach(k => {
        _txt = _txt.replace(k, content[k])
      })
    } else {
      _txt = _txt.replace('// __PUSH_DATA', content)
    }
    fs.writeFileSync(filePwd, _txt)
    console.log(chalk.blue('[已更新] ') + chalk.green(`${initPwd}`))
    fn && fn()
  }


  /**
   * pwd字符串转驼峰   eg: login/code => LoginCode
   * @param {String} str 目标字符串
   */
  function toHump(str = '') {
    if (str.length < 1) return
    str = str.replace(/\/\w/g, item => {
      item = item.replace('/', '')
      item = firstToLocaleUpperCase(item)
      return item
    })
    return firstToLocaleUpperCase(str)
  }

  function firstToLocaleUpperCase(str) {
    return str.charAt(0).toLocaleUpperCase() + str.substr(1)
  }

  /**
   * 创建多级目录
   * @param {String} dirname 目录名称 eg: a/b/c or a
   */
  function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
      return true
    }
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true
    }
    return false
  }
}