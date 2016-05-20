# blear.classes.watcher

[![npm module][npm-img]][npm-url]
[![build status][travis-img]][travis-url]
[![coverage][coveralls-img]][coveralls-url]

[travis-img]: https://img.shields.io/travis/blearjs/blear.classes.watcher/master.svg?maxAge=2592000&style=flat-square
[travis-url]: https://travis-ci.org/blearjs/blear.classes.watcher

[npm-img]: https://img.shields.io/npm/v/blear.classes.watcher.svg?maxAge=2592000&style=flat-square
[npm-url]: https://www.npmjs.com/package/blear.classes.watcher

[coveralls-img]: https://img.shields.io/coveralls/blearjs/blear.classes.watcher/master.svg?maxAge=2592000&style=flat-square
[coveralls-url]: https://coveralls.io/github/blearjs/blear.classes.watcher?branch=master



## 数据监听
IE8 采用轮询脏检查。

- 会自动过滤掉“_”、“$”开头和值为“function”的元素的监听
- 每个数组实例都会新增一个 set(index, val) 方法用于设置数组元素
- 每个数组实例都会新增一个 remove(index) 方法用于删除数组元素


