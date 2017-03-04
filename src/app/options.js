
define([
  'store',
  'utils/rasterize'
], function(
  store,
  rasterize
){
  var defaultOptions = {
    raster: 4,
    scale: 1,
    burn: 1,
    falloff: 1,
    multiply: true,
    audio: true,
    tone: 'sine',
    cover: false,
  };

  var options = {
    _raster: defaultOptions.raster,

    get raster(){
      return options._raster;
    },

    set raster(newValue){
      options._raster = newValue;

      if (store.colors) {
        store.rastered = rasterize(store.colors, options.raster);
      }

      options.updateGui();
    },

    scale: defaultOptions.scale,
    burn: defaultOptions.burn,
    falloff: defaultOptions.falloff,
    multiply: defaultOptions.multiply,
    audio: defaultOptions.audio,
    tone: defaultOptions.tone,
    cover: defaultOptions.cover,

    upload: function(){
      // TODO: upload image
      options.raster = 10;
      options.scale = 2;
      options.falloff = 0.5;
      options.multiply = true;
      options.cover = false;
    },

    reset: function(){
      options.raster = defaultOptions.raster;
      options.scale = defaultOptions.scale;
      options.burn = defaultOptions.burn;
      options.falloff = defaultOptions.falloff;
      options.multiply = defaultOptions.multiply;
      options.audio = defaultOptions.audio;
      options.tone = defaultOptions.tone;
      options.cover = defaultOptions.cover;

      options.updateGui();
    },

    updateGui: function(){
      if (gui) {
        for (var i in gui.__controllers) {
          gui.__controllers[i].updateDisplay();
        }
      }
    }
  };

  var hasGui = typeof dat !== 'undefined';

  if (hasGui) {
    var gui = new dat.GUI();
    gui.add(options, 'reset');
    gui.add(options, 'upload');
    gui.add(options, 'raster', 2, 10, 0.1);
    gui.add(options, 'burn', 0.5, 5, 0.01);
    gui.add(options, 'scale', 0, 2, 0.01);
    gui.add(options, 'falloff', 0.5, 2, 0.01);
    gui.add(options, 'multiply');
    gui.add(options, 'audio');
    gui.add(options, 'tone', ['sine', 'square', 'triangle', 'sawtooth']);
    gui.add(options, 'cover');
  }

  return options;
});
