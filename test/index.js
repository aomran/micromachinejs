const assert = require('assert');
const describe = require('mocha').describe;
const it = require('mocha').it;
const MicroMachine = require('../src/micromachine');

function fsmFactory() {
  const fsm = new MicroMachine('unsubmitted');
  fsm
    .when('submit', {
      unsubmitted: 'submitted',
      reverted: 'submitted',
    })
    .when('revert', { submitted: 'reverted' })
    .when('approve', { submitted: 'approved' });

  return fsm;
}

describe('initial State', () => {
  it('should initialize fsm with state', () => {
    const fsm = new MicroMachine('unsubmitted');

    assert.equal(fsm.state, 'unsubmitted');
  });

  it('should have default state is none set', () => {
    const fsm = new MicroMachine();
    assert.equal(fsm.state, 'initial');
  });
});

describe('#when()', () => {
  describe('define one event', () => {
    it('should return list of states', () => {
      const fsm = new MicroMachine('unsubmitted');
      fsm.when('submit', { unsubmitted: 'submitted' });

      assert.deepEqual(fsm.getStates(), ['unsubmitted', 'submitted']);
    });
  });

  describe('define no events', () => {
    it('should return empty list of states', () => {
      const fsm = new MicroMachine('unsubmitted');
      fsm.when('submit');

      assert.deepEqual(fsm.getStates(), []);
    });
  });

  describe('define multiple events', () => {
    it('should return list of states', () => {
      const fsm = fsmFactory();

      assert.deepEqual(fsm.getStates(), ['unsubmitted', 'reverted', 'submitted', 'approved']);
    });
  });
});

describe('#on()', () => {
  describe('callback register', () => {
    it('should add single callback', () => {
      const fsm = fsmFactory();
      fsm.on('submit', () => {});
      const callbacks = fsm.getCallbacks('submit').length;

      assert.equal(callbacks, 1);
    });
    it('should add multiple callbacks', () => {
      const fsm = fsmFactory();
      fsm
        .on('submit', () => {})
        .on('submit', () => {});
      const callbacks = fsm.getCallbacks('submit').length;

      assert.equal(callbacks, 2);
    });
    it('should do nothing without callbacks', () => {
      const fsm = fsmFactory();
      fsm.on('submit');
      const callbacks = fsm.getCallbacks('submit').length;

      assert.equal(callbacks, 0);
    });
  });
});

describe('#off()', () => {
  describe('callback unregister', () => {
    it('should remove single callback', () => {
      const fsm = fsmFactory();
      fsm.on('submit', () => {});

      let callbacks = fsm.getCallbacks('submit').length;
      assert.equal(callbacks, 1);

      fsm.off('submit');
      callbacks = fsm.getCallbacks('submit').length;
      assert.equal(callbacks, 0);
    });
    it('should remove multiple callbacks', () => {
      const fsm = fsmFactory();
      fsm
        .on('submit', () => {})
        .on('submit', () => {});

      let callbacks = fsm.getCallbacks('submit').length;
      assert.equal(callbacks, 2);

      fsm.off('submit');
      callbacks = fsm.getCallbacks('submit').length;
      assert.equal(callbacks, 0);
    });
    describe('event name not specified', () => {
      it('should remove all callbacks', () => {
        const fsm = fsmFactory();
        fsm
        .on('submit', () => {})
        .on('revert', () => {});

        let callbacks = fsm.getCallbacks('submit').length + fsm.getCallbacks('revert').length;
        assert.equal(callbacks, 2);

        fsm.off();
        callbacks = fsm.getCallbacks('submit').length + fsm.getCallbacks('revert').length;
        assert.equal(callbacks, 0);
      });
    });
    describe('event name specified', () => {
      it('should remove callbacks just for event', () => {
        const fsm = fsmFactory();
        fsm
          .on('submit', () => {})
          .on('revert', () => {});

        let callbacks = fsm.getCallbacks('submit').length + fsm.getCallbacks('revert').length;
        assert.equal(callbacks, 2);

        fsm.off('revert');
        callbacks = fsm.getCallbacks('submit').length + fsm.getCallbacks('revert').length;
        assert.equal(callbacks, 1);
      });
    });
  });
});

describe('#trigger()', () => {
  describe('unavailable events', () => {
    it('should not change state and return false', () => {
      const fsm = fsmFactory();
      assert.equal(fsm.trigger('approve'), false);
      assert.equal(fsm.state, 'unsubmitted');
    });
  });

  describe('undefined events', () => {
    it('should not change state and return false', () => {
      const fsm = fsmFactory();
      assert.equal(fsm.trigger('bad!'), false);
      assert.equal(fsm.state, 'unsubmitted');
    });
  });

  describe('available events', () => {
    it('should change state and return true', () => {
      const fsm = fsmFactory();
      assert.ok(fsm.trigger('submit'));
      assert.equal(fsm.state, 'submitted');
    });

    it('should trigger callbacks', () => {
      const fsm = fsmFactory();
      let counter = 0;
      fsm.on('submit', () => (counter += 1));
      assert.equal(counter, 0);

      fsm.trigger('submit');
      assert.equal(counter, 1);
    });

    it('any callbacks should always trigger', () => {
      const fsm = fsmFactory();
      let counter = 0;
      fsm.on('any', () => (counter += 1));
      assert.equal(counter, 0);

      fsm.trigger('submit');
      assert.equal(counter, 1);
    });
  });
});

describe('#getAvailableEvents()', () => {
  it('should return list of available events', () => {
    const fsm = fsmFactory();
    assert.deepEqual(fsm.getAvailableEvents(), ['submit']);

    fsm.trigger('submit');
    assert.deepEqual(fsm.getAvailableEvents(), ['revert', 'approve']);
  });
});
