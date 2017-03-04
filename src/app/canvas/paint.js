
define([
  'stage',
  'store',
  'options'
], function(
  stage,
  store,
  options
){
  var hasStats = typeof Stats !== 'undefined';

  if (hasStats) {
    var stats = new Stats();
    document.body.appendChild(stats.dom);
  }

  var focalLength = 100;

  var x, y, x2, y2, bytePosition, color, rect, pointDistance, distance, percentage, scaling, randomNumber, burn, burnFraction, bufferData;

  return function paint() {
    if (hasStats) stats.begin();
    if (! store.raster) return requestAnimationFrame(paint);

    stage.canvas.width = store.windowSize.width;

    burn = Math.sqrt(options.burn);
    bufferData = store.buffer.data;
    bufferData.set(store.cleanBuffer);

    for (x = 0; x < store.raster.x; x++) {
      for (y = 0; y < store.raster.y; y++) {
        color = store.rastered[x][y];
        randomNumber = Math.random();

        rect = {
          x: store.raster.offset.x + x * store.raster.size,
          y: store.raster.offset.y + y * store.raster.size,
          width: store.raster.size,
          height: store.raster.size
        };

        pointDistance = {
          x: (rect.x + rect.width / 2) - store.mousePosition.x,
          y: (rect.y + rect.height / 2) - store.mousePosition.y,
        };

        distance = Math.sqrt(Math.pow(pointDistance.x, 2) + Math.pow(pointDistance.y, 2));
        percentage = Math.min(1, distance / (store.falloffDistance / options.falloff));

        color.a = Math.round(color.l * 255 * (1 - percentage * (1 - options.light)));

        if (color.a <= 0) {
          continue;
        }

        scaling = 1 + (options.scale / 2) * (1 - percentage) - 0.5 * (options.scale / 2) * percentage;

        rect.z = 1 * focalLength - color.l * focalLength;
        if (focalLength + rect.z !== 0) {
          scaling = scaling / 1.75 + (focalLength / (focalLength + rect.z)) / 1.75;
        }

        percentage = Math.min(1, distance / (store.falloffDistance / burn));

        rect.x = rect.x - Math.round((store.raster.size * scaling) / 2);
        rect.y = rect.y - Math.round((store.raster.size * scaling) / 2);
        rect.width = Math.round(rect.width * scaling);
        rect.height = Math.round(rect.height * scaling);

        rect.x = Math.round(rect.x + (pointDistance.x * percentage / 2.25 * (burn / 2.25) + percentage * randomNumber * (pointDistance.x / 2.25) * burn));

        burnFraction = pointDistance.y < 0 ? 1.5 : 0.75;
        rect.y = Math.round(rect.y + (pointDistance.y * percentage / 1.75 * (burn / 1.75) + percentage * randomNumber * (pointDistance.y / 1.75) * burn) * burnFraction);

        rect.xEnd = rect.x + rect.width;
        rect.yEnd = rect.y + rect.height;

        if (rect.width <= 0 || rect.height <= 0 || rect.x < 0 || rect.y < 0 || rect.xEnd >= store.windowSize.width || rect.yEnd >= store.windowSize.height) {
          continue;
        }

        if (options.multiply) {
          for (x2 = rect.x; x2 < rect.xEnd; x2++) {
            for (y2 = rect.y; y2 < rect.yEnd; y2++) {
              bytePosition = ((y2 * (store.buffer._width * 4)) + (x2 * 4));

              bufferData[bytePosition + 0] = (bufferData[bytePosition + 0] || 0) + color.r;
              bufferData[bytePosition + 1] = (bufferData[bytePosition + 1] || 0) + color.g;
              bufferData[bytePosition + 2] = (bufferData[bytePosition + 2] || 0) + color.b;
              bufferData[bytePosition + 3] = (bufferData[bytePosition + 3] || 0) + color.a;
            }
          }
        } else {
          for (x2 = rect.x; x2 < rect.xEnd; x2++) {
            for (y2 = rect.y; y2 < rect.yEnd; y2++) {
              bytePosition = ((y2 * (store.buffer._width * 4)) + (x2 * 4));

              bufferData[bytePosition + 0] = color.r;
              bufferData[bytePosition + 1] = color.g;
              bufferData[bytePosition + 2] = color.b;
              bufferData[bytePosition + 3] = color.a;
            }
          }
        }
      }
    }

    stage.context.putImageData(store.buffer, 0, 0);

    if (hasStats) stats.end();

    requestAnimationFrame(paint);
  }
});
