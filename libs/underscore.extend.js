/**
 * 基于underscore的扩展
 * @module lib/underscoreExtend
 */
(function() {

    // 全局可能用到的变量
    var arr = [];
    var slice = arr.slice;
    /**
     * js的继承，默认为两个参数
     * @public
     * @name inherit
     * @param  {function} origin - 可选，要继承的类
     * @param  {object}   methods - 被创建类的成员，扩展的方法和属性
     * @return {KLASS}  klass - 继承之后的子类
     */
    _.inherit = function(origin, methods) {

        // 参数检测，该继承方法，只支持一个参数创建类，或者两个参数继承类
        if (arguments.length === 0 || arguments.length > 2) throw '参数错误';

        var parent = null;

        // 将参数转换为数组
        var properties = slice.call(arguments);

        // 如果第一个参数为类（function），那么就将之取出
        if (typeof properties[0] === 'function') parent = properties.shift();
        properties = properties[0];

        function klass() {
            if (_.isFunction(this.$initialize)) this.$initialize.apply(this, arguments);
        }

        klass.superclass = parent;

        if (parent) {
            // 中间过渡类，防止parent的构造函数被执行
            var subclass = function() {};
            subclass.prototype = parent.prototype;
            klass.prototype = new subclass();
        }

        var ancestor = klass.superclass && klass.superclass.prototype;
        for (var k in properties) {
            var value = properties[k];

            // 满足条件就重写
            if (ancestor && typeof value == 'function') {
                var argslist = /^\s*function\s*\(([^\(\)]*?)\)\s*?\{/i.exec(value.toString())[1].replace(/\s/g, '').split(',');
                // 只有在第一个参数为$super情况下才需要处理（是否具有重复方法需要用户自己决定）
                // 第一个参数为super 并且父类存在相同方法的情况下才会执行
                if (argslist[0] === '$super' && ancestor[k]) {
                    value = (function(methodName, fn) {
                        return function() {
                            var scope = this;
                            var args = [function() {
                                return ancestor[methodName].apply(scope, arguments);
                            }];
                            return fn.apply(this, args.concat(slice.call(arguments)));
                        };
                    })(k, value);
                }
            }

            // 此处对对象进行扩展，当前原型链已经存在该对象，便进行扩展
            if (_.isObject(klass.prototype[k]) && _.isObject(value) && (typeof klass.prototype[k] != 'function' && typeof value != 'fuction')) {
                // 原型链是共享的，这里处理逻辑要改
                var temp = {};
                _.extend(temp, klass.prototype[k]);
                _.extend(temp, value);
                klass.prototype[k] = temp;
            } else {
                klass.prototype[k] = value;
            }
        }

        // 静态属性继承
        // 兼容代码，非原型属性也需要进行继承
        for (key in parent) {
            if (parent.hasOwnProperty(key) && key !== 'prototype' && key !== 'superclass') klass[key] = parent[key];
        }

        if (!klass.prototype.$initialize) klass.prototype.$initialize = function() {};

        klass.prototype.constructor = klass;
        return klass;
    };

})();

//基础方法
(function() {
    /**
     * seajs.use的包装方法, 直接用seajs.use打包工具会异常
     * @method
     * @name seaUse
     * @param  {string} method - 要加载的模块名
     * @param  {function}   callback - 加载完成以后的回调方法
     * @return {undefined}  undefined - 没有返回值
     */
    _.seaUse = function (method, callback) {
        var m = 'use';
        seajs[m](method, callback);
    },
        _.removeHTMLTag = function(str) {
            if (!str) return;
            str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
            str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
            // str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
            str = str.replace(/ /ig, ''); //去掉
            return str;
        };

    // 获取url参数
    _.getUrlParam = function(url, key) {
        var loc = window.location;
        if (!url) url = loc.origin + loc.pathname + loc.search;

        var searchReg = /([^&=?]+)=([^&]+)/g;
        var urlReg = /\/+.*\?/;
        var arrayReg = /(.+)\[\]$/;
        var urlParams = {};
        var match, name, value, isArray;

        while (match = searchReg.exec(url)) {
            name = match[1];
            value = match[2];
            isArray = name.match(arrayReg);
            // 处理参数为url这种情况
            if (urlReg.test(value)) {
                urlParams[name] = url.substr(url.indexOf(value));
                break;
            } else {
                if (isArray) {
                    name = isArray[1];
                    urlParams[name] = urlParams[name] || [];
                    urlParams[name].push(value);
                } else {
                    urlParams[name] = value;
                }
            }
        }

        for (var k in urlParams) urlParams[k] = _.removeHTMLTag(decodeURIComponent(urlParams[k]));

        return key ? urlParams[key] : urlParams;
    };
    _.fjyGetByteLength = function (str) {
        var bytesCount = 0;
        for (var i = 0; i < str.length; i++) {
            if (/[^\x00-\x80]/g.test(str)) bytesCount += 2;
            else bytesCount++;
        }
        return bytesCount;
    };
    // 移除空对象
    _.removeObjEmpty = function(data) {
        var _data = {};
        for (var o in data) {
            var item = data[o];
            if (Object.prototype.toString.call(item) === "[object Object]") {
                _data[o] = _.removeObjEmpty(item)
            } else {
                if (item !== undefined && item !== 'undefined' && item !== null && item !== '') {
                    _data[o] = item;
                }
            }
        }
        return _data
    };
    _.isWeiXin = function() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    };
    _.isQQ = function () {
        var ua = navigator.userAgent;
        var REGEXP_IOS_QQ = /(iPad|iPhone|iPod).*? (IPad)?QQ\/([\d\.]+)/;
        var REGEXP_ANDROID_QQ = /\bV1_AND_SQI?_([\d\.]+)(.*? QQ\/([\d\.]+))?/;
        if(REGEXP_IOS_QQ.test(ua) || REGEXP_ANDROID_QQ.test(ua)) {
            return true;
        } else {
            return false;
        }
    };
    // 移除空白符
    _.removeAllSpace = function(str) {
        if (str) str = str.toString();
        else return '';
        return str.replace(/\s+/g, "");
    };

})();

//日期操作类
(function() {

    /**
     * @description 静态日期操作类，封装系列日期操作方法
     * @description 输入时候月份自动减一，输出时候自动加一
     * @return {object} 返回操作方法
     */
    _.dateUtil = {

        //根据一个日期获取所有信息
        getDetail: function(date) {
            if (!date) date = new Date();
            var d, now = new Date(),
                dateInfo = {},
                _diff;
            var weekDayArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

            if (_.isNumber(date)) {
                d = new Date();
                d.setTime(date);
                date = d;
            }

            //充值date对象，让其成为一天的起点时间
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            now = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            _diff = date.getTime() - now.getTime();

            if (_diff == 0) {
                dateInfo.day1 = '今天';
            } else if (_diff == 86400000) {
                dateInfo.day1 = '明天';
            } else if (_diff == 172800000) {
                dateInfo.day1 = '后天';
            }

            dateInfo.weekday = weekDayArr[date.getDay()];

            dateInfo.year = date.getFullYear();
            dateInfo.month = date.getMonth() + 1;
            dateInfo.day = date.getDate();

            return dateInfo;

        },
        /**
         * @description 添加n天，
         * @param {n} 天数
         * @param {date} 默认今天, 支持Date()/timestmap/Y-M-D/Y/M/D 等格式
         * @param {formatStr} 默认Y-M-D
         * @return {string} 返回处理后的时间对象, 包括时间戳/日期/详情信息
         */
        addDay: function (n, date, formatStr) {
            var d = date || new Date();
            formatStr = formatStr || 'Y-M-D';
            if (typeof d === 'string' || typeof d === 'number') {
                d = new Date(date);
            }
            var day = 1000 * 60 * 60 * 24 * n;
            var newDay = new Date(d.getTime() + day);
            return {
                date: newDay,
                info: this.getDetail(newDay),
                day: this.format(newDay, formatStr)
            }

        },
        /**
         * @description 数字操作，
         * @return {string} 返回处理后的数字
         */
        formatNum: function(n) {
            if (n < 10) return '0' + n;
            return n;
        },
        /**
         * @description 将字符串转换为日期，支持格式y-m-d ymd (y m r)以及标准的
         * @return {Date} 返回日期对象
         */
        parse: function(dateStr, formatStr) {
            if (typeof dateStr === 'undefined') return null;
            if (typeof formatStr === 'string') {
                var _d = new Date(formatStr);
                //首先取得顺序相关字符串
                var arrStr = formatStr.replace(/[^ymd]/g, '').split('');
                if (!arrStr && arrStr.length != 3) return null;

                var formatStr = formatStr.replace(/y|m|d/g,
                    function(k) {
                        switch (k) {
                            case 'y':
                                return '(\\d{4})';
                            case 'm':
                                ;
                            case 'd':
                                return '(\\d{1,2})';
                        }
                    });

                var reg = new RegExp(formatStr, 'g');
                var arr = reg.exec(dateStr)

                var dateObj = {};
                for (var i = 0,
                         len = arrStr.length; i < len; i++) {
                    dateObj[arrStr[i]] = arr[i + 1];
                }
                return new Date(dateObj['y'], dateObj['m'] - 1, dateObj['d']);
            }
            return null;
        },
        /**
         * @description将日期格式化为字符串
         * @return {string} 常用格式化字符串
         */
        format: function(date, format) {
            if (arguments.length < 2 && !date.getTime) {
                format = date;
                date = new Date();
            }
            typeof format != 'string' && (format = 'Y年M月D日 H时F分S秒');
            return format.replace(/Y|y|M|m|D|d|H|h|F|f|S|s/g,
                function(a) {
                    switch (a) {
                        case "y":
                            return (date.getFullYear() + "").slice(2);
                        case "Y":
                            return date.getFullYear();
                        case "m":
                            return date.getMonth() + 1;
                        case "M":
                            return _.dateUtil.formatNum(date.getMonth() + 1);
                        case "d":
                            return date.getDate();
                        case "D":
                            return _.dateUtil.formatNum(date.getDate());
                        case "h":
                            return date.getHours();
                        case "H":
                            return _.dateUtil.formatNum(date.getHours());
                        case "f":
                            return date.getMinutes();
                        case "F":
                            return _.dateUtil.formatNum(date.getMinutes());
                        case "s":
                            return date.getSeconds();
                        case "S":
                            return _.dateUtil.formatNum(date.getSeconds());
                    }
                });
        },
        // @description 是否为为日期对象，该方法可能有坑，使用需要慎重
        // @param year {num} 日期对象
        // @return {boolean} 返回值
        isDate: function(d) {
            if ((typeof d == 'object') && (d instanceof Date)) {
                return true;
            }
            return false;
        },
        // @description 是否为闰年
        // @param year {num} 可能是年份或者为一个date时间
        // @return {boolean} 返回值
        isLeapYear: function(year) {
            //传入为时间格式需要处理
            if (_.dateUtil.isDate(year)) {
                year = year.getFullYear();
            }
            if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
                return true;
            }
            return false;
        },

        // @description 获取一个月份的天数
        // @param year {num} 可能是年份或者为一个date时间
        // @param year {num} 月份
        // @return {num} 返回天数
        getDaysOfMonth: function(year, month) {
            //自动减一以便操作
            month--;
            if (_.dateUtil.isDate(year)) {
                month = year.getMonth(); //注意此处月份要加1，所以我们要减一
                year = year.getFullYear();
            }
            return [31, _.dateUtil.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
        },

        // @description 获取一个月份1号是星期几，注意此时的月份传入时需要自主减一
        // @param year {num} 可能是年份或者为一个date时间
        // @param year {num} 月份
        // @return {num} 当月一号为星期几0-6
        getBeginDayOfMouth: function(year, month) {
            //自动减一以便操作
            month--;
            if ((typeof year == 'object') && (year instanceof Date)) {
                month = year.getMonth();
                year = year.getFullYear();
            }
            var d = new Date(year, month, 1);
            return d.getDay();
        },

        //不同时区皆返回北京时间
        getBeijingDate: function(d) {
            var tmp, localTime, localOffset, beijiTime, utc;
            if (!_.isDate(d)) {
                tmp = d;
                d = new Date();
                d.setTime(tmp);
            }

            // 通过调用Data()对象的getTime()方法，即可显示1970年1月1日后到此时时间之间的毫秒数。
            localTime = d.getTime();
            // 当地时间偏移
            localOffset = d.getTimezoneOffset() * 60000;
            // 标准时间
            utc = localTime + localOffset;

            // 加上北京偏移量便是北京时区
            beijiTime = utc + 28800000;

            d.setTime(beijiTime);
            return d;
        },

        setBeijingDate: function(d) {
            var tmp, localTime, localOffset, beijiTime, utc;
            if (!_.isDate(d)) {
                tmp = d;
                d = new Date();
                d.setTime(tmp);
            }

            // 通过调用Data()对象的getTime()方法，即可显示1970年1月1日后到此时时间之间的毫秒数。
            localTime = d.getTime();
            // 当地时间偏移
            localOffset = d.getTimezoneOffset() * 60000;
            // 标准时间
            utc = localTime - localOffset;

            //加上北京偏移量便是北京时区
            beijiTime = utc - 28800000;

            d.setTime(beijiTime);
            return d;
        }

    };

})();

// Hybrid基本逻辑
(function() {
    window.Hybrid = window.Hybrid || {};

    var getHybridInfo = function() {
        var platform_version = {
            platform: 'web',
            version: ''
        };
        var na = navigator.userAgent;
        na = na.toLowerCase();

        var info = na.match(/tctravel\/\d\.\d\.\d/);

        if (info && info[0]) {
            info = info[0].split('/');
            if (info && info.length == 2) {
                platform_version.platform = info[0];
                platform_version.version = info[1];
            }
        } else if (_.isWeiXin()) {
            platform_version.platform = 'weixin';
            platform_version.version = '';
        } else if (_.isQQ()) {
            platform_version.platform = 'qq';
            platform_version.version = '';
        }

        //*debug* 调试模拟环境
        if (_.getUrlParam().__platform) {
            platform_version.platform = _.getUrlParam().__platform;
            platform_version.version = _.getUrlParam().__version;
        }

        return platform_version;
    };

    var requestHybrid = function(opts) {
        var method = opts.method;
        method = method.split('.');
        if (method.length !== 2) {
            throw 'method must be like "_tc_bridge_user.user_login" !';
        }
        var callbackName = 'HybridCallback_' + _.uniqueId();
        var jsonObj = {
            param: opts.param,
            CBPluginName: 'Hybrid',
            CBTagName: callbackName
        }
        var scope = opts.scope || this;
        window.Hybrid[callbackName] = function() {
            var args = [].slice.call(arguments);
            opts.callback && opts.callback.apply(scope, args);
        }
        try {
            window[method[0]][method[1]](jsonObj);
        } catch(e) {
            return false;
        }
        return true;
    }

    var hybridCallback = function(opts) {
        var platform = _.getHybridInfo().platform || 'weixin';
        var mapping = {
            'web': 'web_',
            'tctravel': 'tctravel_',
            'qq': 'qq_',
            'weixin': ''
        };
        var callbackName = mapping[platform] || '';
        // 如果没有定义渠道callback 则默认为普通callback
        var callback = opts[callbackName + 'callback'] || opts['callback'];
        if (typeof callback == 'function') callback();
    };
    // 获取cookie
    var getCookie = function(name) {
        var result = null;
        // 对cookie信息进行相应的处理，方便搜索
        var myCookie = "" + document.cookie + ";";
        var searchName = "" + name + "=";
        var startOfCookie = myCookie.indexOf(searchName);
        var endOfCookie;
        if (startOfCookie != -1) {
            startOfCookie += searchName.length;
            endOfCookie = myCookie.indexOf(";", startOfCookie);
            result = (myCookie.substring(startOfCookie, endOfCookie));
        }
        return result;
    }
    // cookie的过期时间， 单位为秒
    var setCookie = function (name, value, time) {
        var Days = 30;
        var exp = new Date();
        var time = time ? time * 1000 : Days*24*60*60*1000;
        exp.setTime(exp.getTime() + time);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    }
    _.getHybridInfo = getHybridInfo;
    _.hybridCallback = hybridCallback;
    _.requestHybrid = requestHybrid;
    _.getCookie = getCookie;
    _.setCookie = setCookie;

})();