/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-11 15:30
 */


'use strict';

var Watcher = require('../../src/index.js');

it('#watch(String)', function () {
    var data = {
        a: 1,
        b: 2
    };
    var watcher = new Watcher(data);
    var changeTimes = 0;
    var newValList = [];

    watcher.watch('a', function (newVal, oldVal, signal) {
        newValList.push(newVal);
        changeTimes++;
    });
    data.a += 1;
    data.b += 1;

    expect(changeTimes).toBe(1);
    watcher.destroy();
    data.a += 1;
    data.b += 1;
    expect(changeTimes).toBe(1);

    expect(changeTimes).toBe(1);
    expect(newValList[0]).toBe(2);
});

it('#watch(String) + imme: true', function () {
    var data = {
        a: 1,
        b: 2
    };
    var watcher = new Watcher(data);
    var changeTimes = 0;
    var newValList = [];

    watcher.watch('a', function (newVal, oldVal, signal) {
        newValList.push(newVal);
        changeTimes++;
    }, {
        imme: true
    });

    data.a += 1;
    data.b += 1;
    expect(changeTimes).toBe(2);

    watcher.destroy();
    data.a += 1;
    data.b += 1;
    expect(changeTimes).toBe(2);
    expect(newValList[0]).toBe(1);
    expect(newValList[1]).toBe(2);
});

it('#watch(Function)', function () {
    var data = {
        a: 1,
        b: 2
    };
    var watcher = new Watcher(data);
    var newValList = [];

    watcher.watch(function () {
        return this.a + this.b;
    }, function (newVal) {
        newValList.push(newVal);
    });

    expect(newValList.length).toBe(0);

    data.a++;
    expect(newValList.length).toBe(1);
    expect(newValList[0]).toBe(4);

    data.b++;
    expect(newValList.length).toBe(2);
    expect(newValList[1]).toBe(5);

    watcher.destroy();

    data.b++;
    expect(newValList.length).toBe(2);
    expect(newValList[1]).toBe(5);
});

it('#watch(Function) + imme: true', function () {
    var data = {
        a: 1,
        b: 2
    };
    var watcher = new Watcher(data);
    var newValList = [];

    watcher.watch(function () {
        return this.a + this.b;
    }, function (newVal) {
        newValList.push(newVal);
    }, {
        imme: true
    });

    expect(newValList.length).toBe(1);
    expect(newValList[0]).toBe(3);

    data.a++;
    expect(newValList.length).toBe(2);
    expect(newValList[1]).toBe(4);

    data.b++;
    expect(newValList.length).toBe(3);
    expect(newValList[2]).toBe(5);

    watcher.destroy();

    data.b++;
    expect(newValList.length).toBe(3);
    expect(newValList[2]).toBe(5);
});

it('#watch 指定 keys', function () {
    var data = {
        a: 1,
        b: 2,
        c: 3,
        d: 4
    };
    var watcher = new Watcher(data, {
        keys: ['a', 'b']
    });
    var newValList = [];

    watcher.watch('a + b + c + d', function (newVal) {
        newValList.push(newVal);
    });

    data.a++;
    expect(newValList.length).toBe(1);
    expect(newValList[0]).toBe(11);

    data.b++;
    expect(newValList.length).toBe(2);
    expect(newValList[1]).toBe(12);

    data.c++;
    expect(newValList.length).toBe(2);
    expect(newValList[1]).toBe(12);

    data.d++;
    expect(newValList.length).toBe(2);
    expect(newValList[1]).toBe(12);
});

it('已定义 get、set 属性', function () {
    var data = {};
    var a = 1;

    Object.defineProperty(data, 'a', {
        configurable: true,
        enumerable: true,
        get: function () {
            return a;
        },
        set: function (val) {
            a = val * 2;
        }
    });

    var wather = new Watcher(data);
    var newValList = [];

    wather.watch('a', function (newVal) {
        newValList.push(newVal);
    });

    data.a = 2;
    expect(data.a).toBe(4);
    expect(newValList.length).toBe(1);
    expect(newValList[0]).toBe(4);

    data.a = 3;
    expect(data.a).toBe(6);
    expect(newValList.length).toBe(2);
    expect(newValList[1]).toBe(6);
});
