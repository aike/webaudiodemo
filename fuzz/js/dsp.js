//  This program is licensed under the MIT License.
//  Copyright 2013, aike (@aike1000)
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var ctx = new AudioContext();

var fuzz = ctx.createScriptProcessor(1024, 1, 1);
fuzz.onaudioprocess = function(event) {
    var sin = event.inputBuffer.getChannelData(0);
    var sout = event.outputBuffer.getChannelData(0);

    // Noise Gate
    var sum = 0;
    for (var i = 0; i < sin.length; i++) {
        sum += Math.abs(sin[i]);
    }
    if (sum < 20.0) {
        for (var i = 0; i < sin.length; i++) {
            sout[i] = 0;
        }
        return;
    }

    // Distortion
    var limit = 0.2;
    for (var i = 0; i < sin.length; i++) {
        var sig = sin[i] * 6;           // Boost
        if (sig >  limit) sig =  limit; // Clip
        if (sig < -limit) sig = -limit; // Clip
        sout[i] = sig;
    }
};


var audioproc = function(stream) {
    var mic = ctx.createMediaStreamSource(stream);
    mic.connect(fuzz);
    fuzz.connect(ctx.destination);
};

function initialize() {
    navigator.webkitGetUserMedia(
        {audio : true},
        audioproc,
        function(e) {
            console.log(e);
        }
    );
}

window.addEventListener("load", initialize, false);

