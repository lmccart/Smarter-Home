var p = 0;
var n = 0;
var heart;

function preload() {
  heart = loadImage("heart.png");
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  initDatabase();
  textSize(30);
  textAlign(CENTER);
}

function draw() {
  background(200);
  text("positive: "+p+" negative: "+n, width/2, height/2);

  for (var i=0; i<p; i++) {
    image(heart, width/2, height-5-(i*5), 5, 5);
  }

}





var vx = 0;
var vy = 0;
var vw = 0;
var vh = 0;
var k = 1;

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