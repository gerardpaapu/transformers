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
        var offset = this.getTopLeftCorner(),
            filters = this.transform.getIEFilters();

        return {
            filter: filters.filter,
            '-ms-filter': filters['-ms-filter'],
            top: offset.top,
            left: offset.left
        };
    };

    Transformer.prototype.getTopLeftCorner = function () {
        // IE positions transformed elements to the
        // top left corner of their bounding box
        var corners = [
            this.getPoint(0, 0),
            this.getPoint(this.width, 0),
            this.getPoint(this.width, this.height),
            this.getPoint(0, this.height)
        ];

        var top, left, x = 0, y = 1;

        top = Math.min(
            corners[0].y, 
            corners[1].y,
            corners[2].y,
            corners[3].y
        );

        left = Math.min(
            corners[0].x, 
            corners[1].x,
            corners[2].x, 
            corners[3].x
        );

        return {
            // these are pixel values
            top: Math.round(top),
            left: Math.round(left)
        };
    };
}.call(null));