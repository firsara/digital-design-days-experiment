
define(function(){
  return function getLuminance(color) {
    color.r = color.r / 255;
    color.g = color.g / 255;
    color.b = color.b / 255;

    var max = Math.max(color.r, color.g, color.b);
    var min = Math.min(color.r, color.g, color.b);

    return (max + min) / 2;
  }
});
