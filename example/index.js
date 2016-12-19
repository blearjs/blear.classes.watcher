/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var Watcher = require('../src/index');
var data = window.data = {
    obj: {
        b: {
            c: {
                d: 1
            }
        }
    },
    arr: [{
        b: {
            c: {
                d: 1
            }
        }
    }]
};
var watch = new Watcher(data);

watch.watch('obj.b.c.d', function (newVal, oldVal, operation, pathList) {
    console.log('watch', newVal, oldVal, operation, pathList);
});

watch.on('change', function (newVal, oldVal, operation, pathList) {
    console.log('change', newVal, oldVal, operation, pathList);
});

