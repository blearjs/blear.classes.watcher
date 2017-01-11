/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-11 11:16
 */


'use strict';

var Class = require('blear.classes.class');
var typeis = require('blear.utils.typeis');
var array = require('blear.utils.array');

var Terminal = Class.extend({
    className: 'Terminal',
    constructor: function (receptiveness, receiver) {
        var the = this;

        the[_wireList] = [];
        the[_receptiveness] = the[_parseReceptiveness](receptiveness);
        the[_receiver] = receiver;
    },

    get: function (context) {
        return this[_receptiveness](context);
    },

    link: function (wire) {
        this[_wireList].push(wire);
    },

    pipe: function (signal) {
        var the = this;

        if (!the[_receiver]) {
            return;
        }

        the[_receiver](signal);
    },

    destroy: function () {
        var the = this;

        array.each(the[_wireList], function (index, wire) {
            wire.unlink(the);
        });
        the[_receiver] = the[_receptiveness] = the[_parseReceptiveness] = the[_wireList] = null;
    }
});
var sole = Terminal.sole;
var _wireList = sole();
var _receptiveness = sole();
var _receiver = sole();
var _parseReceptiveness = sole();
var pro = Terminal.prototype;

module.exports = Terminal;

/**
 * 解析接收方式
 * @returns {Function}
 */
pro[_parseReceptiveness] = function (receptiveness) {
    var the = this;

    if (typeis.Function(receptiveness)) {
        return function (context) {
            receptiveness.call(context, context);
        };
    }

    var contextName = sole();
    var errorName = sole();
    var body =
        'try{' +
        /****/'with(' + contextName + '){' +
        /****//****/'return (' + receptiveness + ');' +
        /****/'}' +
        '}catch(' + errorName + '){}';

    var fn = new Function(contextName, body);
    return function (context) {
        return fn.call(context, context)
    };
};

