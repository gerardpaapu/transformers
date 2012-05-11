/*globals Transformers: false */
window.addEvent('domready', function () {
  var transformer = new Transformers.Moo('object1');
  transformer
    .rotate(Math.PI * 0.75)
    .translate(40, 20)
    .scale(20, 10);
});