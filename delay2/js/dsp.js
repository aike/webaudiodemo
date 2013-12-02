//  This program is licensed under the MIT License.
//  Copyright 2013, aike (@aike1000)
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var ctx = new AudioContext();

var delay = ctx.createDelay();
delay.delayTime.value = 0.5;

var feedback = ctx.createGain();
feedback.gain.value = 0.4;

var audioproc = function(stream) {
    var mic = ctx.createMediaStreamSource(stream);
    mic.connect(delay);
    mic.connect(ctx.destination);
    delay.connect(feedback);
    feedback.connect(delay);
    feedback.connect(ctx.destination);
};

function initialize() {
    navigator.webkitGetUserMedia({audio : true},
        audioproc,
        function(e) { console.log(e); }
    );
}

window.addEventListener("load", initialize, false);
