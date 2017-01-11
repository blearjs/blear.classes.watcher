/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var Watcher = require('../src/index.js');
var plan = require('blear.utils.plan');

describe('测试文件', function () {
    it('base', function (done) {
        var data = {
            a: 1,
            b: 2
        };
        var watcher = new Watcher(data);
        var changeTimes = 0;

        plan
            .taskSync(function () {
                watcher.on('change', function (signal) {
                    console.log(signal);
                    changeTimes++;
                });
                data.a += 1;
                data.b += 1;
            })
            // 是不是两个 taskSync 的问题
            .taskSync(function () {
                expect(changeTimes).toBe(2);
                watcher.destroy();
                data.a += 1;
                data.b += 1;
                expect(changeTimes).toBe(2);
            })
            .serial(function (err) {
                expect(changeTimes).toBe(2);
                expect(!!err).toBeFalsy();
                done();
            });
    });

    // it('main', function (done) {
    //     var data = {
    //         obj: {
    //             data: {
    //                 a: {
    //                     b: 1
    //                 }
    //             },
    //             c: 2
    //         },
    //         arr: [{
    //             d: 3
    //         }, {
    //             e: 4,
    //             f: function () {
    //             }
    //         }, function () {
    //         }],
    //         num: 5,
    //         _: 6,
    //         $: 7,
    //         f: function () {
    //         }
    //     };
    //
    //     console.dir(data);
    //
    //     var wt1 = new Watcher(data);
    //     var wt2 = new Watcher(data.obj.data);
    //     var watcher1ChangeTimes = 0;
    //     var watcher2ChangeTimes = 0;
    //     var delay = function (next) {
    //         setTimeout(function () {
    //             next();
    //         }, 1);
    //     };
    //
    //
    //     wt1.on('change', function () {
    //         watcher1ChangeTimes++;
    //     });
    //     wt2.on('change', function () {
    //         watcher2ChangeTimes++;
    //     });
    //
    //     howdo
    //         .task(function (next) {
    //             data.obj.data.a.b = 8;
    //
    //             delay(next);
    //         })
    //         .task(function (next) {
    //             expect(watcher1ChangeTimes).toEqual(1);
    //             expect(watcher2ChangeTimes).toEqual(1);
    //
    //             data._ = '....';
    //             data.$ = '....';
    //             data.f = function () {
    //             };
    //             delay(next);
    //         })
    //         .task(function (next) {
    //             expect(watcher1ChangeTimes).toEqual(1);
    //             expect(watcher2ChangeTimes).toEqual(1);
    //
    //             data.obj.c = 9;
    //             delay(next);
    //         })
    //         // 新增一个对象
    //         .task(function (next) {
    //             expect(watcher1ChangeTimes).toEqual(2);
    //             expect(watcher2ChangeTimes).toEqual(1);
    //
    //             data.obj.data.a = {
    //                 f: 10
    //             };
    //             delay(next);
    //         })
    //         // 重新刚才新增的对象
    //         .task(function (next) {
    //             expect(watcher1ChangeTimes).toEqual(3);
    //             expect(watcher2ChangeTimes).toEqual(2);
    //
    //             data.obj.data.a.f = 11;
    //             delay(next);
    //         })
    //         // 覆盖对象为 null
    //         .task(function (next) {
    //             expect(watcher1ChangeTimes).toEqual(4);
    //             expect(watcher2ChangeTimes).toEqual(3);
    //
    //             data.obj.data.a = null;
    //             delay(next);
    //         })
    //         .task(function (next) {
    //             expect(watcher1ChangeTimes).toEqual(5);
    //             expect(watcher2ChangeTimes).toEqual(4);
    //
    //             wt2.destroy();
    //             data.obj.data.a = 12;
    //             delay(next);
    //         })
    //         .task(function (next) {
    //             expect(watcher1ChangeTimes).toEqual(6);
    //             expect(watcher2ChangeTimes).toEqual(4);
    //
    //             data.arr.push({g: 13});
    //             delay(next);
    //         })
    //         .task(function (next) {
    //             expect(watcher1ChangeTimes).toEqual(7);
    //
    //             data.arr.pop();
    //             delay(next);
    //         })
    //         .task(function (next) {
    //             expect(watcher1ChangeTimes).toEqual(8);
    //
    //             delay(next);
    //         })
    //         .task(function (next) {
    //             var clData1 = wt1.data();
    //             var clData2 = wt2.data();
    //
    //             console.log(clData1);
    //             console.log(clData2);
    //             delay(next);
    //         })
    //         .task(function (next) {
    //             data.arr.set(0, {x: 'x'});
    //
    //             delay(next);
    //         })
    //         .task(function (next) {
    //             expect(data.arr[0].x).toEqual('x');
    //             expect(data.arr[0].a).toEqual(undefined);
    //             expect(watcher1ChangeTimes).toEqual(9);
    //
    //             data.arr.remove(0);
    //
    //             delay(next);
    //         })
    //         .task(function (next) {
    //             expect(data.arr[0].e).toEqual(4);
    //             expect(data.arr.length).toEqual(2);
    //             expect(watcher1ChangeTimes).toEqual(10);
    //
    //             data.arr.sort();
    //
    //             delay(next);
    //         })
    //         .task(function (next) {
    //             expect(data.arr.length).toEqual(2);
    //             expect(watcher1ChangeTimes).toEqual(11);
    //
    //             delay(next);
    //         })
    //         .task(function (next) {
    //             wt1.destroy();
    //
    //             data.arr.push({g: ',,,'});
    //             delay(next);
    //         })
    //         .task(function (next) {
    //             expect(watcher1ChangeTimes).toEqual(11);
    //
    //             delay(next);
    //         })
    //         .follow(done);
    // });

    // it('#watch', function (done) {
    //     var data = {
    //         a: {
    //             b: 1
    //         }
    //     };
    //     var watcher = new Watcher(data);
    //     var watchTimes = 0;
    //
    //     watcher.watch('a.b', function (newVal, oldVal) {
    //         watchTimes++;
    //     });
    //
    //     data.a.b++;
    //     data.a.b++;
    //     setTimeout(function () {
    //         expect(watchTimes).toEqual(2);
    //         done();
    //     }, 100);
    // });

    // it('#unwatch()', function (done) {
    //     var data = {
    //         a: {
    //             b: 1,
    //             c: 2
    //         }
    //     };
    //     var watcher = new Watcher(data);
    //     var watchTimes = 0;
    //
    //     watcher.watch('a.b', function (newVal, oldVal) {
    //         watchTimes++;
    //         watcher.unwatch();
    //     });
    //
    //     data.a.b++;
    //     data.a.b++;
    //     setTimeout(function () {
    //         expect(watchTimes).toEqual(1);
    //         done();
    //     }, 100);
    // });
    //
    // it('#unwatch(path)', function (done) {
    //     var data = {
    //         a: {
    //             b: 1,
    //             c: 2
    //         }
    //     };
    //     var watcher = new Watcher(data);
    //     var watchTimes = 0;
    //     var watchTimes2 = 0;
    //
    //     watcher.watch('a.b', function (newVal, oldVal) {
    //         watchTimes++;
    //     });
    //
    //     watcher.watch('a.c', function (newVal, oldVal) {
    //         watchTimes2++;
    //         watcher.unwatch('a.c');
    //     });
    //
    //     data.a.b++;
    //     data.a.b++;
    //     data.a.c++;
    //     data.a.c++;
    //     setTimeout(function () {
    //         expect(watchTimes).toEqual(2);
    //         expect(watchTimes2).toEqual(1);
    //         done();
    //     }, 100);
    // });
    //
    // it('#unwatch(path, callback)', function (done) {
    //     var data = {
    //         a: {
    //             b: 1,
    //             c: 2
    //         }
    //     };
    //     var watcher = new Watcher(data);
    //     var watchTimes = 0;
    //     var watchTimes2 = 0;
    //     var fn1 = function (newVal, oldVal) {
    //         watchTimes++;
    //     };
    //     var fn2 = function (newVal, oldVal) {
    //         watchTimes2++;
    //         watcher.unwatch('a.b', fn2);
    //     };
    //
    //     watcher.watch('a.b', fn1);
    //     watcher.watch('a.b', fn2);
    //
    //     data.a.b++;
    //     data.a.b++;
    //     setTimeout(function () {
    //         expect(watchTimes).toEqual(2);
    //         expect(watchTimes2).toEqual(1);
    //         done();
    //     }, 100);
    // });
    //
    // it('#data/#get', function () {
    //     var w = new Watcher({
    //         a: {
    //             b: 1
    //         }
    //     });
    //
    //     expect(w.get('a.b')).toEqual(1);
    // });
    //
    // it('watch array:push', function (done) {
    //     var list = [1, 2, 3];
    //     var w = new Watcher({
    //         list: list
    //     });
    //
    //     var spliceIndexHistory = [];
    //     var spliceCountHistory = [];
    //     var insertValueHistory = [];
    //
    //     w.on('change', function (newVal, oldVal, opratrion) {
    //         spliceIndexHistory.push(opratrion.spliceIndex);
    //         spliceCountHistory.push(opratrion.spliceCount);
    //         insertValueHistory.push(opratrion.insertValue);
    //     });
    //
    //     list.push('x');
    //     list.push('a', 'b', 'c');
    //
    //     setTimeout(function () {
    //         expect(spliceCountHistory.length).toEqual(2);
    //         expect(spliceIndexHistory[0]).toEqual(3);
    //         expect(spliceIndexHistory[1]).toEqual(4);
    //         expect(spliceCountHistory[0]).toEqual(0);
    //         expect(spliceCountHistory[1]).toEqual(0);
    //         expect(insertValueHistory[0]).toEqual(['x']);
    //         expect(insertValueHistory[1]).toEqual(['a', 'b', 'c']);
    //
    //         done();
    //     }, 100);
    // });
    //
    // it('watch array:pop', function (done) {
    //     var list = [1, 2, 3];
    //     var w = new Watcher({
    //         list: list
    //     });
    //
    //     var spliceIndexHistory = [];
    //     var spliceCountHistory = [];
    //     var insertValueHistory = [];
    //
    //     w.on('change', function (newVal, oldVal, opratrion) {
    //         spliceIndexHistory.push(opratrion.spliceIndex);
    //         spliceCountHistory.push(opratrion.spliceCount);
    //         insertValueHistory.push(opratrion.insertValue);
    //     });
    //
    //     list.pop();
    //     list.pop();
    //
    //     setTimeout(function () {
    //         expect(spliceCountHistory.length).toEqual(2);
    //         expect(spliceIndexHistory[0]).toEqual(2);
    //         expect(spliceIndexHistory[1]).toEqual(1);
    //         expect(spliceCountHistory[0]).toEqual(1);
    //         expect(spliceCountHistory[1]).toEqual(1);
    //         expect(insertValueHistory[0]).toEqual([]);
    //         expect(insertValueHistory[1]).toEqual([]);
    //
    //         done();
    //     }, 100);
    // });
    //
    // it('watch array:unshift', function (done) {
    //     var list = [1, 2, 3];
    //     var w = new Watcher({
    //         list: list
    //     });
    //
    //     var spliceIndexHistory = [];
    //     var spliceCountHistory = [];
    //     var insertValueHistory = [];
    //
    //     w.on('change', function (newVal, oldVal, opratrion) {
    //         spliceIndexHistory.push(opratrion.spliceIndex);
    //         spliceCountHistory.push(opratrion.spliceCount);
    //         insertValueHistory.push(opratrion.insertValue);
    //     });
    //
    //     list.unshift('x');
    //     list.unshift('a', 'b', 'c');
    //
    //     setTimeout(function () {
    //         expect(spliceCountHistory.length).toEqual(2);
    //         expect(spliceIndexHistory[0]).toEqual(0);
    //         expect(spliceIndexHistory[1]).toEqual(0);
    //         expect(spliceCountHistory[0]).toEqual(0);
    //         expect(spliceCountHistory[1]).toEqual(0);
    //         expect(insertValueHistory[0]).toEqual(['x']);
    //         expect(insertValueHistory[1]).toEqual(['a', 'b', 'c']);
    //
    //         done();
    //     }, 100);
    // });
    //
    // it('watch array:shift', function (done) {
    //     var list = [1, 2, 3];
    //     var w = new Watcher({
    //         list: list
    //     });
    //
    //     var spliceIndexHistory = [];
    //     var spliceCountHistory = [];
    //     var insertValueHistory = [];
    //
    //     w.on('change', function (newVal, oldVal, opratrion) {
    //         spliceIndexHistory.push(opratrion.spliceIndex);
    //         spliceCountHistory.push(opratrion.spliceCount);
    //         insertValueHistory.push(opratrion.insertValue);
    //     });
    //
    //     list.shift();
    //     list.shift();
    //
    //     setTimeout(function () {
    //         expect(spliceCountHistory.length).toEqual(2);
    //         expect(spliceIndexHistory[0]).toEqual(0);
    //         expect(spliceIndexHistory[1]).toEqual(0);
    //         expect(spliceCountHistory[0]).toEqual(1);
    //         expect(spliceCountHistory[1]).toEqual(1);
    //         expect(insertValueHistory[0]).toEqual([]);
    //         expect(insertValueHistory[1]).toEqual([]);
    //
    //         done();
    //     }, 100);
    // });
    //
    // it('watch array:sort', function (done) {
    //     var list = [1, 2, 3];
    //     var w = new Watcher({
    //         list: list
    //     });
    //
    //     var spliceIndexHistory = [];
    //     var spliceCountHistory = [];
    //     var insertValueHistory = [];
    //
    //     w.on('change', function (newVal, oldVal, opratrion) {
    //         spliceIndexHistory.push(opratrion.spliceIndex);
    //         spliceCountHistory.push(opratrion.spliceCount);
    //         insertValueHistory.push(opratrion.insertValue);
    //     });
    //
    //     list.sort(function () {
    //         return Math.random() > 0.5;
    //     });
    //
    //     setTimeout(function () {
    //         expect(spliceCountHistory.length).toEqual(1);
    //         expect(spliceIndexHistory[0]).toEqual(-1);
    //         expect(spliceCountHistory[0]).toEqual(0);
    //         expect(insertValueHistory[0]).toEqual([]);
    //
    //         done();
    //     }, 100);
    // });
    //
    // it('watch array:splice', function (done) {
    //     var list = [1, 2, 3];
    //     var w = new Watcher({
    //         list: list
    //     });
    //
    //     var spliceIndexHistory = [];
    //     var spliceCountHistory = [];
    //     var insertValueHistory = [];
    //
    //     w.on('change', function (newVal, oldVal, opratrion) {
    //         spliceIndexHistory.push(opratrion.spliceIndex);
    //         spliceCountHistory.push(opratrion.spliceCount);
    //         insertValueHistory.push(opratrion.insertValue);
    //     });
    //
    //     list.splice(1);
    //     // [1, 2, 3]
    //     list.splice(1, 1);
    //     // [1, 3]
    //     list.splice(1, 2, 'x', 'y', 'z');
    //     // [1, 'x', 'y', 'z']
    //
    //     setTimeout(function () {
    //         expect(spliceCountHistory.length).toEqual(3);
    //         expect(spliceIndexHistory[0]).toEqual(1);
    //         expect(spliceIndexHistory[1]).toEqual(1);
    //         expect(spliceIndexHistory[2]).toEqual(1);
    //         expect(spliceCountHistory[0]).toEqual(0);
    //         expect(spliceCountHistory[1]).toEqual(1);
    //         expect(spliceCountHistory[2]).toEqual(2);
    //         expect(insertValueHistory[0]).toEqual([]);
    //         expect(insertValueHistory[1]).toEqual([]);
    //         expect(insertValueHistory[2]).toEqual(['x', 'y', 'z']);
    //         expect(list).toEqual([1, 'x', 'y', 'z']);
    //
    //         done();
    //     }, 100);
    // });
});
