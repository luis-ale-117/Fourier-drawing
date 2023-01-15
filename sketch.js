// Coding Challenge 130.3: Drawing with Fourier Transform and Epicycles
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/130.1-fourier-transform-drawing.html
// https://thecodingtrain.com/CodingChallenges/130.2-fourier-transform-drawing.html
// https://thecodingtrain.com/CodingChallenges/130.3-fourier-transform-drawing.html
// https://youtu.be/7_vKzcgpfvU


const USER = 0;
const FOURIER = 1;
const CANVAS_WINDOW = 3/4

let drownPath = [];
let dft;
let time = 0;
let fourierPath = [];
let state = -1;

let btnRunStop; // Stop or Run the drawing from user or fourier
let btnDrawing; 

function setup() {
  createCanvas(windowWidth, windowHeight*3/4);
  background(0);
  fill(255);
  textAlign(CENTER);
  textSize(64);
  text("Draw Something!", width/2, height/2);
  btnRunStop = createButton('Stop')
  btnRunStop.mousePressed(runOrStop)
  btnDrawing = createButton('Running!')
  btnDrawing.mousePressed(drawOrRun)
}
const runOrStop = _ => {
  if(btnRunStop.elt.textContent === 'Stop'){
    btnRunStop.elt.textContent = 'Run'
    noLoop()
  }else if(btnRunStop.elt.textContent === 'Run'){
    btnRunStop.elt.textContent = 'Stop'
    loop()
  }
}

const drawOrRun = _ => {
  // If stopped, do nothing
  if(btnRunStop.elt.textContent === 'Run'){
    return
  }
  if(btnDrawing.elt.textContent === 'Drawing!'){
    btnDrawing.elt.textContent = 'Running!'
    state = FOURIER;
    const skip = 1;
    dft = discretFourierTransform(drownPath);

    dft.sort((a, b) => b.amp - a.amp);
  }else if(btnDrawing.elt.textContent === 'Running!'){
    btnDrawing.elt.textContent = 'Drawing!'
    state = USER;
    drownPath = [];
    time = 0;
    fourierPath = [];
  }
}

function epicycles(x, y, rotation, dft) {
  for (let i = 0; i < dft.length; i++) {
    let prevx = x;
    let prevy = y;
    let freq = dft[i].freq;
    let radius = dft[i].amp;
    let phase = dft[i].phase;
    x += radius * cos(freq * time + phase + rotation);
    y += radius * sin(freq * time + phase + rotation);

    stroke(255, 100);
    noFill();
    ellipse(prevx, prevy, radius * 2);
    stroke(255);
    line(prevx, prevy, x, y);
  }
  return createVector(x, y);
}

function draw() {

  if (state == USER) {
    background(0);
    let point = createVector(mouseX - width / 2, mouseY - height / 2);
    if(mouseIsPressed && mouseY<=windowHeight*CANVAS_WINDOW){
      drownPath.push(new Complex(point.x,point.y));
    }
    stroke(255);
    noFill();
    beginShape();
    for (let comp of drownPath) {
      vertex(comp.re + width / 2, comp.im + height / 2);
    }
    endShape();
  } else if (state == FOURIER) {
    background(0);
    let v = epicycles(width / 2, height / 2, 0, dft);
    fourierPath.push(v);
    beginShape();
    noFill();
    strokeWeight(2);
    stroke(255, 0, 255);
    for (let i = fourierPath.length-1; i>=0; i--) {
      vertex(fourierPath[i].x, fourierPath[i].y);
    }
    endShape();

    const dt = TWO_PI / dft.length;
    time += dt;

    if (time > TWO_PI) {
      time = 0;
      fourierPath = [];
    }
  }

}


