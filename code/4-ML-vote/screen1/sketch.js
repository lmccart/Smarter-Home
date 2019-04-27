var p = 0;
var n = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  initDatabase();
}

function draw() {

  background(200);
  text("positive: "+p+" negative: "+n, width/2, height/2);
}

function keyPressed() {
  if (key === '1') {
    addVote('positive');
  } else if (key === '2') {
    addVote('negative');
  }
}


function addVote(type) {
  if (type === 'positive') {
    p = p + 1;
    firebase.database().ref('/positive/').set(p);
  } else if (type === 'negative') {
    n = n + 1;
    firebase.database().ref('/negative/').set(n);
  }
}