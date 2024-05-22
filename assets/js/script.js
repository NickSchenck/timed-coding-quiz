let startButton = document.getElementById("start-btn");
let scoreButton = document.getElementById("score-btn");
let nextButton = document.getElementById("next-btn");
let questionContainerEl = document.getElementById("question-container");
let nextQuestion, currentQuestion;//returns null, letting these values be defined later in the doc
let questionEl = document.getElementById("question");
let answerButtonsEl = document.getElementById("answer-buttons");
let sec = 40;
let scoreBoard = document.getElementById("score-board");
let questions = [
  {
    question: "What is a pseudo-class?",
    answers: [
      { option: "A CSS keyword to target an element's state.", correct: true },
      { option: "A CSS declaration that hides the element.", correct: false },
      { option: "A financial class in society that isn't well defined.", correct: false },
      { option: "Uhhhh... a kinda germ??", correct: false }
    ]
  },
  {
    question: "What is the purpose of the alt attribute for images?",
    answers: [
      { option: "To make it easier to style the image with CSS.", correct: false },
      { option: "To give your image a grungy, punk-like filter.", correct: false },
      { option: "To provide context for the image.", correct: true },
      { option: "To alter the image with provided parameters.", correct: false }
    ]
  },
  {
    question: "What is the preferred way to include or link another file in programming?",
    answers: [
      { option: "Relative pathing.", correct: true },
      { option: "Through the browser.", correct: false },          //Questions + Answers objects
      { option: "Absolute pathing.", correct: false },
      { option: "Filing is for interns... get one of them to do it.", correct: false }
    ]
  },
  {
    question: "What is the command to push code to GitHub?",
    answers: [
      { option: "git init", correct: false },
      { option: "Push? Are you threatening me??", correct: false },
      { option: "git commit -m", correct: false },
      { option: "git push origin main", correct: true }
    ]
  },
  {
    question: "Which of the following is >NOT< a reason to validate a user's responses?",
    answers: [
      { option: "Increases the overall quality of the user data.", correct: false },
      { option: "When they're rude and a jerk.", correct: true },
      { option: "Reduces inaccurate answers getting stored in the database.", correct: false },
      { option: "Offers the user an opportunity to enter a correct response.", correct: false }
    ]
  }
];

//starting the quiz through this startGame function seems sound, but may still need editting
function startGame() {
  startButton.classList.add("hide");  //60-62 calls defines the function to start the game, hides the start buttton, and calls the function for the timer to begin
  timer();
  nextQuestion = questions.sort(() => Math.random() - 0.5);
  currentQuestion = 0;                                    //63-66 randomizes question order and calls the function to generate the next question
  questionContainerEl.classList.remove("hide");
  setNextQuestion();
};
//unsure this needs to be its own function, seems as if it could be rolled into another
function setNextQuestion() {
  resetState();                                   //69-71 clears the previous question from the page and determines which question will be displayed next
  showQuestion(nextQuestion[currentQuestion]);
};
//This function seems particularly messy, will need a thorough look
function showQuestion(question) {
  questionEl.innerText = question.question; //confusing line, but does accurately target a given question within the questions array
  question.answers.forEach((answer) => {                        
    let button = document.createElement("button");
    button.innerText = answer.option;
    button.classList.add("btn");
    if (answer.correct) {
      button.dataset.correct = answer.correct;//if loop checks if answer is correct by assigning a data attribute to the correct input
    }                                               
    button.addEventListener("click", selectAnswer);//event listener links directly to line 94
    answerButtonsEl.appendChild(button);//appends button(defined on line 77) to the container
  });
};
//unsure this needs to be its own function, seems as if it could be rolled into another
function resetState() {
  nextButton.classList.add("hide"); //hides next button after click
  while (answerButtonsEl.firstChild) {
    answerButtonsEl.removeChild(answerButtonsEl.firstChild); //while loop goes through the children of our answer elements
  }
};

function selectAnswer() {
  if (nextQuestion.length > currentQuestion + 1) {  //99-103 determines if the next button or the highscore button should be displayed based off of the place in the array
    nextButton.classList.remove("hide");
  } else {
    scoreButton.innerHTML = "Highscores";
    scoreButton.classList.remove("hide");
    // document.getElementById(`time-readout`).classList.add(`hide`); may use this line to remove the timer display on displaying the highscore button
  }
};

function timer() {
  setInterval(function () {
    document.getElementById("time-readout").innerHTML = `Time left: ${sec}`; //this line determines the text of the timer, the rest down to line 132 is the timer itself
    sec--;
    // if (sec < 0) {
    //   clearInterval(timer);
    // }
    // if(currentQuestion === questions.length - 1){
    //   clearInterval(timer);
    // }
  }, 1000);
};
//will need to create a container for saving previous scores, so as to load them upon displaying scoreboard
function scorePage(){
    questionContainerEl.classList.add("hide");                  //135-138 hides the questions+answers, displays the score, and the text for the score
    scoreBoard.classList.remove("hide");
    localStorage.setItem("score", JSON.stringify(sec));
    scoreBoard.innerText = `Your score: ${sec + 1}`;
};


scoreButton.addEventListener("click", scorePage) //calls scorePage function on a click
nextButton.addEventListener("click", () => {
  currentQuestion++;                            //iterates the question array and calls setNextQuestion function on a click
  setNextQuestion();
});
startButton.addEventListener("click", startGame); //calls startGame function on a click

//when timer reaches zero the app will still allow the user to finish the quiz.
//highscores do not save between sessions, previous repo's code could have something that helps
//lots of confusion on variables and function names, often being too similar for ease-of-understanding
//current version of quiz only records score as quickness of user, does not disincetivize selecting wrong answers

//below is a possible quick-ref on how to impliment score-saving via methods on a different repo
// let saveTasks = function() {
//   localStorage.setItem("tasks", JSON.stringify(tasks));//stringify converts an array into a number
// }
// let loadTasks = function() {
//   let savedTasks = localStorage.getItem("tasks"); //this variable here allows us to save added tasks between sessions
//   // if there are no tasks, set tasks to an empty array and return out of the function
//   if (!savedTasks) {
//     return false;
//   }
//   console.log("Saved tasks found!");
//   // else, load up saved tasks

//   // parse into array of objects
//   savedTasks = JSON.parse(savedTasks);//parse converts a number back into an array

//   // loop through savedTasks array
//   for (let i = 0; i < savedTasks.length; i++) {
//     // pass each task object into the `createTaskEl()` function
//     createTaskEl(savedTasks[i]);
//     console.log(tasks[i]);
//   }
// };