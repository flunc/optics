const assert = require('assert');

const R = require('ramda');

const { Maybe: { Just, Nothing }
      , Tuple } = require('ramda-fantasy');

const { Fold
      , Lens
      , Traversal
      } = require('..');

describe('Fold', () => {

  it('can fold over a foldable optic', () => {
    assert(R.equals(
      [1, 2, 3, 4, 5, 6],
      Fold.foldOf({ empty: () => [] }, Traversal.traversed, [[1, 2], [3, 4], [5, 6]])
    ));
  });

  it('can foldMap over a foldable optic', () => {
    const Sum = x => ({
      value: x,
      concat: s2 => Sum(x + s2.value),
      equals: s2 => s2.value === x
    });
    assert(R.equals(
      Sum(10),
      Fold.foldMapOf({ empty: () => Sum(0) }, Traversal.traversed, Sum, [1, 2, 3, 4])
    ));
  });

  it('can preview the first focus of a foldable optic', () => {
    assert(R.equals(
      Just(1),
      Fold.preview(Traversal.traversed, [1, 2, 3, 4])
    ));

    assert(R.equals(
      Nothing(),
      Fold.preview(Traversal.traversed, [])
    ));
  });

  // TODO: Provide examples of remaining Fold functions
});
