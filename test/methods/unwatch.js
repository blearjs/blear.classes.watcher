/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-11 15:30
 */


'use strict';

var Watcher = require('../../src/index.js');

it('#watch + unwatch', function () {
    var data = {
        a: 1,
        b: 2
    };
    var watcher = new Watcher(data);
    var changeTimes = 0;
    var newValList = [];
    var unwatch = watcher.watch('a', function (newVal, oldVal, signal) {
        newValList.push(newVal);
        changeTimes++;
    });

    data.a += 1;
    data.b += 1;

    expect(changeTimes).toBe(1);
    unwatch();
    data.a += 1;
    data.b += 1;
    expect(changeTimes).toBe(1);

    watcher.destroy();
    expect(newValList[0]).toBe(2);

});

it('#watch + unwatch + imme: true', function () {
    var data = {
        a: 1,
        b: 2
    };
    var watcher = new Watcher(data);
    var changeTimes = 0;
    var newValList = [];
    var unwatch = watcher.watch('a', function (newVal, oldVal, signal) {
        newValList.push(newVal);
        changeTimes++;
    }, {
        imme: true
    });

    data.a += 1;
    data.b += 1;

    expect(changeTimes).toBe(2);
    unwatch();
    data.a += 1;
    data.b += 1;
    expect(changeTimes).toBe(2);

    watcher.destroy();
    expect(newValList[0]).toBe(1);
    expect(newValList[1]).toBe(2);
});

// it('#watch + deep: true');



