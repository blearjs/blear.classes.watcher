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
        the[_terminalList] = [];
        options = the[_options] = object.assign({}, defaults, options);

        var keys = options.keys;

        if (keys && typeis.Array(keys)) {
            array.each(keys, function (index, key) {
                kernel.linking(data, key);
            });
        } else {
            kernel.linkStart(data);
        }
    },

    /**
     * 监视
     * @param expression {String|Function} 字符串表达式或函数表达式
     * @param listener {Function}
     * @param [options] {Object}
     * @param [options.imme] {Boolean} 是否立即反馈
     * @param [options.deep] {Boolean} 是否深度监视
     * @returns {undefined|unwatch}
     */
    watch: function (expression, listener, options) {
        var the = this;

        options = object.assign({}, the[_options], options);
        options.context = the[_data];
        options.receiver = listener;
        options.expression = expression;
        var terminal = new Terminal(options);
        the[_terminalList].push(terminal);

        /**
         * 取消监视
         */
        return function unwatch() {
            terminal.destroy();
            array.delete(the[_terminalList], terminal);
        };
    },

    /**
     * 销毁实例
     */
    destroy: function () {
        var the = this;

        // 1、断开所有终端
        array.each(the[_terminalList], function (index, terminal) {
            terminal.destroy();
        });
        the[_terminalList] = null;

        // 2、父类销毁
        Watcher.invoke('destroy', the);
    }
});
var sole = Watcher.sole;
var _data = sole();
var _options = sole();
var _terminalList = sole();


Watcher.Terminal = Terminal;
module.exports = Watcher;
