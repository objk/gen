`yo name` (default generator) 对应下面的目录结构
generators
  |-- app/
      |-- index.js

`yo name:subcommand` (sub-generators) 对应下面的目录结构
this case: `yo name:router`
generators
  |-- router/
      |-- index.js

Yeoman 支持两种目录结构 `./` 和 `generators/`
上面的例子也可以写成：
```
|-- package.json
|-- app/
    |-- index.js
|-- router
    |-- index.js
```

需要注意的是，如果你使用 `./` 这种结构，在你 `package.json` 文件里面需要用 *files* property 指明所有的 generator folders
```
{
  "files": [
    "app",
    "router"
  ]
}
```

## Extending generator
Yeoman 提供了 `base generator` -- 具备了一些基本的功能，你通过 extend `base generator` 来实现你需要的功能。

### `constructor` method
  Some generator methods can only be called inside the `constructor` function.

### adding your own functionality
  - call--and usually in sequence
  - **some special method names** will trigger a specific run order

### Finding the project root
  Yeoman 会去找 `.yo-rc.json` 文件来决定哪个是根目录
  所以，除了根目录之外最好别去创建（不要在任何子目录创建）`.yo-rc.json`
  要么就不用 `.yo-rc.json` 文件（你需要主动切换到根目录来运行 yo command）
  要么在根目录创建 `.yo-rc.json` 文件（你可以在子目录来运行 yo command）

## Running Context
在创建 `Generator` 的时候最重要的一个概念是： **how methods are running and in which context.**

### prototype methods as actions
#### helper and private methods
  有三种方式定义 private methods
#### the run loop
  - 1 `initializing() {}`
  - 2 `prompting() {}`
  - 3 `configuring() {}`
  - 4 `default() {}`
  - 5 `writing() {}`
  - 6 `conflicts() {}`
  - 7 `install() {}`
  - 8 `end() {}`
### Asynchronous tasks
  - 最简单的方式 `return a promise`
  - 可以你环境不支持 promises，可以使用下面的方式
```js
  asyncTask() {
    var done = this.async();

    getUserEmail(function (err, name) {
      done(err);
    });
  }
```

## User interactions
never use `console.log()` or `process.stdout.write()`
always rely on `this.log()`
`this` is the context of your current generator

#### Prompts
Prompts are the main way a generator interacts with a user.

`prompting() {}` return a promise
**You'll need to** return the promise from your task in order to wait for its completion before running the next one.

#### Remembering user preferences
对于一些问题不需要用户每次都重复输入的，可以使用 `store: true` 来记录上一次输入的记录
例如：'What\'s your Github username'
```
  this.prompt({
    type    : 'input',
    name    : 'username',
    message : 'What\'s your Github username',
    store   : true
  });

```

#### Arguments
> yo webapp my-project

- *my-project* would be the first argument
- 为了告知 generator 我们传入了参数，我们需要调用 `this.argument()`
- 之后（通常会在callback里）我们就可以通过 this.options[name] 来取得这个参数
- This method must be called inside the `constructor` method. （要不然用户使用 `bacyo webpack --help` 的时候就得不到相应的帮助信息）
```js
  module.exports = class extends Generator {
    constructor(args, opts) {
      super(args, opts)

      this.argument('appname', {
        type: String,
        required: true
      })

      this.log(this.options.appname)
    }
  }

```

#### Options
> yo webapp --coffee

- *coffee* 为传入 option
- 为了告知 generator 我们传入了参数，我们需要调用 `this.options()`
- 之后（通常会在callback里）我们就可以通过 this.options[name] 来取得这个options
- This method must be called inside the `constructor` method. （要不然用户使用 `bacyo webpack --help` 的时候就得不到相应的帮助信息）

```
  module.exports = class extends Generator {
    constructor(args, opts) {
      super(args, opts)

      // 添加对 --coffee option的支持
      this.option('coffee', {

      })

      // 之后你可以通过 this.options.coffee 来访问这个option
      this.scriptSuffix = this.options.coffee ? '.coffee' : '.js'
    }
  }
```

#### Outputting Information
使用 `this.log()`，例如：this.log('Something has gone wrong!')

### Composability
还未阅读

### Managing Dependencies
通常都会使用 `npm`(or `Yarn`) and `Bower` 来安装依赖
Yeoman 提供了 installation helpers - `initializing() {}`
如果你想某些动作在，安装依赖完成之后执行可以使用 end helpers - `end() {}`

#### `npm` `Yarn` `Bower`
使用
`this.npmInstall() {}`
`this.yarnInstall() {}`
`this.bowerInstall() {}` 来安装 npm module

Yeoman 会确保
`npm install`
`yarn install`
`bower install`
仅会执行一次！

例如：
```js
  module.exports = class extends Generator {
    installingLodash() {

      this.npmInstall(['lodash'], {
        'save-dev': true
      })

      this.yarnInstall(['lodash'], {
        'save-dev': true
      })

      this.bowerInstall(['lodash'], {
        'save-dev': true
      })
    }
  }

  // 相当于 `npm install lodash --save-dev`
  // 相当于 `yarn add lodash --save-dev`
  // 相当于 `bower install lodash --save-dev`
```

#### Combined use
Calling `generator.installDependencies()` runs npm and bower by default.

例如你喜欢使用 `yarn` 和 `bower`
```js
  module.exports = class extends Generator {
    install () {
      this.installDependencies({
        npm: false,
        bower: true,
        yarn: true
      })
    }
  }
```

#### Using other tools
参考官方文档


### Working with the file system

#### Location contexts and paths
Yeoman file utilities are based on the idea you always have two location contexts on disk. These contexts are folders your generator will most likely read from and write to.

**Destination context** and **Template context**

##### Destination context
*distination context* 是你通过 Yeoman 生产的 'App structure'
默认为当前 working directory 或者 the closest parent folder containing a `.yo-rc.json` 文件

> 前面我们知道：The `.yo-rc.json` file defines the root of a Yeoman project.

你可以通过 `generator.destinationRoot()` 来获取 destination path
你也可以通过 `generator.destinationPath('sub/path')` 来 joining path
例如：
```js
  module.export = class extends Generator {
    paths() {
      // return '~/projects'
      this.destinationRoot()

      // return '~/projects/index.js'
      this.destinationPath('index.js')
    }
  }
```

当然你也可以通过 `generator.destinationRoot('new/path')` 来指定 destination path，**但是不建议这么做**

如果你想知道user在哪个目录下运行 `yo command`，可以通过 `this.contextRoot` 来取得

#### Template context
*template context* 是你存放 template files 的文件夹，通常你会对这些文件进行 read and copy

template context 默认定于为 `./templates/` 你也可以通过 `generator.sourceRoot('new/template/path')` 来重写，但是不建议你去这么做

你可以通过 `generator.sourceRoot()` 来获得 template files 的路径
你也可以通过 `generator.templatePath('app/index.j')` 来 joining path
例如：
```js
  module.exports = class extends Generator {
    paths() {
      this.sourceRoot()
      // return './templates'

      this.templatePath('index/js')
      // return './templates/index.js'
    }
  }
```

### An "in memory" file system
参考官方文档

### File utilities
Generators 会 expose 所有对file 操作的 methos 在 `this.fs` object

要注意的是，虽然会把 `commit` exposes 在 `this.fs` object，但是你不要主动去调用这个 method，Yeoman内部会在file stage conflicts的时候去调用！

#### Example: copying a template file(and process)
假设你有以下的文件 `./templates/index.html`
```html
  <html>
    <head>
      <title><%= title %></title>
    </head>
  </html>
```

然后你(read and copy)使用 `copyTpl` - method to copy the file while processing the content as a template.
```js
  module.exports = class extends Generator {
    writing() {
      this.fs.copyTpl(
        this.templatePath('index.html'),
        this.destinationPath('public/index.html'),
        { title: 'Templating with Yeoman' }
      );
    }
  }
```

当 generator 完成之后，你会得到 `public/index.html`
```html
  <html>
    <head>
      <title>Templating with Yeoman</title>
    </head>
  </html>
```

### Transform output files through streams
你可以在output destination context的时候对文件进行处理，例如：beautifying files, normalizing whitespace etc...

使用起来像 `gulp` 一样
可以使用 `generator.registerTransformStream()` 来处理输出文件或输出路径
例如：你想缩进两个空格
```js
  const beautify = require('gulp-beautify')
  module.exports = class extends Generator {
    writing() {
      this.fs.copyTpl(
        this.templatePath('index.html'),
        this.destinationPath('public/index.html'),
        { title: 'Templating with Yeoman' },

        // 输出之前对文件进行'处理'
        this.registerTransformStream(beautify({indent_size: 2 }))
      )
    }
  }
```

理论上你可以使用所有的 *gulp plugins*

### Update existing file's content
这种情况比较复杂！
参考官方文档


### Managing Configuration
Storing user configuration options and sharing them between sub-generators is a common task.

这些配置可以通过 Yeoman Storage API 存放在 `.yo-rc.json` 文件, 这个API通过访问 `generator.config` object

#### Methods
一些常用的方法

> generator.config.save()
这个方法会把configuration写入 `.yo-rc.json` 文件, 如果没有这个文件会去创建再写入！
因为 `.yo-rc.json` 决定project的根目录位置，所有即使在你的 generator 不使用 storage，也建议你保留这个文件！

还有几个常用的方法，参考官方文档！

#### `.yo-rc.json` structure
参考官方文档！

下面章节都参考官方文档
### Unit testing
### Debugging Generators
### Integrating Yeoman in other tools
### Full API documentation

### other articles
https://scotch.io/tutorials/create-a-custom-yeoman-generator-in-4-easy-steps

