//  This program is licensed under the MIT License.
//  Copyright 2013, aike (@aike1000)
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var ctx = new AudioContext();

var convolver = ctx.createConvolver();
var xhr = new XMLHttpRequest();
xhr.open("GET", "twinrev.wav", true);
xhr.responseType = "arraybuffer";
xhr.onload = function() {
    ctx.decodeAudioData(xhr.response,function(buf){
        convolver.buffer = buf;
    }, function(){});
};
xhr.send();

var audioproc = function(stream) {
    var mic = ctx.createMediaStreamSource(stream);
    mic.connect(convolver);
    mic.connect(ctx.destination);
    convolver.connect(ctx.destination);
};

function initialize() {
    navigator.webkitGetUserMedia({audio : true},
        audioproc,
        function(e) { console.log(e); }
    );
}

window.addEventListener("load", initialize, false);
