/******/ (() => { // webpackBootstrap
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
        console.log("startWatching");
        this.stopped = false;
        PressEvents.forEach((activityEvent) => {
            document.addEventListener(activityEvent, (e) => { this.handlePressActivity(e); }, { once: true });
        });
        this.scheduleWindowWatcher();
        this.scheduleInactivityCallback();
    }
    stopWatching() {
        console.log("stopWatching");
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
        console.log("handlePressActivity");
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
        console.log("handleWindowActivity");
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
        console.log("reactivate");
        this.inactive = false;
        clearInterval(this.timer);
        clearInterval(this.windowWatchTimer);
        this.reactivateCallback();
    }
    //////////////////////////
    // Functions to handle inactivity
    //////////////////////////
    scheduleInactivityCallback() {
        console.log("scheduleInactivityCallback");
        clearInterval(this.timer);
        this.timer = setInterval(() => { this.checkIfInactive(); }, this.timeout);
    }
    checkIfInactive() {
        console.log("checkIfInactive");
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
        console.log("scheduleWindowWatcher");
        this.takeWindowSnapshot();
        clearInterval(this.windowWatchTimer);
        this.windowWatchTimer = setInterval(() => { this.checkIfWindowChanged(); }, this.windowChangeInterval);
    }
    checkIfWindowChanged() {
        console.log("checkIfWindowChanged");
        if (this.windowChanged()) {
            this.handleWindowActivity();
        }
    }
    takeWindowSnapshot() {
        console.log("takeWindowSnapshot");
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Websock)
/* harmony export */ });
/* harmony import */ var _timer_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _browser_activity_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);


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
        console.log("message:");
        console.log(message);
        for (let callback_key in this.callbacks) {
            this.callbacks[callback_key](message);
        }
        for (let message_key in this.keyedCallbacks) {
            console.log("message_key: " + message_key);
            if (typeof message[message_key] !== 'undefined') {
                console.log("message has key");
                for (let callback_key in this.keyedCallbacks[message_key]) {
                    this.keyedCallbacks[message_key][callback_key](message);
                }
            }
        }
    }
}
class Websock {
    constructor(url, port_number) {
        this.initialConnection = true;
        this.channels = {};
        this.socket = null;
        this.heartbeatTimer = new _timer_ts__WEBPACK_IMPORTED_MODULE_0__.default(() => { this.pingHeartbeat(); }, this.hearbeatInterval);
        this.reconnectTimer = new _timer_ts__WEBPACK_IMPORTED_MODULE_0__.default(() => { this.connect(); }, this.reconnectAfterMs);
        this.browserActivity = new _browser_activity_ts__WEBPACK_IMPORTED_MODULE_1__.default(1800000, 5000);
        this.closeWasClean = false;
        this.browserActivity.register(() => { console.log("browseractivity callback inactive..."); this.closeDueToInactivity(); }, () => { console.log("browseractivity callback reactivating..."); this.connect(); });
        let port = '';
        if (port_number) {
            port = ':' + port_number;
        }
        this.connectionString = url + port + "/sock";
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
        console.log("igg_websocket subscribe:");
        console.log(channel_name);
        console.log(callback);
        return response;
    }
    connect() {
        console.log("connecting...");
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
        console.log("handleIncoming event:");
        console.log(event);
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
        this.heartbeatTimer.scheduleTimeout();
        this.reconnectTimer.reset();
        this.resubscribeChannels();
        this.browserActivity.startWatching();
    }
    handleConnectionClose() {
        if (!this.closeWasClean) {
            console.log("unexpected connection close...");
            this.initialConnection = false;
            this.browserActivity.stopWatching();
            this.reconnectTimer.scheduleTimeout();
        }
    }
    closeDueToInactivity() {
        console.log("closeDueToInactivity");
        this.heartbeatTimer.reset();
        if (this.socket.readyState === WebSocket.OPEN) {
            console.log("connection was open, closing");
            this.closeWasClean = true;
            this.socket.close(1000);
        }
        this.initialConnection = false;
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
    pingHeartbeat() {
        console.log("pingHeartbeat");
        this.socket.send(JSON.stringify({ heart: "beat" }));
    }
    reconnectAfterMs(tries) {
        return [50, 100, 200, 500, 1000, 2000, 5000][tries - 1] || 10000;
    }
    hearbeatInterval(tries) {
        return 50000;
    }
}

})();

/******/ })()
;