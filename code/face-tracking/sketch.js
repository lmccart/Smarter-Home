var capture;
var scenes = [];
var num = 0;
var sound;


function preload() {
  sound = loadSound("doorbell.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  startTracking();
}

function draw() {
  updateFace();
  background(200);

  scenes[num]();
}


scenes[0] = function() {
  // draw scene 1 here
  background(255, 0, 0);

}

scenes[1] = function() {
  // draw scene 2 here
  background(0, 255, 0);

}

scenes[2] = function() {
  // draw scene 3 here
  background(0, 0, 255);
}

// add more scenes by copying the format above




function blink() {
  // pick a random new scene that is different than the current one
  var oldNum = num;
  while (oldNum === num) {
    num = floor(random(0, scenes.length));
  }

  // play sound
  sound.play();
}