(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["MicroMachine"] = factory();
	else
		root["MicroMachine"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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

// This is a small Finite State Machine implementation in JavaScript.

var MicroMachine = function () {
  // Initial State:
  // ---------------
  //
  //     const MicroMachine = require('micromachinejs');
  //     const initialState = 'unsubmitted';
  //     const fsm = new MicroMachine(initialState);

  function MicroMachine() {
    var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'initial';

    _classCallCheck(this, MicroMachine);

    this.state = initialState;
    this.events = {};
    this.callbacks = {};
  }

  // Define Events:
  // ---------------
  //
  //     fsm
  //      .when('submit', {
  //        unsubmitted: 'submitted',
  //        reverted: 'submitted',
  //      })
  //      .when('revert', { submitted: 'reverted' })
  //      .when('approve', { submitted: 'approved' });


  _createClass(MicroMachine, [{
    key: 'when',
    value: function when(eventName) {
      var events = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.events[eventName] = events;
      return this;
    }

    // Listen to events:
    // ---------------
    //
    //     fsm
    //       .on('submit', (event) => {
    //          // event.to
    //          // event.from
    //          // event.eventName
    //       })
    //       .on('submit', (event) => {
    //          // multiple callbacks to same event are possible
    //       })
    //       .on('revert', (event) => {
    //          // do something else
    //       });

  }, {
    key: 'on',
    value: function on(eventName, callback) {
      if (!callback) {
        return this;
      }
      var handlers = this.getCallbacks(eventName);
      handlers.push(callback);
      this.callbacks[eventName] = handlers;

      return this;
    }

    // Stop listen to events:
    // ---------------
    //
    //     fsm.off('submit') // remove 'submit' event callbacks
    //     fsm.off() // remove all event callbacks

  }, {
    key: 'off',
    value: function off(eventName) {
      if (eventName) {
        this.callbacks[eventName] = [];
      } else {
        this.callbacks = {};
      }
      return this;
    }

    // Trigger an Event:
    // ---------------
    //
    //     fsm.trigger('submit');
    //     fsm.state; // "submitted"

  }, {
    key: 'trigger',
    value: function trigger(eventName) {
      var from = this.state;
      var to = this.events[eventName][this.state];

      this.triggerCallbacks(eventName, from, to);
      this.state = to;
    }

    // Helper functions
    // ---------------

    // Return an `Array` of all events.

  }, {
    key: 'getEvents',
    value: function getEvents() {
      return Object.values(this.events);
    }

    // Return a unique set (`Array`) of all states.

  }, {
    key: 'getStates',
    value: function getStates() {
      var states = [];
      this.getEvents().forEach(function (event) {
        var statesToAdd = Object.keys(event).concat(Object.values(event));
        states = states.concat(statesToAdd);
      });
      return Array.from(new Set(states));
    }

    // Return an `Array` of callback functions for an event.

  }, {
    key: 'getCallbacks',
    value: function getCallbacks(eventName) {
      return this.callbacks[eventName] || [];
    }

    // Loop through each callback function and call it.
    // Pass each function an event object:
    //
    //     {from: String, to: String, eventName: String}

  }, {
    key: 'triggerCallbacks',
    value: function triggerCallbacks(eventName, from, to) {
      var callbacks = this.getCallbacks(eventName).concat(this.getCallbacks('any'));
      callbacks.forEach(function (callback) {
        callback({ from: from, to: to, eventName: eventName });
      });
    }
  }]);

  return MicroMachine;
}();

module.exports = MicroMachine;

/***/ })
/******/ ]);
});