//  This program is licensed under the MIT License.
//  Copyright 2013, aike (@aike1000)
var Synth = function(ctx) {
	this.ctx = ctx;
	this.vol = ctx.createGain();
	this.vol.gain.value = 0.2;
	this.vol.connect(ctx.destination);

	this.seq = [69, 72, 76, 74, 71, 69, 72, 76];
}

Synth.prototype.play = function(n, tim) {
	var osc = ctx.createOscillator();
	osc.type = 2;
	osc.frequency.value = 440.0 * Math.pow(2.0, (this.seq[n % 8] - 69.0) / 12.0);
	osc.connect(this.vol);
	osc.start(tim);
	osc.stop(tim + 0.10);
}


window.AudioContext = window.AudioContext || window.webkitAudioContext;
var ctx = new AudioContext();
var synth = new Synth(ctx);

var play = function() {
	var t = ctx.currentTime;
	for (var i = 0; i < 64; i++) {
		t += 0.1;
		synth.play(i, t);
	}
}
