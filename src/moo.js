var Transformers = Transformers || {};
(function () {
    // Provides a basic level of integration with
    // mootools
    var Transformer = Transformers.Transformer,
        Point = Transformers.Point;

    var Moo = function (element, origin) {
        this.element = document.id(element);
        var dimensions = this.element.getCoordinates();
        Transformer.call(this, null, dimensions.width, dimensions.height, origin);
    };

    Transformers.Moo = Moo;
    Moo.prototype = new Transformer();
    Moo.prototype.apply = function () {
        Transformer.prototype.apply.apply(this, arguments);
        if (Browser.ie && Browser.version <= 9) {
            this.element.setStyles(this.getStylesForIE());
        } else {
            this.element.setStyles(this.getStyles());
        }
        return this;
    };

    Fx.Transformer = new Class({
        // A class for animating transformer effects
        Extends: Fx,

        initialize: function (element, options) {
            this.element = $(element);
            var dimensions = this.element.getCoordinates();
            this.transformer = new Transformer(null, dimensions.width, dimensions.height);
            this.updateTransform = options.transformer || function () {};
            this.parent(options);

            var positioning = this.element.getStyles('top', 'left');

            // If the element is positioned, we need to remove
            // that positioning because it will be overridden
            if (positioning.top != null || positioning.left != null) {
                this.element.setStyles({ top: 0, left: 0 });
                this.transformer.translate(positioning.left || 0,
                                           positioning.top || 0);
                this.renderTransform();
            }

        },

        renderTransform: function () {
            if (Browser.ie) {
                this.element.setStyles(this.transformer.getStylesForIE());
            } else {
                this.element.setStyles(this.transformer.getStyles());
            }
        },

        set: function (t) {
            this.updateTransform.call(this.transformer, t);
            this.renderTransform();
        }
    });
}.call(null));