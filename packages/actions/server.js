const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')

const connect = require('connect')   // 可扩展的HTTP服务器框架
const serveStatic = require('serve-static')   // 设置静态资源目录
const serveIndex = require('serve-index')   // 将文件夹中文件列表显示到浏览器中
const fallback = require('connect-history-api-fallback')   // 启用html5 history 模式
const chalk = require('chalk')

const debug = require('debug')

const minimist = require('minimist')

let { openURL, getIPAddress, } = require('../../utils')

module.exports = async function (args) {

  debug.enable('server')

  // 使用 命令行参数解析引擎minimist来解析参数
  var argv = minimist(process.argv.slice(3), {
    alias: {
      'silent': 's',
      'port': 'p',
      'hostname': 'h',
      'dir': 'd',
      'log': 'l',
      'fallback': 'f'
    },
    string: ['port', 'hostname', 'fallback'],
    boolean: ['silent', 'log'],
    'default': {
      'port': 8000,
      'dir': process.cwd(),
    }
  })

  var log = debug('server')

  var app = connect()
  app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*")
    if (argv.log) {
      log(req.method + ' ' + req.url)
    }
    next()
  })
  if (argv.fallback !== undefined) {
    console.log(chalk.bgBlue('Enable html5 history mode.'))
    app.use(fallback({
      index: argv.fallback || '/index.html'
    }))
  }
  app.use(serveStatic(argv.dir, { 'index': ['index.html'] }))
  app.use(serveIndex(argv.dir, { 'icons': true }))

  var port = parseInt(argv._[0] || argv.port, 10)
  var secure = port + 1

  var hostname = argv.hostname || getIPAddress()

  http.createServer(app).listen(port, function () {
    // 忽略80端口
    port = (port != 80 ? ':' + port : '')
    let url = "http://" + hostname + port + '/'
    console.log(chalk.bgRed.bold(' [http]') + " Running at " + chalk.magenta(url))
    if (!argv.silent) {
      openURL(url)
    }
  })

  var options = {
    key: fs.readFileSync(path.join(__dirname, '../httpsKey/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../httpsKey/cert.pem'))
  }

  https.createServer(options, app).listen(secure, function () {
    secure = (secure != 80 ? ':' + secure : '')
    var url = chalk.magenta("https://" + hostname + secure + '/')
    console.log(chalk.bgRed.bold('[https]') + " running at " + url)
  })
}