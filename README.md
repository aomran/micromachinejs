# Micromachine.js

[![Build Status](https://travis-ci.org/aomran/micromachinejs.svg?branch=master)](https://travis-ci.org/aomran/micromachinejs)
[![npm version](https://badge.fury.io/js/micromachinejs.svg)](https://badge.fury.io/js/micromachinejs)
[![Coverage Status](https://coveralls.io/repos/github/aomran/micromachinejs/badge.svg)](https://coveralls.io/github/aomran/micromachinejs)

This is a small Finite State Machine implementation in JavaScript inspired by a similar [library in ruby](https://github.com/soveran/micromachine).

### Installation

```
$ npm install micromachinejs --save
```

### Usage

Initialize the finite state machine:

```javascript
// ES2015 syntax
import MicroMachine from 'micromachinejs';
const initialState = 'unsubmitted';
const fsm = new MicroMachine(initialState);
```

Define some events:

```javascript
fsm
  .when('submit', {
    unsubmitted: 'submitted',
    reverted: 'submitted',
  })
  .when('revert', { submitted: 'reverted' })
  .when('approve', { submitted: 'approved' });
```

Listen to events:

```javascript
fsm
  .on('submit', (event) => {
    // event.to
    // event.from
    // event.eventName
  })
  .on('submit', (event) => {
    // multiple callbacks to same event are possible
  })
  .on('revert', (event) => {
    // do something else
  });
```

Trigger an event:

```javascript
fsm.trigger('submit');
fsm.state; // "submitted"
```
