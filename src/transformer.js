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

        top = Math.min(corners[0].y, corners[1].y,
                       corners[2].y, corners[3].y);

        left = Math.min(corners[0].x, corners[1].x,
                        corners[2].x, corners[3].x);

        return {
            // these are pixel values
            top: Math.round(top),
            left: Math.round(left)
        };
    };

    Transformer.prototype.getCSSValues = function () {
        return [
            this.transform.a.toFixed(5),
            this.transform.c.toFixed(5),
            this.transform.b.toFixed(5),
            this.transform.d.toFixed(5),
            Math.floor(this.transform.tx),
            Math.floor(this.transform.ty)
        ];
    };

    function format(string, arr) {
        return string.replace(/\{(\d+)\}/g, function (_, n) {
            n = parseInt(n, 10);
            return arr[n];
        });
    }

    Transformer.prototype.getCSSMatrix = function () {
        var values = this.getCSSValues();
        return format('matrix({0}, {1}, {2}, {3}, {4}, {5})', values);
    };

    Transformer.prototype.getCSSFilter = function () {
        var values = this.getCSSValues(),
            wrapper = 'progid:DXImageTransform.Microsoft.Matrix({0})',
            rows =  'M11={0}, M12={2}, M21={1}, M22={3}',
            defaults = "enabled=true, SizingMethod='auto expand'",
            inner;

        inner = [defaults, format(rows, values)].join(', ');
        return format(wrapper, [inner]);
    };

    Transformer.prototype.getStyles = function () {
        var prefixes = ['moz', 'webkit', 'o', 'ms'],
            i = prefixes.length,
            prefix,
            styles = {},
            value = this.getCSSMatrix();

        while (i--) {
            prefix = prefixes[i];
            styles['-' + prefix + '-transform-origin'] = '0% 0%';
            styles['-' + prefix + '-transform'] = value;
        }

        styles['transform-origin'] = '0% 0%';
        styles.transform = value;

        return styles;
    };

    Transformer.prototype.getStylesForIE = function () {
        var filter = this.getCSSFilter(),
            offset = this.getTopLeftCorner(),
            styles = {};

        styles.top = offset.top;
        styles.left = offset.left;

        styles.filter = filter;
        styles['-ms-filter'] = '"' + filter + '"';

        return styles;
    };
}.call(null));