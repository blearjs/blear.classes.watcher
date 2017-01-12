/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-11 15:30
 */


'use strict';

var Watcher = require('../../src/index.js');

it('change', function () {
    var data = {
        a: 1,
        b: 2
    };
    var watcher = new Watcher(data);
    var changeTimes = 0;
    var singalList = [];

    watcher.on('change', function (signal) {
        singalList.push(signal);
        changeTimes++;
    });

    data.a += 1;
    data.b += 1;

    expect(changeTimes).toBe(2);
    watcher.destroy();
    data.a += 1;
    data.b += 1;
    expect(changeTimes).toBe(2);

    expect(changeTimes).toBe(2);
    expect(singalList[0].newVal).toBe(2);
    expect(singalList[0].key).toBe('a');
    expect(singalList[1].newVal).toBe(3);
    expect(singalList[1].key).toBe('b');
});


it('1个 object 多个 watcher 实例', function () {
    var data = {a: 1};
    var watcher1 = new Watcher(data);
    var watcher2 = new Watcher(data);
    var watcher3 = new Watcher(data);
    var len1 = 0;
    var len2 = 0;
    var len3 = 0;

    watcher1.on('change', function () {
        len1++;
    });
    watcher2.on('change', function () {
        len2++;
    });
    watcher3.on('change', function () {
        len3++;
    });

    data.a = 1;
    expect(len1).toBe(0);
    expect(len2).toBe(0);
    expect(len3).toBe(0);

    data.a = 2;
    expect(len1).toBe(1);
    expect(len2).toBe(1);
    expect(len3).toBe(1);
});
