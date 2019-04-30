let video;
let poseNet;
let pose;
let vote = 'none';
let leftDiff, rightDiff;

function setup() {
  createCanvas(640, 480);
  textSize(30);
  textAlign(CENTER);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    if (results.length) {
      pose = results[0].pose;
    } else {
      pose = null;
    }
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  select('#status').remove();
}

function mousePressed(){
  console.log(pose)
}

function draw() {
  image(video, 0, 0, width, height);
  strokeWeight(2);

  // For one pose only (use a for loop for multiple poses!)
  if (pose) {

    // FACE
    fill(255, 215, 0);
    stroke(255, 215, 0);
    var nose = pose['nose'];
    ellipse(nose.x, nose.y, 20, 20);

    var rightEye = pose['rightEye'];
    ellipse(rightEye.x, rightEye.y, 20, 20);

    var leftEye = pose['leftEye'];
    ellipse(leftEye.x, leftEye.y, 20, 20);

    // LEFT SIDE
    fill(255, 0, 0);
    stroke(255, 0, 0);
    var leftShoulder = pose['leftShoulder'];
    ellipse(leftShoulder.x, leftShoulder.y, 20, 20);

    var leftElbow = pose['leftElbow'];
    ellipse(leftElbow.x, leftElbow.y, 20, 20);

    var leftWrist = pose['leftWrist'];
    ellipse(leftWrist.x, leftWrist.y, 20, 20);

    line(leftShoulder.x, leftShoulder.y, leftElbow.x, leftElbow.y);
    line(leftElbow.x, leftElbow.y, leftWrist.x, leftWrist.y);


    // RIGHT SIDE
    fill(0, 255, 0);
    stroke(0, 255, 0);
    var rightShoulder = pose['rightShoulder'];
    ellipse(rightShoulder.x, rightShoulder.y, 20, 20);

    var rightElbow = pose['rightElbow'];
    ellipse(rightElbow.x, rightElbow.y, 20, 20);

    var rightWrist = pose['rightWrist'];
    ellipse(rightWrist.x, rightWrist.y, 20, 20);

    line(rightShoulder.x, rightShoulder.y, rightElbow.x, rightElbow.y);
    line(rightElbow.x, rightElbow.y, rightWrist.x, rightWrist.y);


    fill(255);
    noStroke();
    text("vote: "+vote, width*0.5, height*0.8);
    text("left: "+round(leftDiff)+" right: "+round(rightDiff), width*0.5, height*0.8 + 50);

  }
  updateTracking();
}

function updateTracking() {
  if (pose) {

    var heart = false;
    var cross = false;

    var leftShoulder = pose['leftShoulder'];
    var leftElbow = pose['leftElbow'];
    var leftWrist = pose['leftWrist'];
    var rightShoulder = pose['rightShoulder'];
    var rightElbow = pose['rightElbow'];
    var rightWrist = pose['rightWrist'];


    leftDiff = leftShoulder.y - leftWrist.y;
    rightDiff = rightShoulder.y - rightWrist.y;

    if (leftDiff > 0 && rightDiff > 0) {
      heart = true;
    }


    // should be neg
    leftElbowDiffY = leftShoulder.y - leftElbow.y;
    rightElbowDiffY = rightShoulder.y - rightElbow.y;

    // should be pos
    leftWristDiffY = leftElbow.y - leftWrist.y;
    rightWristDiffY = rightElbow.y - rightWrist.y;

    // should be pos
    wristsDiffX = Math.abs(leftWrist.x - rightWrist.x);
    elbowsDiffX = Math.abs(leftElbow.x - rightElbow.x);

    if (leftElbowDiffY < 0 && rightElbowDiffY < 0 && 
       (leftWristDiffY + rightWristDiffY) > 0 && 
       wristsDiffX < elbowsDiffX) {
      cross = true;
    }
    // console.log(leftDiff, rightDiff)

    if (heart) {
      vote = 'positive';
    } else if (cross) {
      vote = 'negative';
    } else {
      vote = 'none';
    }
  }
}


function updateTrackingRaisedHand() {
  if (pose) {

    var leftShoulder = pose['leftShoulder'];
    var leftWrist = pose['leftWrist'];
    leftDiff = leftShoulder.y - leftWrist.y;


    var rightShoulder = pose['rightShoulder'];
    var rightWrist = pose['rightWrist'];
    rightDiff = rightShoulder.y - rightWrist.y;


    var left = false;
    var right = false;

    if (leftDiff > 0) {
      left = true;
    }
    if (rightDiff > 0) {
      right = true;
    }
    // console.log(leftDiff, rightDiff)

    if (left && !right) {
      vote = 'positive';
    } else if (!left && right) {
      vote = 'negative';
    } else if (!left && !right) {
      vote = 'none';
    } else if (left && right) {
      if (leftDiff > rightDiff) {
        vote = 'positive';
      } else {
        vote = 'negative';
      }
    }
  }
}
