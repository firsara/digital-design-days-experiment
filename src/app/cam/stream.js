
define([
  'utils/rasterize',
  'utils/getImageColors'
], function(
  rasterize,
  getImageColors
){
  var store = null;
  var options = null;

  var video = document.createElement('video');
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  var mediaStream = null;
  var isStreaming = false;
  var frames = 0;

  function paint() {
    if (isStreaming) {
      frames++;

      if (frames >= 5) {
        frames = 0;
      } else {
        return requestAnimationFrame(paint);
      }

      var width = Math.round(video.videoWidth / 1.5);
      var height = Math.round(video.videoHeight / 1.5);

      if (width > 0 && height > 0) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);

        var buffer = context.getImageData(0, 0, width, height);
        store.colors = getImageColors.fromData(buffer);
        store.rastered = rasterize(store.colors, options.raster);
        store.updateRasterSize();
      }

      requestAnimationFrame(paint);
    }
  }

  function attach(stream) {
    mediaStream = stream;
    video.src = URL.createObjectURL(stream);
    isStreaming = true;
    paint();
  }

  function streamError(err){}

  function stream() {
    if (! store) store = require('store');
    if (! options) options = require('options');

    stream.stop();

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({audio: false, video: true}).then(attach).catch(streamError);
    } else {
      navigator.getUserMedia({audio: false, video: true}, attach, streamError);
    }
  }

  stream.stop = function(){
    video.src = '';
    isStreaming = false;

    if (mediaStream) {
      mediaStream.getTracks().forEach(function(track){ track.stop(); });
      mediaStream.getAudioTracks().forEach(function(track){ track.stop(); });
      mediaStream.getVideoTracks().forEach(function(track){ track.stop(); });

      try {
        mediaStream.stop();
      } catch(err) {}

      mediaStream = null;
    }
  };

  return stream;
});
