const chalk = require('chalk')
const shelljs = require('shelljs')

/**
 * 运行多个shell命令
 * @param {Array} cmds  运行多个命令
 * @param {*} cb 
 */
function run(cmds, cb, noTips = false) {
  var execNext = function _execNext() {
    let cmd = cmds.shift();
    !noTips && console.log(chalk.blue('run command: ') + chalk.magenta(cmd));
    shelljs.exec(cmd, function (err) {
      if (err) return cb && cb(err);
      if (cmds.length) return execNext();
      cb && cb(null);
    });
    return _execNext
  }()
};

module.exports = run