/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function SomeException(message) {
  this.message = message;
  this.name = 'SomeException';
}

throw new SomeException('InvalidMonthNo');

var MicroMachine = function () {
  function MicroMachine(initialState) {
    _classCallCheck(this, MicroMachine);

    this.state = initialState;
    this._events = {};
    this._callbacks = {};
  }

  _createClass(MicroMachine, [{
    key: 'getTransitions',
    value: function getTransitions() {
      return Object.values(this._events).reduce(function (a, b) {
        return a.concat(b);
      }, []);
    }
  }, {
    key: 'getStates',
    value: function getStates() {
      var states = [];
      this.getTransitions().map(function (transition) {
        var statesToAdd = Object.keys(transition).concat(Object.values(transition));
        states = states.concat(statesToAdd);
      });
      return Array.from(new Set(states)); // return unique set
    }
  }, {
    key: 'getCallbacks',
    value: function getCallbacks(eventName) {
      return this._callbacks[eventName] || [];
    }
  }, {
    key: 'triggerCallbacks',
    value: function triggerCallbacks(eventName, from, to) {
      var callbacks = this.getCallbacks(eventName).concat(this.getCallbacks("any"));
      callbacks.forEach(function (callback) {
        callback({
          from: from,
          to: to,
          eventName: eventName
        });
      });
    }
  }, {
    key: 'when',
    value: function when(eventName, transitions) {
      this._events[eventName] = transitions;
    }
  }, {
    key: 'on',
    value: function on(eventName, callback) {
      this.getCallbacks(eventName).push(callback);
    }
  }, {
    key: 'trigger',
    value: function trigger(eventName) {
      var from = this.state;
      var to = this._events[eventName][this.state];

      this.triggerCallbacks(eventName, from, to);
      this.state = to;
    }
  }]);

  return MicroMachine;
}();

var fsm = new MicroMachine("unsubmitted");

// define events
// fsm.when('submit', [{'unsubmitted': 'submitted'}])
// fsm.when('approve', [{'submitted': 'conditional approval'}])
// fsm.when('complete', [{'conditional approval': 'completed'}, {'unsubmitted': 'completed'}])

/***/ })
/******/ ]);