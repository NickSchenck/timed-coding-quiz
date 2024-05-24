//variables for targeting specific elements within the DOM, from the timer itself to the disappearing-on-click
//start button
let startButton = document.getElementById("start-btn");
let scoreButton = document.getElementById("score-btn");
let nextButton = document.getElementById("next-btn");
let questionContainerEl = document.getElementById("question-container");
let questionEl = document.getElementById("question");
let answerButtonsEl = document.getElementById("answer-buttons");
let scoreBoard = document.getElementById("score-board");

//a variable for storing time and two initialized variables to act as generic containers that are convinient to
//assign value as the app progresses
let sec = 8;
let nextQuestion, currentQuestion;

//this is a helper-function for shuffling arrays, known as the fisher-yates shuffle. This implimentation of it was
//taken from: https://bost.ocks.org/mike/shuffle/
//The old shuffling method used was this: /*questions.sort(() => Math.random() - 0.5)*/
//which apparently is inefficient and not totally random, but was alright for smaller arrays
function shuffle(array) {
  let m = array.length, t, i;
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}


//An array containing several objects formatted as questions, to be populated as the quiz is progressed
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
      { option: "Through the browser.", correct: false },
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

//app is started through an event listener which calls this function. startGame first calls the timer, hides the
//start button after the user has clicked it, and removes the 'hide' class from questionContainerEl which makes
//it visible. The container variable nextQuestion is initialized with a value that calls our randomize function
//on the array of questions, and currentQuestion is given a value of 0 to ensure we start at the beginning of our 
//now randomized nextQuestion array, when we call the function setNextQuestion.
function startGame() {
  timer();
  startButton.classList.add("hide");
  questionContainerEl.classList.remove("hide");
  nextQuestion = shuffle(questions);
  currentQuestion = 0;
  setNextQuestion();
};

//setNextQuestion first hides the nextButton, after the element has been clicked. We enter a while loop which
//checks if the provided argument is truthy, and if so prevents the empty buttons from our html file from
//generating alongside our actual answer buttons. We then call showQuestion with the argument of nextQuestion-
//our randomized array of questions- at an index of currentQuestion.
function setNextQuestion() {
  nextButton.classList.add("hide"); //hides next button after click
  while (answerButtonsEl.firstChild) {
    answerButtonsEl.removeChild(answerButtonsEl.firstChild); //while loop goes through the children of our answer elements
  }
  showQuestion(nextQuestion[currentQuestion]);
};

//showQuestion first manipulates the text of questionEl by targeting the questions parameter passed to the function
//and appending the value of question onto it from the object array(questions => question => answers => option).
//We then target the answers property of the param, putting it through a forEach loop. The forEach loop creates a
//button for each of the given answer.option values and adds a class of 'btn' to them. Finally, an event listener
//is attached to button, activating on a click and calling the selectAnswer function.
function showQuestion(questions) {
  questionEl.innerText = questions.question; //confusing line, but does accurately target a given question within the questions array
  questions.answers.forEach((answer) => {                        
    let button = document.createElement("button");
    button.innerText = answer.option;
    answerButtonsEl.appendChild(button);
    button.classList.add("btn");
    // if (answer.correct) {
    //   button.dataset.correct = answer.correct;
    // }   I believe this had previously determined if a selected answer was correct or not, not sure if needed                          
    button.addEventListener("click", selectAnswer);
  });
};

function selectAnswer() {
  if (nextQuestion.length > currentQuestion + 1) {
    nextButton.classList.remove("hide");
  } else {
    scoreButton.innerHTML = "Highscores";
    scoreButton.classList.remove("hide");
    document.getElementById(`time-readout`).classList.add(`hide`); //removes the timer display on displaying the highscore button
  }
};

function timer() {
  const timeCount = setInterval(function () {
    document.getElementById("time-readout").innerHTML = `Time left: ${sec}`;
    
    if (sec > 0) {
      sec--;
    }else{
      clearInterval(timeCount);
    }

    if(currentQuestion === questions.length - 1){
      clearInterval(timeCount);
    }

  }, 1000);
};
//will need to create a container for saving previous scores, so as to load them upon displaying scoreboard
//will need to create a system which rewards/penalizes score off of right/wrong answers, rather than just time
function scorePage(){
    questionContainerEl.classList.add("hide");
    scoreBoard.classList.remove("hide");
    localStorage.setItem("score", JSON.stringify(sec));
    scoreBoard.innerText = `Your score: ${sec + 1}`;
};

scoreButton.addEventListener("click", scorePage);

nextButton.addEventListener("click", () => {
  currentQuestion++;
  setNextQuestion();
});

startButton.addEventListener("click", startGame);

//when timer reaches zero the app will still allow the user to finish the quiz.
//highscores do not save between sessions, previous repo's code could have something that helps
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

//Note: the fisher-yates method of shuffling is apparently very efficent, but I cannot seem to figure out how to
//impliment it within this app