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

# usage
```js
var data = {a: 1};
var watcher = new Watcher(data);

watcher.watch('a', function(newVal, oldVal, signal) {
    // ....
});
```


# API
## #watch(expOrFn, listener): unwatch()


# 流程

- 一个 data 的一个 key 关联一个 wire
- data 层级之前使用 linker 来关联
- 一个 wire 关联多个 terminal


```
data => wire => terminal

{ --> linker --> wire --> [terminal1, ...]
    obj: --> wire --> [terminal1, ...]
        { --> linker --> wire --> [terminal1, ...]
            a: --> wire --> [terminal1, ...]
            b: --> wire --> [terminal1, ...]
        }
        
    arr: --> wire --> [terminal1, ...]
        [ --> linker --> wire --> [terminal1, ...]
           1,
           2
        ]
}
```

- 其中 `terminal` 需要调用者实现
- 一个 `terminal` 可能与多个 `wire` 有关联
- `terminal` 需要实现 `.link` 方法，用来与 `wire` 进行关联
- `terminal` 需要实现 `.pipe` 方法，用来与 `wire` 信号传输
- `terminal` 如果不需要关联，则需要主动调用 `wire.unlink(terminal)` 切断关联

