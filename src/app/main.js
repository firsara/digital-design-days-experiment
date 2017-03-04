
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
  var fakeMouseDirection = 1;
  var fakeMouseIteration = 1;

  function fakeMouse() {
    if (fakeMouseDirection === -1 || fakeMouseDirection === 1) {
      var fakeMouseStep = store.windowSize.width / 2000 * 11;

      store.mousePosition.x = store.mousePosition.x + (fakeMouseStep + (fakeMouseStep / 2) * Math.random()) * fakeMouseDirection;
      store.mousePosition.y = store.windowSize.height / 2 + fakeMouseStep * 2 * Math.random() * fakeMouseIteration;
      fakeMouseIteration = fakeMouseIteration * -1;

      if (store.mousePosition.x >= store.windowSize.width - store.raster.offset.x / 2) {
        fakeMouseDirection = -1;
      }

      if (store.mousePosition.x < store.raster.offset.x / 2) {
        fakeMouseDirection = 1;
      }

      requestAnimationFrame(fakeMouse);
    }
  }

  function mouseMove(event) {
    fakeMouseDirection = null;

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
    fakeMouseDirection = null;
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
    if (options.animate) {
      if (options.raster > targetRaster) {
        if (options.raster > targetRaster) {
          options.raster = options.raster / 1.05;
        }

        if (options.raster <= targetRaster) {
          targetRaster = 3.5 + Math.random() * 20;
        }
      } else {
        if (options.raster < targetRaster) {
          options.raster = options.raster * 1.05;
        }

        if (options.raster >= targetRaster) {
          targetRaster = 3.5 + Math.random() * 20;
        }
      }
    }

    requestAnimationFrame(animate);
  }

  resize();

  render('pixel.jpg');
  paint();

  var targetRaster = options.raster;
  animate();

  fakeMouse();

  document.addEventListener('gesturestart', function(e){
    e.preventDefault();
    e.stopPropagation();
  });

  window.addEventListener('resize', delay(resize));
  window.addEventListener('mousemove', mouseMove);
  window.addEventListener('touchmove', touchMove);
});
