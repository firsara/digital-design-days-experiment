
define([
  'store',
  'options',
  'utils/rasterize',
  'utils/getImageColors'
], function(
  store,
  options,
  rasterize,
  getImageColors
){
  return function render(path) {
    var image = new Image();

    image.onload = function(){
      store.colors = getImageColors(image);
      store.rastered = rasterize(store.colors, options.raster);
    };

    image.src = path;
  }
});
