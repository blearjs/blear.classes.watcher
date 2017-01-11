/**
 * 数据观察者
 * @author ydr.me
 * @created 2016-12-31 02:36
 * @updated 2017年01月07日15:27:12
 */


'use strict';

var Events = require('blear.classes.events');
var array = require('blear.utils.array');
var object = require('blear.utils.object');
var random = require('blear.utils.random');
var typeis = require('blear.utils.typeis');

var kernel = require('./kernel');
var Wire = require('./wire');

var defaults = {
    /**
     * 监听的键，默认监听所有
     */
    keys: null
};
var Watcher = Events.extend({
    className: 'Watcher',

    constructor: function (data, options) {
        var the = this;

        Watcher.parent(the);
        the.guid = random.guid();
        the[_wireList] = [];
        options = the[_options] = object.assign({}, defaults, options);

        var keys = options.keys;

        if (keys && typeis.Array(keys)) {
            array.each(keys, function (index, key) {
                kernel.linking(the, data, key);
            });
        } else {
            kernel.linkStart(the, data);
        }
    },

    watch: function (exp, listener) {


        return function unwatch () {

        };
    },

    /**
     * 与 wire 建立关系
     * @param wire
     * @private
     */
    _tie: function (wire) {
        this[_wireList].push(wire);
    },

    /**
     * 销毁实例
     */
    destroy: function () {
        var the = this;

        array.each(the[_wireList], function (index, wire) {
            wire.untie(the);
        });
        the[_wireList] = null;
        Watcher.invoke('destroy', the);
    }
});
var _options = Watcher.sole();
var _wireList = Watcher.sole();
var linkingTerminal = null;

// 当前连接的终端
object.define(Watcher, 'terminal', {
    get: function () {
        return linkingTerminal;
    },
    set: function (terminal) {
        if (terminal === null) {
            linkingTerminal = terminal;
            return;
        }

        if (terminal && isFunction(terminal.link) && isFunction(terminal.pipe)) {
            linkingTerminal = terminal;
            return;
        }

        if (typeof DEBUG !== 'undefined' && DEBUG) {
            throw new TypeError(
                '\n\n' +
                '当前 `watcher` 的 `terminal` 实现不正确：\n' +
                '- `terminal.link(wire)` 用来与 `wire` 进行信号传输关联。\n' +
                '- `terminal.pipe(signal)` 用来传递信号。\n' +
                '- `terminal` 调用 `wire.unlink(terminal)` 用来断开关联关系。\n' +
                '- 因此需要 `terminal` 自己来管理与多个 `wire` 之前的关系，如果有的话。\n'
            );
        }
    }
});

Wire.Watcher = Watcher;
module.exports = Watcher;

function isFunction(any) {
    return typeis.Function(any);
}

