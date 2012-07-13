GTransformer
===========

Provide affine transformations in a cross browser, framework agnostic fashion.

the Point class represents a 2D point {x, y}

The Transform class represents a 2D [Affine transform](http://en.wikipedia.org/wiki/Affine_transform)


Using Transforms
----------------

Transforms support two basic operations 'apply' and 'compose', (implemented in Transformers.Transform.apply and Transformers.Transform.compose)

`Transform.apply(Transform t, Point p)`

returns a new point that represents point 'p' with the transform 't' applied to it.

`Transform.compose(Transform a, Transform b)`

returns a new Transform such that apply(compose(a, b), p) is equivalent to apply(b, apply(a, p))

`Transform::getStyles()`

returns an object of CSS styles using CSS3 2D transforms, with prefixes for Webkit, Gecko, Internet Explorer and Opera.

`Transform::getStylesForIE(Number width, Number height)`

returns an object of CSS styles using filters for Internet Explorer, together with the necessary positioning styles 'top' and 'left' (these are only necessary for Internet Explorer).


Creating Transforms
-------------------

`Transform.identity()`

returns the identity transform, `Transform.identity().apply(p)` is equal to 'p'.

`Transform.rotate(Number n, Point c)`

returns a Transform that will rotate an point through 'n' degrees around the center 'c'.

`Transform.translation(Number x, Number y)`

returns a Transform that will move a point by the vector (x, y).

`Transform.scale(Number n)`

`Transform.skew(Number x, Number y)`

