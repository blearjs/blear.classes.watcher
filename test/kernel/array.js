/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-12 10:44
 */


'use strict';

var Watcher = require('../../src/index');

it('数组信号: push(2, 3, 4)', function () {
    var data = {
        a: [1]
    };
    var watcher = new Watcher(data);
    var newValList = [];
    var oldValList = [];
    var signalList = [];

    watcher.watch('a', function (newVal, oldVal, signal) {
        newValList.push(newVal);
        oldValList.push(oldVal);
        signalList.push(signal);
    });

    data.a.push(2, 3, 4);

    expect(newValList.length).toBe(1);
    expect(newValList[0]).toEqual([1, 2, 3, 4]);
    expect(oldValList[0]).toEqual([1]);
    expect(signalList[0].type).toBe('array');
    expect(signalList[0].method).toBe('push');
    expect(signalList[0].parent).toBe(data.a);
    expect(signalList[0].oldVal).toBe(data.a);
    expect(signalList[0].newVal).toBe(data.a);
    expect(signalList[0].spliceIndex).toBe(1);
    expect(signalList[0].spliceCount).toBe(0);
    expect(signalList[0].insertValue).toEqual([2, 3, 4]);
});

it('数组信号: pop()', function () {
    var data = {
        a: [1]
    };
    var watcher = new Watcher(data);
    var newValList = [];
    var oldValList = [];
    var signalList = [];

    watcher.watch('a', function (newVal, oldVal, signal) {
        newValList.push(newVal);
        oldValList.push(oldVal);
        signalList.push(signal);
    });

    data.a.pop();

    expect(newValList.length).toBe(1);
    expect(newValList[0]).toEqual([]);
    expect(oldValList[0]).toEqual([1]);
    expect(signalList[0].type).toBe('array');
    expect(signalList[0].method).toBe('pop');
    expect(signalList[0].parent).toBe(data.a);
    expect(signalList[0].oldVal).toBe(data.a);
    expect(signalList[0].newVal).toBe(data.a);
    expect(signalList[0].spliceIndex).toBe(0);
    expect(signalList[0].spliceCount).toBe(1);
    expect(signalList[0].insertValue).toEqual([]);
});

it('数组信号: unshift(2, 3, 4)', function () {
    var data = {
        a: [1]
    };
    var watcher = new Watcher(data);
    var newValList = [];
    var oldValList = [];
    var signalList = [];

    watcher.watch('a', function (newVal, oldVal, signal) {
        newValList.push(newVal);
        oldValList.push(oldVal);
        signalList.push(signal);
    });

    data.a.unshift(2, 3, 4);

    expect(newValList.length).toBe(1);
    expect(newValList[0]).toEqual([2, 3, 4, 1]);
    expect(oldValList[0]).toEqual([1]);
    expect(signalList[0].type).toBe('array');
    expect(signalList[0].method).toBe('unshift');
    expect(signalList[0].parent).toBe(data.a);
    expect(signalList[0].oldVal).toBe(data.a);
    expect(signalList[0].newVal).toBe(data.a);
    expect(signalList[0].spliceIndex).toBe(0);
    expect(signalList[0].spliceCount).toBe(0);
    expect(signalList[0].insertValue).toEqual([2, 3, 4]);
});

it('数组信号: shift()', function () {
    var data = {
        a: [1]
    };
    var watcher = new Watcher(data);
    var newValList = [];
    var oldValList = [];
    var signalList = [];

    watcher.watch('a', function (newVal, oldVal, signal) {
        newValList.push(newVal);
        oldValList.push(oldVal);
        signalList.push(signal);
    });

    data.a.shift();

    expect(newValList.length).toBe(1);
    expect(newValList[0]).toEqual([]);
    expect(oldValList[0]).toEqual([1]);
    expect(signalList[0].type).toBe('array');
    expect(signalList[0].method).toBe('shift');
    expect(signalList[0].parent).toBe(data.a);
    expect(signalList[0].oldVal).toBe(data.a);
    expect(signalList[0].newVal).toBe(data.a);
    expect(signalList[0].spliceIndex).toBe(0);
    expect(signalList[0].spliceCount).toBe(1);
    expect(signalList[0].insertValue).toEqual([]);
});

it('数组信号: sort()', function () {
    var data = {
        a: [1, 11, 9, 12, 3, 8, 6]
    };
    var watcher = new Watcher(data);
    var newValList = [];
    var oldValList = [];
    var signalList = [];

    watcher.watch('a', function (newVal, oldVal, signal) {
        newValList.push(newVal);
        oldValList.push(oldVal);
        signalList.push(signal);
    });

    data.a.sort();

    expect(newValList.length).toBe(1);
    expect(newValList[0]).toEqual([1, 11, 12, 3, 6, 8, 9]);
    expect(oldValList[0]).toEqual([1, 11, 9, 12, 3, 8, 6]);
    expect(signalList[0].type).toBe('array');
    expect(signalList[0].method).toBe('sort');
    expect(signalList[0].parent).toBe(data.a);
    expect(signalList[0].oldVal).toBe(data.a);
    expect(signalList[0].newVal).toBe(data.a);
    expect(signalList[0].spliceIndex).toBe(0);
    expect(signalList[0].spliceCount).toBe(0);
    expect(signalList[0].insertValue).toEqual([]);
});

it('数组信号: splice(0, 1)', function () {
    var data = {
        a: [1]
    };
    var watcher = new Watcher(data);
    var newValList = [];
    var oldValList = [];
    var signalList = [];

    watcher.watch('a', function (newVal, oldVal, signal) {
        newValList.push(newVal);
        oldValList.push(oldVal);
        signalList.push(signal);
    });

    data.a.splice(0, 1);

    expect(newValList.length).toBe(1);
    expect(newValList[0]).toEqual([]);
    expect(oldValList[0]).toEqual([1]);
    expect(signalList[0].type).toBe('array');
    expect(signalList[0].method).toBe('splice');
    expect(signalList[0].parent).toBe(data.a);
    expect(signalList[0].oldVal).toBe(data.a);
    expect(signalList[0].newVal).toBe(data.a);
    expect(signalList[0].spliceIndex).toBe(0);
    expect(signalList[0].spliceCount).toBe(1);
    expect(signalList[0].insertValue).toEqual([]);
});

it('数组信号: splice(0, 1, 2, 3, 4)', function () {
    var data = {
        a: [1]
    };
    var watcher = new Watcher(data);
    var newValList = [];
    var oldValList = [];
    var signalList = [];

    watcher.watch('a', function (newVal, oldVal, signal) {
        newValList.push(newVal);
        oldValList.push(oldVal);
        signalList.push(signal);
    });

    data.a.splice(0, 1, 2, 3, 4);

    expect(newValList.length).toBe(1);
    expect(newValList[0]).toEqual([2, 3, 4]);
    expect(oldValList[0]).toEqual([1]);
    expect(signalList[0].type).toBe('array');
    expect(signalList[0].method).toBe('splice');
    expect(signalList[0].parent).toBe(data.a);
    expect(signalList[0].oldVal).toBe(data.a);
    expect(signalList[0].newVal).toBe(data.a);
    expect(signalList[0].spliceIndex).toBe(0);
    expect(signalList[0].spliceCount).toBe(1);
    expect(signalList[0].insertValue).toEqual([2, 3, 4]);
});

it('数组信号: set(0, 2)', function () {
    var data = {
        a: [1]
    };
    var watcher = new Watcher(data);
    var newValList = [];
    var oldValList = [];
    var signalList = [];

    watcher.watch('a', function (newVal, oldVal, signal) {
        newValList.push(newVal);
        oldValList.push(oldVal);
        signalList.push(signal);
    });

    data.a.set(0, 2);

    expect(newValList.length).toBe(1);
    expect(newValList[0]).toEqual([2]);
    expect(oldValList[0]).toEqual([1]);
    expect(signalList[0].type).toBe('array');
    expect(signalList[0].method).toBe('splice');
    expect(signalList[0].parent).toBe(data.a);
    expect(signalList[0].oldVal).toBe(data.a);
    expect(signalList[0].newVal).toBe(data.a);
    expect(signalList[0].spliceIndex).toBe(0);
    expect(signalList[0].spliceCount).toBe(1);
    expect(signalList[0].insertValue).toEqual([2]);
});

it('数组信号: remove(0)', function () {
    var data = {
        a: [1]
    };
    var watcher = new Watcher(data);
    var newValList = [];
    var oldValList = [];
    var signalList = [];

    watcher.watch('a', function (newVal, oldVal, signal) {
        newValList.push(newVal);
        oldValList.push(oldVal);
        signalList.push(signal);
    });

    data.a.remove(0);

    expect(newValList.length).toBe(1);
    expect(newValList[0]).toEqual([]);
    expect(oldValList[0]).toEqual([1]);
    expect(signalList[0].type).toBe('array');
    expect(signalList[0].method).toBe('splice');
    expect(signalList[0].parent).toBe(data.a);
    expect(signalList[0].oldVal).toBe(data.a);
    expect(signalList[0].newVal).toBe(data.a);
    expect(signalList[0].spliceIndex).toBe(0);
    expect(signalList[0].spliceCount).toBe(1);
    expect(signalList[0].insertValue).toEqual([]);
});

it('数组信号: delete(1)', function () {
    var data = {
        a: [1]
    };
    var watcher = new Watcher(data);
    var newValList = [];
    var oldValList = [];
    var signalList = [];

    watcher.watch('a', function (newVal, oldVal, signal) {
        newValList.push(newVal);
        oldValList.push(oldVal);
        signalList.push(signal);
    });

    data.a.delete(1);

    expect(newValList.length).toBe(1);
    expect(newValList[0]).toEqual([]);
    expect(oldValList[0]).toEqual([1]);
    expect(signalList[0].type).toBe('array');
    expect(signalList[0].method).toBe('splice');
    expect(signalList[0].parent).toBe(data.a);
    expect(signalList[0].oldVal).toBe(data.a);
    expect(signalList[0].newVal).toBe(data.a);
    expect(signalList[0].spliceIndex).toBe(0);
    expect(signalList[0].spliceCount).toBe(1);
    expect(signalList[0].insertValue).toEqual([]);
});

it('1 维数组', function () {
    var data = {
        a: [
            1
        ]
    };
    var watcher = new Watcher(data);
    var newValList = [];

    watcher.watch('a', function (newVal, oldVal, signal) {
        newValList.push(newVal);
    });

    data.a.push(2);
    expect(newValList[0]).toEqual([1, 2]);

    data.a.push(3);
    expect(newValList[1]).toEqual([1, 2, 3]);

    data.a.push(4);
    expect(newValList[2]).toEqual([1, 2, 3, 4]);

    expect(newValList.length).toBe(3);
});

it('2 维数组[0]', function () {
    var data = {
        a: [
            [
                1
            ]
        ]
    };
    var watcher = new Watcher(data);
    var newValList = [];

    watcher.watch('a', function (newVal, oldVal, signal) {
        newValList.push(newVal);
    });

    data.a[0].push(2);
    expect(newValList[0]).toEqual([[1, 2]]);

    data.a[0].push(3);
    expect(newValList[1]).toEqual([[1, 2, 3]]);

    data.a[0].push(4);
    expect(newValList[2]).toEqual([[1, 2, 3, 4]]);

    expect(newValList.length).toBe(3);
});

it('3 维数组[0][0]', function () {
    var data = {
        a: [
            [
                [
                    1
                ]
            ]
        ]
    };
    var watcher = new Watcher(data);
    var newValList = [];

    watcher.watch('a', function (newVal, oldVal, signal) {
        newValList.push(newVal);
    });

    data.a[0][0].push(2);
    expect(newValList[0]).toEqual([[[1, 2]]]);

    data.a[0][0].push(3);
    expect(newValList[1]).toEqual([[[1, 2, 3]]]);

    data.a[0][0].push(4);
    expect(newValList[2]).toEqual([[[1, 2, 3, 4]]]);

    expect(newValList.length).toBe(3);
});

it('3 维数组[0]', function () {
    var data = {
        a: [
            [
                [
                    1
                ]
            ]
        ]
    };
    var watcher = new Watcher(data);
    var newValList = [];

    watcher.watch('a', function (newVal, oldVal, signal) {
        newValList.push(newVal);
    });

    data.a[0].push(2);
    expect(newValList[0]).toEqual([[[1], 2]]);

    data.a[0].push(3);
    expect(newValList[1]).toEqual([[[1], 2, 3]]);

    data.a[0].push(4);
    expect(newValList[2]).toEqual([[[1], 2, 3, 4]]);

    expect(newValList.length).toBe(3);
});

it('3 维数组', function () {
    var data = {
        a: [
            [
                [
                    1
                ]
            ]
        ]
    };
    var watcher = new Watcher(data);
    var newValList = [];

    watcher.watch('a', function (newVal, oldVal, signal) {
        newValList.push(newVal);
    });

    data.a.push(2);
    expect(newValList[0]).toEqual([[[1]], 2]);

    data.a.push(3);
    expect(newValList[1]).toEqual([[[1]], 2, 3]);

    data.a.push(4);
    expect(newValList[2]).toEqual([[[1]], 2, 3, 4]);

    expect(newValList.length).toBe(3);
});

it('数组替换', function () {
    var data = {
        a: [
            [
                1
            ]
        ]
    };
    var watcher = new Watcher(data);
    var newValList = [];

    watcher.watch('a[0]', function (newVal) {
        newValList.push(newVal);
    });

    data.a.set(0, [2]);
    expect(newValList[0]).toEqual([2]);

    data.a.set(0, 3);
    expect(newValList[1]).toEqual(3);

    data.a = ['a'];
    expect(newValList[2]).toEqual('a');

    expect(newValList.length).toBe(3);
});

it('数组嵌套对象', function () {
    var data = {
        a: [
            {b: 10},
            {b: 20},
            {b: 30}
        ]
    };
    var watcher = new Watcher(data);
    var newValList = [];

    watcher.watch('a[0].b', function (newVal) {
        newValList.push(newVal);
    });

    data.a[0].b++;
    expect(newValList[0]).toEqual(11);

    data.a.remove(0);
    expect(newValList[1]).toEqual(20);

    data.a = [{b: 40}];
    expect(newValList[2]).toEqual(40);
});
