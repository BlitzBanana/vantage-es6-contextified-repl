# Vantage REPL - ES6 & Context

[![Build Status](https://travis-ci.org/BlitzBanana/vantage-es6-contextified-repl.svg?branch=master)](https://travis-ci.org/BlitzBanana/vantage-es6-contextified-repl)
[![code coverage](https://img.shields.io/codecov/c/github/blitzbanana/vantage-es6-contextified-repl.svg)](https://codecov.io/gh/blitzbanana/vantage-es6-contextified-repl)
[![code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![made with lass](https://img.shields.io/badge/made_with-lass-95CC28.svg)](https://lass.js.org)
[![license](https://img.shields.io/github/license/blitzbanana/vantage-es6-contextified-repl.svg)](LICENSE)


## Table of Contents

* [Install](#install)
* [Usage](#usage)
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
  .use(repl, { app: app, db: db })
  .listen(80)
  .show()
```

```sh
user$ node server.js
awesome-server$ repl
awesome-server$ repl: await db.users.find()
[
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Doe' }
]
```


## Contributors

| Name                       |
| -------------------------- |
| **Victor Rebiard--Crépin** |


## License

[MIT](LICENSE) © Victor Rebiard--Crépin


## 

[npm]: https://www.npmjs.com/

[yarn]: https://yarnpkg.com/
