
var pieceColor = {r: 127, g: 27, b: 42};
var circleColor = {r: 21, g: 105, b: 98};
var pieceTolerance = 50;
var circleTolerance = 61;
var distanceTolerance = 50;


var debug = true;

function startTracking() {

  var piece;
  var circles = [];

  var last = {x:0, y:0};

  var canvas  = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var webcam = document.getElementById('webcam');
  var pieceSlider = document.getElementById('pieceTolerance');
  var circleSlider = document.getElementById('circleTolerance');
  var distanceSlider = document.getElementById('distanceTolerance');
  var pieceSwatch = document.getElementById('pieceSwatch');
  var circleSwatch = document.getElementById('circleSwatch');


  pieceSwatch.style.backgroundColor = "rgb(" + pieceColor.r + ", " + pieceColor.g + ", " + pieceColor.b + ")";
  circleSwatch.style.backgroundColor = "rgb(" + circleColor.r + ", " + circleColor.g + ", " + circleColor.b + ")";
  pieceSlider.value = pieceTolerance;
  circleSlider.value = circleTolerance;
  distanceSlider.value = distanceTolerance;
  pieceSlider.onchange = printSettings;
  circleSlider.onchange = printSettings;
  distanceSlider.onchange = printSettings;

  tracking.ColorTracker.registerColor('dynamicPiece', function(r, g, b) {
    return getColorDistance(pieceColor, {r: r, g: g, b: b}) < pieceSlider.value
  });
  var pieceTracker = new tracking.ColorTracker('dynamicPiece');
  pieceTracker.on('track', function(e) {
    piece = e.data[0];
  });
  tracking.track(webcam, pieceTracker, { camera: true } );
  
  tracking.ColorTracker.registerColor('dynamicCircle', function(r, g, b) {
    return getColorDistance(circleColor, {r: r, g: g, b: b}) < circleSlider.value
  });
  var circleTracker = new tracking.ColorTracker('dynamicCircle');
  circleTracker.on('track', function(e) {
    circles = e.data;
  });
  tracking.track(webcam, circleTracker, { camera: true } );


  webcam.addEventListener("click", function (e) {
    var c = getColorAt(webcam, e.offsetX, e.offsetY);
    if (c.r > c.g) {
      pieceColor.r = c.r;
      pieceColor.g = c.g;
      pieceColor.b = c.b;
      pieceSwatch.style.backgroundColor = "rgb(" + c.r + ", " + c.g + ", " + c.b + ")";
    } else {
      circleColor.r = c.r;
      circleColor.g = c.g;
      circleColor.b = c.b;
      circleSwatch.style.backgroundColor = "rgb(" + c.r + ", " + c.g + ", " + c.b + ")";
    }
    printSettings();
  });


  setInterval(update, 100);
  function update() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (piece) {
      drawRect(piece, context, pieceColor);
      circles.forEach(function(rect) {
        if (dist(piece, rect) < distanceSlider.value) {
          drawRect(rect, context, circleColor);

          if (dist(rect, last) > 100) {
            circleHit();
          }

          last.x = rect.x;
          last.y = rect.y;
        }
      });
    } else {
      circles.forEach(function(rect) {
        drawRect(rect, context, circleColor);
      });
    }

  }

  // Calculates the Euclidian distance between the target color and the actual color
  function getColorDistance(target, actual) {
    return Math.sqrt(
      (target.r - actual.r) * (target.r - actual.r) +
      (target.g - actual.g) * (target.g - actual.g) +
      (target.b - actual.b) * (target.b - actual.b)
    );
  }

  function getColorAt(webcam, x, y) {

    // To be able to access pixel data from the webcam feed, we must first draw the current frame in
    // a temporary canvas.
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = webcam.width;
    canvas.height = webcam.height;
    context.drawImage(webcam, 0, 0, webcam.width, webcam.height);

    // Then we grab the pixel information from the temp canvas and return it as an object
    var pixel = context.getImageData(x, y, 1, 1).data;
    return {r: pixel[0], g: pixel[1], b: pixel[2]};

  }

  function dist(r1, r2) {
    return Math.sqrt( Math.pow((r1.x-r2.x), 2) + Math.pow((r1.y-r2.y), 2));
  }

  function drawRect(rect, context, color) {
    context.strokeStyle = "rgb(" + color.r + ", " + color.g + ", " + color.b + ")";
    context.strokeRect(rect.x, rect.y, rect.width, rect.height);
  }

  function printSettings() {
    console.log('PIECE '+pieceColor.r+' '+pieceColor.g+' '+pieceColor.b+' (tolerance '+pieceSlider.value+')');
    console.log('CIRCLE '+circleColor.r+' '+circleColor.g+' '+circleColor.b+' (tolerance '+circleSlider.value+')');
    console.log('DISTANCE TOLERANCE '+distanceSlider.value);
  }

  function download(text, name, type) {
    var a = document.getElementById("a");
    var file = new Blob([text], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
  }

  window.addEventListener('keyup', function(e) {
    if (e.key === ' ') {
      if (debug) {
        document.getElementsByClassName('ui')[0].style.display = 'none';
        document.getElementsByClassName('display')[0].style.display = 'none';
        debug = false;
      } else {
        document.getElementsByClassName('ui')[0].style.display = 'flex';
        document.getElementsByClassName('display')[0].style.display = 'block';
        debug = true;
      }
    }
  });

}
