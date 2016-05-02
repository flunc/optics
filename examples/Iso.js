const assert = require('assert');
const R = require('ramda');

const { Maybe: { Just } } = require('ramda-fantasy');

const { Iso
      , Getter
      , Lens
      , Setter
      } = require('..');

const fooLens = Lens.atObject('foo');
const barLens = Lens.atObject('bar');

describe('Iso', () => {
  const strToCharcodes = Iso.iso(
    R.compose(R.map(c => c.charCodeAt(0)), R.split('')),
    R.apply(String.fromCharCode)
  );

  it('creates maps from one type to another and back again', () => {
    assert.equal('bcd', Setter.over(strToCharcodes, R.map(R.inc), 'abc'));
  });

  it('can modify a value under an iso (think Setter.over in reverse)', () => {
    assert(R.equals([65,66,67], Iso.under(strToCharcodes, R.toUpper, [97,98,99])));
  });

  it('can use `non` to specify a default value to retrieve or remove when set', () => {
    const nonZeroFoo = R.compose(fooLens, Iso.non(0));

    assert(R.equals({foo: 1 }, Setter.over(nonZeroFoo, R.dec, { foo: 2 })));
    assert(R.equals({}, Setter.over(nonZeroFoo, R.dec, { foo: 1 })));

    assert.equal(1, Getter.view(nonZeroFoo, { foo: 1 }));
    assert.equal(0, Getter.view(nonZeroFoo, {}));

    const fooBarLens = R.compose(fooLens, Iso.non({}), barLens);
    assert(R.equals(
      { a: 1, foo: { b: 2, bar: 'baz' } },
      Setter.set(fooBarLens, Just('baz'), { a: 1, foo: { b: 2, bar: 'bob' } })
    ));

    assert(R.equals(
      { a: 1, foo: { b: 2, bar: 'baz' } },
      Setter.set(fooBarLens, Just('baz'), { a: 1, foo: { b: 2 } })
    ));

    assert(R.equals(
      { a: 1, foo: { bar: 'baz' } },
      Setter.set(fooBarLens, Just('baz'), { a: 1 })
    ));

    assert(R.equals(
      { foo: { bar: 'baz' } },
      Setter.set(fooBarLens, Just('baz'), {})
    ));
  });
});




