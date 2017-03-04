
define([
  '../../../node_modules/stats.js/build/stats.min',
  'stage',
  'store',
  'options'
], function(
  Stats,
  stage,
  store,
  options
){
  var isLocal = window.location.href.indexOf('localhost') !== -1;
  var stats = new Stats();
  if (isLocal) document.body.appendChild(stats.dom);

  var Math_floor = Math.floor;
  var Math_ceil = Math.ceil;
  var Math_round = Math.round;
  var Math_min = Math.min;
  var Math_max = Math.max;
  var Math_sqrt = Math.sqrt;
  var Math_pow = Math.pow;
  var Math_random = Math.random;

  return function paint() {
    requestAnimationFrame(paint);

    if (isLocal) stats.begin();

    stage.context.clearRect(0, 0, store.windowSize.width, store.windowSize.height);

    var raster = null;

    // TODO: cache rastered image length in store

    if (options.cover) {
      raster = Math_ceil(Math_max(store.windowSize.width / store.rastered.length, store.windowSize.height / store.rastered[0].length));
    } else {
      raster = Math_floor(Math_min(store.windowSize.width / store.rastered.length, store.windowSize.height / store.rastered[0].length));
    }

    var offset = {
      x: Math_round((store.windowSize.width - raster * store.rastered.length) / 2),
      y: Math_round((store.windowSize.height - raster * store.rastered[0].length) / 2),
    };

    var x, y, i, _len, xLen, yLen, x2, x2Len, y2, y2Len, bytePosition;

    var buffer = stage.context.createImageData(store.windowSize.width, store.windowSize.height);
    buffer._length = buffer.data.length;
    buffer._width = buffer.width;

    for (x = 0, xLen = store.rastered.length, yLen = store.rastered[0].length; x < xLen; x++) {
      for (y = 0; y < yLen; y++) {
        var color = store.rastered[x][y];

        var rect = {
          x: x * raster,
          y: y * raster,
          width: raster,
          height: raster,
        };

        var center = {
          x: offset.x + rect.x + rect.width / 2,
          y: offset.y + rect.y + rect.height / 2
        };

        var pointDistance = {
          x: center.x - store.mousePosition.x,
          y: center.y - store.mousePosition.y,
        };

        var distance = Math_sqrt(Math_pow(pointDistance.x, 2) + Math_pow(pointDistance.y, 2));
        var percentage = Math_min(1, distance / (store.falloffDistance / options.falloff));
        var scaling = 0.5 + 0.5 * color.l + (0 - (options.scale - 1) / 1.5 + (options.scale - 1));

        color.a = (color.l / 25) + (color.l / 25 * 24) * (1 - percentage);
        color.a = Math_round(color.a * 255);

        if (color.a === 0) {
          continue;
        }

        var randomNumber = Math_random();
        var burn = Math_sqrt(options.burn);

        rect.x = rect.x - Math_round((raster * scaling) / 2);
        rect.y = rect.y - Math_round((raster * scaling) / 2);
        rect.width = Math_max(1, Math_round(rect.width * scaling));
        rect.height = Math_max(1, Math_round(rect.height * scaling));
        rect.x = Math_round(rect.x + (pointDistance.x * percentage / 1.7 * (burn / 1.75) + percentage * randomNumber * (pointDistance.x / 1.7) * (burn / 1.75)));
        rect.y = Math_round(rect.y + (pointDistance.y * percentage / 2.2 * (burn / 2) + percentage * randomNumber * (pointDistance.y / 2.2) * (burn / 2)));

        if (color.a === 0) continue;

        var startX = offset.x + rect.x;
        var endX = offset.x + rect.x + rect.width;
        var startY = offset.y + rect.y;
        var endY = offset.y + rect.y + rect.height;

        if (startX < 0 || startY < 0 || endX >= store.windowSize.width || endY >= store.windowSize.height) {
          continue;
        }

        if (options.multiply) {
          for (x2 = startX; x2 < endX; x2++) {
            for (y2 = startY; y2 < endY; y2++) {
              bytePosition = ((y2 * (buffer._width * 4)) + (x2 * 4));

              buffer.data[bytePosition + 0] = (buffer.data[bytePosition + 0] || 0) + color.r;
              buffer.data[bytePosition + 1] = (buffer.data[bytePosition + 1] || 0) + color.g;
              buffer.data[bytePosition + 2] = (buffer.data[bytePosition + 2] || 0) + color.b;
              buffer.data[bytePosition + 3] = (buffer.data[bytePosition + 3] || 0) + color.a;
            }
          }
        } else {
          for (x2 = startX; x2 < endX; x2++) {
            for (y2 = startY; y2 < endY; y2++) {
              bytePosition = ((y2 * (buffer._width * 4)) + (x2 * 4));

              buffer.data[bytePosition + 0] = color.r;
              buffer.data[bytePosition + 1] = color.g;
              buffer.data[bytePosition + 2] = color.b;
              buffer.data[bytePosition + 3] = color.a;
            }
          }
        }
      }
    }

    stage.context.putImageData(buffer, 0, 0);

    if (isLocal) stats.end();
  }
});
