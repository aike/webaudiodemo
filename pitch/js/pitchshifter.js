//  This program is licensed under the MIT License.
//  Copyright 2013, aike (@aike1000)
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var ctx = new AudioContext();
var rate = 2.0;

var stream_length = 4096;
var pitchShifter = ctx.createScriptProcessor(stream_length, 1, 1);
var fft = new FFT(stream_length, this.ctx.sampleRate);
var hann = new WindowFunction(DSP.HANN);
var a_real = new Array(stream_length);
var a_imag = new Array(stream_length);
var pshift = function(val, indata) {
    this.fft.forward(indata);
    for (var i = 0; i < stream_length; i++) {
        a_real[i] = 0;
        a_imag[i] = 0;
    }
    for (var i = 0; i < stream_length; i++) {
        var index = parseInt(i * val);
        var eq = 1.0;
        if (i > stream_length / 2) {
            eq = 0;
        }
        if ((index >= 0) && (index < stream_length)) {
            a_real[index] += fft.real[i] * eq;
            a_imag[index] += fft.imag[i] * eq;
        } 
    }
    return this.fft.inverse(this.a_real, this.a_imag);
}

pitchShifter.onaudioprocess = function(event) {
    var sin = event.inputBuffer.getChannelData(0);
    var sout = event.outputBuffer.getChannelData(0);
    var data = pshift(rate, sin);    // 1.0:normal  2.0:1oct up  0.5:1oct down
    for (var i = 0; i < sin.length; i++) {
        sout[i] = data[i];
    }
};

var audioproc = function(stream) {
    var mic = ctx.createMediaStreamSource(stream);
    mic.connect(pitchShifter);
    pitchShifter.connect(ctx.destination);
};

var toggle = function() {
    rate = (2.0 + 0.7) - rate;
}

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

