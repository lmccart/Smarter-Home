var vid1, vid2, vid3;
var keystone = false;

var positions = [
  [0, 0, 100, 100], // 1
  [100, 200, 50, 50], // 2
  [500, 300, 100, 100]  // 3
];

var v = 0;
var k = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // you can change the video file here. make sure it's in the project folder.
  vid1 = createVideo("fingers.mov", function() {
    vid1.hide();
  });
  vid2 = createVideo("fingers.mov", function() {
    vid2.hide();
  });
  vid3 = createVideo("fingers.mov", function() {
    vid3.hide();
  });

}

function draw() {
  background(0);
  updateMic();
  
  if (volume > 0.5 || keystone) {
    if (vid3.width) image(vid3, positions[2][0], positions[2][1], positions[2][2], positions[2][3])
  }

  if (volume > 0.3 || keystone) {
    if (vid2.width) image(vid2, positions[1][0], positions[1][1], positions[1][2], positions[1][3])
  }

  if (volume > 0.1 || keystone) {
    if (vid1.width) image(vid1, positions[0][0], positions[0][1], positions[0][2], positions[0][3])
  }

  // console.log(volume);
  
}


// this helps with positioning projection
function keyPressed() {
  if (Number(key) >= 1 && Number(key) <= 4) {
    console.log('a')
    v = Number(key) - 1;
  }
  else if (Number(key) >= 5 && Number(key) <= 8) {
    k = Number(key) - 4;
    console.log('b')
  }
  else if (keyCode === LEFT_ARROW) {
    if (k == 1) {
      positions[v][0]--;
      positions[v][2]++;
    } else if (k == 3) {
      positions[v][2]--;
    }
  }
  else if (keyCode === RIGHT_ARROW) {
    if (k == 1) {
      positions[v][0]++;
      positions[v][2]--;
    } else if (k == 3) {
      positions[v][2]++;
    }
  }
  else if (keyCode === UP_ARROW) {
    if (k == 2) {
      positions[v][1]--;
      positions[v][3]++;
    } else if (k == 4) {
      positions[v][3]--;
    }
  }
  else if (keyCode === DOWN_ARROW) {
    if (k == 2) {
      positions[v][1]++;
      positions[v][3]--;
    } else if (k == 4) {
      positions[v][3]++;
    }
  }
  else if (key == 'K') {
    keystone = !keystone;
  }


  console.log(positions);
}

function mousePressed() {
  startMic();
  vid1.loop();
  vid2.loop();
  vid3.loop();
}