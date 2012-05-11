var Transformers = Transformers || {};
(function (){
    // Affine transformations are traditionally
    // represented as 3x3 matrices:
    //
    //      [[a, b, tx],
    //       [c, d, ty],
    //       [0, 0, 1]]
    //
    // And Points are represented as 3x1 matrices:
    //
    //      [.x,
    //       .y,
    //       [1]]
    //
    // Because the bottom row is constant, we will omit it.
    // Because we only deal with 3x3 matrices (tranforms) and
    // 2x1 matrices, we will represent them as objects
    //
    //      {a, b, c, d, tx, ty}
    //      {x, y}
    //
    // As such, our constructor simply returns an array
    var Transform = function (a, b, tx,
                              c, d, ty) {
        this.a = a || 0;
        this.b = b || 0;
        this.c = c || 0;
        this.d = d || 0;
        this.tx = tx || 0;
        this.ty = ty || 0;
    };

    Transformers.Transform = Transform;

    var Point = function (x, y) {
        this.x = x || 0;
        this.y = y || 0;
    };

    Transformers.Point = Point;
    // Where ID is the identity transform,
    // A is any transform and P is any point
    //
    // compose(A, ID) = Compose(ID, A) = A
    // apply(ID, P) = P
    var identityTransform = function () {
        return new Transform(1, 0, 0,
                             0, 1, 0);
    };

    // The composition(A, B) is equivalent to
    // the Matrix product B x A
    var _compose = function (A, B) {
        var R = new Transform();
        // B(a, b, tx) * A(a, c, 0)
        R.a  = B.a * A.a  + B.b * A.c; // + 0 * B.tx
        // B(a, b, tx) * A(b, d, 0)
        R.b  = B.a * A.b  + B.b * A.d; // + 0 * B.ty
        // B(a, b, tx) * A(tx, ty, 1)
        R.tx = B.a * A.tx + B.b * A.ty + 1 * B.tx;

        // B(c, d, ty) * A(a, c, 0)
        R.c  = B.c * A.a  + B.d * A.c; // + 0 * B.ty
        // B(c, d, ty) * A(b, d, 0)
        R.d  = B.c * A.b  + B.d * A.d; // + 0 * B.ty
        // B(c, d, ty) * A(tx, ty, 1)
        R.ty = B.c * A.tx + B.d * A.ty + B.ty;

        return R;
    };

    var compose = function (A, B) {
        if (arguments.length === 2) {
            return _compose(A, B);
        } else {
            var rest = [].slice.call(arguments, 1);
            return _compose(A, compose.apply(this, rest));
        }
    };

    Transform.prototype.compose = function (t) {
        return compose(this, t);
    };

    // The application of transform T to point P
    // is equivalent to the matrix product T x P
    var apply = function (T, P) {
        var R = new Point(0, 0);
        // T(a, b, tx) * P(x, y, 1)
        R.x = T.a * P.x + T.b * P.y + T.tx;
        // T(c, d, ty) * P(x, y, 1)
        R.y = T.c * P.x + T.d * P.y + T.ty;

        return R;
    };

    Transform.prototype.apply = function (p) {
        return apply(this, p);
    };

    var sin = Math.sin,
        tan = Math.tan,
        cos = Math.cos;

    var rotation = function (angle, origin) {
        var T = new Transform(),
            x, y;

        origin = origin || new Point(0, 0);
        x = origin.x;
        y = origin.y;

        T.a = cos(angle);
        T.b = -sin(angle);
        T.c = sin(angle);
        T.d = cos(angle);

        if (x !== 0 || y !== 0) {
            T.tx = x - T.a * x - T.b * y;
            T.ty = y - T.c * y - T.d * x;
        }

        return T;
    };

    var translation = function (x, y) {
        return new Transform(1, 0, x,
                             0, 1, y);
    };

    var withOrigin = function (origin, transform) {
        var t1 = translation(-origin.x, -origin.y),
            t2 = translation(origin.x, origin.y);

        // translate so that the origin is at (0, 0)
        // perform the transform
        // transform so that the origin is where it started
        return compose(t1, transform, t2);
    };

    var scale = function (x, y, origin) {
        var T = new Transform(x, 0, 0,
                              0, y, 0);

        if (origin == null  ||
            origin.x === 0 &&
            origin.y === 0) {
            return T;
        } else {
            return withOrigin(origin, T);
        }
    };

    var skew = function (x, y) {
        return new Transform(1, tan(x), 0,
                             tan(y), 1, 0);
    };

    Transform.identity = identityTransform;
    Transform.translation = translation;
    Transform.compose = compose;
    Transform.apply = apply;
    Transform.rotation = rotation;
    Transform.scale = scale;
    Transform.skew = skew;
}.call(null));