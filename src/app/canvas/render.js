
define([
  'utils/rasterize',
  'utils/getImageColors'
], function(
  rasterize,
  getImageColors
){
  var store = null;
  var options = null;

  return function render(path) {
    if (! store) store = require('store');
    if (! options) options = require('options');

    var image = new Image();

    store.imageSrc = path;

    image.addEventListener('load', function(){
      store.colors = getImageColors(image);
      store.rastered = rasterize(store.colors, options.raster);
      store.updateRasterSize();
    });

    image.src = path;
  }
});
