const assert = require('assert');

const R = require('ramda');

const { Maybe: { Just, Nothing } } = require('ramda-fantasy');

const { Fold
      , Prism
      } = require('..');

describe('Prism', () => {

  it('can focus on a potential value', () => {
    assert(R.equals(
      Just(5),
      Fold.preview(Prism._Just, Just(5))
    ));

    assert(R.equals(
      Nothing(),
      Fold.preview(Prism._Just, Nothing())
    ));

    assert(R.equals(
      Nothing(),
      Fold.preview(Prism._Nothing, Just(5))
    ));

    assert(R.equals(
      Just({}),
      Fold.preview(Prism._Nothing, Nothing())
    ));
  });

  it('can construct instances of a focus', () => {
    assert(R.equals(
      Just(5),
      Prism.review(Prism._Just, 5)
    ));

    assert(R.equals(
      Nothing(),
      Prism.review(Prism._Nothing, 'whatever')
    ));
  });

  it('can match exact values using `only`', () => {
    assert(R.equals(
      Just({}),
      Fold.preview(Prism.only(10), 10)
    ));

    assert(R.equals(
      Nothing(),
      Fold.preview(Prism.only(10), 9.9)
    ));

    assert(R.equals(
      10,
      Prism.review(Prism.only(10), 42)
    ));
  });

  it('can match values that are close to a value', () => {
    const nearly10 = Prism.nearly(10, n => Math.abs(10 - n) < 1);

    assert(R.equals(
      Just({}),
      Fold.preview(nearly10, 10.5)
    ));

    assert(R.equals(
      Nothing(),
      Fold.preview(nearly10, 8.5)
    ));

    assert(R.equals(
      10,
      Prism.review(nearly10, 42)
    ));
  });

  it('can be declared with a constructor function and a function returning a Maybe to indicate a valid value', () => {
    const naturals = Prism.prism_(
      x => Math.abs(x),
      n => n >= 0 ? Just(n) : Nothing()
    );

    assert(R.equals(
      Just(5),
      Fold.preview(naturals, 5)
    ));

    assert(R.equals(
      Nothing(),
      Fold.preview(naturals, -5)
    ));

    assert(R.equals(
      5,
      Prism.review(naturals, -5)
    ));
  });
});
