/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

describe('事件', function () {
    require('./events/change');
});

describe('方法', function () {
    require('./methods/watch');
    require('./methods/unwatch');
});

describe('核心', function () {
    require('./kernel/object');
});
