//  This program is licensed under the MIT License.
//  Copyright 2013, aike (@aike1000)
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var ctx = new AudioContext();

///// 全ての楽器を生成
var drum = new Drum(ctx);
var bass = new Bass(ctx);
var synth = new Synth(ctx);

var play = function() {
	var t = ctx.currentTime;
	for (var i = 0; i < 128; i++) {
		t += 0.1;
		drum.play(i, t);
		bass.play(i, t);
		synth.play(i, t);
	}
}
