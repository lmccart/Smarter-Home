function setup() {
  startTracking();
  createCanvas(windowWidth, windowHeight);
  background(200);
}


function draw() {

}

function circleHit() {
  background(random(255), random(255), random(255));
  fill(0);
  ellipse(circleX, circleY, 50, 50);

  if (circleX < 200 && circleY < 250) {
    // 1st quadrant (adjust 200 and 250 as needed)
  }

}