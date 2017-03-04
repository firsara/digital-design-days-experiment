
define(function(){
  var store = {
    colors: null,
    imageSrc: null,
    rastered: [[{r: 0, g: 0, b: 0, a: 0, l: 0}]],
    buffer: null,
    cleanBuffer: null,

    windowSize: {
      width: window.innerWidth,
      height: window.innerHeight
    },

    mousePosition: {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    },

    raster: {
      size: null,
      x: null,
      y: null,
      offset: {
        x: null,
        y: null
      }
    },

    updateRasterSize: function(){
      store.raster = null;

      if (! (store.rastered && store.rastered.length && store.rastered[0] && store.rastered[0].length)) {
        return;
      }

      var options = require('options');

      store.raster = {};
      store.raster.x = store.rastered.length;
      store.raster.y = store.rastered[0].length;

      if (options.cover) {
        store.raster.size = Math.ceil(Math.max(store.windowSize.width / store.raster.x, store.windowSize.height / store.raster.y));
      } else {
        store.raster.size = Math.floor(Math.min(store.windowSize.width / store.raster.x, store.windowSize.height / store.raster.y));
      }

      store.raster.offset = {
        x: Math.round((store.windowSize.width - store.raster.size * store.raster.x) / 2),
        y: Math.round((store.windowSize.height - store.raster.size * store.raster.y) / 2),
      };
    }
  };

  return store;
});
