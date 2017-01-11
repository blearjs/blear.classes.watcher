/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-11 15:30
 */


'use strict';

var Watcher = require('../../src/index.js');
var plan = require('blear.utils.plan');

it('base', function () {
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



