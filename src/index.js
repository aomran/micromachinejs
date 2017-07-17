class MicroMachine {
  constructor(initialState = 'initial') {
    this.state = initialState;
    this.events = {};
    this.callbacks = {};
  }

  getEvents() {
    return Object.values(this.events);
  }

  getStates() {
    let states = [];
    this.getEvents().forEach((event) => {
      const statesToAdd = Object.keys(event).concat(Object.values(event));
      states = states.concat(statesToAdd);
    });
    return Array.from(new Set(states)); // return unique set
  }

  getCallbacks(eventName) {
    return this.callbacks[eventName] || [];
  }

  triggerCallbacks(eventName, from, to) {
    const callbacks = this.getCallbacks(eventName).concat(this.getCallbacks('any'));
    callbacks.forEach((callback) => {
      callback({ from, to, eventName });
    });
  }

  when(eventName, events = {}) {
    this.events[eventName] = events;
    return this;
  }

  on(eventName, callback) {
    if (!callback) { return this; }
    const handlers = this.getCallbacks(eventName);
    handlers.push(callback);
    this.callbacks[eventName] = handlers;

    return this;
  }

  off(eventName) {
    if (eventName) {
      this.callbacks[eventName] = [];
    } else {
      this.callbacks = {};
    }
    return this;
  }

  trigger(eventName) {
    const from = this.state;
    const to = this.events[eventName][this.state];

    this.triggerCallbacks(eventName, from, to);
    this.state = to;
  }
}

export default MicroMachine;
