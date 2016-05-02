const assert = require('assert');

const R = require('ramda');

const { Maybe: { Just, Nothing }
      , Tuple
      } = require('ramda-fantasy');

const { Cons
      , Fold
      , Prism
      } = require('..');

describe('Cons', () => {
  it('represents the pairs in a cons-list', () => {
    assert(R.equals(
      [1, 2, 3, 4],
      Prism.review(Cons._Cons, Tuple(1, [2, 3, 4]))
    ));

    assert(R.equals(
      Just(Tuple(1, [2, 3, 4])),
      Fold.preview(Cons._Cons, [1, 2, 3, 4])
    ));

    assert(R.equals(
      Nothing(),
      Fold.preview(Cons._Cons, [])
    ));
  });

  it('allows access to the init and last elements of a list', () => {
    assert(R.equals(
      [1, 2, 3, 4],
      Prism.review(Cons._Snoc, Tuple([1, 2, 3], 4))
    ));

    assert(R.equals(
      Just(Tuple([1, 2, 3], 4)),
      Fold.preview(Cons._Snoc, [1, 2, 3, 4])
    ));

    assert(R.equals(
      Nothing(),
      Fold.preview(Cons._Snoc, [])
    ));
  });

  it('provides helper functions for constructing and deconstructing via cons/uncons', () => {
    assert(R.equals([1, 2, 3, 4], Cons.cons(1, [2, 3, 4])));
    assert(R.equals(Just(Tuple(1, [2, 3, 4])), Cons.uncons([1, 2, 3, 4])));
    assert(R.equals(Nothing(), Cons.uncons([])));
  });

  it('provides helper functions for constructing and deconstructing via snoc/unsnoc', () => {
    assert(R.equals([1, 2, 3, 4], Cons.snoc([1, 2, 3], 4)));
    assert(R.equals(Just(Tuple([1, 2, 3], 4)), Cons.unsnoc([1, 2, 3, 4])));
    assert(R.equals(Nothing(), Cons.unsnoc([])));
  });

  it('allows access to the head, tail, init, last of a list', () => {
    assert(R.equals(Just(1), Fold.preview(Cons._head, [1, 2, 3, 4])));
    assert(R.equals(Nothing(), Fold.preview(Cons._head, [])));

    assert(R.equals(Just([2, 3, 4]), Fold.preview(Cons._tail, [1, 2, 3, 4])));
    assert(R.equals(Nothing(), Fold.preview(Cons._tail, [])));

    assert(R.equals(Just([1, 2, 3]), Fold.preview(Cons._init, [1, 2, 3, 4])));
    assert(R.equals(Nothing(), Fold.preview(Cons._init, [])));
    
    assert(R.equals(Just(4), Fold.preview(Cons._last, [1, 2, 3, 4])));
    assert(R.equals(Nothing(), Fold.preview(Cons._last, [])));
  });
});
