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

相对于模板，扩展了以下实例指令

## 事件
- 事件的上下文为 `data`
- 触发元素固定为 `$el`
- 事件对象固定为 `$event`
- 支持事件过滤器 enter/esc/up/right/down/left/delete/tab/space
- 为了防止歧义，不支持事件表达式

```
@click="onClick"
@keyup.enter="onEnter()"
@keyup.delete="onDelete(arg)"
```

## 模型
- 支持在 input/select/textarea 的数据监听
- checkbox 如果没有 name 则返回布尔值
- checkbox 如果有 name 则返回数组
- radio 返回布尔值
```
@model="exp"
```
