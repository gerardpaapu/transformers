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
        if (Browser.ie) {
            this.element.setStyles(this.getStylesForIE());
        } else {
            this.element.setStyles(this.getStyles());
        }
        return this;
    };
}.call(null));