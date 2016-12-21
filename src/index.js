/**
 * classes/Watcher
 * @author ydr.me
 * @create 2016-05-03 17:26
 */



'use strict';

var Events = require('blear.classes.events');
var object = require('blear.utils.object');
var array = require('blear.utils.array');
var typeis = require('blear.utils.typeis');
var collection = require('blear.utils.collection');
var access = require('blear.utils.access');
var date = require('blear.utils.date');


var gid = 0;
var OVERRIDE_ARRAY_PROTOS = ['pop', 'push', 'reverse', 'shift', 'sort', 'slice', 'unshift', 'splice'];
var reSkipKey = /^[_$]/;
var defaults = {
    /**
     * 防反跳超时时间，为了防止数据监听过于频繁，从源头控制，默认为 0，即不控制
     * @type Number
     */
    debounceTimeout: 0
};
var Watcher = Events.extend({
    className: 'Watcher',
    constructor: function (data, options) {
        var the = this;

        the[_options] = object.assign({}, defaults, options);
        the[_id] = gid++;
        the[_data] = data;
        the[_callback] = data;
        the[_watchList] = [];
        Watcher.parent(the);
        the[_lastChangeTime] = 0;
        the.update();
    },


    /**
     * 取值
     * @param {String|Array} path
     * @returns {*}
     */
    get: function (path) {
        return object.value(this[_data], path);
    },


    /**
     * 手动更新，触发监听
     * @returns {Watcher}
     */
    update: function () {
        var the = this;

        the[_watchData](the[_data], [ROOT_PATH]);

        return the;
    },


    /**
     * 根据路径监听数据变化
     * @param {String|Array} path 路径
     * @param {Function} listener 回调
     * @returns {Watcher}
     */
    watch: function (path, listener) {
        var the = this;
        the[_watchList].push([path, listener]);
        return the;
    },

    /**
     * 取消根据路径监听数据变化
     * @param {String|Array} [path] 路径
     * @param {Function} [listener] 回调
     * @returns {Watcher}
     */
    unwatch: function (path, listener) {
        var the = this;
        var args = access.args(arguments);

        switch (args.length) {
            case 0:
                the[_unWatchAll]();
                break;

            case 1:
                the[_unWatchPath](path);
                break;

            case 2:
                the[_unWatchOne](path, listener);
                break;
        }

        return the;
    },


    /**
     * 销毁实例
     */
    destroy: function () {
        var the = this;

        the[_unwatchData](the[_data]);
        the[_watchList] = [];
        Watcher.invoke('destroy', the);
    }
});
var _options = Watcher.sole();
var _lastChangeTime = Watcher.sole();
var _data = Watcher.sole();
var _callback = Watcher.sole();
var _pushWatcherList = Watcher.sole();
var _watchData = Watcher.sole();
var _unwatchData = Watcher.sole();
var _watchObject = Watcher.sole();
var _unwatchObject = Watcher.sole();
var _watchArray = Watcher.sole();
var _unwatchArray = Watcher.sole();
var _broadcast = Watcher.sole();
var _id = Watcher.sole();
var _watchList = Watcher.sole();
var _joinPathList = Watcher.sole();
var _isSamePathList = Watcher.sole();
var _unWatchAll = Watcher.sole();
var _unWatchPath = Watcher.sole();
var _unWatchOne = Watcher.sole();
var WATCHER_LIST = Watcher.sole();
var PATH_LIST = Watcher.sole();
var ROOT_PATH = '#';
var pro = Watcher.prototype;


/**
 * 清洁数据
 * @param obj
 * @returns {*}
 */
var cleanData = function (obj) {
    var data2 = typeis.Array(obj) ? [] : {};
    collection.each(obj, function (key, val) {
        if (reSkipKey.test(key)) {
            return;
        }

        if (typeis.Object(val)) {
            data2[key] = cleanData(val);
        } else if (typeis.Array(val)) {
            data2[key] = cleanData(val);
        } else if (!typeis.Function(val)) {
            data2[key] = val;
        }
    });
    return data2;
};

// 添加 watcher
pro[_pushWatcherList] = function (obj, pathList) {
    var the = this;

    // 多个 watcher
    if (obj[WATCHER_LIST]) {
        if (obj[WATCHER_LIST].indexOf(the) === -1) {
            obj[WATCHER_LIST].push(the);
        }
        return;
    }

    // 监听的实例列表
    var list = [].concat(the[_data][WATCHER_LIST] || [the]);
    object.define(obj, WATCHER_LIST, {
        value: list
    });
    object.define(obj, PATH_LIST, {
        value: pathList
    });
};

// 监听数据
pro[_watchData] = function (data, pathList) {
    var the = this;

    if (typeis.Array(data)) {
        the[_pushWatcherList](data, pathList);
        the[_watchArray](data, pathList);
    } else if (typeis.Object(data)) {
        the[_pushWatcherList](data, pathList);
        the[_watchObject](data, pathList);
    }
};

// 销毁监听
pro[_unwatchData] = function (data) {
    var the = this;

    if (typeis.Array(data)) {
        the[_unwatchArray](data);
    } else if (typeis.Object(data)) {
        the[_unwatchObject](data);
    }
};

// 监听对象
pro[_watchObject] = function (obj, pathList) {
    var the = this;

    object.each(obj, function (key, val) {
        if (reSkipKey.test(key) || typeis.Function(val)) {
            return;
        }

        the[_watchData](val, the[_joinPathList](pathList, key));

        var oldVal = val;

        object.define(obj, key, {
            enumerable: true,
            get: function () {
                return val;
            },
            set: function (newVal) {
                val = newVal;

                // 新添加的数据，再一次递归监听
                if ((typeis.Array(val) || typeis.Object(val)) && !val[WATCHER_LIST]) {
                    the[_watchData](val, the[_joinPathList](pathList, key));
                }

                if (oldVal !== newVal) {
                    the[_broadcast](key, obj, newVal, oldVal, 'set');
                }

                oldVal = newVal;
            }
        });
    });
};


// 取消监听对象
pro[_unwatchObject] = function (obj) {
    var the = this;

    if (obj[WATCHER_LIST] && obj[WATCHER_LIST].length) {
        obj[WATCHER_LIST] = array.filter(obj[WATCHER_LIST], function (watcher) {
            return watcher !== the;
        });
    }

    object.each(obj, function (key, val) {
        if (reSkipKey.test(key) || typeis.Function(val)) {
            return;
        }

        the[_unwatchData](val);
    });
};

// 监听数组
pro[_watchArray] = function (arr, pathList) {
    var the = this;

    array.each(arr, function (index, val) {
        the[_watchData](val, the[_joinPathList](pathList, index));
    });

    object.define(arr, 'size', {
        value: arr.length
    });

    object.define(arr, 'set', {
        value: function (index, val) {
            arr.splice(index, 1, val);
        }
    });

    object.define(arr, 'remove', {
        value: function (index) {
            arr.splice(index, 1);
        }
    });

    array.each(OVERRIDE_ARRAY_PROTOS, function (index, proto) {
        var original = Array.prototype[proto];

        object.define(arr, proto, {
            value: function () {
                var args = access.args(arguments);
                var oldLength = arr.length;
                var key = oldLength - 1;
                var oldVal = [].concat(arr);
                var newVal;

                newVal = original.apply(arr, args);
                array.each(arr, function (index, val) {
                    the[_watchData](val, the[_joinPathList](pathList, index));
                });
                the[_broadcast](key, arr, newVal, oldVal, proto);
                arr.size = arr.length;
            }
        });
    });
};


// 取消监听对象
pro[_unwatchArray] = function (arr) {
    var the = this;

    if (arr[WATCHER_LIST] && arr[WATCHER_LIST].length) {
        arr[WATCHER_LIST] = array.filter(arr[WATCHER_LIST], function (watcher) {
            return watcher !== the;
        });
    }

    object.each(arr, function (key, val) {
        if (reSkipKey.test(key) || typeis.Function(val)) {
            return;
        }

        the[_unwatchData](val);
    });
};


// 广播
pro[_broadcast] = function (key, parent, newVal, oldVal, operation) {
    var the = this;
    var debounceTimeout = the[_options].debounceTimeout;
    var now = date.now();

    // 配置了 && 时间跨度小于限制时间
    if (debounceTimeout > 0 && now - the[_lastChangeTime] < debounceTimeout) {
        return;
    }

    the[_lastChangeTime] = now;

    var watchList = the[_watchList];
    var watcherList = parent[WATCHER_LIST];
    var watchArgs = access.args(arguments).slice(2);
    var watcherArgs = access.args(arguments).slice(2);
    var changePath = the[_joinPathList](parent[PATH_LIST], key);

    watcherArgs.unshift('change');
    watcherArgs.push(changePath);
    watchArgs.push(changePath);
    array.each(watcherList, function (index, watcher) {
        // args: key, newVal, oldVal, parent, operation, changePath
        watcher.emit.apply(watcher, watcherArgs);
    });

    array.each(watchList, function (index, watch) {
        var listenPath = watch[0];
        var listener = watch[1];
        var isSamePath = the[_isSamePathList](listenPath, changePath, true);

        if (isSamePath) {
            listener.apply(the, watchArgs);
        }
    });
};


// 合并路径
pro[_joinPathList] = function (pathList, path) {
    var newPathList = [].concat(pathList);
    newPathList.push(path + '');
    return newPathList;
};


pro[_isSamePathList] = function (pathList1, pathList2, hasRoot) {
    var isSamePath = true;

    pathList1 = object.parsePath(pathList1);
    pathList2 = object.parsePath(pathList2);

    array.each(pathList1, function (index, path) {
        if (path !== pathList2[index + (hasRoot ? 1 : 0)]) {
            isSamePath = false;
            return false;
        }
    });

    return isSamePath;
};


pro[_unWatchAll] = function () {
    this[_watchList] = [];
};

pro[_unWatchPath] = function (pathList1) {
    var the = this;

    the[_watchList] = array.filter(the[_watchList], function (arr) {
        return !the[_isSamePathList](pathList1, arr[0]);
    });
};

pro[_unWatchOne] = function (pathList1, listener) {
    var the = this;

    the[_watchList] = array.filter(the[_watchList], function (arr) {
        return !the[_isSamePathList](pathList1, arr[0]) || listener !== arr[1];
    });
};

Watcher.defaults = defaults;
module.exports = Watcher;
