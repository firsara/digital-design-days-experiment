
define(function(){
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');

  return {
    canvas: canvas,
    context: context
  };
});
