'use strict';

const Generator = require('yeoman-generator');
const beautify = require('gulp-beautify');
const chalk = require('chalk');
const yosay = require('yosay');
const utils = require('../utils/file-util');
const Base = require('../utils/Base');
const _ = require('lodash');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('babel');
  }

  initializing() {
    this.log(yosay(
      'Welcome to the PABank B2B2C ' + chalk.red('VUE.JS MPA') + ' generator!'
    ));
  }

  prompting() {
    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Project name',
        default: this.appname
      },
      {
        type: 'confirm',
        name: 'vueRouter',
        message: 'Install Vue-router',
        default: true
      },
      {
        type: 'confirm',
        name: 'vuex',
        message: 'Install vuex',
        default: false
      },
      {
        type: 'confirm',
        name: 'share',
        message: '引入分享组件',
        default: true
      },
      {
        type: 'confirm',
        name: 'auth',
        message: '启用登录组件拦截',
        default: false
      },
      {
        type: 'confirm',
        name: 'webtrends',
        message: '引入埋点组件',
        default: true
      },
      {
        type: 'confirm',
        name: 'zhida',
        message: '引入直达组件',
        default: false
      }
    ];

    return this.prompt(prompts).then(answers => {
      // To access answers later use this.answers.someAnswer;
      this.answers = answers;
    });
  }

  // 3
  configuring() {
    this._mergeJson('package.json', {
      dependencies: {
        vue: '^2.1.10'
      }
    });

    if (this.answers.router === 'router') {
      this._mergeJson('package.json', {
        dependencies: {
          'vue-router': '^2.2.1'
        }
      });
    }
    console.log('configuring')
  }

  // 6
  writing() {
    console.log('writing')

    // copy templates files
    // this.fs.copyTpl(
    //   this.templatePath('index.html'),
    //   this.destinationPath('public/index.html'),
    //   { title: 'Templating with Yeoman' },
    //   this.registerTransformStream(beautify({indent_size: 2 }))
    // )
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


  // UTILS
  _mergeJson(fileName, newContent) {
    const content = this.fs.readJSON(this.destinationPath(fileName), {});

    _.mergeWith(content, newContent, (a, b) => {
      if (_.isArray(a)) {
        return _.uniq(a.concat(b));
      }
    });

    this.fs.writeJSON(this.destinationPath(fileName), content);
  }

  // installingLodash
  // installingLodash() {
  //   this.npmInstall('lodash', {
  //     'save-dev': true
  //   })
  // }

  // show destination/template context
  // showContext() {
  //   this.log('dest root', this.destinationRoot())
  //   this.log('dest path', this.destinationPath())

  //   this.log('temp root', this.sourceRoot())
  //   this.log('temp path', this.templatePath())
  // }
};

