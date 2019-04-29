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

    var leftShoulder = pose['leftShoulder'];
    var leftWrist = pose['leftWrist'];
    var leftDiff = leftShoulder.y - leftWrist.y;


    var rightShoulder = pose['rightShoulder'];
    var rightWrist = pose['rightWrist'];
    var rightDiff = rightShoulder.y - rightWrist.y;


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


function modelReady() {
  select('#status').remove();
}

// adds vote to database so it can be retrieved by second screen
function clearVotes() {
  firebase.database().ref('/positive/').set(0);
  firebase.database().ref('/negative/').set(0);
}
