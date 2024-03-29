let video;
let detector;
let detections = [];
let people = [];
let left = [];
let right = [];
let time_to_choose = true;
let score = 0;

const elements = document.querySelector('.elements')
const next_btn = document.querySelector('.btn');

function preload() {
  detector = ml5.objectDetector('cocossd');
}

function gotDetections(error, results) {
  people = [];
  left = [];
  right = [];
  if (error) {
    console.error(error);
  }
  detections = results;
  detector.detect(video, gotDetections);
  for (let i = 0; i < detections.length; i++){
    if (detections[i] && detections[i].label == "person") {
      people.push(detections[i]);
    }
  }
  // console.log(people,detections.length,people.length);

  if(time_to_choose){
    for (let i = 0; i < people.length; i++) {
      if (people[i].x < 240) {
        right.push(people[i]);
      }
      else{
        left.push(people[i]);
      }
    }
  }

  // console.log(left.length, right.length);

}

function setup() {
  createCanvas(640,480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  detector.detect(video, gotDetections);
  showQuestion(questionCount)
  startTimer(timeValue);
  elements.classList.add("show");
}


function draw() {
  image(video, 0,0);

  // for (let i = 0; i < people.length; i++) {
  //   let object = people[i];
  //   stroke(0, 255, 0);
  //   strokeWeight(4);
  //   noFill();
  //   rect(object.x, object.y, object.width, object.height);
  //   noStroke();
  //   fill(255);
  //   textSize(24);
  //   text(object.label, object.x + 10, object.y + 24);
  // }
}

const quiz = document.querySelector('.hero');
const answerTextA = document.querySelector('.answerA');
const answerTextB = document.querySelector('.answerB');

let questionCount = 0;
let questionLen = 5;

function showQuestion(index) {
  // console.log(questionCount)
  const questionText = document.querySelector('.question');
  questionText.textContent = `${questions[index].numb}. ${questions[index].question}`;
  answerTextA.textContent = `${questions[index].options[0]}`;
  answerTextB.textContent = `${questions[index].options[1]}`;
}

function showResult(){
  const scoreText = result_box.querySelector(".score_text");
  let scoreTag = '<span>Apsveicam! Jūs ieguvāt '+ score +' punktus no '+ questionLen +'</span>';
  scoreText.innerHTML = scoreTag;
}

function showAnswer(index){
  let atbilde = `${questions[index].answer}`
  let winner
  if (left.length > right.length){
    winner = "LEFT"
  }else if(left.length < right.length){
    winner = "RIGHT"
  }else if(left.length == 0 && right.length == 0){
    winner = "NONE"
  }else if(left.length == right.length){
    winner = "DRAW"
  }

  // console.log(winner)
  if (answerTextA.textContent == atbilde && winner == "LEFT"){
    answerTextA.style.color = "#00ff00";
    score++
    // console.log('LEFT SCORED',score)
  }
  if(answerTextB.textContent == atbilde && winner == "RIGHT"){
    answerTextB.style.color = "#00ff00";
    score++
    // console.log('RIGHT SCORED',score)
  }
  if (answerTextB.textContent == atbilde && winner == "LEFT"){
    answerTextB.style.color = "#00ff00";
    answerTextA.style.color = "#ff0000";
  }
  if (answerTextA.textContent == atbilde && winner == "RIGHT"){
    answerTextA.style.color = "#00ff00";
    answerTextB.style.color = "#ff0000";
  }
  if (answerTextA.textContent == atbilde && winner == "NONE" || answerTextA.textContent == atbilde && winner == "DRAW"){
    answerTextA.style.color = "#ff0000";
    answerTextB.style.color = "#ff0000";
  }
  if (answerTextB.textContent == atbilde && winner == "NONE" || answerTextB.textContent == atbilde && winner == "DRAW"){
    answerTextA.style.color = "#ff0000";
    answerTextB.style.color = "#ff0000";
  }
}

const time_line = document.querySelector(".time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");


let timeValue =  15;
let userScore = 0;
let counter

function startTimer(time){
  counter = setInterval(timer, 1000);
  function timer(){
      timeCount.textContent = time; //changing the value of timeCount with time value
      time--; //decrement the time value
      if(time < 9){ //if timer is less than 9
          let addZero = timeCount.textContent; 
          timeCount.textContent = "0" + addZero; //add a 0 before time value
      }
      if(time < 0){ //if timer is less than 0
          clearInterval(counter); //clear counter
          timeText.textContent = "Laiks Beidzies!"; //change the time text to time off
          time_to_choose = false
          showAnswer(questionCount);
          next_btn.classList.add("show"); //show the next button if user selected any option
      }
  }
}

const questionText = document.querySelector('.question');
const line = document.querySelector('.vl');
const result_box = document.querySelector('.result_box');
const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");
let img = document.getElementById("image");

quit_quiz.onclick = () => {
  location.href = "../index.html";
}

restart_quiz.onclick = () => {
  window.location.reload();
}

next_btn.onclick = () => {
  if (next_btn.classList.contains("show") && questionCount < 4){
    questionCount++
    answerTextB.style.color = "#ffffff";
    answerTextA.style.color = "#ffffff";
    clearInterval(counter); //clear counter
    startTimer(timeValue); //calling startTimer function
    showQuestion(questionCount);
    timeText.textContent = "Atlikušais Laiks!"; //change the timeText to Time Left
    time_to_choose = true
    next_btn.classList.remove("show"); //hide the next button
    if(questionCount == 1){
      img.src = "Images/america.jpeg";
    }if(questionCount == 2){
      img.src = "Images/anglija.webp";
    }if(questionCount == 3){
      img.src = "Images/kina.jpeg";
    }
  }
  if (questionCount == 4 && next_btn.textContent != "Rezultāti"){
    time_to_choose = true
    next_btn.textContent = "Rezultāti";
    img.src = "Images/spanija.jpeg";
  }
  if (next_btn.classList.contains("show") && questionCount == 4){
    next_btn.classList.remove("show");
    elements.classList.remove("show");
    line.style.opacity = "0";
    var elem = document.getElementsByTagName("main");
    var videoElem = document.getElementsByTagName("video");
    for (let i = 0; i < elem.length; i++){
      elem[i].remove()
      videoElem[i].remove()
    }
    result_box.classList.add("activeResult");
    showResult()
  }
}
