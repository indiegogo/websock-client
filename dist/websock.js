(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("typescript-logging"));
	else if(typeof define === 'function' && define.amd)
		define(["typescript-logging"], factory);
	else if(typeof exports === 'object')
		exports["Websock"] = factory(require("typescript-logging"));
	else
		root["Websock"] = factory(root["typescript-logging"]);
})(self, function(__WEBPACK_EXTERNAL_MODULE__4__) {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BrowserActivity)
/* harmony export */ });
/* harmony import */ var _logger_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);

var logger = new _logger_ts__WEBPACK_IMPORTED_MODULE_0__.default("BrowserActivity");
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "TSLogger": () => (/* binding */ TSLogger)
/* harmony export */ });
/* harmony import */ var typescript_logging__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var typescript_logging__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(typescript_logging__WEBPACK_IMPORTED_MODULE_0__);

typescript_logging__WEBPACK_IMPORTED_MODULE_0__.CategoryServiceFactory.setDefaultConfiguration(new typescript_logging__WEBPACK_IMPORTED_MODULE_0__.CategoryConfiguration(typescript_logging__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Info));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (typescript_logging__WEBPACK_IMPORTED_MODULE_0__.Category);
const TSLogger = {
    help: typescript_logging__WEBPACK_IMPORTED_MODULE_0__.help,
    getLogControl: typescript_logging__WEBPACK_IMPORTED_MODULE_0__.getLogControl,
    getCategoryControl: typescript_logging__WEBPACK_IMPORTED_MODULE_0__.getCategoryControl,
};


/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__4__;

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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TSLogger": () => (/* reexport safe */ _logger_ts__WEBPACK_IMPORTED_MODULE_2__.TSLogger),
/* harmony export */   "default": () => (/* binding */ Websock)
/* harmony export */ });
/* harmony import */ var _timer_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _browser_activity_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _logger_ts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);





var logger = new _logger_ts__WEBPACK_IMPORTED_MODULE_2__.default("Websock");
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
        logger.debug({ msg: "handling message", data: message });
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
        this.reconnectTimer = new _timer_ts__WEBPACK_IMPORTED_MODULE_0__.default(() => { this.connect(); }, this.reconnectAfterMs);
        this.closeWasClean = false;
        this.heartbeatMs = 50000;
        this.browseractivityTimeout = 180000;
        logger.debug({ msg: "config", data: config });
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
        this.browserActivity = new _browser_activity_ts__WEBPACK_IMPORTED_MODULE_1__.default(this.browseractivityTimeout, 5000);
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
        logger.debug({ msg: "subscribe to channel:", data: channel_name });
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
        logger.debug({ msg: "handleIncoming event:", data: event });
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