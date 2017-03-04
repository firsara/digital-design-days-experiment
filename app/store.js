
define(function(){
  var store = {
    colors: null,
    rastered: [[{r: 0, g: 0, b: 0, a: 0, l: 0}]],
    windowSize: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    mousePosition: {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    }
  };

  return store;
});
