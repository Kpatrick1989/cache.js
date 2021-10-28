/*!
 * Cache.js v0.0.6
 * (c) 2021-10-28 Xinyu Peng
 */

; (function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            global.Cache = factory();
}(this, function () {
    'use strict';
    var config = {
        debug: false,
        storage: 'localStorage'
    };

    var owner = {};

    owner.debug = {
        enable: function () {
            config.debug = true;
        },
        disabled: function () {
            config.debug = false;
        },
        state: function () {
            return config.debug;
        }
    };

    owner.set = function () {
        if (!this.canIUse) return false;
        var param = arguments;
        try {
            switch (param.length) {
                case 2:
                    var res = queryRes(this.storage.getItem(toString(param[0])));

                    if (!res || typeof res !== 'object' || res.Expires == '') {
                        this.storage.setItem(toString(param[0]), toString({ Content: param[1], Expires: '' }));
                    } else {
                        this.storage.setItem(toString(param[0]), toString({ Content: param[1], Expires: res.Expires }));
                    }
                    res = JSON.parse(this.storage.getItem(toString(param[0])));
                    var exp = res.Expires == '' ? '' : new Date(res.Expires);
                    output('set', 'success', toString(param[0]) + ':' + toString(param[1]) + '  ' + exp);
                    break;
                case 3:
                    if (isObject(param[2]) && hasOwn(param[2], 'type') && hasOwn(param[2], 'delay')) {
                        this.storage.setItem(toString(param[0]), toString({
                            Content: param[1],
                            Expires: setExpires(param[2].type, param[2].delay, new Date())
                        }));
                        output('set', 'success', toString(param[0]) + ':' + toString(param[1]) + '  ' + setExpires(param[2].type, param[2].delay, new Date()));
                    } else {
                        console.error('%c cache:%cSET error %c过期时间设置格式必须是%c {"type":时间类型<String>,"delay":延迟时间<Number>} %c！', '', 'font-weight:bold', '', 'font-style: italic', '');
                    }
                    break;
                default:
                    console.error('%c cache:%cSET error %c参数应为%c (键<String>, 值<Any>, [过期时间<Obj>]) %c！', '', 'font-weight:bold', '', 'font-style: italic', '');
                    break;
            }
        } catch (error) {

        }
    };

    owner.get = function () {
        if (!this.canIUse) return false;
        var param = arguments;
        try {
            switch (param.length) {
                case 1:
                    var res = queryRes(this.storage.getItem(toString(param[0])));

                    if (!res) {
                        output('get', 'error', toString(param[0]) + ' 此 Key 不存在！');
                        return undefined;
                    }
                    if (typeof res === 'object') {
                        var exp = res.Expires == '' ? '' : new Date(res.Expires);
                        if (res.Expires !== '' && new Date(res.Expires) < new Date()) {
                            this.storage.removeItem(toString(param[0]));
                            output('get', 'success', toString(param[0]) + ' 过期已清除！');
                            return res.Content;
                        } else {
                            output('get', 'success', toString(param[0]) + ':' + toString(res.Content) + '  ' + exp);
                            return res.Content;
                        }
                    } else {
                        output('get', 'success', toString(param[0]) + ':' + toString(res));
                        return res;
                    }
                    break;
                default:
                    console.error('%c cache:%cGET error %c参数应为%c (键<String>) %c！', '', 'font-weight:bold', '', 'font-style: italic', '');
                    break;
            }
        } catch (error) {

        }
    };

    owner.remove = function () {
        if (!this.canIUse) return false;
        var param = arguments;
        var exp = '';
        try {
            var res = queryRes(this.storage.getItem(toString(param[0])));
            if (!res) {
                output('remove', 'error', toString(param[0]) + ' 此 Key 不存在！');
                return undefined;
            }
            if (typeof res === 'object') {
                exp = res.Expires == '' ? '' : new Date(res.Expires);
            }
            output('remove', 'success', toString(param[0]) + ':' + toString(res.Content) + '  ' + exp);
            this.storage.removeItem(toString(param[0]));
        } catch (error) {

        }
    };

    owner.clear = function () {
        if (!this.canIUse) return false;
        var param = arguments;
        var _this = this;
        try {
            if(param[0] == 'exp'){
                var keys = this.keys('exp');
                keys.forEach(function (v, k) {
                    _this.storage.removeItem(v);
                    output('clear', 'success', toString(keys));
                    return keys;
                });
            }else{
                this.storage.clear();
                output('clear', 'success', '清除所有数据成功！');
            }
        } catch (error) {

        }
    };

    owner.update = function () {
        if (!this.canIUse) return false;
        var param = arguments;
        try {
            var res = queryRes(this.storage.getItem(toString(param[0])));
            if (!res) {
                output('update', 'error', toString(param[0]) + ' 此 Key 不存在！');
                return undefined;
            }

            switch (param.length) {
                case 2:
                    if (isObject(param[1]) && hasOwn(param[1], 'type') && hasOwn(param[1], 'delay')) {
                        this.storage.setItem(toString(param[0]), toString({
                            Content: typeof res === 'object' && hasOwn(res, 'Content') ? res.Content : res,
                            Expires: setExpires(param[1].type, param[1].delay, new Date())
                        }));
                        output('update', 'success', toString(param[0]) + ':' + toString(this.storage.getItem(toString(param[0]))) + '  ' + setExpires(param[1].type, param[1].delay, new Date()));
                    } else {
                        console.error('%c cache:%cUPDATE error %c过期时间设置格式必须是%c {"type":时间类型<String>,"delay":延迟时间<Number>} %c！', '', 'font-weight:bold', '', 'font-style: italic', '');
                    }
                    break;
                case 3:
                    if (isObject(param[2]) && hasOwn(param[2], 'type') && hasOwn(param[2], 'delay')) {
                        this.storage.setItem(toString(param[0]), toString({
                            Content: param[1],
                            Expires: setExpires(param[2].type, param[2].delay, new Date())
                        }));
                        output('update', 'success', toString(param[0]) + ':' + toString(param[1]) + '  ' + setExpires(param[2].type, param[2].delay, new Date()));
                    } else {
                        console.error('%c cache:%cUPDATE error %c过期时间设置格式必须是%c {"type":时间类型<String>,"delay":延迟时间<Number>} %c！', '', 'font-weight:bold', '', 'font-style: italic', '');
                    }
                    break;
                default:
                    console.error('%c cache:%cUPDATE error %c参数应为%c (键<String>, [值<Any>], 过期时间<Obj>) %c！', '', 'font-weight:bold', '', 'font-style: italic', '');
                    break;
            }
        } catch (error) {

        }
    };

    owner.keys = function () {
        if (!this.canIUse) return false;
        var param = arguments;
        try {
            var keys = [];
            for (var k in this.storage) {
                if (k == 'length') break;
                if (param[0] == 'exp') {
                    var res = queryRes(this.storage.getItem(k));
                    if (isObject(res) && hasOwn(res, 'Expires')) {
                        if (res.Expires == '') continue;
                        if (new Date(res.Expires) >= new Date()) continue;
                    } else {
                        continue;
                    }
                }
                keys.push(k);
                output('keys', 'success', toString(keys));
            }
            return keys;
        } catch (error) {

        }
    };

    function setExpires(type, delay, date) {
        var _delay = toNumber(delay);
        switch (toString(type)) {
            case "y": {
                date.setFullYear(date.getFullYear() + _delay);
                break;
            }
            case "M": {
                date.setMonth(date.getMonth() + _delay);
                break;
            }
            case "w": {
                date.setDate(date.getDate() + _delay * 7);
                break;
            }
            case "d": {
                date.setDate(date.getDate() + _delay);
                break;
            }
            case "h": {
                date.setHours(date.getHours() + _delay);
                break;
            }
            case "m": {
                date.setMinutes(date.getMinutes() + _delay);
                break;
            }
            case "s": {
                date.setSeconds(date.getSeconds() + _delay);
                break;
            }
            default: {
                date.setDate(date.getDate() + _delay);
                break;
            }
        }
        return date;
    }

    function output(method, state, content) {
        if (config.debug) {
            switch (method) {
                case 'set':
                    console.log('%c cache:%cSET ' + state + ' %c' + content, 'color:green', 'color:green;font-weight:bold', '');
                    break;
                case 'get':
                    console.log('%c cache:%cGET ' + state + ' %c' + content, 'color:blue', 'color:blue;font-weight:bold', '');
                    break;
                case 'remove':
                    console.log('%c cache:%cREMOVE ' + state + ' %c' + content, 'color:#93135F', 'color:#93135F;font-weight:bold', '');
                    break;
                case 'clear':
                    console.log('%c cache:%cCLEAR ' + state + ' %c' + content, 'color:#56CB96', 'color:#56CB96;font-weight:bold', '');
                    break;
                case 'update':
                    console.log('%c cache:%cUPDATE ' + state + ' %c' + content, 'color:#199DCE', 'color:#199DCE;font-weight:bold', '');
                    break;
                case 'keys':
                    console.log('%c cache:%cKEYS ' + state + ' %c' + content, 'color:#D38DB3', 'color:#D38DB3;font-weight:bold', '');
            }
        }
    }

    var hasOwnProperty = Object.prototype.hasOwnProperty;

    function hasOwn(obj, key) {
        return hasOwnProperty.call(obj, key);
    }

    function isObject(obj) {
        return obj !== null && typeof obj === 'object';
    }

    function toNumber(val) {
        var n = parseFloat(val);
        return isNaN(n) ? val : n;
    }

    function toString(val) {
        return val == null ? '' :
            typeof val === 'object' ? JSON.stringify(val) :
                String(val);
    }

    function isJSON(str) {
        if (typeof str === 'string') {
            try {
                var obj = JSON.parse(str);
                return !!isObject(obj);
            } catch (error) {
                return false;
            }
        }
    }

    function queryRes(str) {
        if (isJSON(str)) {
            return JSON.parse(str);
        } else {
            return str;
        }
    }

    function canIUseFn(storage) {
        var supported = false;
        if (storage && storage.setItem) {
            supported = true;
            var key = '_' + Math.round(Math.random() * 1e7);
            try {
                storage.setItem(key, key);
                storage.removeItem(key);
            } catch (error) {
                supported = false;
            }
        }
        return supported;
    }

    function getStorage(storage) {
        try {
            var type = typeof storage;
            if (type === 'string' && window[storage] instanceof Storage) {
                return window[storage];
            }
            return storage;
        } catch (error) {

        }
    }

    function CacheAPI() {
        var param = arguments;
        switch (param.length) {
            case 0:
                break;
            case 1:
                if (param[0] == 'localStorage' || param[0] == 'sessionStorage') {
                    config.storage = param[0];
                } else {
                    console.warn('cache:%cWARN %c配置参数必须是"localStorage"或"sessionStorage"！', 'font-weight:bold', '');
                }
                break;
            default:
                console.warn('cache:%cWARN %c配置参数必须是字符串！', 'font-weight:bold', '');
                break;
        }

        var storage = getStorage(config.storage);
        var canIUse = canIUseFn(storage);

        this.canIUse = function () {
            return canIUse;
        };

        this.storage = storage;

    }

    CacheAPI.prototype = owner;

    return CacheAPI;

}));