/*globals Transformers: false */
window.addEvent('domready', function () {
    var transformer = new Transformers.Moo('object1');

    $$('input[name=rotate]').addEvent('click', function (e) {
        var element = document.getElement('input[name=rotation-number]'),
            value = Number(element.get('value'));

        if (!isNaN(value)) {
            transformer.rotateDegrees(value);
        }
    });

    $$('input[name=translate]').addEvent('click', function (e) {
        var xElement = document.getElement('input[name=translate-x-number]'),
            yElement = document.getElement('input[name=translate-y-number]'),
            x = Number(xElement.get('value')),
            y = Number(yElement.get('value'));

        if (!(isNaN(x) || isNaN(y))) {
            transformer.translate(x, y);
        }
    });

    $$('input[name=scale]').addEvent('click', function (e) {
        var element = document.getElement('input[name=scale-number]'),
            value = Number(element.get('value'));

        if (!isNaN(value)) {
            transformer.scale(value, value);
        }
    });

    $$('input[name=skew]').addEvent('click', function (e) {
        var xElement = document.getElement('input[name=skew-x-number]'),
            yElement = document.getElement('input[name=skew-y-number]'),
            x = Number(xElement.get('value')),
            y = Number(yElement.get('value'));

        if (!(isNaN(x) || isNaN(y))) {
            transformer.skew(x, y);
        }
    });

    $$('input[name=clear]').addEvent('click', function (e) {
        transformer.clear();
    });


});