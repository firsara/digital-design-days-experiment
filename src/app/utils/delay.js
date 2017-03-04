
define(function(){
  return function delay(callback, timeout) {
    return function() {
      if (! callback.delay) {
        callback.delay = setTimeout(function(){
          callback.delay = null;
          callback();
        }, timeout || 250);
      }
    }
  }
});
