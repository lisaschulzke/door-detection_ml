// Traffic light system for camera status
let redLight = 'red'
let yellowLight = 'yellow'
let greenLight = 'green'

// Traffic light system for sound status
let redLightSound = 'red'
let yellowLightSound = 'yellow'
let greenLightSound = 'green'

//sizes and spacing
let cameraOffsetXAxis = 420;
let soundOffsetXAxis = 920;
let spaceBetween = 70;
let offsetYAxis = 80;
let offsetYAxisIcons = 30;
let xPositionLock = 3600;
let sizeEllipse = 50;
let videoX = 1280;
let videoY = 960;
let iconSize = 100;

// Icons used
let openLock;
let closedLock;
let soundIcon;
let videoIcon;

// camera and sound state are both set to red until the authentication is successful
let cameraState = "red";
let soundState = "red";

let classifier;
let soundClassifier;

// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/oJBjd7fUg/';
let soundModelURL = 'https://teachablemachine.withgoogle.com/models/mlm4KTCA9/';

// Video 
let video;
let flippedVideo;

// To store the classification
let label = "";
let soundLabel = "";


// Load the model first
function preload() {
  openLock = loadImage("openLock.svg");
  closedLock = loadImage("closedLock.svg");
  soundIcon = loadImage("soundIcon.svg");
  videoIcon = loadImage("videoIcon.svg");

  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
  soundClassifier = ml5.soundClassifier(soundModelURL + 'model.json');
}

function setup() {
  createCanvas(4000, 2000);

  // Create the video
  video = createCapture(VIDEO);
  video.size(videoX, videoY);
  video.hide();

  // Resizing the image of the used Icons
  closedLock.resize(iconSize, iconSize);
  openLock.resize(iconSize, iconSize);
  videoIcon.resize(iconSize, iconSize);
  soundIcon.resize(iconSize, iconSize);

  flippedVideo = ml5.flipImage(video);

  // Start classifying
  classifyVideo();
  soundClassifier.classify(gotSoundResult);
}

function draw() {
  background(0);

  // Draw the video (welches Bild, x, y, Breite, Höhe)
  image(flippedVideo, 1360, 500);

  // Draw the label
  drawCameraTrafficLights();
  drawSoundTrafficLights();
  drawLock();
}


// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video)
  classifier.classify(flippedVideo, gotCameraResult);
  flippedVideo.remove();
}


// When we get a result
function gotCameraResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }


  // The results are in an array ordered by confidence.
  label = results[0].label;
  results.forEach(element => {

    if (element.label == "Teddy mit Erlaubnis" && element.confidence > 0.8) {
      cameraState = "green";
    }

    if (element.label == "Ein Freund/Bekannter" && element.confidence > 0.7) {
      cameraState = "yellow";
    }

    if (element.label == "Unbekannt" && element.confidence > 0.2) {
      cameraState = "red";
    }
  });

  // Classifiying the video
  classifyVideo();
}

function gotSoundResult(error, results) {
  //If there is an error
  if (error) {
    console.error(error);
    return;
  }

    soundLabel = results[0].label;
    results.forEach(element => {

      if (element.label == "Hintergrundgeräusche" && element.confidence > 0.4) {
        soundState = "red";
      }

      if (element.label == "Teddy" && element.confidence > 0.8) {
        soundState = "green";
      }

      console.log(element.label, soundState);
    });
}

// all about the sound status and the according color + ellipse
function drawSoundTrafficLights(x, y) {

  image(soundIcon, 750, offsetYAxisIcons);

  rectMode(CENTER)
  fill(100);

  fill(redLightSound)
  ellipse(soundOffsetXAxis, offsetYAxis, sizeEllipse, sizeEllipse)

  fill(greenLightSound)
  ellipse(soundOffsetXAxis + spaceBetween, offsetYAxis, sizeEllipse, sizeEllipse)

  //Sound
  if (soundState == "red") {
    redLightSound = '#FA3622'
    greenLightSound = '#212121'

  } else if (soundState == "green") {
    redLightSound = '#212121'
    greenLightSound = '#59FF31'
  }
}

// all about the camera status and the according color + ellipse
function drawCameraTrafficLights(x, y) {

  image(videoIcon, 250, offsetYAxisIcons);

  rectMode(CENTER)
  fill(100);

  fill(redLight)
  ellipse(cameraOffsetXAxis, offsetYAxis, sizeEllipse, sizeEllipse)

  fill(yellowLight)
  ellipse(cameraOffsetXAxis + spaceBetween, offsetYAxis, sizeEllipse, sizeEllipse)

  fill(greenLight)
  ellipse(cameraOffsetXAxis + spaceBetween * 2, offsetYAxis, sizeEllipse, sizeEllipse)

  if (cameraState == "red") {
    redLight = '#FA482A'
    yellowLight = '#212121'
    greenLight = '#212121'

  } else if (cameraState == "yellow") {
    redLight = '#212121'
    yellowLight = '#EDFA1F'
    greenLight = '#212121'

  } else if (cameraState == "green") {
    redLight = '#212121'
    yellowLight = '#212121'
    greenLight = '#59FF31'
  }
}


// Logic of opening and closing the lock (it will only open if both parameters are on green status)
function drawLock(x, y) {

  if (cameraState == "green" && soundState == "green") {
    image(openLock, xPositionLock, offsetYAxis/2);
  }

  if (cameraState == "green" && soundState == "red") {
    image(closedLock, xPositionLock, offsetYAxis/2);
  }

  if (cameraState == "yellow") {
    image(closedLock, xPositionLock, offsetYAxis/2);
  }

  if (cameraState == "red") {
    image(closedLock, xPositionLock, offsetYAxis/2);
  }
}