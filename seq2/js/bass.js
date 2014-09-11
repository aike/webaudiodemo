//  This program is licensed under the MIT License.
//  Copyright 2013, aike (@aike1000)
var Bass = function(ctx) {
	this.ctx = ctx;

	this.vol = ctx.createGain();
	this.vol.gain.value = 0.3;

	this.lpf = ctx.createBiquadFilter();
	this.lpf.type = "lowpass"; // LPF
	this.lpf.Q.value = 5;
	this.lpf.frequency.value = 1500;

	this.vol.connect(this.lpf);
	this.lpf.connect(ctx.destination);

	this.seq = [
		33, 33, 40, 33, 33, 40, 33, 33,
		33, 33, 40, 33, 33, 40, 33, 33,
		31, 31, 31, 38, 38, 31, 31, 38,	
		29, 29, 36, 29, 36, 29, 29, 29
	];
}

Bass.prototype.play = function(n, tim) {
	var osc = ctx.createOscillator();
	osc.type = "sawtooth";
	osc.frequency.value = 440.0 * Math.pow(2.0, (this.seq[n % 32] - 69.0) / 12.0);
	osc.connect(this.vol);
	osc.start(tim);
	osc.stop(tim + 0.08);	
}


window.AudioContext = window.AudioContext || window.webkitAudioContext;
var ctx = new AudioContext();
var bass = new Bass(ctx);

var play = function() {
	var t = ctx.currentTime;
	for (var i = 0; i < 64; i++) {
		t += 0.1;
		bass.play(i, t);
	}
}
