const assert = require('assert');

const R = require('ramda');

const { Maybe: { Just }
      , Tuple } = require('ramda-fantasy');

const { Fold
      , Lens
      , Prism
      , Setter
      , Traversal
      } = require('..');

describe('Traversal', () => {

  it('can set target elements of a traversal', () => {
    assert(R.equals([1, 2, 3], Setter.over(Traversal.traversed, R.inc, [0, 1, 2])));
  });

  it('can fold over the elements of a traversal', () => {
    assert(R.equals(Just(10), Fold.maximumOf(Traversal.traversed, [1, 10, 2, 8, 5])));
  });

  it('composes with other optics', () => {
    const data = Tuple(42, Just([
      { a: [ {id: 1 }, { id: 2 }, { id: 3 } ] },
      { a: [ {id: 4 }, { id: 5 }, { id: 6 } ] }
    ]));

    const idFocus = R.compose(
      Lens._2,
      Prism._Just,
      Traversal.traversed,
      Traversal.ixObject('a'),
      Traversal.traversed,
      Traversal.ixObject('id')
    );

    assert(R.equals(21, Fold.sumOf(idFocus, data)));
  });

});
