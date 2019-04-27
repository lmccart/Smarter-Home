function setup() {
  createCanvas(600, 400);
  setupML();
}

function draw() {
  if (future == 'positive') {
    drawPositive();
  } else if (future == 'negative') {
    drawNegative(); 
  }
}

function drawPositive() {
  background(0);
  fill(0);
  text("POSITIVE", width/2, height/2);
}

function drawNegative() {
  background(0);
  fill(255);
  text("NEGATIVE", width/2, height/2);
}
