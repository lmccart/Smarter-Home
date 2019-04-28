var p = 0;
var n = 0;
var lastVote;
var vote = 'none';
var voteTimeout;

function setup() {
  createCanvas(windowWidth, windowHeight);
  initDatabase();
  initTracking();
  textSize(30);
  textAlign(CENTER);
}



function draw() {

  // update tracking and add vote if needed
  lastVote = vote;
  updateTracking();
  if (vote !== lastVote && vote == 'positive') {
    addVote('positive');
  }
  else if (vote !== lastVote && vote == 'negative') {
    addVote('negative');
  }

  // draw sketch
  background(200);
  text("positive: "+p+" negative: "+n, width/2, height/2);
  text("vote: "+vote, width/2, height/2 + 50);
}



// adds vote to database so it can be retrieved by second screen
function addVote(type) {
  if (!voteTimeout) {
    voteTimeout = setTimeout(clearVoteTimeout, 3000);
    if (type === 'positive') {
      p = p + 1;
      firebase.database().ref('/positive/').set(p);
    } else if (type === 'negative') {
      n = n + 1;
      firebase.database().ref('/negative/').set(n);
    }
  } else {
    console.log('vote ignored, too soon');
  }
}


// helper methods
function clearVoteTimeout() {
  if (voteTimeout) clearTimeout(voteTimeout);
  voteTimeout = null;
}

function keyPressed() {
  if (key == '1') {
    addVote('positive');
  } else if (key == '2') {
    addVote('negative');
  }
}
