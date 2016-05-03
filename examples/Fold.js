const assert = require('assert');

const R = require('ramda');

const { Maybe } = require('ramda-fantasy');
const { Just, Nothing } = Maybe;

const { Fold
      , Traversal
      } = require('..');

const Unit = {};
const listOfLists = R.compose(Traversal.traversed, Traversal.traversed);

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

  it('can fold left over the focus of a foldable optic', () => {
    assert(R.equals(
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      Fold.foldlOf(listOfLists, (xs, x) => R.append(x, xs), [], [[1, 2, 3], [4, 5, 6], [7, 8, 9]])
    ));
  });

  it('can fold right over the focus of a foldable optic', () => {
    assert(R.equals(
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      Fold.foldrOf(listOfLists, R.prepend, [], [[1, 2, 3], [4, 5, 6], [7, 8, 9]])
    ));
  });

  it('can produce a list of the focus of a foldable optic', () => {
    assert(R.equals(
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      Fold.toListOf(listOfLists, [[1, 2, 3], [4, 5, 6], [7, 8, 9]])
    ));
  });

  it('can determine whether all focused items of a foldable optic satisfy a given predicate', () => {
    assert(Fold.allOf(listOfLists, x => x < 10, [[1, 2, 3], [4, 5, 6], [7, 8, 9]]));
    assert(!Fold.allOf(listOfLists, x => x < 10, [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]]));
  });

  it('can determine whether any focused items of a foldable optic satisfy a given predicate', () => {
    assert(Fold.anyOf(listOfLists, x => x < 10, [[13, 12], [11, 10], [9, 8]]));
    assert(!Fold.anyOf(listOfLists, x => x < 10, [[13, 12], [11, 10]]));
  });

  it('can determine whether all focused items of a foldable optic are true', () => {
    assert(Fold.andOf(listOfLists, [[true, true], [true, true]]));
    assert(!Fold.andOf(listOfLists, [[true, true], [false, true]]));
  });

  it('can determine whether any focused items of a foldable optic are true', () => {
    assert(Fold.orOf(listOfLists, [[false, false], [true, false]]));
    assert(!Fold.orOf(listOfLists, [[false, false], [false, false]]));
  });

  it('can determine whether a given value is present in the focus of a foldable optic', () => {
    assert(Fold.elemOf(listOfLists, 'baz', [['foo', 'bar'], ['baz', 'moo']]));
    assert(!Fold.elemOf(listOfLists, 'baa', [['foo', 'bar'], ['baz', 'moo']]));
  });

  it('can determine whether a given value is absent from the focus of a foldable optic', () => {
    assert(Fold.notElemOf(listOfLists, 'baa', [['foo', 'bar'], ['baz', 'moo']]));
    assert(!Fold.notElemOf(listOfLists, 'baz', [['foo', 'bar'], ['baz', 'moo']]));
  });

  it('can produce the sum of all focused items of a foldable optic', () => {
    assert.equal(10, Fold.sumOf(listOfLists, [[1, 2], [3, 4]]));
  });

  it('can produce the product of all focused items of a foldable optic', () => {
    assert.equal(24, Fold.productOf(listOfLists, [[1, 2], [3, 4]]));
  });

  it('can determine the number of focused items of a foldable optic', () => {
    assert.equal(4, Fold.lengthOf(listOfLists, [[1, 2], [3, 4]]));
  });

  it('can return the first focused item of a foldable optic', () => {
    assert(R.equals(Just(1), Fold.firstOf(listOfLists, [[1, 2], [3, 4]])));
    assert(R.equals(Nothing(), Fold.firstOf(listOfLists, [])));
  });

  it('can return the last focused item of a foldable optic', () => {
    assert(R.equals(Just(4), Fold.lastOf(listOfLists, [[1, 2], [3, 4]])));
    assert(R.equals(Nothing(), Fold.lastOf(listOfLists, [])));
  });

  it('can determine the maximum focused item of a foldable optic', () => {
    assert(R.equals(Just(4), Fold.maximumOf(listOfLists, [[1, 2], [3, 4]])));
    assert(R.equals(Nothing(), Fold.maximumOf(listOfLists, [])));
  });

  it('can determine the minimum focused item of a foldable optic', () => {
    assert(R.equals(Just(1), Fold.minimumOf(listOfLists, [[1, 2], [3, 4]])));
    assert(R.equals(Nothing(), Fold.minimumOf(listOfLists, [])));
  });

  it('can find the first focused item of a foldable optic that satisfies a given predicate', () => {
    assert(R.equals(Just(2), Fold.findOf(listOfLists, n => n % 2 === 0, [[1, 2], [3, 4]])));
    assert(R.equals(Nothing(), Fold.findOf(listOfLists, n => n > 4 === 0, [[1, 2], [3, 4]])));
  });

  it('can evaluate each focused monadic/applicative action of a foldable optic, ignoring the results', () => {
    assert(R.equals(
      Just(Unit),
      Fold.sequenceOf_(Maybe, listOfLists, [[Just(1), Just(2)], [Just(3), Just(4)]])
    ));
    assert(R.equals(
      Nothing(),
      Fold.sequenceOf_(Maybe, listOfLists, [[Just(1), Just(2)], [Nothing(), Just(4)]])
    ));
  });

  it('can determine whether there are any focused items of a foldable optic', () => {
    assert(Fold.has(listOfLists, [[1, 2], [3, 4]]));
    assert(!Fold.has(listOfLists, []));
  });

  it('can determine whether there are no focused items of a foldable optic', () => {
    assert(Fold.hasnt(listOfLists, []));
    assert(!Fold.hasnt(listOfLists, [[1, 2], [3, 4]]));
  });

  it('can produce an optic that filters items to keep those that satisfy the a given predicate', () => {
    const listOfListOfEvens = R.compose(listOfLists, Fold.filtered(n => n % 2 === 0));
    assert(R.equals(
      [2, 4],
      Fold.toListOf(listOfListOfEvens, [[1, 2], [3, 4]])
    ));
  });
});
