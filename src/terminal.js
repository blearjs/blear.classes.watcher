/**
 * Terminal
 * @author ydr.me
 * @created 2017-01-11 11:16
 */


'use strict';

var Class = require('blear.classes.class');
var array = require('blear.utils.array');
var object = require('blear.utils.object');
var typeis = require('blear.utils.typeis');

var defaults = {
    /**
     * 上下文
     * @type Object
     */
    context: null,

    /**
     * 表达式，可以是字符串或者函数
     * @type String|Function
     */
    expression: '',

    /**
     * 接收者
     */
    receiver: function (newVal, oldVal, signal) {
        //
    },

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
var Terminal = Class.extend({
    className: 'Terminal',
    constructor: function (options) {
        var the = this;

        options = the[_options] = object.assign({}, defaults, options);
        the[_wireList] = [];
        the[_expFn] = parseExp(options.expression);

        // 先主动调用一次，确定关联关系
        the.before();
        the.oldVal = the.newVal = the.get();
        the.after();

        if (options.imme) {
            options.receiver(the.newVal, the.oldVal, null);
        }
    },

    before: function () {
        Terminal[_target] = this;
    },

    get: function () {
        var the = this;

        return the[_expFn](the[_options].context);
    },

    after: function () {
        Terminal[_target] = null;

        var the = this;
        var newVal = the.newVal;

        if (typeof newVal === 'object') {
            the.oldVal = object.assign(typeis.Object(newVal) ? {} : [], newVal)
        } else {
            the.oldVal = newVal;
        }
    },

    /**
     * 与 wire 建立关系
     * @param wire
     */
    link: function (wire) {
        this[_wireList].push(wire);
    },

    /**
     * 由 wire 传过来的信号
     * @param signal
     */
    pipe: function (signal) {
        var the = this;
        var receiver = the[_options].receiver;

        if (!receiver) {
            return;
        }

        the.before();

        var newVal = the.newVal = the.get();

        if (newVal !== the.oldVal) {
            receiver(newVal, the.oldVal, signal);
            the.oldVal = newVal;
        }

        the.after();
    },

    /**
     * 销毁 terminal
     */
    destroy: function () {
        var the = this;

        array.each(the[_wireList], function (index, wire) {
            wire.unlink(the);
        });
        the[_receiver] = the[_wireList] = null;
    }
});
var sole = Terminal.sole;
var _options = sole();
var _wireList = sole();
var _receiver = sole();
var _expFn = sole();
var _target = sole();

Terminal[_target] = null;

Terminal.target = function () {
    return Terminal[_target];
};

module.exports = Terminal;


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

