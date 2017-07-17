import assert from "assert";
import MicroMachine from '../src/index'

function fsmFactory() {
  const fsm = new MicroMachine("unsubmitted");
  fsm
    .when('submit', {'unsubmitted': 'submitted'})
    .when('approve', {'submitted': 'conditional approval'})
    .when('complete', {
      'conditional approval': 'completed',
      'unsubmitted': 'completed'
    })

  return fsm
}

context('initial State', function() {
  it('should initialize fsm with state', function() {
    const fsm = new MicroMachine("unsubmitted");

    assert.equal(fsm.state, "unsubmitted");
  });

  it('should have default state is none set', function() {
    const fsm = new MicroMachine();
    assert.equal(fsm.state, "initial");
  });
});

context('#when()', function() {
  context('define one event', function() {
    it('should return list of states', function() {
      const fsm = new MicroMachine("unsubmitted");
      fsm.when('submit', {'unsubmitted': 'submitted'})

      assert.deepEqual(fsm.getStates(), ["unsubmitted", "submitted"]);
    });
  });

  context('define multiple events', function() {
    it('should return list of states', function() {
      const fsm = fsmFactory();

      assert.deepEqual(fsm.getStates(), ["unsubmitted", "submitted", 'conditional approval', 'completed']);
    });
  });
});

context('#on()', function() {
  context('callback register', function() {
    it('should add single callback', function() {
      const fsm = fsmFactory();
      fsm.on('submit', function(event) {});
      const callbacks = fsm.getCallbacks('submit').length;

      assert.equal(callbacks, 1)
    })
    it('should add multiple callbacks', function() {
      const fsm = fsmFactory();
      fsm
        .on('submit', function(event) {})
        .on('submit', function(event) {});
      const callbacks = fsm.getCallbacks('submit').length;

      assert.equal(callbacks, 2)
    })
  })
})

context('#trigger()', function() {
  it('should change state', function() {
    const fsm = fsmFactory();
    fsm.trigger('submit');

    assert.equal(fsm.state, 'submitted')
  })
  it('should trigger callbacks', function() {
    const fsm = fsmFactory();
    let counter = 0;
    fsm.on('submit', () => counter += 1);
    assert.equal(counter, 0)

    fsm.trigger('submit');
    assert.equal(counter, 1)
  })
})
