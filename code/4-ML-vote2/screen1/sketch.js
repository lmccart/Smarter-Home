
var vid;

// this helps with positioning projection
var vx = 600;
var vy = 100;
var vw = 0;
var vh = 0;
var k = 1;


function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(30);
  textAlign(CENTER);

  vid = createVideo('diary.mp4');
  vid.hide();

  vw = 800;
  vh = 800;
}



function draw() {
  background(0);
  image(vid, vx, vy, vw, vh);
}


function mousePressed() {
  vid.loop();
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
