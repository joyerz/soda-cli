const fs = require('fs')
const os = require('os')
const path = require('path')
let { exec, spawn } = require('child_process')

const figlet = require('figlet')
const chalk = require('chalk')

/**
 * 在打开一个地址或者文件夹目录
 */
exports.openURL = function (url) {
  switch (process.platform) {
    case 'darwin':
      exec('open ' + url)
      break
    case 'win32':
      exec('start ' + url)
      break
    default:
      spawn('xdg-open', [url])
  }
}

/**
   * 获取ipv4 地址
   * @return {String} the ipv4 address or 'localhost'
   */
exports.getIPAddress = function () {
  var ifaces = os.networkInterfaces()
  var ip = ''
  for (var dev in ifaces) {
    ifaces[dev].forEach(function (details) {
      if (ip === '' && details.family === 'IPv4' && !details.internal) {
        ip = details.address
        return
      }
    })
  }
  return ip || "127.0.0.1";
};

// 获取cli所在的目录
function getRootPath() {
  return path.resolve(__dirname, '../')
}
exports.getRootPath = getRootPath

/**
 * 获取package.json
 * @param {*} _path 指定目录 默认为cli所在的目录
 */
function getPkg(_path) {
  return require(path.join(_path || getRootPath(), 'package.json'))
}

exports.getPkg = getPkg

/**
 * 获取 package 版本
 */
function getPkgVersion() {
  return getPkg().version
}

exports.getPkgVersion = getPkgVersion

/**
 * 打印cli信息
 */
exports.printPkgVersion = function () {
  const version = getPkgVersion()
  figlet('SODA CLI', function (err, data) {
    if (err) {
      console.log(chalk.red('Some thing about figlet is wrong!'))
    }

    console.log(`\n${chalk.rgb(232, 75, 49)(data)}`)
    console.log(chalk.magenta(`🙂 v${version}`))
    console.log()
    console.log('Please use the:')
    console.log(chalk.green('\n $ sbc -h'))
    console.log()
  })
}

/**
 * 同步创建文件夹
 * @param {String} name  路径
 */
exports.mkdirSync = function (name) {
  if (!name) throw 'dirname not is null.'
  if (fs.existsSync(name)) return
  fs.mkdirSync(name)
}

/**
 * 复制目录、子目录，及其中的文件
 * @param {String} src  要复制的目录
 * @param {String} dist  复制到目标目录
 */
function copyDir(src, dist, callback) {

  callback = err => console.log(err)

  fs.access(dist, function (err) {
    if (err) {
      // 目录不存在时创建目录
      fs.mkdirSync(dist)
    }
    _copy(null, src, dist)
  })

  function _copy(err, src, dist) {
    if (err) return callback(err)
    fs.readdir(src, function (err, paths) {
      if (err) return callback(err)
      paths.forEach(function (path) {
        var _src = src + '/' + path
        var _dist = dist + '/' + path
        fs.stat(_src, function (err, stat) {
          if (err) callback(err)
          // 判断是文件还是目录
          if (stat.isFile()) {
            fs.writeFileSync(_dist, fs.readFileSync(_src))
          } else if (stat.isDirectory()) {
            // 递归复制
            copyDir(_src, _dist, callback)
          }
        })
      })
    })
  }
}

exports.copyDir = copyDir

/**
 * 复制文件
 * @param {String} src 要复制的文件
 * @param {String} dist 目标文件
 */
function copyFile(src, dist) {
  fs.writeFileSync(dist, fs.readFileSync(src))
}

exports.copyFile = copyFile

/**
 * 复制文件（通过流）
 * @param {String} src  要复制的
 * @param {String} dist  目标文件
 */
function copyFileByStream(src, dist) {
  fs.createReadStream(src).pipe(fs.createWriteStream(dist))
}
exports.copyFileByStream = copyFileByStream