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
var watch = window.watch = new Watcher(data);

watch.watch('obj.b.c.d', function (newVal, oldVal, operation) {
    console.log('watch obj.b.c.d', newVal, oldVal, operation);
});

watch.watch('arr[1].x', function (newVal, oldVal, operation) {
    console.log('watch arr[1].x', newVal, oldVal, operation);
});

watch.on('change', function (newVal, oldVal, operation) {
    console.log('change all', newVal, oldVal, operation);
});

