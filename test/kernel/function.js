/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-12 11:37
 */


'use strict';

var Watcher = require('../../src/index');

it('函数', function () {
    var data = {
        a: function () {

        }
    };
    var watcher = new Watcher(data);
    var newValList = [];

    watcher.watch('a', function (newVal) {
        newValList.push(newVal);
    });

    data.a = function () {

    };
    expect(newValList.length).toBe(0);

    data.a = 1;
    expect(newValList.length).toBe(0);
});


