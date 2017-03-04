
define([
  'store',
  'utils/rasterize',
  'utils/delay',
  'cam/stream'
], function(
  store,
  rasterize,
  delay,
  stream
){
  var defaultOptions = {
    preset: 'default',
    webcam: false,
    animate: false,
    raster: 4,
    scale: 1,
    burn: 1,
    falloff: 1,
    light: 0,
    multiply: true,
    audio: true,
    tone: 'sine',
    tonePower: 1.25,
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
        store.updateRasterSize();
      }

      options.updateGui();
    },

    animate: defaultOptions.animate,
    preset: defaultOptions.preset,
    webcam: defaultOptions.webcam,
    scale: defaultOptions.scale,
    burn: defaultOptions.burn,
    falloff: defaultOptions.falloff,
    light: defaultOptions.light,
    multiply: defaultOptions.multiply,
    audio: defaultOptions.audio,
    tone: defaultOptions.tone,
    tonePower: defaultOptions.tonePower,
    cover: defaultOptions.cover,

    upload: function(){
      fileInput.click();
    },

    reset: function(){
      options.animate = defaultOptions.animate;
      options.preset = defaultOptions.preset;
      options.webcam = defaultOptions.webcam;
      options.raster = defaultOptions.raster;
      options.scale = defaultOptions.scale;
      options.burn = defaultOptions.burn;
      options.falloff = defaultOptions.falloff;
      options.light = defaultOptions.light;
      options.multiply = defaultOptions.multiply;
      options.audio = defaultOptions.audio;
      options.tone = defaultOptions.tone;
      options.tonePower = defaultOptions.tonePower;
      options.cover = defaultOptions.cover;

      options.updateGui();

      if (store.imageSrc !== 'pixel.jpg') {
        require('canvas/render')('pixel.jpg');
      }
    },

    updateGui: function(){
      if (gui) {
        for (var i in gui.__controllers) {
          gui.__controllers[i].updateDisplay();
        }
      }
    },

    setPreset: function(){
      switch (options.preset) {
        case 'static':
          options.raster = 4;
          options.burn = 1;
          options.scale = 3;
          options.falloff = 0.5;
          options.light = 0;
          options.multiply = false;
          options.cover = false;
        break;

        case 'investigage':
          options.raster = 2;
          options.burn = 5;
          options.scale = 3;
          options.falloff = 2;
          options.light = 0;
          options.multiply = true;
          options.cover = false;
        break;

        default:
          options.raster = defaultOptions.raster;
          options.scale = defaultOptions.scale;
          options.burn = defaultOptions.burn;
          options.falloff = defaultOptions.falloff;
          options.light = defaultOptions.light;
          options.multiply = defaultOptions.multiply;
          options.cover = defaultOptions.cover;
      }

      options.updateGui();
    },

    toggleWebcam: function(){
      delay(setWebcam, 250)();
    }
  };

  function selectedFile() {
    var file = fileInput.files[0];
    var reader = new FileReader();

    reader.addEventListener('load', function(){
      require('canvas/render')(reader.result);
    });

    reader.readAsDataURL(file);

    options.raster = 5;
    options.scale = 1;
    options.falloff = 1;
    options.light = 0.5;
    options.multiply = true;
    options.cover = false;

    options.updateGui();
  }

  function setWebcam() {
    if (options.webcam) {
      options.raster = 5;
      stream();
    } else {
      stream.stop();

      if (store.imageSrc !== 'pixel.jpg') {
        require('canvas/render')('pixel.jpg');
      }
    }
  }

  var fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.addEventListener('change', selectedFile);

  var hasGui = typeof dat !== 'undefined';

  if (hasGui) {
    var gui = new dat.GUI();
    gui.add(options, 'reset');
    gui.add(options, 'upload');

    if ((navigator.mediaDevices && navigator.mediaDevices.getUserMedia) || navigator.getUserMedia) {
      var controller = gui.add(options, 'webcam');
      controller.onChange(options.toggleWebcam);
      controller.onFinishChange(options.toggleWebcam);
    }

    var controller = gui.add(options, 'preset', ['default', 'static', 'investigage']);
    controller.onChange(options.setPreset);
    controller.onFinishChange(options.setPreset);

    gui.add(options, 'animate');
    gui.add(options, 'raster', screen.width < 1025 ? 5 : 2, 10, 0.1);
    gui.add(options, 'burn', 0, 5, 0.01);
    gui.add(options, 'scale', 0, 3, 0.01);
    gui.add(options, 'falloff', 0.5, 2, 0.01);
    gui.add(options, 'light', 0, 1, 0.01);
    gui.add(options, 'multiply');
    gui.add(options, 'audio');
    gui.add(options, 'tone', ['sine', 'square', 'triangle', 'sawtooth']);
    gui.add(options, 'tonePower', 1, 2, 0.01);
    gui.add(options, 'cover');

    if (screen.width < 1025) {
      gui.close();
    }
  }

  return options;
});
