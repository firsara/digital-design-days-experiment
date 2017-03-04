
define([
  'options',
  'store',
  'stage',
  'utils/delay',
  'canvas/render',
  'canvas/paint',
  'audio/playTone'
], function(
  options,
  store,
  stage,
  delay,
  render,
  paint,
  playTone
){
  function mouseMove(event) {
    store.mousePosition = {
      x: event.pageX,
      y: event.pageY
    };

    if (options.audio) {
      delay(playTone, 340)();
    }
  }

  function touchMove(event) {
    event.preventDefault();
    event.stopPropagation();

    if (! (event.touches && event.touches[0])) return;
    mouseMove(event.touches[0]);
  }

  function resize() {
    store.windowSize = {
      width: window.innerWidth,
      height: window.innerHeight,
      centerX: Math.round(window.innerWidth / 2),
      centerY: Math.round(window.innerHeight / 2)
    };

    stage.canvas.width = window.innerWidth;
    stage.canvas.height = window.innerHeight;

    store.falloffDistance = Math.sqrt(Math.pow(store.windowSize.width, 2) + Math.pow(store.windowSize.height, 2)) / 6;

    store.buffer = new ImageData(store.windowSize.width, store.windowSize.height);
    store.buffer._length = store.buffer.data.length;
    store.buffer._width = store.buffer.width;

    store.cleanBuffer = new Uint8ClampedArray(store.buffer._length);
    store.updateRasterSize();
  }

  function animate() {
    if (options.raster > targetRaster * 1.25) {
      if (options.raster < targetRaster * 1.5) {
        options.raster = options.raster / 1.2;
      } else {
        options.raster = options.raster / 1.05;
      }

      requestAnimationFrame(animate);
    } else {
      options.raster = targetRaster;
    }
  }

  resize();

  render('pixel.jpg');
  paint();

  var targetRaster = options.raster;
  options.raster = 500;
  animate();

  document.addEventListener('gesturestart', function(e){
    e.preventDefault();
    e.stopPropagation();
  });

  window.addEventListener('resize', delay(resize));
  window.addEventListener('mousemove', mouseMove);
  window.addEventListener('touchmove', touchMove);
});
