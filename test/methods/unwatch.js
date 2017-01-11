/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-11 15:30
 */


'use strict';

var Watcher = require('../../src/index.js');
var plan = require('blear.utils.plan');

it('#watch + unwatch', function (done) {
    var data = {
        a: 1,
        b: 2
    };
    var watcher = new Watcher(data);
    var changeTimes = 0;
    var newValList = [];
    var unwatch;

    plan
        .taskSync(function () {
            unwatch = watcher.watch('a', function (newVal, oldVal, signal) {
                newValList.push(newVal);
                changeTimes++;
            });
            data.a += 1;
            data.b += 1;
        })
        .taskSync(function () {
            expect(changeTimes).toBe(1);
            unwatch();
            data.a += 1;
            data.b += 1;
            expect(changeTimes).toBe(1);
        })
        .serial(function (err) {
            watcher.destroy();
            expect(!!err).toBeFalsy();
            expect(newValList[0]).toBe(2);

            done();
        });
});

it('#watch + unwatch + imme: true', function (done) {
    var data = {
        a: 1,
        b: 2
    };
    var watcher = new Watcher(data);
    var changeTimes = 0;
    var newValList = [];
    var unwatch;

    plan
        .taskSync(function () {
            unwatch = watcher.watch('a', function (newVal, oldVal, signal) {
                newValList.push(newVal);
                changeTimes++;
            }, {
                imme: true
            });
            data.a += 1;
            data.b += 1;
        })
        .taskSync(function () {
            expect(changeTimes).toBe(2);
            unwatch();
            data.a += 1;
            data.b += 1;
            expect(changeTimes).toBe(2);
        })
        .serial(function (err) {
            watcher.destroy();
            expect(!!err).toBeFalsy();
            expect(newValList[0]).toBe(1);
            expect(newValList[1]).toBe(2);

            done();
        });
});

// it('#watch + deep: true');



