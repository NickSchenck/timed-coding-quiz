var startButton = document.getElementById("start-btn");
var scoreButton = document.getElementById("score-btn");
var nextButton = document.getElementById("next-btn");
var questionContainerEl = document.getElementById("question-container");
var nextQuestion, currentQuestion;//returns null, letting these values be defined later in the doc
var questionEl = document.getElementById("question");
var answerButtonsEl = document.getElementById("answer-buttons");
var sec = 30;
var scoreBoard = document.getElementById("score-board");
var questions = [
  {
    question: "What is 2+2?",
    answers: [
      { option: "4", correct: true },
      { option: "7", correct: false },
      { option: "99", correct: false },
      { option: "31", correct: false }
    ]
  },
  {
    question: "What is 2+3?",
    answers: [
      { option: "5", correct: true },
      { option: "7", correct: false },
      { option: "99", correct: false },
      { option: "31", correct: false }
    ]
  },
  {
    question: "What is 2+1?",
    answers: [
      { option: "3", correct: true },
      { option: "7", correct: false },          //Questions + Answers arrays
      { option: "99", correct: false },
      { option: "31", correct: false }
    ]
  },
  {
    question: "What is 2+7?",
    answers: [
      { option: "9", correct: true },
      { option: "7", correct: false },
      { option: "99", correct: false },
      { option: "31", correct: false }
    ]
  },
  {
    question: "What is 2+0?",
    answers: [
      { option: "2", correct: true },
      { option: "7", correct: false },
      { option: "99", correct: false },
      { option: "31", correct: false }
    ]
  }
];
console.log(questions);
function startGame() {
  startButton.classList.add("hide");  //60-62 calls defines the function to start the game, hides the start buttton, and calls the function for the timer to begin
  timer();
  nextQuestion = questions.sort(() => Math.random() - 0.5);
  currentQuestion = 0;                                    //63-66 randomizes question order and calls the function to generate the next question
  questionContainerEl.classList.remove("hide");
  setNextQuestion();
};

function setNextQuestion() {
  resetState();                                   //69-71 clears the previous question from the page and determines which question will be displayed next
  showQuestion(nextQuestion[currentQuestion]);
  
};
function showQuestion(question) {
  questionEl.innerText = question.question; //74-79 determines what content will displayed for each question and answer, aswell as creates buttons that content will be displayed in
  question.answers.forEach((answer) => {                        
    var button = document.createElement("button");
    button.innerText = answer.option;
    button.classList.add("btn");
    if (answer.correct) {
      button.dataset.correct = answer.correct;//if loop checks if answer is correct by assigning a data attribute to the correct input
    }                                               
    button.addEventListener("click", selectAnswer);//event listener links directly to line 94
    answerButtonsEl.appendChild(button);//appends button(defined on line 77) to the container
  });
};
function resetState() {
  nextButton.classList.add("hide"); //hides next button after click
  while (answerButtonsEl.firstChild) {
    answerButtonsEl.removeChild(answerButtonsEl.firstChild); //while loop goes through the children of our answer elements
  }
};

function selectAnswer(e) {
  var selectedbutton = e.target; //93-95 informs the function to which button you clicked, if that selection is correct, and writes the class of the selection to the body
  var correct = selectedbutton.dataset.correct; 
  setStatusClass(document.body, correct);
  Array.from(answerButtonsEl.children).forEach((button) => { //this line and the one below it loops through our other buttons
    setStatusClass(button, button.dataset.correct);
  });
  if (nextQuestion.length > currentQuestion + 1) {  //99-103 determines if the next button or the highscore button should be displayed based off of the place in the array
    nextButton.classList.remove("hide");
  } else {
    scoreButton.innerHTML = "Highscores";
    scoreButton.classList.remove("hide");
  }
};
function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add("correct");       //107-113 determines the actual class that the given response will write from line 95, and decrements the timer if a wrong answer is given
    sec = sec + 2;
  } else {
    element.classList.add("wrong");
    sec = sec - 1;
  }
  
};
function clearStatusClass(element) {
  element.classList.remove("correct");    //these lines remove the previously written correct/wrong response upon sumbition of another question response
  element.classList.remove("wrong");
};

function timer() {
  var timer = setInterval(function () {
    document.getElementById("time-readout").innerHTML = "Time Left:" + sec; //this line determines the text of the timer, the rest down to line 132 is the timer itself
    sec--;
    if (sec < 0) {
      clearInterval(timer);
    }
    if(currentQuestion === questions.length - 1){
      clearInterval(timer);
    }
  }, 1000);
};
function scorePage(){
    questionContainerEl.classList.add("hide");                  //135-138 hides the questions+answers, displays the score, and the text for the score
    scoreBoard.classList.remove("hide");
    localStorage.setItem("score", JSON.stringify(sec));
    scoreBoard.innerText = "Your score:" + localStorage.getItem("score");
}



scoreButton.addEventListener("click", scorePage) //calls scorePage function on a click
nextButton.addEventListener("click", () => {
  currentQuestion++;                            //iterates the question array and calls setNextQuestion function on a click
  setNextQuestion();
});
startButton.addEventListener("click", startGame); //calls startGame function on a click
