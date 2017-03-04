
define([
  'store',
  'options',
  'stage',
  'utils/getLuminance'
], function(store,
  options,
  stage,
  getLuminance
){
  var context = new AudioContext();

  var FADE_IN_TIME = 1;
  var FADE_OUT_TIME = 15;
  var VOLUMES = {
    sine: 0.25,
    square: 0.075,
    triangle: 0.175,
    sawtooth: 0.09
  };

  var defaultColor = {
    r: 11,
    g: 22,
    b: 26,
  };

  defaultColor.l = getLuminance(defaultColor);

  return function playTone() {
    var pixelData = stage.context.getImageData(store.mousePosition.x, store.mousePosition.y, 1, 1).data;
    var color = {
      r: pixelData[0] * 255,
      g: pixelData[1] * 255,
      b: pixelData[2] * 255,
    };

    if (color.r === 0 && color.g === 0 && color.b === 0) {
      color = defaultColor;
    }

    color.l = getLuminance(color);

    var gain = context.createGain();
    gain.connect(context.destination);
    gain.gain.value = 0.00001;
    gain.gain.exponentialRampToValueAtTime(VOLUMES[options.tone], context.currentTime + FADE_IN_TIME);
    gain.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + FADE_IN_TIME + FADE_OUT_TIME);

    var oscillator = context.createOscillator();
    oscillator.type = options.tone;
    oscillator.frequency.value = Math.pow(Math.sqrt(Math.sqrt((color.r * color.b * color.g) * (0.5 + 1 * (color.l / 255)))), 0.25 + options.tonePower);
    oscillator.connect(gain);
    oscillator.start();

    setTimeout(function(){
      gain.disconnect();
      oscillator.disconnect();
    }, (FADE_IN_TIME + FADE_OUT_TIME) * 1.1 * 1000);
  }
});
