//  This program is licensed under the MIT License.
//  Copyright 2013, aike (@aike1000)
var Synth = function(ctx) {
	this.ctx = ctx;
	this.vol = ctx.createGain();
	this.vol.gain.value = 0.1;

	this.delay = ctx.createDelay();
	this.delay.delayTime.value = 0.2;
	this.feedback = ctx.createGain();
	this.feedback.gain.value = 0.3;

	///// LFOで周期的に変化するフィルター追加
	this.lpf = ctx.createBiquadFilter();
	this.lpf.type = "lowpass";
	this.lpf.Q.value = 20;
	this.lpf.frequency.value = 4000;
	this.angle = 0.0;
	var self = this;
	this.lfo = function() {
		self.angle += 0.1;
		if (self.angle > 2 * Math.PI)
			self.angle -= 2 * Math.PI;
		self.lpf.frequency.value = 4000 + Math.sin(self.angle) * 3000;
	}
	setInterval(this.lfo, 100);
	/////

	this.vol.connect(this.lpf);
	this.lpf.connect(this.delay);
	this.lpf.connect(ctx.destination);
	this.delay.connect(this.feedback);
	this.feedback.connect(this.delay);
	this.feedback.connect(ctx.destination);

	this.seq = [69, 72, 76, 74, 71, 69, 72, 76];
}

Synth.prototype.play = function(n, tim) {
	for (j = 0; j < 3; j++) {
		var osc = ctx.createOscillator();
		osc.type = "sawtooth";
		var detune = 3 * j;
		osc.frequency.value = 440.0 * Math.pow(2.0, (this.seq[n % 8] - 69.0) / 12.0) + detune;
		osc.connect(this.vol);
		osc.start(tim);
		osc.stop(tim + 0.10);
	}
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
