var mic;
var volume = -1;
var input = [];

function setupMic() {
  for (var i=0; i<10; i++) {
    input[i] = 0;
  }
  // Create an Audio input
  mic = new p5.AudioIn();

  // start the Audio Input.
  // By default, it does not .connect() (to the computer speakers)
  mic.start();
}

function updateMic() {
  if (started) {
    for (var i=1; i<input.length; i++) {
      input[i-1] = input[i];
    }
    input[input.length - 1] = mic.getLevel() * 1.2;

    var v = 0;
    for (var i=0; i<input.length; i++) {
      v += input[i];
    }
    volume = v / input.length;
  }
}



