const
  RF = require('ramda-fantasy'),
  Either = RF.Either,
  Left  = Either.Left,
  Right = Either.Right;


// `Market` is a `Profunctor` that stores the `to` and `fro` of a `Prism`.
//
// Market :: (b -> t) -> (s -> Either t a) -> Market a b s t
const Market = (to, fro) => ({
  to: to,
  fro: fro,
  map: f => Market(b => f(to(b)), s => fro(s).bimap(f, x => x)),
  dimap: (f, g) => Market(b => g(to(b)), s => fro(f(s)).bimap(g, x => x)),
  left:      () => Market(b => Left(to(b)), Either.either(a => fro(a).bimap(Left, x => x), b => Left(Right(b)))),
  right:     () => Market(b => Right(to(b)), Either.either(a => Left(Left(a)), b => fro(b).bimap(Right, x => x)))
});

module.exports = Market;
