
define([
  './getAverageColor',
  './getLuminance'
], function(
  getAverageColor,
  getLuminance
){
  return function rasterize(colors, raster) {
    raster = Math.floor(raster);

    var fraction = {
      x: Math.floor(colors.length / raster),
      y: Math.floor(colors[0].length / raster)
    };

    var rastered = [];

    for (var x = 0; x < fraction.x; x++) {
      rastered[x] = [];

      for (var y = 0; y < fraction.y; y++) {
        rastered[x][y] = getAverageColor(colors, x * raster, y * raster, raster, raster);
        rastered[x][y].l = getLuminance(rastered[x][y]);
        rastered[x][y].r = rastered[x][y].r * 255;
        rastered[x][y].g = rastered[x][y].g * 255;
        rastered[x][y].b = rastered[x][y].b * 255;
      }
    }

    return rastered;
  }
});
