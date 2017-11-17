# Vantage REPL - ES6 & Context

[![NPM](https://nodei.co/npm/vantage-es6-contextified-repl.png)](https://nodei.co/npm/vantage-es6-contextified-repl/)

[![Build Status](https://travis-ci.org/BlitzBanana/vantage-es6-contextified-repl.svg?branch=master)](https://travis-ci.org/BlitzBanana/vantage-es6-contextified-repl)
[![code coverage](https://img.shields.io/codecov/c/github/blitzbanana/vantage-es6-contextified-repl.svg)](https://codecov.io/gh/blitzbanana/vantage-es6-contextified-repl)
[![code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![made with lass](https://img.shields.io/badge/made_with-lass-95CC28.svg)](https://lass.js.org)
[![license](https://img.shields.io/github/license/blitzbanana/vantage-es6-contextified-repl.svg)](LICENSE)


## Table of Contents

* [Install](#install)
* [Usage](#usage)
  * [Options](#options)
* [Contributors](#contributors)
* [License](#license)


## Install

[npm][]:

```sh
npm install vantage-es6-contextified-repl
```

[yarn][]:

```sh
yarn add vantage-es6-contextified-repl
```


## Usage

```js
import Vantage from 'vantage'
import repl from 'vantage-es6-contextified-repl'

const vantage = Vantage()
  .delimiter('awesome-server$')
  .use(repl, {
    description: 'REL with custom context',
    banner: 'Welcome to my contextified REPL mode !',
    delimiter: chalk.red('repl:'),
    context: { app, db },
    timeout: 10000
  })
  .listen(80)
  .show()
```

```sh
user$ vantage my.server.com:8080
awesome-server$ awesome-repl
Welcome to my contextified REPL mode !
awesome-server$ repl: db.users.find()
[
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Doe' }
]
awesome-server$ repl: Promise.all([db.users.findOne(2), db.users.findOne(1)])
[
  { id: 2, name: 'Jane Doe' },
  { id: 1, name: 'John Doe' }
]
awesome-server$ repl: Promise.resolve(10).delay(11000)
Error: TimeoutError: operation timed out
```

### Options

* `mode` - the command to type to enter in REPL mode, default to `repl`.
* `description` - the mode description displayed in help menu, default to `Enters REPL mode.`.
* `banner` - the welcome message displayed when entrering in REPL mode, default to: `Entering REPL Mode. To exit, type 'exit'`.
* `delimiter` - the additional delimiter of the mode, default to `repl:`.
* `timeout` - the maximum amout of time to eval the code, default to `15000`.
* `context` - the REPL context, accessible from evalued code, default to `{}`.
* `compiler` - the code transformation functon, set `null` or a functon using signature `function(code:string)` and that returns a `string`, the default function uses Babel.


## Contributors

| Name                       |
| -------------------------- |
| **Victor Rebiard--Crépin** |


## License

[MIT](LICENSE) © Victor Rebiard--Crépin


## 

[npm]: https://www.npmjs.com/

[yarn]: https://yarnpkg.com/
