const assert = require('assert');
const R = require('ramda');
const { Maybe: { Just, Nothing }
      , Tuple
      } = require('ramda-fantasy');

const { Getter
      , Setter
      , Lens } = require('..');

describe('Lens', () => {
  
  const fooLens = Lens.atObject('foo');
  
  it('can view exactly one focus', () => {
    assert(R.equals(
      42,
      Getter.view(Lens._2, Tuple('foo', 42))));
    
    assert(R.equals(
      Just(1),
      Getter.view(fooLens, { 'foo': 1 })
    ));
    
    assert(R.equals(
      Nothing(),
      Getter.view(fooLens, { 'bar': 1 })
    ));
  });
  
  it('can update exactly one focus', () => {
    assert(R.equals(
      Tuple('foo', 42),
      Setter.set(Lens._2, 42, Tuple('foo', 0))
    ));
    
    assert(R.equals(
      { 'foo': 5 },
      Setter.set(fooLens, Just(5), { 'foo': 1 })
    ));
    
    assert(R.equals(
      {},
      Setter.set(fooLens, Nothing(), { 'foo': 1 })
    ));
  });
  
  it('can be composed with other optics', () => {
    const l = R.compose(Lens._1, Lens._2),
          t = Tuple(Tuple(true, 42), 'foo');
    
    assert(R.equals(
      42,
      Getter.view(l, t)
    ));
    
    assert(R.equals(
      Tuple(Tuple(true, 43), 'foo'),
      Setter.over(l, R.inc, t)
    ));
  });
  
});

