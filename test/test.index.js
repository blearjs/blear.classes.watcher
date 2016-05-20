/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var Watcher = require('../src/index.js');
var howdo = require('blear.utils.howdo');

describe('测试文件', function () {
    it('main', function (done) {
        var data = {
            obj: {
                data: {
                    a: {
                        b: 1
                    }
                },
                c: 2
            },
            arr: [{
                d: 3
            }, {
                e: 4,
                f: function(){}
            }, function(){}],
            num: 5,
            _: 6,
            $: 7,
            f: function(){}
        };

        console.dir(data);

        var wt1 = new Watcher(data);
        var wt2 = new Watcher(data.obj.data);
        var watcher1ChangeTimes = 0;
        var watcher2ChangeTimes = 0;
        var delay = function (next) {
            setTimeout(function () {
                next();
            }, 1);
        };


        wt1.on('change', function () {
            watcher1ChangeTimes++;
        });
        wt2.on('change', function () {
            watcher2ChangeTimes++;
        });

        howdo
            .task(function (next) {
                data.obj.data.a.b = 8;

                delay(next);
            })
            .task(function (next) {
                expect(watcher1ChangeTimes).toEqual(1);
                expect(watcher2ChangeTimes).toEqual(1);

                data._ = '....';
                data.$ = '....';
                data.f = function(){};
                delay(next);
            })
            .task(function (next) {
                expect(watcher1ChangeTimes).toEqual(1);
                expect(watcher2ChangeTimes).toEqual(1);

                data.obj.c = 9;
                delay(next);
            })
            // 新增一个对象
            .task(function (next) {
                expect(watcher1ChangeTimes).toEqual(2);
                expect(watcher2ChangeTimes).toEqual(1);

                data.obj.data.a = {
                    f: 10
                };
                delay(next);
            })
            // 重新刚才新增的对象
            .task(function (next) {
                expect(watcher1ChangeTimes).toEqual(3);
                expect(watcher2ChangeTimes).toEqual(2);

                data.obj.data.a.f = 11;
                delay(next);
            })
            // 覆盖对象为 null
            .task(function (next) {
                expect(watcher1ChangeTimes).toEqual(4);
                expect(watcher2ChangeTimes).toEqual(3);

                data.obj.data.a = null;
                delay(next);
            })
            .task(function (next) {
                expect(watcher1ChangeTimes).toEqual(5);
                expect(watcher2ChangeTimes).toEqual(4);

                wt2.destroy();
                data.obj.data.a = 12;
                delay(next);
            })
            .task(function (next) {
                expect(watcher1ChangeTimes).toEqual(6);
                expect(watcher2ChangeTimes).toEqual(4);

                data.arr.push({g: 13});
                delay(next);
            })
            .task(function (next) {
                expect(watcher1ChangeTimes).toEqual(7);

                data.arr.pop();
                delay(next);
            })
            .task(function (next) {
                expect(watcher1ChangeTimes).toEqual(8);

                delay(next);
            })
            .task(function (next) {
                var clData1 = wt1.data();
                var clData2 = wt2.data();

                console.log(clData1);
                console.log(clData2);
                delay(next);
            })
            .task(function (next) {
                data.arr.set(0, {x: 'x'});

                delay(next);
            })
            .task(function (next) {
                expect(data.arr[0].x).toEqual('x');
                expect(data.arr[0].a).toEqual(undefined);
                expect(watcher1ChangeTimes).toEqual(9);

                data.arr.remove(0);

                delay(next);
            })
            .task(function (next) {
                expect(data.arr[0].e).toEqual(4);
                expect(data.arr.length).toEqual(2);
                expect(watcher1ChangeTimes).toEqual(10);

                data.arr.sort();

                delay(next);
            })
            .task(function (next) {
                expect(data.arr.length).toEqual(2);
                expect(watcher1ChangeTimes).toEqual(11);

                delay(next);
            })
            .task(function (next) {
                wt1.destroy();

                data.arr.push({g: ',,,'});
                delay(next);
            })
            .task(function (next) {
                expect(watcher1ChangeTimes).toEqual(11);

                delay(next);
            })
            .follow(done);
    });
});
