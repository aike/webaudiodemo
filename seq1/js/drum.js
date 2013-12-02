//  This program is licensed under the MIT License.
//  Copyright 2013, aike (@aike1000)
var loadwav = function(file, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", file, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function() {
        ctx.decodeAudioData(xhr.response,function(buf){
            callback(buf);
        }, function(){});
    };
    xhr.send();
}

var Drum = function(ctx) {
    this.ctx = ctx;

    this.vol = ctx.createGain();
    this.vol.gain.value = 0.9;
    this.vol.connect(ctx.destination);

    this.kick = null;
    this.hat = null;
    var self = this;
    loadwav('wav/kick.wav', function(buf) { self.kick = buf; });
    loadwav('wav/hat.wav', function(buf) { self.hat = buf; });
}

Drum.prototype.play = function(n, tim) {
    if (n % 4 == 0) {
        var src = ctx.createBufferSource();
        src.buffer = this.kick;             // play Kick sound
        src.connect(this.vol);
        src.start(tim);
    }
    if (n % 4 == 2) {
        var src = ctx.createBufferSource();
        src.buffer = this.hat;              // play Hat sound
        src.connect(this.vol);
        src.start(tim);
    }
}


window.AudioContext = window.AudioContext || window.webkitAudioContext;
var ctx = new AudioContext();
var drum = new Drum(ctx);

var play = function() {
    var t = ctx.currentTime;
    for (var i = 0; i < 64; i++) {
        t += 0.1;
        drum.play(i, t);
    }
}
