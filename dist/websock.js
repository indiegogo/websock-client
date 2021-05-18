(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Websock"] = factory();
	else
		root["Websock"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Timer)
/* harmony export */ });
class Timer {
    constructor(callback, timerCalc) {
        this.timer = null;
        this.tries = 0;
        this.callback = callback;
        this.timerCalc = timerCalc;
    }
    reset() {
        this.tries = 0;
        clearTimeout(this.timer);
    }
    /**
     * Cancels any previous scheduleTimeout and schedules callback
     */
    scheduleTimeout() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.tries = this.tries + 1;
            this.callback();
        }, this.timerCalc(this.tries + 1));
    }
}


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BrowserActivity)
/* harmony export */ });
const logging = __webpack_require__(3);
var logger = logging("BrowserActivity");
const PressEvents = ['mousedown', 'keydown', 'touchstart'];
class BrowserActivity {
    constructor(timeout, windowChangeInterval) {
        this.timer = null;
        this.inactive = false;
        this.lastActivity = Date.now();
        this.stopped = false;
        this.handlingActivity = false;
        this.windowWatchTimer = null;
        this.timeout = timeout;
        this.windowChangeInterval = windowChangeInterval;
    }
    register(inactivityCallback, reactivateCallback) {
        if (typeof this.inactivityCallback !== 'undefined') {
            this.stopWatching();
        }
        this.inactivityCallback = inactivityCallback;
        this.reactivateCallback = reactivateCallback;
    }
    startWatching() {
        logger.debug("startWatching");
        this.stopped = false;
        PressEvents.forEach((activityEvent) => {
            document.addEventListener(activityEvent, (e) => { this.handlePressActivity(e); }, { once: true });
        });
        this.scheduleWindowWatcher();
        this.scheduleInactivityCallback();
    }
    stopWatching() {
        logger.debug("stopWatching");
        clearInterval(this.timer);
        clearInterval(this.windowWatchTimer);
        this.stopped = true;
    }
    //////////////////////////
    // Functions to handle user activity
    // Activity resets lastActivity so we don't shut the user down for another interval
    //////////////////////////
    // Press activity includes keydown, mousedown, and touchstart, fairly self-describing
    handlePressActivity(event) {
        logger.debug("handlePressActivity");
        if (this.stopped) {
            return;
        }
        ;
        document.addEventListener(event.type, (e) => { this.handlePressActivity(e); }, { once: true });
        if (this.handlingActivity) {
            return;
        }
        ; // Can't remove an event listener with a bound function, so here we are
        this.handlingActivity = true;
        if (this.inactive) {
            this.reactivate();
        }
        this.lastActivity = Date.now();
        setTimeout(() => { this.handlingActivity = false; }, 1000);
    }
    // Window activity includes any scrolling or resizing, handled by taking snapshots and comparing
    handleWindowActivity() {
        logger.debug("handleWindowActivity");
        if (this.stopped || this.handlingActivity) {
            return;
        }
        ;
        this.handlingActivity = true;
        if (this.inactive) {
            this.reactivate();
        }
        this.lastActivity = Date.now();
        this.takeWindowSnapshot();
        setTimeout(() => { this.handlingActivity = false; }, 1000);
    }
    reactivate() {
        logger.debug("reactivate");
        this.inactive = false;
        clearInterval(this.timer);
        clearInterval(this.windowWatchTimer);
        this.reactivateCallback();
    }
    //////////////////////////
    // Functions to handle inactivity
    //////////////////////////
    scheduleInactivityCallback() {
        logger.debug("scheduleInactivityCallback");
        clearInterval(this.timer);
        this.timer = setInterval(() => { this.checkIfInactive(); }, this.timeout);
    }
    checkIfInactive() {
        logger.debug("checkIfInactive");
        if (((Date.now() - this.lastActivity) > this.timeout) && !this.windowChanged()) {
            this.deactivate();
        }
    }
    deactivate() {
        this.inactive = true;
        this.inactivityCallback();
        clearInterval(this.timer);
    }
    //////////////////////////
    // Functions to handle changes to the window--scrolling or resizing
    //////////////////////////
    scheduleWindowWatcher() {
        logger.debug("scheduleWindowWatcher");
        this.takeWindowSnapshot();
        clearInterval(this.windowWatchTimer);
        this.windowWatchTimer = setInterval(() => { this.checkIfWindowChanged(); }, this.windowChangeInterval);
    }
    checkIfWindowChanged() {
        logger.debug("checkIfWindowChanged");
        if (this.windowChanged()) {
            this.handleWindowActivity();
        }
    }
    takeWindowSnapshot() {
        logger.debug("takeWindowSnapshot");
        this.lastScrollY = window.scrollY;
        this.lastScrollX = window.scrollX;
        this.lastHeight = window.outerHeight;
        this.lastWidth = window.outerWidth;
    }
    windowChanged() {
        return this.lastScrollY !== window.scrollY ||
            this.lastScrollX !== window.scrollX ||
            this.lastHeight !== window.outerHeight ||
            this.lastWidth !== window.outerWidth;
    }
}


/***/ }),
/* 3 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// ulog - the universal logger
// © 2021 by Stijn de Witt
// License: MIT
(module.exports = __webpack_require__(4)).use([
  __webpack_require__(21),
  __webpack_require__(30),
  __webpack_require__(33),
  __webpack_require__(49),
  __webpack_require__(51),
])


/***/ }),
/* 4 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

(module.exports = __webpack_require__(5)).use(
  __webpack_require__(9)
)

/***/ }),
/* 5 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ulog = __webpack_require__(6)
var grab = __webpack_require__(7)

var ext = ulog.ext

/**
 * `ulog.ext(logger) => logger`
 *
 * Called when a logger needs to be extended, either because it was newly
 * created, or because it's configuration or settings changed in some way.
 *
 * This method must ensure that a log method is available on the logger
 * for each level in `ulog.levels`.
 *
 * This override calls `ext` on all mods when a logger is extended and
 * enables calling ext on all loggers by passing no arguments.
 */
ulog.ext = function(logger) {
	if (logger) {
		ext(logger)
		grab(ulog, 'ext', []).map(function(ext){
			ext.call(ulog, logger)
		})
		grab(ulog, 'after', []).map(function(ext){
			ext.call(ulog, logger)
		})
		return logger
	} else {
		for (logger in ulog()) {
			ulog.ext(ulog(logger))
		}
	}
}

ulog.mods = []

/**
 * ### `ulog.use(mod: Object|Array<Object>): Number`
 *
 * Makes ulog use `mod`.
 *
 * The mod(s) is/are added to `ulog.mods`. This function checks whether `mod`
 * is already in use and only adds it if needed. Checks whether `mod` has a key
 * `use` containing mods `mod` depends on and adding those first, guaranteeing
 * the order in which mods are added. Returns the total number of mods added,
 * including transitive dependencies.
 *
 * @param mod A single mod object or an array of mod objects.
 * @returns The number of mods that were added
 *
 * E.g.:
 * ```
 * var mod = require('./mod')
 * var solo = {} // the simplest mod is just an empty object
 * var using = {
 *   // you can declare a dependency on other mods
 *   use: [
 *     mod
 *   ]
 * }
 *
 * ulog.add(solo)  // returns 1
 * ulog.add(solo)  // returns 0, because mods are only added once
 * ulog.add(using) // returns 2, because `using` depends on `mod`
 * ulog.add(mod)   // returns 0, because `mod` was already added by `using`
 * ```
 */
ulog.use = function(mod) {
	// handle mod being an array of mods
	if (Array.isArray(mod)) {
		return mod.reduce(function(r,mod){return r + ulog.use(mod)}, 0)
	}
	// // handle mod being a single mod
	var result = ulog.mods.indexOf(mod) === -1 ? 1 : 0
	if (result) {
		if (mod.use) {
			// use dependencies
			result += ulog.use(mod.use)
		}
		if (mod.extend) {
			for (var name in mod.extend) {
				ulog[name] = mod.extend[name]
			}
		}
		ulog.mods.push(mod)
		if (mod.init) {
			mod.init.call(ulog)
		}
	}
	return result
}

// ulog.grab = function(name){
// 	return ulog.mods.reduce(function(r,mod){
// 		for (var o in mod[name]) {
// 			r[o] = mod[name][o]
// 		}
// 		return r
// 	}, {})
// }

// var recorders = []
// for (var i=0,mod; mod=ulog.mods[i]; i++) {
// 	if (mod.record) recorders.push(mod.record)
// }


// ulog.enabled = ulog.get.bind(ulog, 'debug')
// ulog.enable = ulog.set.bind(ulog, 'debug')
// ulog.disable = ulog.set.bind(ulog, 'debug', undefined)

module.exports = ulog


/***/ }),
/* 6 */
/***/ ((module) => {

/**
 *  A  N  Y  L  O  G  G  E  R
 *  Get a logger. Any logger.
 *
 *  © 2020 by Stijn de Witt, some rights reserved
 *  Licensed under the MIT Open Source license
 *  https://opensource.org/licenses/MIT
 */

 // stores loggers keyed by name
var loggers = Object.create(null);

/**
 * anylogger([name] [, options]) => function logger([level='log'] [, ...args])
 *
 * The main `anylogger` function creates a new or returns an existing logger
 * with the given `name`. It maintains a registry of all created loggers,
 * which it returns when called without a name, or with an empty name.
 *
 * If anylogger needs to create a new logger, it invokes
 * [`anylogger.new`](#anyloggernew).
 *
 * @param name {String} The name of the logger to create
 * @param options {Object} An optional options object
 *
 * @returns A logger with the given `name` and `options`.
 */
var anylogger = function(name, options){
  // return the existing logger, or create a new one. if no name was given, return all loggers
  return name ? loggers[name] || (loggers[name] = anylogger.ext(anylogger.new(name, options))) : loggers
};

/**
 * `anylogger.levels`
 *
 * An object containing a mapping of level names to level values.
 *
 * To be compliant with the anylogger API, loggers should support at least
 * the log methods corresponding to the default levels, but they may define
 * additional levels and they may choose to use different numeric values
 * for all the levels.
 *
 * The guarantees the Anylogger API makes are:
 * - there is a logging method corresponding to each level listed in anylogger.levels
 * - the levels error, warn, info, log, debug and trace are always there
 * - each level corresponds to a numeric value
 *
 * Note that the Anylogger API explicitly does not guarantee that all levels
 * have distinct values or that the numeric values will follow any pattern
 * or have any specific order. For this reason it is best to think of levels
 * as separate log channels, possibly going to different output locations.
 *
 * You can replace or change this object to include levels corresponding with
 * those available in the framework you are writing an adapter for. Please
 * make sure to always include the default levels as well so all code can
 * rely on the 6 console methods `error`, `warn`, `info`, `log`, `debug` and
 * `trace` to always be there.
 */
anylogger.levels = { error: 1, warn: 2, info: 3, log: 4, debug: 5, trace: 6 };

/**
 * `anylogger.new(name, options)`
 *
 * Creates a new logger function that calls `anylogger.log` when invoked.
 *
 * @param name {String} The name of the logger to create
 * @param options {Object} An optional options object
 *
 * @returns A new logger function with the given `name`.
 */
anylogger.new = function(name, options) {
  var result = {};
  result[name] = function() {anylogger.log(name, [].slice.call(arguments));};
  // some old browsers dont'create the function.name property. polyfill it for those
  try {Object.defineProperty(result[name], 'name', {get:function(){return name}});} catch(e) {}
  return result[name]
};

/**
 * `anylogger.log(name, args)`
 *
 * The log function used by the logger created by `anylogger.new`.
 *
 * You can override this method to change invocation behavior.
 *
 * @param name {String} The name of the logger to use. Required. Not empty.
 * @param args {Array} The log arguments. Required. May be empty.
 *
 * If multiple arguments were given in `args` and the first argument is a
 * log level name from anylogger.levels, this method will remove that argument
 * and call the corresponding log method with the remaining arguments.
 * Otherwise it will call the `log` method with the arguments given.
 */
anylogger.log = function(name, args) {
  var level = args.length > 1 && anylogger.levels[args[0]] ? args.shift() : 'log';
  loggers[name][level].apply(loggers[name], args);
};

/**
 * `anylogger.ext(logger) => logger`
 *
 * Called when a logger needs to be extended, either because it was newly
 * created, or because it's configuration or settings changed in some way.
 *
 * This method must ensure that a log method is available on the logger for
 * each level in `anylogger.levels`.
 *
 * When overriding `anylogger.ext`, please ensure the function can safely
 * be called multiple times on the same object
 *
 * @param logger Function The logger to be (re-)extended
 *
 * @return The logger that was given, extended
 */
anylogger.ext = function(logger) {
  logger.enabledFor = function(){};
  for (var method in anylogger.levels) {logger[method] = function(){};}
  return logger
};

module.exports = anylogger;


/***/ }),
/* 7 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var merge = __webpack_require__(8)

module.exports = function(ulog, name, result) {
	ulog.mods.reduce(function(r,mod){
		if (Array.isArray(r) && (name in mod)) {
			r.push(mod[name])
		} else {
			merge(r, mod[name])
		}
		return r
	}, result)
	return result
}


/***/ }),
/* 8 */
/***/ ((module) => {

var merge = module.exports = function(result, obj) {
	for (var o in obj) {
		if ((typeof obj[o] == 'object') && (Object.getPrototypeOf(obj[o]) === Object.prototype)) {
			if (! (o in result)) result[o] = {}
			if ((typeof result[o] == 'object') && (Object.getPrototypeOf(obj[o]) === Object.prototype)) {
				merge(result[o], obj[o])
			} else {
				result[o] = obj[o]
			}
		} else {
			result[o] = obj[o]
		}
	}
}


/***/ }),
/* 9 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var grab = __webpack_require__(7)
// var args = require('./args')
// var env = require('./env')
var read = __webpack_require__(10)
var update = __webpack_require__(17)
var notify = __webpack_require__(18)
var watch = __webpack_require__(19)
var config = module.exports = {
  use: [
    __webpack_require__(20),
  ],

  settings: {
    config: {
      config: 'log_config'
    }
  },

  init: function(){
    this.get('config')
  },

  get: function(result, name) {
    if (! this.config) {
      config.update(this)
    }
    if (!result) {
      var settings = grab(this, 'settings', {})
      name = settings[name] && settings[name].config || name
      result = this.config[name]
    }
    return result
  },

  update: function(ulog) {
    ulog.config = ulog.config || {}
    var newCfg = read(ulog)
    var changed = update(ulog.config, newCfg)
    if (changed.length) notify(ulog, changed)
    watch(ulog)
  },

  set: function(name) {
    if (name === 'log_config') config.update(this)
  }
}


/***/ }),
/* 10 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


var configure = __webpack_require__(11)
var watched = __webpack_require__(15)

module.exports = function(ulog, callback) {
  var watches = watched(ulog)

  var cfg = {}
  for (var name in watches) {
    try {
      var value = localStorage.getItem(name)
      if (value) cfg[name] = value
    } catch(ignore){}
  }

  cfg = configure(watches, cfg)
  return callback ? callback(cfg) : cfg
}


/***/ }),
/* 11 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var merge = __webpack_require__(8)
var env = __webpack_require__(12)
var args = __webpack_require__(13)

module.exports = function(watched, data) {
  var cfg = {}
  merge(cfg, env)
  merge(cfg, args)
  data && merge(cfg, data)
  // var result = {}
  // for (var setting in watched) {
  //   if (setting in cfg) result[setting] = cfg[setting]
  // }
  return cfg
}


/***/ }),
/* 12 */
/***/ ((module) => {

module.exports = {}


/***/ }),
/* 13 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var parse = __webpack_require__(14)

module.exports = parse(typeof location == 'undefined' ? [] : location.search.replace(/^(\?|#|&)/, '').split('&'),
  /\+/g, ' ', decodeURIComponent
)


/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = function parse(data, regex, replacement, decode) {
  return data.reduce(function(result,value){
    value = value.replace(regex, replacement)
    var i = value.indexOf('=')
    if (i !== -1) {
      var n = value.substring(0, i).replace(/^\s+|\s+$/g, '')
      if (n) {
        var v = value.substring(i + 1).replace(/^\s+|\s+$/g, '')
        if (decode) v = decode(v)
        result[n] = v
      }
    }
    return result
  }, {})
}


/***/ }),
/* 15 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var grab = __webpack_require__(7)
var watches = __webpack_require__(16)

module.exports = function(ulog){
  var settings = grab(ulog, 'settings', {})
  var watchers = watches(ulog)
  var watched = {}
  watchers.forEach(function(watcher){
    for (var name in watcher) {
      watched[name] = watchers[name]
    }
  })
  for (var setting in settings) {
    var name = (settings[setting] && settings[setting].config) || setting
    watched[name] = settings[setting]
  }
  return watched
}


/***/ }),
/* 16 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var grab = __webpack_require__(7)

module.exports = function(ulog){
  return grab(ulog, 'watch', []).map(function(watch){
    var result = {}
    for (var key in watch) {
      key.split(',').forEach(function(name){
        result[name] = watch[key]
      })
    }
    return result
  })
}

/***/ }),
/* 17 */
/***/ ((module) => {

module.exports = function(cfg, newCfg) {
  var name, changes = []
  for (name in cfg) {
    if (! (name in newCfg)) {
      changes.push({ name: name, old: cfg[name] })
      delete cfg[name]
    }
  }
  for (name in newCfg) {
    if ((! (name in cfg)) || (cfg[name] !== newCfg[name])) {
      if (! (name in cfg)) {
        changes.push({ name: name, new: newCfg[name] })
      } else {
        changes.push({ name: name, old: cfg[name], new: newCfg[name] })
      }
      cfg[name] = newCfg[name]
    }
  }
  return changes
}


/***/ }),
/* 18 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var watches = __webpack_require__(16)

module.exports = function(ulog, changed) {
  ulog.ext()
  var watched = watches(ulog)

  changed.map(function(change){
    return { change: change, watches: watched.filter(function(watch){return typeof watch[change.name] == 'function'}) }
  })
  .filter(function(item){
    return item.watches.length
  })
  .forEach(function(item){
    item.watches.forEach(function(watch) {
      setTimeout(function(){
        watch[item.change.name].call(ulog, item.change)
      },0)
    })
  })
}


/***/ }),
/* 19 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var read = __webpack_require__(10)
var update = __webpack_require__(17)
var notify = __webpack_require__(18)

module.exports = function(ulog) {
  // storage events unfortunately only fire on events triggered by other windows...
  // so we need to poll here...
  setInterval(function(){
    if (ulog.config) {
      var cfg = read(ulog)
      setTimeout(function(){
        var changed = update(ulog.config, cfg)
        if (changed.length) setTimeout(function(){
          notify(ulog, changed)
        }, 0)
      }, 0)
    }
  }, 350)
}


/***/ }),
/* 20 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var grab = __webpack_require__(7)

module.exports = {
  extend: {
    settings: {},

   /**
     * `ulog.get(name?: String, ...args): String|Object`
     *
     * Get hook.
     *
     * This method can be used to read settings. When called, it
     * initializes the return value to the value for the setting with `name`
     * and then calls the `get` method on all registered mods, allowing them
     * to modify the result value. Then it returns that result.
     *
     * The first argument to `get` is expected to be the name of the setting
     * to get. Any other arguments are passed on to the `get` methods on
     * registered mods unchanged.
     */
    get: function() {
      var ulog = this
      var args = [].slice.call(arguments)
      var name = args[0]
      if (! name) return ulog.settings
      args.unshift(ulog.settings[name])
      var getters = grab(ulog, 'get', [])
      getters.map(function(get){
        args[0] = get.apply(ulog, args)
      })
      return args[0]
    },

    /**
     * `ulog.set(name, value)`
     *
     * Sets the setting named `name` to the given `value`.
     *
     * E.g. to set the log level for all loggers to 'warn':
     *
     * `ulog.set('log', 'warn')`
     *
     * The `value` may contain a literal value for the setting, or
     * it may contain a semicolon separated list of `expression=value` pairs,
     * where `expression` is a debug-style pattern and `value` is a literal value
     * for the setting. The literal value may not contain any semicolons, or must
     * escape them by preceding them with a backslash: `\;`.
     *
     * E.g. to set the log level for libA to ERROR, for libB to INFO and for
     * all other loggers to WARN:
     *
     * `ulog.set('log', 'libA=error; libB=info; *=warn')`
     *
     * Both forms may be combined:
     *
     * `ulog.set('log', 'warn; libA=error; libB=info')` // same as above
     *
     * The `expression=value` pairs are evaluated in the order they are listed,
     * the first `expression` to match decides which `value` is returned.
     *
     * The `expression` can be a list of patterns and contain wildcards
     * and negations:
     *
     * `ulog.set('log', 'info; lib*,-libC=error; libC=warn')`
     *
     * Because of the expression=value pairs being evaluated in order, the simplest
     * is generally to list specific rules first and general rules later:
     *
     * `ulog.set('log', 'libC=warn; lib*=error; info')` // equivalent to above
     */
    set: function(name, value) {
      var ulog = this
      var changed = ulog.settings[name] !== value
      ulog.settings[name] = value
      grab(ulog, 'set', []).map(function(set){
        set.call(ulog, name, value)
      })
      if (changed) ulog.ext()
    }
  }
}


/***/ }),
/* 21 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  use: [
    __webpack_require__(22),
  ],

  init: function() {
    this.enabled = this.get.bind(this, 'debug')
    this.enable = this.set.bind(this, 'debug')
    this.disable = this.set.bind(this, 'debug', '')
  }
}


/***/ }),
/* 22 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  use: [
    __webpack_require__(23),
  ],

  settings: {
    debug: {},
    level: {
      config: 'log',
      // level property
      prop: {
        // default value
        default: __webpack_require__(29),
        // level number from string
        fromStr: function(v) {
          return Number(v) === Number(v) ? Number(v) : v && this[v.toUpperCase()]
        },
        // level number to string
        toStr: function(v) {
          for (var x in this)
            if (this[x] === v) return x.toLowerCase()
          return v
        },
        // property getter extension, called when property on logger is read
        get: function(v, ulog){
          return Math.max(ulog.get('debug', this.name) && this.DEBUG || this.NONE, v)
        },
      },
    },
  },

  ext: function(logger) {
    logger.NONE = 0
    logger.ALL = 7
    for (var level in this.levels) {
      logger[level.toUpperCase()] = this.levels[level]
    }
    logger.enabledFor = function(level){
      return logger.level >= logger[level.toUpperCase()]
    }
  },
}


/***/ }),
/* 23 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var grab = __webpack_require__(7)
var console = __webpack_require__(24)
var noop = __webpack_require__(25)
var method = __webpack_require__(26)

/**
 * mod: channels
 *
 * Introduces the concept of log channels.
 *
 * A log channel is a path a log message may take that leads to an output.
 *
 * This mod enables multiple channels to be defined (by other mods) and offers
 * a hook for other mods to customize how the channel output is created.
 *
 * This mod adds two default channels named 'output' and 'drain'.
 */
module.exports = {
  use: [
    __webpack_require__(9),
    // require('../options'),
    __webpack_require__(27),
  ],

  // adds the channels 'output' and 'drain'
  channels: {
    output: {
      out: console,
    },
    drain: {
      out: noop,
    }
  },

  // enhance the given loggers with channels
  ext: function(logger) {
    var ulog = this
    var channels = grab(ulog, 'channels', {})
    var channelOutputs = grab(ulog, 'channelOutput', [])
    var recorders = grab(ulog, 'record', [])
    logger.channels = {}
    for (var channel in channels) {
      var ch = logger.channels[channel] = {
        name: channel,
        channels: channels,
        out: channels[channel].out || console,
        recorders: recorders,
        fns: {},
      }
      ch.out = channelOutputs.reduce(function(r, channelOutput){
        return channelOutput.call(ulog, logger, ch) || r
      }, ch.out);
      for (var level in ulog.levels) {
        var rec = ch.recorders.reduce(function(rec, record){
          record.call(ulog, logger, rec)
          return rec
        }, { channel: channel, level: level })
        ch.fns[level] = (function(ch,rec){
          return (typeof ch.out == 'function'
            ? function(){
              rec.message = [].slice.call(arguments)
              ch.out(rec)
            }
            : method(ch.out, rec)
          )
        })(ch,rec)
      }
    }
  },

  // after all ext hooks have run, assign the log methods to
  // the right channels based on logger.enabledFor
  after: function(logger) {
    for (var level in this.levels) {
      logger[level] = logger.channels[logger.enabledFor(level) ? 'output' : 'drain'].fns[level]
    }
  },

  record: function(logger, rec){
    rec.name = logger.name
    rec.logger = logger
    rec.ulog = this
  }
}


/***/ }),
/* 24 */
/***/ ((module) => {

module.exports = (typeof console != 'undefined') && console

/***/ }),
/* 25 */
/***/ ((module) => {

module.exports = {
  log: function(){}
}

/***/ }),
/* 26 */
/***/ ((module) => {

module.exports = function(out, rec) {
  return out[rec.level] || out.log || function(){}
}

/***/ }),
/* 27 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var grab = __webpack_require__(7)

/**
 * Mod: props
 *
 * Enables properties on loggers that are backed by options on ulog.
 *
 * This mod allows other mods to declare props that will be added on each created logger
 * and that are backed by options on ulog itself. A getter and setter will be created that
 * return the value of the option for that logger, or set (override) the value of that
 * option for that specific logger.
 *
 * When a prop is set directly on a logger, the logger will keep an in-memory setting that
 * overrides the option set on ulog itself. To clear a prop and have it use the global option
 * again, set `undefined` as the value for the prop.
 */
var props = module.exports = {
  use: [
    __webpack_require__(28),
  ],

  // // called when a logger needs to be enhanced
  ext: function(logger) {
    var settings = grab(this, 'settings', {})
    for (var name in settings) {
      if (settings[name].prop) {
        props.new.call(this, logger, name, settings[name].prop)
      }
    }
  },


  // contribute props to log records
  record: function(logger, rec) {
    var settings = grab(this, 'settings', {})
    for (var name in settings) {
      if (settings[name].prop) {
        rec['log_' + name] = this.get(name, logger.name)
      }
    }
  },

  /**
   * `new(logger, name, prop)`
   *
   * Creates an option named `name` on the given `logger`, using
   * the provided `prop` whenever applicable.
   *
   * @param {Function} logger The logger function
   * @param {String} name The name of the property to create
   * @param {Object} prop A prop object
   *
   * The `prop` object can have functions `fromStr` and `toStr` that
   * convert from and to String, and `get` and `set` that are called whenever
   * the property is read or written.
   *
   * @returns The given `logger`
   */
  new: function(logger, name, prop) {
    if (name in logger) return logger // already exist
    var ulog=this
    var value // private field
    return Object.defineProperty(logger, prop.name || name, {
      get: function(){
        var v = value !== undefined ? value : ulog.get(name, logger.name)
        v = v !== undefined ? v : prop.default
        v = prop.fromStr ? prop.fromStr.call(logger, v, ulog) : v
        v = prop.get ? prop.get.call(logger, v, ulog) : v
        return v
      },
      set: function(v){
        v = prop.toStr ? prop.toStr.call(logger, v, ulog) : v
        if (value !== v) {
          value = v
          ulog.ext(logger)
        }
        prop.set && prop.set.call(logger, v, ulog)
      }
    })
  }
}

/***/ }),
/* 28 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// options are smart settings....
var options = module.exports = {
  use: [
    __webpack_require__(20)
  ],

  /**
   * `options.get(result: String|Object, name?: String, loggerName?: String): String|Object`
   *
   * @param {String|Object} result The result found so far.
   * @param {String} name The name of the setting to get. Optional.
   * @param {String} loggerName The name of the logger to get the effective setting for. Optional.
   * @returns {String|Object} The (effective) setting for the given `name` and `loggerName`.
   *
   * if no `loggerName` is given, returns the `result` unchanged.
   *
   * If a `loggerName` is given, the effective setting value for that specific
   * logger name is returned.
   *
   * If empty string is given as `loggerName`, the effective global/default
   * setting value is returned.
   *
   * For example, given that the following settings are active:
   *
   * `{ level: 'info; libA=warn; libB=error', output: 'console' }`
   *
   * These following statements would be true:
   *
   * `JSON.stringify(ulog.get()) == '{"level":"info; libA=warn; libB=error","output":"console"}'`
   * `ulog.get('output') == 'console`
   * `ulog.get('level') == 'info; libA=warn; libB=error'`
   * `ulog.get('level', 'libA') == 'warn'`
   * `ulog.get('level', 'libB') == 'error'`
   * `ulog.get('level', 'libC') == 'info'`
   * `ulog.get('level', '') == 'info'`
   */
  get: function(result, name, loggerName) {
    return (loggerName === undefined) ? result : options.eval(options.parse(result, name), loggerName)
  },

  /**
   * `parse(value: string, name?: string) => Array<Object>`
   *
   * Parses the setting value string, returning an AST
   *
   * e.g `parse('warn; test=debug')` would yield:
   *
   * [{
   * 	incl: [test],
   * 	excl: [],
   * 	value: 'debug'
   * },{
   *   incl: [*],
   *   excl: [],
   *   value: 'warn'
   * }]`
   *
   * if `debugStyle` is truthy, the setting value string is parsed debug-style
   * and `impliedValue` is used as the value of the setting
   *
   * @param {String} value The setting value string.
   * @param {String} name The name of the setting. Optional.
   *
   * @returns {Array} The parsed setting value objects
   */
  parse: function(value, name) {
    var d = (name == 'debug') && name
    var settings = []
    var items = (value||'').trim().split(';').map(function(x){return x.replace('\\;', ';')})
    // parse `ulog` style settings, include support for `debug` style
    var implied = []
    for (var i=0,item,idx; item=items[i]; i++) {
      var x = ((idx = item.indexOf('=')) == -1)
          ? [item.trim()]
          : [item.substring(0,idx).trim(), item.substring(idx + 1).trim()]
      // ulog: expressions is first param or none if only a setting value is present (implied)
      // debug: expressions is always first and only param
      var expressions = x[1] || d ? x[0].split(/[\s,]+/) : []
      // ulog: setting value is second param, or first if only a value is present (implied)
      // debug: setting value is always implied
      var setting = { value: x[1] || (!d && x[0]) || d, incl: [], excl: [] }
      if (expressions.length) {
        settings.push(setting)
      }
      else {
        expressions.push('*')
        implied.push(setting)
      }
      // add the expressions to the incl/excl lists on the setting
      for (var j=0,s; s=expressions[j]; j++) {
        s = s.replace(/\*/g, '.*?')
        setting[s[0]=='-'?'excl':'incl'].push(new RegExp('^' + s.substr(s[0]=='-'?1:0) + '$'))
      }
    }
    // add implied settings last so they act as defaults
    settings.push.apply(settings, implied)
    return settings
  },

  /**
   * Evaluates the given AST for the given logger name.
   *
   * @param {Array} ast AST
   * @param {String} name Logger name
   *
   * @returns {String} The effective option value for the given logger name
   */
  eval: function(ast, name){
    for (var i=0,s,r; s=ast[i]; i++) {              // for all parts ('info; test=debug' has 2 parts)
      if (excl(s, name)) continue
      if (r = incl(s, name)) return r
    }

    function excl(s, name) {
      for (var j=0,br,excl; excl=s.excl[j]; j++)    // for all exclusion tests
        if (br = excl.test(name)) return br   // if logger matches exclude, return true
    }

    function incl(s, name) {
      for (var j=0,incl; incl=s.incl[j]; j++)  	    // for all inclusion tests
        if (incl.test(name)) return s.value   // if logger matches include, return result
    }
  },
}


/***/ }),
/* 29 */
/***/ ((module) => {

module.exports = 'warn'

/***/ }),
/* 30 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var parse = __webpack_require__(31)
var pipe = __webpack_require__(32)
var grab = __webpack_require__(7)
var console = __webpack_require__(24)
var method = __webpack_require__(26)
const noop = __webpack_require__(25)

/**
 * mod: outputs
 *
 * Makes the outputs of logger channels configurable via props
 */
module.exports = {
  use: [
    __webpack_require__(27),
    __webpack_require__(23),
  ],

  // adds a collection of outputs
  // an output is either an object with `log()`, `info()`, `warn()` etc methods,
  // or a kurly tag
  outputs: {
    console: console,
    noop: noop,
  },

  // adds 'output' and `drain` props to configure the output of these channels
  settings: {
    output: {
      config: 'log_output',
      prop: {
        default: 'console',
      },
    },
    drain: {
      config: 'log_drain',
      prop: {
        default: 'noop',
      },
    },
  },

  // override the channel output constructor to take logger props into account
  channelOutput: function(logger, ch){
    if (! (ch.cfg = logger[ch.name])) return
    ch.outputs = grab(this, 'outputs', {})
    var ast = parse(ch.cfg, { optional: true })
        .filter(function(node){return typeof node == 'object'})
    var outs = pipe(ast, ch.outputs)
        .map(function(node){return node.tag})
    return (
      outs.length === 0 ? 0 :
      (outs.length === 1) && (typeof outs[0] == 'object') ? outs[0] :
      function(rec) {
        for (var i=0,out; out=outs[i]; i++) {
          if (typeof out == 'function') out(rec)
          else method(out, rec).apply(out, rec.message)
        }
      }
    )
  },
}


/***/ }),
/* 31 */
/***/ ((module) => {

/**
 * Parses a string with template tags in it into an abstract syntax tree.
 *
 * @param {Object} options An optional options object
 * @param {String} str The string to parse, may be null or undefined
 *
 * @returns An array, possibly empty but never null or undefined.
 */
function parse(str, options) {
  if (process.env.NODE_ENV != 'production') {
    if (str && typeof str != 'string') throw new TypeError('`str` is not a string: ' + typeof str)
    if (options && (typeof options != 'object')) throw new TypeError('`options` is not an object: ' + typeof options)
    if (Array.isArray(options)) throw new TypeError('`options` is not an object: array')
  }

  var openTag = options && options.open || '{'
  var closeTag = options && options.close || '}'
  var opt = options && options.optional
  var regex = new RegExp('(' + openTag + (opt ? '?' : '') + ')([_a-zA-Z][_a-zA-Z0-9]*)([^_a-zA-Z0-9' + closeTag + '].*)?(' + closeTag + (opt ? '?' : '') + ')')
  var tag, result = []

  if (str || (str === '')) {
    while (tag = next(str, regex, openTag, closeTag)) {
      var before = str.substring(0, tag.index)
      if (before) result.push(before)
      tag.ast = !options || tag.open ? parse(tag.text, options) : tag.text ? [ tag.text ] : []
      str = str.substring(tag.end)
      result.push(tag)
    }
    if (str) result.push(str)
  }
  return result
}

/**
 * Finds the next tag in the given `str` and returns a record with the tag
 * name, the index where it starts in the string, the index where it ends
 * and the text contained in the body of the tag.
 *
 * @param {String} str The string to search in
 * @param {Object} options An optional options object
 *
 * @returns {Object} The tag info object, or `undefined` if no tags were found.
 */
function next(str, regex, openTag, closeTag) {
  var match = str.match(regex)
  if (!match) return

  var result = {
    index: match.index,
    open: match[1],
    name: match[2],
    sep: '',
    text: '',
    close: match[4]
  }

  // 'naked' tags, that have no open/close markers, are space terminated
  if (! result.open) {
    result.end = str.indexOf(' ', result.index)
    result.end = result.end === -1 ? str.length : result.end
    result.text = str.substring(match.index + result.name.length, result.end)
    return result
  }

  // tags that have open/close markers are parsed
  var esc = false
  var open = 1
  var start = match.index+result.name.length+result.open.length
  if (start == str.length) return

  for (var i=start; i<str.length; i++) {
    var token = str[i]
    if (esc) {
      token = (token == 'n') ? '\n' :
              (token == 't') ? '\t' :
              (token == openTag) ||
              (token == closeTag) ||
              (token == '\\') ? token :
              '\\' + token // unrecognized escape sequence is ignored
    }
    else {
      if (token === openTag) {
        open++
      }
      if (token === closeTag) {
        open--
        if (!open) {
          result.end = i + 1
          break
        }
      }
      if (token === '\\') {
        esc = true
        continue
      }
      if (!result.text && token.search(/\s/) === 0) {
        result.sep += token
        continue
      }
    }
    result.text += token
    esc = false
  }
  return result
}

parse.default = parse
module.exports = parse


/***/ }),
/* 32 */
/***/ ((module) => {

function pipe(ast, tags, rec) {
  if (process.env.NODE_ENV != 'production') {
    if ((ast === undefined) || (ast === null)) throw new Error('parameter `ast` is required')
    if (! Array.isArray(ast)) throw new Error('parameter `ast` must be an array')
    if ((tags === undefined) || (tags === null)) throw new Error('parameter `tags` is required')
    if (typeof tags != 'object') throw new Error('parameter `tags` must be an object: ' + typeof tags)
    if (Array.isArray(tags)) throw new Error('parameter `tags` must be an object: array')
    if (rec && (typeof rec != 'object')) throw new Error('parameter `rec` must be an object: ' + typeof rec)
    if (Array.isArray(rec)) throw new Error('parameter `rec` must be an object: array')
  }

  var result = ast.map(function(n){
    if (!n || !n.ast) return n
    var tag = tags[n.name] || tags['*']
    if (!tag) return n.open + n.name + n.sep + n.text + n.close
    var ctx = {}
    for (var prop in n) ctx[prop] = n[prop]
    ctx.ast = pipe(n.ast, tags, rec)
    if (typeof tag == 'function') {
      if (tag.length == 2) {
        // static tag
        if (rec && pipe.isStatic(ctx.ast)) {
          // in a static pipe
          ctx.tag = tag(ctx, rec)
          ctx.tag.toString = ctx.tag
        } else {
          // in a dynamic pipe
          ctx.tag = function(rec){
            return tag(ctx, rec)()
          }
        }
      } else {
        // dynamic tag
        ctx.tag = tag(ctx)
      }
    } else {
      ctx.tag = tag
    }
    return ctx
  })
  return result
}

pipe.isStatic = function(ast) {
  return ast.reduce(function(r,n){
    return r && ((typeof n == 'string') || (typeof n.tag != 'function') || (n.tag.toString === n.tag))
  }, true)
}

pipe.default = pipe
module.exports = pipe


/***/ }),
/* 33 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var parse = __webpack_require__(31)
var pipe = __webpack_require__(32)
var grab = __webpack_require__(7)
var console = __webpack_require__(24)
var makeStatic = __webpack_require__(34).makeStatic
var makeStaticPipe = __webpack_require__(34).makeStaticPipe
var applyFormatting = __webpack_require__(36)
var applyAlignment = __webpack_require__(37)

/**
 * mod - formats
 *
 * Makes log formatting configurable and extendable
 */
module.exports = {
  use: [
    __webpack_require__(23),
  ],

  settings: {
    format: {
      config: 'log_format',
      prop: {
        default: __webpack_require__(39),
      }
    },
  },

  formats: {
    // add a bunch of formats
    cr: function(ctx,rec){return function(){return '\r\n'}},
    date: __webpack_require__(40),
    lvl: __webpack_require__(43),
    message: __webpack_require__(44),
    name: __webpack_require__(45),
    perf: __webpack_require__(46),
    time: __webpack_require__(47),
    '*': __webpack_require__(48),
  },

  ext: function(logger) {
    var ulog = this
    for (var channel in logger.channels) {
      for (var level in ulog.levels) {
        logger.channels[channel].fns[level] = makePipe(ulog, logger, channel, level)
      }
    }

    function makePipe(ulog, logger, channel, level) {
      var formats = grab(ulog, 'formats', {})
      var ast = parse(logger.format, { optional: true })
      var rec = logger.channels[channel].recorders.reduce(function(rec, record){
        record.call(ulog, logger, rec)
        return rec
      }, { channel: channel, level: level })
      var line = pipe(ast, formats, rec)
      var ch = logger.channels[channel]
      var method = ch.fns[level]
      var output = ch.out

      if ((output === console) && pipe.isStatic(line)) {
        // derive the arguments to be bound from the pipeline
        var args = line
        .map(toTag)
        .filter(skip)
        .reduce(function(r,fmt){
          var msg = makeStatic(fmt)
          return applyFormatting(rec, fmt, msg, r)
        }, [''])
        // apply alignment if needed
        applyAlignment(rec, args)
        // bind the output and arguments to the log method
        // this uses a devious trick to apply formatting without
        // actually replacing the original method, and thus
        // without mangling the call stack
        return makeStaticPipe(output, method, rec, args)
      } else {
        return makeDynamicPipe(output, method, rec, line)
      }
  }

    function makeDynamicPipe(output, method, rec, line) {
     // set up a dynamic pipeline as a function
     var containsMessage = line.reduce(function(r,node){return r || (node && node.name === 'message')}, false)
     return (function(rec){return function() {
        // arguments to this function are the message
        rec.message = [].slice.call(arguments)
        // run through the pipeline, running all formatters
        var args = line
        .map(toTag)
        .filter(skip)
        .reduce(function(r,fmt){
          var msg = typeof fmt == 'function' ? fmt(rec) : fmt
          return applyFormatting(rec, fmt, msg, r)
        }, [''])
        if (! containsMessage) args.push.apply(args, rec.message)
        // apply alignment if needed
        applyAlignment(rec, args)
        // pass the formatted arguments on to the original output method
        method.apply(output, args)
      }})(rec)
    }

    function toTag(node) {return (
      !node || !node.tag ? node :
      node.tag
    )}

    function skip(tag){return (typeof tag != 'string') || tag.trim().length}
  },
}


/***/ }),
/* 34 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Detect V8 in browsers to compensate for a bug where toString is called twice
var bug = (typeof Intl != 'undefined') && Intl.v8BreakIterator
var firefox = __webpack_require__(35).firefox

module.exports.makeStatic = function(fmt){
  if (bug && (typeof fmt == 'function') && (fmt.toString === fmt)) {
    var skip = bug
    fmt.toString = function(){
      if (skip) return skip = ''
      skip = bug
      return fmt()
    }
  }
  return fmt
}

module.exports.makeStaticPipe = function(output, method, rec, args) {
  return method.bind.apply(method, [output].concat(firefox && (rec.level === 'trace') ? [] : args))
}


/***/ }),
/* 35 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var console = __webpack_require__(24)

module.exports = {
  // Detect firefox to compensate for it's lack of support for format specifiers on console.trace
  firefox: (typeof navigator != 'undefined') && /firefox/i.test(navigator.userAgent),

  hasColor: function(output){
    return (output === console) &&
        (navigator.userAgent.indexOf('MSIE') === -1) &&
        (navigator.userAgent.indexOf('Trident') === -1)
  },

  colorSpecifier: function(color){
    return '%c'
  },

  colorSpecifierAfter: function(color){
    return ''
  },

  colorArgument: function(color){
    return ['color:rgb(' + color.r + ',' + color.g + ',' + color.b + ')']
  },

  palette: (function() {
    var palette = []
    for (var r=0; r<8; r++) {
      for (var g=0; g<8; g++) {
        for (var b=0; b<8; b++) {
          if ((r + g + b > 8) && (r + g + b < 16)) // filter out darkest and lightest colors
          palette.push({r:24*r, g:24*g, b:24*b})
        }
      }
    }
    return palette
  })(),

  levels: {
    error: { r: 192, g:  64, b:   0 },
    warn:  { r: 180, g:  96, b:   0 },
    info:  { r:  64, g: 128, b:  16 },
    log:   { r:  64, g:  64, b:  64 },
    debug: { r:  96, g:  96, b:  96 },
    trace: { r: 112, g: 112, b: 112 },
  },
}


/***/ }),
/* 36 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var console = __webpack_require__(24)
var hasColor = __webpack_require__(35).hasColor
var colorSpecifier = __webpack_require__(35).colorSpecifier
var colorArgument = __webpack_require__(35).colorArgument
var colorSpecifierAfter = __webpack_require__(35).colorSpecifierAfter

module.exports = function(rec, fmt, msg, r){
  var out = rec.logger.channels[rec.channel].out
  if (out === console) {
    var colored = hasColor(out)
    var c = colored && rec.logger.colored && fmt.color
    c = c == 'level' ? rec.logger.colors.levels[rec.level] : c
    c = c == 'logger' ? rec.logger.color : c
    r[0] += (c && colorSpecifier(c)) || ''
    var len = Array.isArray(msg) ? msg.length : 1
    for (var i=0; i<len; i++) {
      var m = Array.isArray(msg) ? msg[i] : msg
      r[0] += fmt.specifier || (typeof m == 'object' ? '%O ' : '%s ')
    }
    r[0] += (c && colorSpecifierAfter(c)) || ''
    r.push.apply(r, (c && colorArgument(c)) || [])
  }
  r.push.apply(r, Array.isArray(msg) ? msg : [ msg ])
  return r
}


/***/ }),
/* 37 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var alignment = __webpack_require__(38)
var hasAlign = alignment.hasAlign

module.exports = function(rec, r){
  var a = hasAlign(rec.logger.channels[rec.channel].out) && rec.logger.align && alignment
  r[0] = ((a && a.specifier && a.specifier[rec.level]) || '') + r[0]
  r.splice.apply(r, [1, 0].concat((a && a.args && a.args[rec.level]) || []))
  return r
}


/***/ }),
/* 38 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

﻿var ZWSP = '​' // zero-width space
var firefox = __webpack_require__(35).firefox

module.exports = {
  // alignment depends on color format specifiers in the browser
  hasAlign: __webpack_require__(35).hasColor,

  specifier: {
    error: '%c%s%c%s',
    warn: '%c%s%c%s',
    info: '%c%s%c%s',
    log: '%c%s%c%s',
    debug: '%c%s%c%s',
    trace: '%c%s%c%s',
  },

  args: {
    error: ['padding-left:0px', ZWSP, 'padding-left:0px', ZWSP],
    warn:  ['padding-left:' + (firefox ? '12' :  '0') + 'px', ZWSP, 'padding-left:0px', ZWSP],
    info:  ['padding-left:' + (firefox ? '12' : '10') + 'px', ZWSP, 'padding-left:0px', ZWSP],
    log:   ['padding-left:' + (firefox ? '12' : '10') + 'px', ZWSP, 'padding-left:0px', ZWSP],
    debug: ['padding-left:' + (firefox ? '12' : '10') + 'px', ZWSP, 'padding-left:0px', ZWSP],
    trace: ['padding-left:0px', ZWSP, 'padding-left:0px', ZWSP],
  },
}


/***/ }),
/* 39 */
/***/ ((module) => {

module.exports = 'lvl name perf'

/***/ }),
/* 40 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var formatter = __webpack_require__(41)
var pad = __webpack_require__(42)

module.exports = function(ctx, rec){
  return formatter(ctx, rec, { color: 'logger' }, function() {
    var time = new Date()
    return time.getFullYear() + '/' +
        pad(time.getMonth().toString(), 2, '0', pad.LEFT) + '/' +
        pad(time.getDate().toString(), 2, '0', pad.LEFT)
  })
}

/***/ }),
/* 41 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var pad = __webpack_require__(42)

module.exports = function formatter(ctx, rec, props, fn) {
  if (! fn) {fn = props; props = rec; rec = undefined}
  var dir = props.dir === pad.LEFT ? pad.LEFT : pad.RIGHT, padding = props.padding || 0
  ctx.text && ctx.text.split(':').forEach(function(text){
    if (text[0] == '>') dir = pad.LEFT
    if (text[0] == '<') dir = pad.RIGHT
    text = (text[0] == '>') || (text[0] == '<') ? text.substring(1) : text
    if (Number(text) && (Number(text) === Number(text))) padding = Number(text)
  })
  var fmt = function(rec) {
    var result = fn(rec)
    if (Array.isArray(result) && (result.length == 1) && (typeof result[0] == 'string'))
    result = result[0]
    if (padding && (typeof result == 'string')) result = pad(result, padding, ' ', dir)
    return result
  }
  var result = rec ? function() {return fmt(rec)} : function(rec){return fmt(rec)}
  for (var prop in props) {
    result[prop] = props[prop]
  }
  return result
}


/***/ }),
/* 42 */
/***/ ((module) => {

var pad = module.exports = function(s, len, c, left){
  var s = s.substring(0, len)
  for (var i=len-s.length; i>0; i--)
    s = left ? (c || ' ') + s : s + (c || ' ')
  return s
}
pad.RIGHT = 0
pad.LEFT = 1


/***/ }),
/* 43 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var formatter = __webpack_require__(41)

module.exports = function(ctx, rec){
  return formatter(ctx, rec, { color: 'level' }, function(){
    return [' ', 'x', '!', 'i', '-', '>', '}'][rec.ulog.levels[rec.level]]
  })
}


/***/ }),
/* 44 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var formatter = __webpack_require__(41)

module.exports = function(ctx) {
  return formatter(ctx, { color: 'level' }, function(rec){
    return rec.message
  })
}


/***/ }),
/* 45 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var formatter = __webpack_require__(41)

module.exports = function(ctx, rec) {
  return formatter(ctx, rec, { color: 'logger', padding: 16 }, function(){
    return rec.logger.name
  })
}


/***/ }),
/* 46 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var formatter = __webpack_require__(41)

module.exports = function(ctx, rec) {
  return formatter(ctx, rec, { color: 'logger', padding: 6, dir: 1 }, function(){
    var time = new Date()
    rec.logger.lastCalled = rec.logger.lastCalled || time
    var ms = time.getTime() - rec.logger.lastCalled.getTime()
    rec.logger.lastCalled = time
    return (
      ms >= 36000000 ?  (ms/3600000).toFixed(1) + 'h' :
      ms >=   600000 ?    (ms/60000).toFixed(ms >= 6000000 ? 1 : 2) + 'm' :
      ms >=    10000 ?     (ms/1000).toFixed(ms >=  100000 ? 1 : 2) + 's' :
      // a one-ms diff is bound to occur at some point,
      // but it doesn't really mean anything as it's
      // basically just the next clock tick, so only
      // show values > 1
      ms >        1 ?                      ms + 'ms' :
      ''
    )
  })
}


/***/ }),
/* 47 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var formatter = __webpack_require__(41)
var pad = __webpack_require__(42)

module.exports = function(ctx, rec){
  return formatter(ctx, rec, { color: 'logger' }, function() {
    var time = new Date()
    return pad(time.getHours().toString(), 2, '0', pad.LEFT) + ':' +
        pad(time.getMinutes().toString(), 2, '0', pad.LEFT)
  })
}

/***/ }),
/* 48 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var formatter = __webpack_require__(41)

module.exports = function(ctx, rec) {
  return formatter(ctx, rec, { color: 'level' }, function() {
    return ctx.name in rec ? rec[ctx.name] : ctx.name + (ctx.text ? ctx.text : '')
  })
}

/***/ }),
/* 49 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var grab = __webpack_require__(7)
var palette = __webpack_require__(35).palette
var levels = __webpack_require__(35).levels
var boolean = __webpack_require__(50)

module.exports = {
  use: [
    __webpack_require__(27)
  ],

  colors: {
    palette: palette,
    levels: levels,
  },

  settings: {
    colored: {
      config: 'log_color',
      prop: boolean(),
    },
  },

  record: function(logger, rec) {
    if (logger.colored) {
      if (!logger.colors) {
        logger.colors = grab(this, 'colors', {})
        logger.colors.index = hash(logger.name) % logger.colors.palette.length
      }
      if (!logger.color) {
        logger.color = logger.colors.palette[logger.colors.index]
      }
    }
  }
}

function hash(s) {
  for (var i=0, h=0xdeadbeef; i<s.length; i++)
      h = imul(h ^ s.charCodeAt(i), 2654435761)
  return (h ^ h >>> 16) >>> 0
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul#Polyfill
function imul(a, b) {
  b |= 0
  var result = (a & 0x003fffff) * b;
  if (a & 0xffc00000 /*!== 0*/) result += (a & 0xffc00000) * b |0;
  return result |0;
}


/***/ }),
/* 50 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var merge = __webpack_require__(8)

module.exports = function(prop) {
  var result = {
    default: 'on',
    fromStr: function(v){return v=='on' || v=='yes' || v=='true' || v=='enabled'},
    toStr: function(v){return v ? 'on' : 'off'}
  }
  merge(result, prop)
  return result
}


/***/ }),
/* 51 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// var grab = require('../../core/grab')
// var palette = require('./utils').palette
// var levels = require('./utils').levels

var boolean = __webpack_require__(50)

module.exports = {
  use: [
    __webpack_require__(27),
  ],

  settings: {
    align: {
      config: 'log_align',
      prop: boolean()
    },
  },
}


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Websock)
/* harmony export */ });
/* harmony import */ var _timer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _browser_activity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);


const logging = __webpack_require__(3);
var logger = logging("Websock");
class Channel {
    constructor() {
        this.callbacks = [];
        this.keyedCallbacks = {};
    }
    addCallback(callback, key) {
        if (key) {
            this.addKeyedCallback(callback, key);
        }
        else {
            this.callbacks.push(callback);
        }
    }
    addKeyedCallback(callback, key) {
        if (typeof this.keyedCallbacks[key] === 'undefined') {
            this.keyedCallbacks[key] = [];
        }
        this.keyedCallbacks[key].push(callback);
    }
    handleMessage(message) {
        logger.debug("Channel handling message:");
        logger.debug(message);
        for (let callback_key in this.callbacks) {
            this.callbacks[callback_key](message);
        }
        for (let message_key in this.keyedCallbacks) {
            logger.debug("trying message_key: " + message_key);
            if (typeof message[message_key] !== 'undefined') {
                logger.debug("message has key");
                for (let callback_key in this.keyedCallbacks[message_key]) {
                    this.keyedCallbacks[message_key][callback_key](message);
                }
            }
        }
    }
}
class Websock {
    constructor(config) {
        this.initialConnection = true;
        this.channels = {};
        this.socket = null;
        this.reconnectTimer = new _timer__WEBPACK_IMPORTED_MODULE_0__.default(() => { this.connect(); }, this.reconnectAfterMs);
        this.closeWasClean = false;
        this.heartbeatMs = 50000;
        this.browseractivityTimeout = 180000;
        let port = '';
        if (config.port) {
            port = ':' + config.port;
        }
        this.connectionString = config.url + port + "/sock";
        if (config.heartbeatMs) {
            this.heartbeatMs = config.heartbeatMs;
        }
        if (config.browseractivityTimeout) {
            this.browseractivityTimeout = config.browseractivityTimeout;
        }
        this.browserActivity = new _browser_activity__WEBPACK_IMPORTED_MODULE_1__.default(this.browseractivityTimeout, 5000);
        this.browserActivity.register(() => { this.closeDueToInactivity(); }, () => { this.connect(); });
    }
    subscribe(channel_name, callback, key) {
        const response = { status: "success" };
        if (null === this.socket) {
            this.connect();
        }
        let preexisting_channel = this.channels[channel_name];
        if (preexisting_channel) {
            preexisting_channel.addCallback(callback, key);
            return response;
        }
        this.connectChannel(channel_name, this.socket);
        let channel = new Channel();
        channel.addCallback(callback, key);
        this.channels[channel_name] = channel;
        return response;
    }
    connect() {
        logger.debug("connecting...");
        this.closeWasClean = false;
        if (this.socket) {
            this.socket.close();
        }
        this.socket = new WebSocket(this.connectionString);
        this.socket.addEventListener("message", (event) => { this.handleIncoming(event); });
        this.socket.addEventListener("open", () => { this.handleConnectionOpen(); });
        this.socket.addEventListener("close", () => { this.handleConnectionClose(); });
    }
    handleIncoming(event) {
        logger.debug("handleIncoming event:");
        logger.debug(event);
        let push_event = JSON.parse(event.data);
        switch (push_event.type) {
            case 'USER':
                let channel = this.channels[push_event.channel];
                if (channel) {
                    channel.handleMessage(push_event.message);
                }
                break;
            case 'SYSTEM':
                // DEBUG subscription responses here
                break;
        }
    }
    handleConnectionOpen() {
        this.startHeartBeat();
        this.reconnectTimer.reset();
        this.resubscribeChannels();
        this.browserActivity.startWatching();
    }
    handleConnectionClose() {
        if (!this.closeWasClean) {
            logger.debug("unexpected connection close...");
            this.browserActivity.stopWatching();
            this.reconnectTimer.scheduleTimeout();
        }
        this.stopHeartBeat();
        this.initialConnection = false;
    }
    closeDueToInactivity() {
        logger.debug("closeDueToInactivity");
        if (this.socket.readyState === WebSocket.OPEN) {
            logger.debug("connection was open, closing");
            this.closeWasClean = true;
            this.socket.close(1000);
        }
    }
    connectChannel(channel_name, socket) {
        // If the connection is already open, we need to subscribe now as the open
        // event below may never fire.
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ subscribe: channel_name }));
        }
        // Regardless of current connection state, we need to ensure this channel
        // will subscribe/resubscribe whenever the socket opens at a later time.
        this.socket.addEventListener('open', () => {
            this.socket.send(JSON.stringify({ subscribe: channel_name }));
        });
    }
    resubscribeChannels() {
        if (this.initialConnection) {
            return;
        }
        for (let channel_name in this.channels) {
            this.socket.send(JSON.stringify({ subscribe: channel_name }));
        }
    }
    startHeartBeat() {
        clearInterval(this.hearbeatInterval);
        this.hearbeatInterval = setInterval(() => { this.pingHeartbeat(); }, this.heartbeatMs);
    }
    stopHeartBeat() {
        clearInterval(this.hearbeatInterval);
    }
    pingHeartbeat() {
        logger.debug("pingHeartbeat");
        this.socket.send(JSON.stringify({ heart: "beat" }));
    }
    reconnectAfterMs(tries) {
        return [50, 100, 200, 500, 1000, 2000, 5000][tries - 1] || 10000;
    }
}

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});