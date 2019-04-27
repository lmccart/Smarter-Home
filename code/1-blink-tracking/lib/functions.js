var tracker;
var pos, lastPos, mvmt;

var blinkTimeout;

// properties
var eyeRect, interval, oldData, curData, cData, currentCorrelation, blinks;

// canvas and contexts
var trackerCanavs, trackerContext, eyeCanvas, eyeContext, bwCanvas, bwContext, thCanvas, thContext, oldCanvas, oldContext, curCanvas, curContext, cCanvas, cContext;

// dom elements
var correlationPercentage, blinksDetected;

var settings = {
  contrast: 3,
  brightness: 0.5,
  threshold: 80,
  minCorrelation: 0.17,
  maxCorrelation: 0.2
};


function startTracking() {
  capture = createCapture({
    audio: false,
    video: {
      width: 320,
      height: 240
    }
  }, function() {
    console.log('capture ready.')
  });
  capture.elt.setAttribute('playsinline', '');
  capture.size(320, 240);
  capture.hide();

  tracker = new clm.tracker();
  tracker.init();
  tracker.start(capture.elt);

  // eye rect
  eyeRect = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  };

  // eye canvas and context
  trackerCanvas = document.getElementById('trackerCanvas');
  trackerContext = trackerCanvas.getContext('2d');

  // eye canvas and context
  eyeCanvas = document.getElementById('eyeCanvas');
  eyeContext = eyeCanvas.getContext('2d');

  // black & white canvas and context
  bwCanvas = document.getElementById('bwCanvas');
  bwContext = bwCanvas.getContext('2d');

  // threshold canvas and context
  thCanvas = document.getElementById('thCanvas');
  thContext = thCanvas.getContext('2d');

  // old canvas and context
  oldCanvas = document.getElementById('oldCanvas');
  oldContext = oldCanvas.getContext('2d');

  // cur canvas and context
  curCanvas = document.getElementById('curCanvas');
  curContext = curCanvas.getContext('2d');

  // correlation canvas and context
  cCanvas = document.getElementById('cCanvas');
  cContext = cCanvas.getContext('2d');

  // correlation percentage dom
  correlationPercentage = document.getElementById('correlationPercentage');

  // blinks detected dom
  blinksDetected = document.getElementById('blinksDetected');

  document.body.className = 'active';
  interval = setInterval(correlation, 100);
  blinks = 0;
}

function updateFace() {


  trackerContext.drawImage(capture.elt, 0, 0, trackerContext.canvas.width, trackerContext.canvas.height);

  bwContext.clearRect(0, 0, bwContext.canvas.width, bwContext.canvas.height);
  thContext.clearRect(0, 0, thContext.canvas.width, thContext.canvas.height);
  oldContext.clearRect(0, 0, oldContext.canvas.width, oldContext.canvas.height);
  curContext.clearRect(0, 0, curContext.canvas.width, curContext.canvas.height);
  cContext.clearRect(0, 0, cContext.canvas.width, cContext.canvas.height);

  lastPos = pos;
  pos = tracker.getCurrentPosition();
  if (pos.length) {
    var mouthLeft = createVector(pos[44][0], pos[44][1]);
    var mouthRight = createVector(pos[50][0], pos[50][1]);
    smile = mouthLeft.dist(mouthRight);
    noseX = pos[62][0];
    noseY = pos[62][1];

    eyeRect.x = pos[23][0];
    eyeRect.y = pos[24][1];
    eyeRect.w = pos[25][0] - pos[23][0];
    eyeRect.h = pos[26][1] - pos[24][1];

    // draw eye
    eyeContext.drawImage(trackerCanvas, eyeRect.x, eyeRect.y, eyeRect.w, eyeRect.h, 0, 0, eyeContext.canvas.width, eyeContext.canvas.height);

    // black and white
    var data = CanvasFilters.getPixels(eyeCanvas);
    var grayscale = CanvasFilters.grayscale(data, settings.contrast, settings.brightness);

    bwContext.putImageData(grayscale, 0, 0);

    // threshold
    var data = CanvasFilters.getPixels(eyeCanvas);
    var grayscale = CanvasFilters.grayscale(data, settings.contrast, settings.brightness);
    var threshold = CanvasFilters.threshold(grayscale, settings.threshold);

    thContext.putImageData(threshold, 0, 0);

    // draw old data set
    if (oldData) {
      oldContext.putImageData(oldData, 0, 0);
    }

    // draw cur data set
    if (curData) {
      curContext.putImageData(curData, 0, 0);
    }

    // draw correlation
    if (cData) {
      cContext.putImageData(cData, 0, 0);
    }
  }
}


function correlation() {
  if (curData) {
    oldData = curData;
  }

  curData = thContext.getImageData(0, 0, thContext.canvas.width, thContext.canvas.height);

  // correlation data
  cData = cContext.createImageData(cContext.canvas.width, cContext.canvas.height);

  var count = 0;
  if (oldData && curData) {
    var total = curData.data.length;
    for (var i = 0; i < total; i += 4) {
      cData.data[i + 3] = 255;
      if (curData.data[i] !== oldData.data[i]) {
        cData.data[i] = 255;
        count++;
      }
    }
  }

  currentCorrelation = count / (cContext.canvas.width * cContext.canvas.height);

  // correlationPercentage.innerHTML = parseFloat(currentCorrelation).toFixed(2) + '%';

  if (lastPos.length && pos.length) {
    //mvmt = Math.abs(pos[23][0] - lastPos[23][0]) + Math.abs(pos[24][0] - lastPos[24][0]) + Math.abs(pos[25][0] - lastPos[25][0]) + Math.abs(pos[26][0] - lastPos[26][0]);
  
  
    mvmt = 0;
    for (var i=0; i<pos.length; i++) {
      mvmt += Math.abs(pos[i][0] - lastPos[i][0]);
    }
  }

  if (mvmt && mvmt < 40 && currentCorrelation > settings.minCorrelation && !blinkTimeout) {
    blinks++;
    blinkTimeout = setTimeout(clearBlink, 500);
    blink();
  }

  blinksDetected.innerHTML = blinks + ' blinks detected';
}

function clearBlink() {
  if (blinkTimeout) clearTimeout(blinkTimeout);
  blinkTimeout = null;
}
