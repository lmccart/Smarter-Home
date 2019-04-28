var video;
var vx = 0;
var vy = 0;
var vw = 0;
var vh = 0;
var k = 1;
var started = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  vw = width;
  vh = height;

  // you can change the video file here. make sure it's in the project folder.
  video = createVideo("fingers.mov", function() {
    video.hide();
    video.loop();
  });

}

function draw() {
  background(0);
  updateMic();
  
  if (video.width) image(video, vx, vy, vw, vh);

  // this blacks out video unless mic volume is more than 0.3
  // you can adjust this level
  if (volume < 0.3) {
    background(0);
  }
  console.log(volume)
  
}


// this helps with positioning projection
function keyPressed() {
  if (key === '1') {
    k = 1;
  }
  else if (key === '2') {
    k = 2;
  }
  else if (key === '3') {
    k = 3;
  }
  else if (key === '4') {
    k = 4;
  }
  else if (keyCode === LEFT_ARROW) {
    if (k == 1) {
      vx--;
      vw++;
    } else if (k == 3) {
      vw--;
    }
  }
  else if (keyCode === RIGHT_ARROW) {
    if (k == 1) {
      vx++;
      vw--;
    } else if (k == 3) {
      vw++;
    }
  }
  else if (keyCode === UP_ARROW) {
    if (k == 2) {
      vy--;
      vh++;
    } else if (k == 4) {
      vh--;
    }
  }
  else if (keyCode === DOWN_ARROW) {
    if (k == 2) {
      vy++;
      vh--;
    } else if (k == 4) {
      vh++;
    }
  }
  console.log(vx, vy, vw, vh);
}