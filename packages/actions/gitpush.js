const inquirer = require('inquirer')
const chalk = require('chalk')

const shells = require('../libs/shell')

const asks = [
  {
    name: 'message',
    type: 'input',
    message: `Enter your commit message `
  }
]

// 合并 git pull | git commit | git push
module.exports = async function () {
  let answers = await inquirer.prompt(asks).catch(err => {
    console.log(chalk.green(err));
  });

  let message = answers.message;
  shells([
    'git pull',
    'git add .',
    `git commit -m "${message}"`,
    'git push',
  ], function (err) {
    if (err) {
      console.log(chalk.red(err.message || '😣 has error.'));
      process.exit(0);
    }
    console.log(chalk.green('Git push completed!'));
    process.exit(0);
  });
}