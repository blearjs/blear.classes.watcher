/**
 * 导线
 * @author ydr.me
 * @created 2016-12-30 13:30
 * @updated 2017年01月07日15:10:21
 */


'use strict';

var Events = require('blear.classes.events');
var random = require('blear.utils.random');
var array = require('blear.utils.array');
var typeis = require('blear.utils.typeis');

var each = array.each;
var arrayDelete = array.delete;
var Wire = Events.extend({
    className: 'Wire',
    constructor: function (data, key) {
        var the = this;

        the[_data] = data;
        the[_key] = key;
        Wire.parent(the);
        the.guid = random.guid();
        the[_terminalList] = [];
        the[_watcherList] = [];
        the[_terminalMap] = {};
        the[_watcherMap] = {};
    },

    /**
     * 打结 watcher
     * @param watcher
     */
    tie: function (watcher) {
        var the = this;
        var map = the[_watcherMap];
        var guid = watcher.guid;

        if (!map[guid]) {
            watcher._tie(the);
            the[_watcherList].push(watcher);
            map[guid] = 1;
        }
    },

    /**
     * 解除 watcher
     * @param watcher
     */
    untie: function (watcher) {
        arrayDelete(this[_watcherList], watcher);
    },

    /**
     * 与响应者关联
     */
    link: function () {
        var the = this;
        // 获取当前视图链接的终端
        var terminal = Wire.Watcher.terminal;

        if (
            terminal &&
            // 用来接收变化
            isFunction(terminal.pipe) &&
            // 用来关联代理
            isFunction(terminal.link)
        ) {
            var guid = terminal.guid;
            var map = the[_terminalMap];
            var list = the[_terminalList];

            if (map[guid]) {
                return;
            }

            map[guid] = true;
            list.push(terminal);
            terminal.link(the);
        }
    },

    /**
     * 切断与某个终端的关联
     * @param terminal
     */
    unlink: function (terminal) {
        var the = this;

        arrayDelete(the[_terminalList], terminal);
    },

    /**
     * 传递变更信号
     * @param signal
     */
    pipe: function (signal) {
        var the = this;

        each(the[_watcherList].slice(), function (index, watcher) {
            watcher.emit('change', signal);
        });

        each(the[_terminalList].slice(), function (index, terminal) {
            // 如果已经被销毁的 terminal
            if (!terminal || !isFunction(terminal.pipe)) {
                return;
            }

            terminal.pipe.call(terminal, signal);
        });
    }
});
var _terminalList = Wire.sole();
var _terminalMap = Wire.sole();
var _watcherList = Wire.sole();
var _watcherMap = Wire.sole();
var _data = Wire.sole();
var _key = Wire.sole();

module.exports = Wire;

function isFunction(any) {
    return typeis.Function(any);
}
