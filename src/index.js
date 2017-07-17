class MicroMachine {
  constructor(initialState="initial") {
    this.state = initialState;
    this._events = {};
    this._callbacks = {};
  }

  getEvents() {
    return Object.values(this._events);
  }

  getStates() {
    let states = [];
    this.getEvents().map(event => {
      let statesToAdd = Object.keys(event).concat(
        Object.values(event)
      );
      states = states.concat(statesToAdd);
    });
    return Array.from(new Set(states)); // return unique set
  }

  getCallbacks(eventName) {
    return this._callbacks[eventName] || [];
  }

  _triggerCallbacks(eventName, from, to) {
    const callbacks = this.getCallbacks(eventName).concat(
      this.getCallbacks("any")
    );
    callbacks.forEach((callback) => {
      callback({
        from: from,
        to: to,
        eventName: eventName
      });
    });
  }

  when(eventName, events={}) {
    this._events[eventName] = events;
    return this;
  }

  on(eventName, callback) {
    if (!callback) return this;
    let handlers = this.getCallbacks(eventName);
    handlers.push(callback);
    this._callbacks[eventName] = handlers

    return this;
  }

  trigger(eventName) {
    const from = this.state;
    const to = this._events[eventName][this.state];

    this._triggerCallbacks(eventName, from, to);
    this.state = to;
  }
}

export default MicroMachine;
