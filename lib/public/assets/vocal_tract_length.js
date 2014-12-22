var JSRecorder = (function() {
  var audio_context;
  var recorder;

  function setupAudioContext(resolve, reject) {
    try {
      // webkit shim
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
      window.URL = window.URL || window.webkitURL;

      audio_context = new AudioContext;

      navigator.getUserMedia({audio: true}, function(stream) {
        startUserMedia(stream, resolve, reject);
      }, reject);
    } catch (e) {
      reject(e);
    }
  }

  function startUserMedia(stream, resolve, reject) {
    var input = audio_context.createMediaStreamSource(stream);
    recorder = new Recorder(input);
    if (recorder) {
      resolve(recorder);
    } else {
      reject(Error('Recorder could not be created'));
    }
  }

  return {
    getRecorder: function() {
      return new Promise(function(resolve, reject) {
        setupAudioContext(resolve, reject);
      });
    }
  };
}());
var recorder;

window.onload = function() {
  JSRecorder.getRecorder().then(function(newRecorder) {
    recorder = newRecorder;
    document.querySelector("[data-id=allowHint]").style.display = 'none';
    startRecordingButton = document.querySelector("[data-action=startRecording]");
    startRecordingButton.disabled = false;
    startRecordingButton.addEventListener("click", startRecording, false);
  }, function(e) {
    alert('No web audio support in this browser!');
    console.log(e);
  });
}

function startRecording() {
  this.innerHTML = "Recording... ";
  this.disabled = true;
  recorder && recorder.record();

  setTimeout(stopRecording, 2000, this);
}

function stopRecording(button) {
  recorder && recorder.stop();

  document.querySelector("[data-action=startRecording]").innerHTML =
    "Calculating...";
  recorder.exportWAV(sendWAV);
}

function calculateVocalTractLength(formant1) {
  return 34400 / (4.0 * formant1);
}

function roundTo(number, places) {
  return Math.round(number * Math.pow(10, places))/Math.pow(10, places);
}

function setFormant1Result(formant1Text) {
  formant1 = parseFloat(formant1Text);
  document.querySelector("[data-action=startRecording]").disabled = false;
  document.querySelector("[data-action=startRecording]").innerHTML =
    "Record";
  document.querySelector("[data-id=results]").style.display = 'initial';
  document.querySelector("[data-id=formant1]").innerHTML = roundTo(formant1, 0);
  document.querySelector("[data-id=vocalTractLength]").innerHTML = roundTo(calculateVocalTractLength(formant1), 1);
}

function sendWAV(blob) {
  var formData = new FormData();
  formData.append('data', blob);
  xhr = new XMLHttpRequest();
  xhr.open("POST", "extract_formant1", true);
  xhr.onload = function() {
    setFormant1Result(xhr.responseText);
  }
  xhr.send(formData);

  recorder.clear();
}



