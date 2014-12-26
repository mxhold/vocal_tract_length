'use strict';

var JSRecorder = (function() {
  var audio_context;

  function setupAudioContext() {
    // webkit shim
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    window.URL = window.URL || window.webkitURL;
  }

  function getRecorder() {
    return new Promise(function(resolve, reject) {
      try {
        setupAudioContext();

        audio_context = new AudioContext;

        navigator.getUserMedia({audio: true}, function(stream) {
          var input = audio_context.createMediaStreamSource(stream);
          var recorder = new Recorder(input);
          if (recorder) {
            resolve(recorder);
          } else {
            reject(Error('Recorder could not be created'));
          }
        }, reject);
      } catch (e) {
        reject(e);
      }
    });
  }

  return {
    getRecorder: getRecorder,
  };
}());
var recorder;

window.onload = setupRecorder;

function setupRecorder() {
  JSRecorder.getRecorder().then(function(newRecorder) {
    recorder = newRecorder;
    afterRecorderSetup();
  }, function(e) {
    alert('No web audio support in this browser!');
    console.log(e);
  });
}

function afterRecorderSetup() {
  hideAllowHint();
  RecordButton.readyForRecording();
}

function hideAllowHint() {
  document.querySelector("[data-id=allowHint]").style.display = 'none';
}

var RecordButton = (function() {
  var element = function() {
    return document.querySelector("[data-action=startRecording]");
  }

  return {
    readyForRecording: function() {
      element().innerHTML = "Record";
      element().disabled = false;
      element().addEventListener("click", startRecording, false);
    },
    startRecording: function() {
      element().innerHTML = "Recording... ";
      element().disabled = true;
    },
    stopRecording: function() {
      element().innerHTML = "Calculating...";
    },
  };
}());

function startRecording() {
  RecordButton.startRecording();
  recorder.record();

  setTimeout(stopRecording, 2000, this);
}

function stopRecording(button) {
  recorder.stop();

  recorder.exportWAV(sendWAV);
}

function calculateVocalTractLength(formant1) {
  return 34400 / (4.0 * formant1);
}

function roundTo(number, places) {
  return Math.round(number * Math.pow(10, places))/Math.pow(10, places);
}

function setFormant1Result(formant1Text) {
  var formant1 = parseFloat(formant1Text);
  RecordButton.readyForRecording();
  document.querySelector("[data-id=results]").style.display = 'initial';
  document.querySelector("[data-id=formant1]").innerHTML = roundTo(formant1, 0);
  document.querySelector("[data-id=vocalTractLength]").innerHTML = roundTo(calculateVocalTractLength(formant1), 1);
}

function sendWAV(blob) {
  var formData = new FormData();
  formData.append('data', blob);
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "extract_formant1", true);
  xhr.onload = function() {
    setFormant1Result(xhr.responseText);
  }
  xhr.send(formData);

  recorder.clear();
}
