
define([
  './getLuminance'
], function(
  getLuminance
){
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');

  var maxDimensions = {
    width: 1200,
    height: 628
  };

  return function getImageColors(image) {
    var size = {
      width: image.width,
      height: image.height
    };

    if (size.width > maxDimensions.width || size.height > maxDimensions.height) {
      var scale = Math.min(maxDimensions.width / size.width, maxDimensions.height / size.height);
      size.width = Math.round(scale * size.width);
      size.height = Math.round(scale * size.height);
    }

    canvas.width = size.width;
    canvas.height = size.height;

    context.drawImage(image, 0, 0, size.width, size.height);

    var buffer = context.getImageData(0, 0, size.width, size.height);
    var bufferData = buffer.data;
    var imageDataWidth = buffer.width;

    var bytePosition = null;
    var color = null;
    var colors = [];

    for (var x = 0; x < size.width; x++) {
      colors[x] = [];

      for (var y = 0; y < size.height; y++) {
        bytePosition = ((y * (imageDataWidth * 4)) + (x * 4));

        color = {};
        color.r = Math.floor(bufferData[bytePosition + 0] * 255);
        color.g = Math.floor(bufferData[bytePosition + 1] * 255);
        color.b = Math.floor(bufferData[bytePosition + 2] * 255);
        color.a = bufferData[bytePosition + 3];
        color.l = getLuminance(color);

        colors[x][y] = color;
      }
    }

    return colors;
  }
});
