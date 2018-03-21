'use strict';

const Generator = require('yeoman-generator');
const beautify = require('gulp-beautify');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  constructor(args, opts) {
    // 这个函数一定要呼叫，下面这一行代码必须写！
    super(args, opts);

    this.option('babel');

    // 单个参数
    this.argument('appname', {
      type: String,
      require: true
    })

    // 多个参数?

    // 添加对 '--coffee' option 的支持
    this.option('coffee', {

    })

    // 之后可以通过 this.options[name] 来取得传入的 argument/option
    this.log(this.options.appname)
    this.log(this.options.coffee)
  }

  // 1
  initializing() {
    this.log(yosay(
      'Welcome to the PABank B2B2C ' + chalk.red('VUE.JS MPA') + ' generator!'
    ));
  }

  // 2
  prompting() {

    return this.prompt([{
      type: 'input',
      name: 'name',
      message: 'Your project name',
      default: this.appname // default to current folder name
    }, {
      type: 'confirm',
      name: 'cool',
      message: 'Would you like to enable the Cool feature?'
    }]).then(answers => {
      this.log('first argument is: ', this.options.appname)
      this.log('app name', answers.name)
      this.log('cool feature', answers.cool)
    })
  }

  // 3
  configuring() {
    console.log('configuring')
  }

  // 4
  // if you define `Tasks (define methods)` and then run

  // 4 or 5
  default() {
    console.log('default')
  }

  // 6
  writing() {
    console.log('writing')

    // copy templates files
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('public/index.html'),
      { title: 'Templating with Yeoman' },
      this.registerTransformStream(beautify({indent_size: 2 }))
    )
  }

  // 7
  conflicts() {
    console.log('conflicts')
  }

  // 8
  install() {
    console.log('install')
  }

  // 9
  end() {
    console.log('end')
  }

  // installingLodash
  // installingLodash() {
  //   this.npmInstall('lodash', {
  //     'save-dev': true
  //   })
  // }

  // show destination/template context
  showContext() {
    this.log('dest root', this.destinationRoot())
    this.log('dest path', this.destinationPath())

    this.log('temp root', this.sourceRoot())
    this.log('temp path', this.templatePath())
  }
};

