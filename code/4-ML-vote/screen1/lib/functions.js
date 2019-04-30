var pose;

function initDatabase() {
  firebase.initializeApp(config);

  firebase.database().ref('positive/').on('value', function(snapshot) {
    p = snapshot.val();
  });
  firebase.database().ref('negative/').on('value', function(snapshot) {
    n = snapshot.val();
  });
}

function initTracking() {
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


function modelReady() {
  select('#status').remove();
}

// adds vote to database so it can be retrieved by second screen
function clearVotes() {
  firebase.database().ref('/positive/').set(0);
  firebase.database().ref('/negative/').set(0);
}
