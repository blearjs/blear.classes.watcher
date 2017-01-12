/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-11 17:51
 */


'use strict';

var Watcher = require('../../src/index');

it('对象信号', function () {
    var data = {
        a: 1
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

    expect(newValList.length).toBe(0);
    expect(oldValList.length).toBe(0);
    expect(signalList.length).toBe(0);

    data.a += 1;
    expect(newValList.length).toBe(1);
    expect(oldValList.length).toBe(1);
    expect(signalList.length).toBe(1);
    expect(newValList[0]).toBe(2);
    expect(oldValList[0]).toBe(1);
    expect(signalList[0].parent).toBe(data);
    expect(signalList[0].type).toBe('object');
    expect(signalList[0].method).toBe('set');
    expect(signalList[0].oldVal).toBe(1);
    expect(signalList[0].newVal).toBe(2);
});

it('浅对象', function () {
    var data = {
        a: 1
    };
    var watcher = new Watcher(data);
    var newValList = [];

    watcher.watch('a', function (newVal, oldVal, signal) {
        newValList.push(newVal);
    });

    data.a++;
    data.a++;
    data.a++;

    expect(newValList.length).toBe(3);
    expect(newValList[0]).toBe(2);
    expect(newValList[1]).toBe(3);
    expect(newValList[2]).toBe(4);
});

it('深对象', function () {
    var data = {
        a: {
            b: {
                c: {
                    d: {
                        e: {
                            f: {
                                g: {
                                    h: 1
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    var watcher = new Watcher(data);
    var newValList = [];

    watcher.watch('a.b.c.d.e.f.g.h', function (newVal, oldVal, signal) {
        newValList.push(newVal);
    });

    data.a.b.c.d.e.f.g.h++;
    data.a.b.c.d.e.f.g.h++;
    data.a.b.c.d.e.f.g.h++;

    expect(newValList.length).toBe(3);
    expect(newValList[0]).toBe(2);
    expect(newValList[1]).toBe(3);
    expect(newValList[2]).toBe(4);
});

it('对象替换', function () {
    var data = {
        a: {
            b: {
                c: 1
            }
        }
    };
    var watcher = new Watcher(data);
    var newValList = [];

    watcher.watch('a.b.c', function (newVal, oldVal, signal) {
        newValList.push(newVal);
    });

    data.a = {b: {c: 2}};
    data.a = {b: {c: 3}};
    data.a = {b: {c: 4}};

    expect(newValList.length).toBe(3);
    expect(newValList[0]).toBe(2);
    expect(newValList[1]).toBe(3);
    expect(newValList[2]).toBe(4);
});

it('1个 object 多个 watcher 实例', function () {
    var data = {a: 1};
    var watcher1 = new Watcher(data);
    var watcher2 = new Watcher(data);
    var watcher3 = new Watcher(data);
    var list1 = [];
    var list2 = [];
    var list3 = [];

    watcher1.watch('a', function (newVal) {
        list1.push(newVal);
    });

    watcher2.watch('a', function (newVal) {
        list2.push(newVal);
    });

    watcher3.watch('a', function (newVal) {
        list3.push(newVal);
    });

    data.a = 1;
    expect(list1.length).toBe(0);
    expect(list2.length).toBe(0);
    expect(list3.length).toBe(0);

    data.a = 2;
    expect(list1.length).toBe(1);
    expect(list2.length).toBe(1);
    expect(list3.length).toBe(1);
    expect(list1[0]).toBe(2);
    expect(list2[0]).toBe(2);
    expect(list3[0]).toBe(2);

    watcher1.destroy();
    data.a = 3;
    expect(list1.length).toBe(1);
    expect(list2.length).toBe(2);
    expect(list3.length).toBe(2);
    expect(list1[1]).toBe(undefined);
    expect(list2[1]).toBe(3);
    expect(list3[1]).toBe(3);

    watcher2.destroy();
    data.a = 4;
    expect(list1.length).toBe(1);
    expect(list2.length).toBe(2);
    expect(list3.length).toBe(3);
    expect(list1[2]).toBe(undefined);
    expect(list2[2]).toBe(undefined);
    expect(list3[2]).toBe(4);

    watcher3.destroy();
    data.a = 5;
    expect(list1.length).toBe(1);
    expect(list2.length).toBe(2);
    expect(list3.length).toBe(3);
    expect(list1[3]).toBe(undefined);
    expect(list2[3]).toBe(undefined);
    expect(list3[3]).toBe(undefined);
});
