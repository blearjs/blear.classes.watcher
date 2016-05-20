/**
 * classes/Watcher
 * @author ydr.me
 * @create 2016-05-03 17:26
 */



'use strict';

                 require('blear.polyfills.object');
var Events =     require('blear.classes.events');
var object =     require('blear.utils.object');
var array =      require('blear.utils.array');
var typeis =     require('blear.utils.typeis');
var collection = require('blear.utils.collection');
var access =     require('blear.utils.access');


var WATCHER_LIST = '_watcherList';
var gid = 0;
var OVERRIDE_ARRAY_PROTOS = ['pop', 'push', 'reverse', 'shift', 'sort', 'slice', 'unshift', 'splice'];
var IE8 = document.documentMode === 8;
var reSkipKey = /^[_$]/;
var defaults = {
    /**
     * 脏检查计时时间间隔
     * @type Number
     */
    interval: 1000
};
var Watcher = Events.extend({
    className: 'Watcher',
    constructor: function (data, options) {
        var the = this;

        the[_options] = object.assign({}, defaults, options);
        the[_id] = gid++;
        the[_data] = data;
        the[_callback] = data;
        the[_pushWatcherList](data);
        Watcher.parent(the);
        the.update();
    },


    /**
     * 获取纯净数据
     * @returns {*}
     */
    data: function () {
        return cleanData(this[_data]);
    },


    /**
     * 手动更新，触发监听
     * @returns {Watcher}
     */
    update: function () {
        var the = this;

        if (IE8) {
            /* istanbul ignore next */
            the[_loopCheck]();
        } else {
            the[_watchData](the[_data]);
        }

        return the;
    },


    /**
     * 销毁实例
     */
    destroy: function () {
        var the = this;

        the[_unwatchData](the[_data]);
        clearInterval(the[_loopTimer]);
    }
});
var _options = Watcher.sole();
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
var _loopTimer = Watcher.sole();
var _loopCheck = Watcher.sole();
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


/**
 * 添加 watcher
 * @param obj
 */
pro[_pushWatcherList] = function (obj) {
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
};


/**
 * 监听数据
 * @param data
 */
pro[_watchData] = function (data) {
    var the = this;

    if (typeis.Array(data)) {
        the[_pushWatcherList](data);
        the[_watchArray](data);
    } else if (typeis.Object(data)) {
        the[_pushWatcherList](data);
        the[_watchObject](data);
    }
};


/**
 * 销毁监听
 */
pro[_unwatchData] = function (data) {
    var the = this;

    if (typeis.Array(data)) {
        the[_unwatchArray](data);
    } else if (typeis.Object(data)) {
        the[_unwatchObject](data);
    }
};


/**
 * 监听对象
 * @param obj
 */
pro[_watchObject] = function (obj) {
    var the = this;

    object.each(obj, function (key, val) {
        if (reSkipKey.test(key) || typeis.Function(val)) {
            return;
        }

        the[_watchData](val);

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
                    the[_watchData](val);
                }

                if (oldVal !== newVal) {
                    the[_broadcast](key, newVal, oldVal, obj);
                }

                oldVal = newVal;
            }
        });
    });
};


/**
 * 取消监听对象
 * @param obj
 */
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


/**
 * 监听数组
 * @param arr
 */
pro[_watchArray] = function (arr) {
    var the = this;

    array.each(arr, function (index, val) {
        the[_watchData](val);
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
                var oldVal;
                var newVal;

                // ['pop', 'push', 'reverse', 'shift',
                // 'sort', 'unshift', 'splice']
                switch (proto) {
                    // 队尾删 1
                    case 'pop':
                    // 队尾追加 N
                    case 'push':
                    // 反转
                    case 'reverse':
                        oldVal = arr[oldLength - 1];
                        break;

                    // 队首减 1
                    case 'shift':
                    // 队首减 N
                    case 'unshift':
                    // 排序
                    case 'sort':
                        oldVal = 0;
                        break;

                    case 'splice':
                        key = args[0];
                        break;
                }

                newVal = original.apply(arr, args);
                array.each(arr, function (index, val) {
                    the[_watchData](val);
                });
                the[_broadcast](key, newVal, oldVal, arr);
                arr.size = arr.length;
            }
        });
    });
};


/**
 * 取消监听对象
 * @param arr
 */
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


/**
 * 广播
 */
pro[_broadcast] = function (key, newVal, oldVal, obj) {
    var watcherList = obj[WATCHER_LIST];
    var args = access.args(arguments);

    args.unshift('change');
    array.each(watcherList, function (index, watcher) {
        watcher.emit.apply(watcher, args);
    });
};


pro[_loopCheck] = function () {
    /* istanbul ignore next */
    var the = this;

    /* istanbul ignore next */
    if (typeof CLASSICAL !== 'undefined' && CLASSICAL === true) {
        var clone = function (obj) {
            if (null == obj || "object" != typeof obj) {
                return obj;
            }

            var copy = obj.constructor();

            collection.each(obj, function (key, val) {
                if (reSkipKey.test(key) || typeis.Function(val)) {
                    return;
                }

                copy[key] = clone(val);
            });

            return copy;
        };


        var getKeys = function (o) {
            var keys = [];

            object.each(o, function (key, val) {
                if (reSkipKey.test(key) || typeis.Function(val)) {
                    return;
                }

                keys.push(key);
            });

            return keys;
        };


        var diff = function diff(a, b) {
            var ret = null;

            var deep = function (a, b) {
                if (ret) {
                    return;
                }

                var deepObject = function (bKey) {
                    var aVal = a[bKey];
                    var bVal = b[bKey];

                    if (reSkipKey.test(bKey) || typeis.Function(aVal)) {
                        return;
                    }

                    var aType = typeis(aVal);
                    var bType = typeis(bVal);

                    if (aType !== bType) {
                        ret = [bKey, bVal, aVal, b];
                        return;
                    }

                    if (aType === 'object' || aType === 'array') {
                        deep(aVal, bVal);
                        return;
                    }

                    if (ret) {
                        return;
                    }

                    if (aVal !== bVal) {
                        ret = [bKey, bVal, aVal, b];
                    }
                };

                if (typeis.Object(a)) {
                    var aKeys = getKeys(a);
                    var bKeys = getKeys(b);

                    object.each(aKeys, function (index, aKey) {
                        deepObject(aKey);

                        if (ret) {
                            return false;
                        }
                    });

                    if (ret) {
                        return;
                    }

                    object.each(bKeys, function (index, bKey) {
                        deepObject(bKey);

                        if (ret) {
                            return false;
                        }
                    });
                } else if (typeis.Array(a)) {
                    var aLength = a.length;
                    var bLength = b.length;

                    if (aLength !== bLength) {
                        ret = [0];
                        return;
                    }

                    array.each(a, function (aIndex) {
                        deepObject(aIndex);

                        if (ret) {
                            return false;
                        }
                    });

                    if (ret) {
                        return;
                    }

                    array.each(b, function (bIndex) {
                        deepObject(bIndex);

                        if (ret) {
                            return false;
                        }
                    });
                }
            };

            deep(a, b);

            return ret;
        };

        var cloneData = clone(the[_data]);
        the[_loopTimer] = setInterval(function () {
            var ret = diff(cloneData, the[_data]);

            if (!ret) {
                return;
            }

            ret.unshift('change');
            the.emit.apply(the, ret);
            cloneData = clone(the[_data]);
        }, the[_options].interval);
    }
};


Watcher.defaults = defaults;
module.exports = Watcher;
