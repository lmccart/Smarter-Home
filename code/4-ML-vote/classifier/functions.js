let video;
// Create a KNN classifier
const knnClassifier = ml5.KNNClassifier();
let featureExtractor;
let type = 1;

function setupML() {
    // Create a featureExtractor that can extract the already learned features from MobileNet
  featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
  // Create a video element
  video = createCapture({
    audio: false,
    video: {
      width: 600,
      height: 400
    }
  }, function() {
    console.log('capture ready.')
  });
  video.elt.setAttribute('playsinline', '');
  video.size(width, height);
  video.hide();
  // Append it to the videoContainer DOM element
  video.parent('videoContainer');
}

function modelReady(){
  knnClassifier.load('myKNNDataset.json', updateCounts);
}

// Predict the current frame.
function classify() {
  // Get the total number of labels from knnClassifier
  const numLabels = knnClassifier.getNumLabels();
  if (numLabels <= 0) {
    console.error('There is no examples in any label');
    return;
  }
  const features = featureExtractor.infer(video);
  knnClassifier.classify(features, gotResults);
}


// Show the results
function gotResults(err, result) {
  // Display any error
  if (err) {
    console.error(err);
  }

  if (result.confidencesByLabel) {
    const confidences = result.confidencesByLabel;
    // result.label is the label that has the highest confidence
    if (result.label) {
      if (result.label == "Rock") type = 1;
      else if (result.label == "Paper") type = 2;
      else type = 3;
      select('#result').html(type);
      select('#confidence').html(`${confidences[result.label] * 100} %`);
    }

    select('#confidenceRock').html(`${confidences['Rock'] ? confidences['Rock'] * 100 : 0} %`);
    select('#confidencePaper').html(`${confidences['Paper'] ? confidences['Paper'] * 100 : 0} %`);
    select('#confidenceScissor').html(`${confidences['Scissor'] ? confidences['Scissor'] * 100 : 0} %`);
  }
  classify();
}

// Update the example count for each label	
function updateCounts() {
  const counts = knnClassifier.getCountByLabel();

  select('#exampleRock').html(counts['Rock'] || 0);
  select('#examplePaper').html(counts['Paper'] || 0);
  select('#exampleScissor').html(counts['Scissor'] || 0);
  
  select('#status').remove();
  classify();
}
