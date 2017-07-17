// This is a small Finite State Machine implementation in JavaScript.

class MicroMachine {
  // Initial State:
  // ---------------
  //
  //     const MicroMachine = require('micromachinejs');
  //     const initialState = 'unsubmitted';
  //     const fsm = new MicroMachine(initialState);

  constructor(initialState = 'initial') {
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
  when(eventName, events = {}) {
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
  on(eventName, callback) {
    if (!callback) { return this; }
    const handlers = this.getCallbacks(eventName);
    handlers.push(callback);
    this.callbacks[eventName] = handlers;

    return this;
  }

  // Stop listen to events:
  // ---------------
  //
  //     fsm.off('submit') // remove 'submit' event callbacks
  //     fsm.off() // remove all event callbacks
  off(eventName) {
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
  trigger(eventName) {
    const from = this.state;
    const to = this.events[eventName][this.state];

    this.triggerCallbacks(eventName, from, to);
    this.state = to;
  }

  // Helper functions
  // ---------------

  // Return an `Array` of all events.
  getEvents() {
    return Object.values(this.events);
  }

  // Return a unique set (`Array`) of all states.
  getStates() {
    let states = [];
    this.getEvents().forEach((event) => {
      const statesToAdd = Object.keys(event).concat(Object.values(event));
      states = states.concat(statesToAdd);
    });
    return Array.from(new Set(states));
  }

  // Return an `Array` of callback functions for an event.
  getCallbacks(eventName) {
    return this.callbacks[eventName] || [];
  }

  // Loop through each callback function and call it.
  // Pass each function an event object:
  //
  //     {from: String, to: String, eventName: String}
  triggerCallbacks(eventName, from, to) {
    const callbacks = this.getCallbacks(eventName).concat(this.getCallbacks('any'));
    callbacks.forEach((callback) => {
      callback({ from, to, eventName });
    });
  }
}

module.exports = MicroMachine;
