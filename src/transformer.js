var Transformers = Transformers || {};
(function () {
    var Transform = Transformers.Transform,
        Point = Transformers.Point;

    var Transformer = function (transform, width, height, origin) {
        this.transform = transform || Transform.identity();
        this.width = width;
        this.height = height;
        this.origin  = origin || new Point(width * 0.5, height * 0.5);
    };

    Transformers.Transformer = Transformer;

    Transformer.prototype.apply = function (transform) {
        this.transform = this.transform.compose(transform);
        return this;
    };

    Transformer.prototype.setOrigin = function (x, y) {
        if (arguments.length === 2) {
            this.origin = new Point(x, y);
        } else {
            this.origin = x;
        }
    };

    Transformer.prototype.clear = function () {
        this.transform = Transform.identity();
        this.apply(Transform.identity());
        return this;
    };

    Transformer.prototype.rotate = function (theta) {
        return this.apply(Transform.rotation(theta, this.origin));
    };

    var radiansPerDegree = 2 * Math.PI / 360;

    Transformer.prototype.rotateDegrees = function (degrees) {
        return this.rotate(degrees * radiansPerDegree);
    };

    Transformer.prototype.scale = function (x, y) {
        return this.apply(Transform.scale(x, y, this.origin));
    };

    Transformer.prototype.skew = function (x, y) {
        return this.apply(Transform.skew(x, y));
    };

    Transformer.prototype.translate = function (x, y) {
        return this.apply(Transform.translation(x, y));
    };

    Transformer.prototype.getPoint = function (x, y) {
        return this.transform.apply(new Point(x, y));
    };

    Transformer.prototype.getStyles = function () {
        return this.transform.getStyles();
    };

    Transformer.prototype.getStylesForIE = function () {
        return this.transform.getStylesForIE(this.width, this.height);
    };
}.call(null));