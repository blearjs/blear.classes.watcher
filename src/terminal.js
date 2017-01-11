/**
 * Terminal
 * @author ydr.me
 * @created 2017-01-11 11:16
 */


'use strict';

var Class = require('blear.classes.class');
var array = require('blear.utils.array');

var Terminal = Class.extend({
    className: 'Terminal',
    constructor: function (receiver) {
        var the = this;

        the[_wireList] = [];
        the[_receiver] = receiver;
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

        if (!the[_receiver]) {
            return;
        }

        the[_receiver](signal);
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
var _wireList = sole();
var _receiver = sole();

module.exports = Terminal;
