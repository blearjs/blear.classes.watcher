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
var Terminal = require('./terminal');

var defaults = {
    /**
     * 监听的键，默认监听所有
     * @type null|Array
     */
    keys: null,

    /**
     * 是否立即反馈监听 immediately
     * @type Boolean
     */
    imme: false,

    /**
     * 是否深度监听 @todo
     * @type Boolean
     */
    deep: false
};
var Watcher = Events.extend({
    className: 'Watcher',

    constructor: function (data, options) {
        var the = this;

        Watcher.parent(the);
        the.guid = random.guid();
        the[_data] = data;
        the[_wireList] = [];
        the[_terminalList] = [];
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

    /**
     * 监视
     * @param exp {String|Function} 字符串表达式或函数表达式
     * @param listener {Function}
     * @param [options] {Object}
     * @param [options.imme] {Boolean} 是否立即反馈
     * @param [options.deep] {Boolean} 是否深度监视
     * @returns {undefined|unwatch}
     */
    watch: function (exp, listener, options) {
        var the = this;

        if (!typeis.Function(listener)) {
            return;
        }

        var expFn = parseExp(exp);
        var receiver = function (signal) {
            var newVal = expFn(the[_data]);

            if (newVal === oldVal) {
                return;
            }

            listener(newVal, oldVal, signal);
            oldVal = newVal;
        };
        var terminal = new Terminal(receiver);

        options = object.assign({}, the[_options], options);

        // 1、指向当前 terminal
        Watcher.terminal = terminal;

        // 2、取值
        var oldVal = expFn(the[_data]);

        // 3、取消指向
        Watcher.terminal = null;
        the[_terminalList].push(terminal);

        if (options.imme) {
            listener(oldVal);
        }

        /**
         * 取消监视
         */
        return function unwatch() {
            terminal.destroy();
            array.delete(the[_terminalList], terminal);
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

        // 1、断开所有节点
        array.each(the[_wireList], function (index, wire) {
            wire.untie(the);
        });
        the[_wireList] = null;

        // 2、断开所有终端
        array.each(the[_terminalList], function (index, terminal) {
            terminal.destroy();
        });
        the[_terminalList] = null;

        // 3、父类销毁
        Watcher.invoke('destroy', the);
    }
});
var sole = Watcher.sole;
var _data = sole();
var _options = sole();
var _wireList = sole();
var _terminalList = sole();
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

/**
 * 解析表达式
 * @param exp
 * @returns {Function}
 */
Watcher.parseExp = parseExp;


Terminal.Watcher = Watcher;
Wire.Watcher = Watcher;
module.exports = Watcher;

function isFunction(any) {
    return typeis.Function(any);
}

function parseExp(exp) {
    if (typeis.Function(exp)) {
        return function (context) {
            exp.call(context, context);
        };
    }

    var contextName = sole();
    var errorName = sole();
    var utilsName = sole();
    var body =
        'try{' +
        /****/'with(' + contextName + '){' +
        /****//****/'return (' + exp + ');' +
        /****/'}' +
        '}catch(' + errorName + '){}';

    var fn = new Function(contextName, utilsName, body);
    return function (context, utils) {
        return fn.call(context, context, utils)
    };
}
