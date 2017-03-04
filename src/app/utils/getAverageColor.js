
define(function(){
  return function getAverageColor(colors, x, y, width, height) {
    var count = 0;

    var rgb = {
      r: 0,
      g: 0,
      b: 0,
      a: 0,
    };

    for (var _x = x; _x < x + width; _x++) {
      if (! colors[_x]) continue;

      for (var _y = y; _y < y + height; _y++) {
        if (! colors[_x][_y]) continue;

        count++;
        rgb.r += colors[_x][_y].r;
        rgb.g += colors[_x][_y].g;
        rgb.b += colors[_x][_y].b;
        rgb.a += colors[_x][_y].a;
      }
    }

    rgb.r = rgb.r / count;
    rgb.g = rgb.g / count;
    rgb.b = rgb.b / count;
    rgb.a = rgb.a / count;

    return rgb;
  }
});
