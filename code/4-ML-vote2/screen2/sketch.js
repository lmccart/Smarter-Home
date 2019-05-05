var p = 0;
var n = 0;
var lastVote;
var vote = 'none';
var voteTimeout;
var heart;
var heartPosP = [];
var heartPosN = [];
var vidStatus;
var template;

var vidP;
var vidN;

function preload() {
  heart = loadImage("heart.png");
  template = loadImage("projectionB_template.png");
}

function setup() {
  createCanvas(1200, 800);
  initTracking();
  textSize(30);
  textAlign(CENTER);
  for (var i=0; i<30; i++) {
    heartPosP[i] = [random(0.6*width, 0.8*width), random(height-200, height-50)];
    heartPosN[i] = [random(0.2*width, 0.4*width), random(height-200, height-50)];
  }

  vidP = createVideo("fingers.mov", function() {
    vidP.hide();
  });
  vidN = createVideo("diary.mp4", function() {
    vidN.hide();
  });
}



function draw() {
  lastVote = vote;
  updateTracking();

  console.log(p, n);
  canvas.getContext('2d').clearRect(0, 0, width, height)
  drawSkeleton(); 

  if (p < 30 && n < 30) {
    // update tracking and add vote if needed

    if (vote !== lastVote && vote == 'positive') {
      addVote('positive');
    }
    else if (vote !== lastVote && vote == 'negative') {
      addVote('negative');
    }

    image(template, 0, 0, width, height);
    for (var i=0; i<p; i++) {
      image(heart, heartPosP[i][0], heartPosP[i][1], 50, 50);
    }
    for (var i=0; i<n; i++) {
      image(heart, heartPosN[i][0], heartPosN[i][1], 50, 50);
    }
  } else if (p == 30) {
    vidP.play();
    vidStatus = 'p';
    setTimeout(reset, 5000);
    p = 100;
    n = 100;
  } else if (n == 30) {
    vidN.play();
    vidStatus = 'n';
    setTimeout(reset, 5000);
    p = 100;
    n = 100;
  }
  if (vidStatus === 'p') {
    image(vidP, 0, 0, width, height);
  }
  else if (vidStatus === 'n') {
    image(vidN, 0, 0, width, height);
  }
}



// adds vote to database so it can be retrieved by second screen
function addVote(type) {
  if (!voteTimeout) {
    voteTimeout = setTimeout(clearVoteTimeout, 500);
    if (type === 'positive') {
      p = p + 1;
      // firebase.database().ref('/positive/').set(p);
    } else if (type === 'negative') {
      n = n + 1;
      // firebase.database().ref('/negative/').set(n);
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
  } else if (key == '0') {
    clearVotes();
  }
}

function reset() {
  p = 0;
  n = 0;
  vidP.stop();
  vidN.stop();
  vidStatus = null;
}