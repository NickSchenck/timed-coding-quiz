/*variables for targeting specific elements within the DOM. In order startButton, scoreButton, nextButton,
questionContainerEl, questionEl, answerButtons, and scoreBoard all select elements with varrying Ids
that roughly equate to the name/functionality of their variable counterpart.*/
let startButton = document.getElementById("start-btn");
let scoreButton = document.getElementById("score-btn");
let nextButton = document.getElementById("next-btn");
let questionContainerEl = document.getElementById("question-container");
let questionEl = document.getElementById("question");
let answerButtons = document.getElementById("answer-buttons");
let scoreBoard = document.getElementById("score-board");

/*sec is a variable for storing time. nextQuestion and currentQuestion are two initialized variables to act as
generic containers that will be assigned value as the app progresses. userScore is a variable initialized to 0,
which will be iterated or decremented upon if the user answers each question correctly or incorrectly, decremented
if the user runs out of time, and have any remaining time added to the users score if they finish the quiz early.*/
let sec = 8;
let nextQuestion, currentQuestion;
let userScore = 0;
let allScores = [];

/*this is a helper-function for shuffling arrays, known as the fisher-yates shuffle. This implimentation of it was
taken from: https://bost.ocks.org/mike/shuffle/
The old shuffling method used was this: questions.sort(() => Math.random() - 0.5)
which apparently is inefficient and not totally random, but was alright for smaller arrays*/
function shuffle(array) {
  let m = array.length, t, i;
  // While there remain elements to shuffle
  while (m) {
    // Pick a remaining element
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  };
  return array;
};

/*questions is an array containing several objects formatted as questions. Each object is
denoted by the curly-brace containing the individual question to the curly-brace just under
the answers property array.*/
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

/*app is started through a click event listener which calls this function. startGame first calls the timer function,
uses the startButton variable to add a class of 'hide' to its element, and removes the 'hide' class from
questionContainerEl which makes its element visible. The container variable nextQuestion is initialized with a value
that calls our shuffle function on the array of questions, and currentQuestion is given a value of 0, which ensures
we will start at the beginning of our now randomized nextQuestion array, once the function setupNextQuestion is called.*/
function startGame() {
  timer();
  startButton.classList.add("hide");
  questionContainerEl.classList.remove("hide");
  nextQuestion = shuffle(questions);
  currentQuestion = 0;
  setupNextQuestion();
};

/*setupNextQuestion first uses the nextButton variable to add a class of 'hide' to its element. Then we enter a while loop
which checks if the provided argument is truthy, and if so prevents the previous array of answers from remaining rendered.
We then call the generateQuestion function with the argument of nextQuestion- our randomized array of questions- at an index
of currentQuestion(initialized as 0 in the startGame function).*/
function setupNextQuestion() {
  nextButton.classList.add("hide");

  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  };
  generateQuestion(nextQuestion[currentQuestion]);
};

/*generateQuestion first manipulates the text of questionEl variable by targeting the array parameter passed to the function
and appending the property of question onto it from the object array. We then call our shuffle function on(randomizing the
order which answers are rendered), and target the answers property of the object array, putting it through a forEach loop.
The forEach loop creates a button variable- which will be used to create a button element for each answer in array.answers.
It targets the text of each button with answer.option, populating each button element with each avaliable option property,
and appends the button variable onto the answerButtons variable, creating a button for each of the given answer.option values.
A class of 'btn' and 'disableBtn' is added to each button variable appended. Two event listeners are attached to the button
variable, activating on a click and calling the answerSelected function and isCorrect function.*/
function generateQuestion(array) {
  questionEl.innerText = array.question;
  shuffle(array.answers).forEach((answer) => {
    let button = document.createElement("button");
    button.innerText = answer.option;
    answerButtons.appendChild(button);
    button.classList.add("btn", 'disableBtn');
    button.addEventListener("click", answerSelected);
    button.addEventListener('click', isCorrect);
  });
};

/*answerSelected creates the disableBtn variable, which selects elements with a class name of 'disableBtn'. We then enter a
for loop, where we initialize the variable i, check it against the length of the disableBtn variable, and iterate i if it is
LESS THAN that check. Within the for loop, we set the disabled propery of disableBtn at an index to true(this prevents the
user from clicking button elements after they've already selected one). Entering an if statement, we check if the length of
the nextQuestion array(which is 5) IS GREATER THAN the number which currentQuestion evaluates to + 1(nextQuestion is an array,
arrays are 0 indexed). If nextQuestion.length is greater, then it will remove the class of 'hide' from the nextButton element,
making it visible. If nextQuestion.length is NOT GREATER than currentQuestion + 1(which will happen once the user has reached
the end of our array of questions), it will instead remove the class of 'hide' from the scoreButton variable, making the
Highscore button visible. It will also add the class of 'hide' to an element with an Id of 'time-readout' which makes the
timer not visible.*/
function answerSelected() {
  let disableBtn = document.getElementsByClassName('disableBtn');

  for(let i = 0; i < disableBtn.length; i++){
    disableBtn[i].disabled = true;
  };

  if(nextQuestion.length > currentQuestion + 1) {
    nextButton.classList.remove("hide");
  } else {
    scoreButton.classList.remove("hide");
    document.getElementById(`time-readout`).classList.add(`hide`);
  };
};

/*isCorrect first sets-up the variable answerText, for holding the target.innerHTML of the event parameter(this evaluates to
what HTML is within a clicked answer button). We then enter a for loop, where we initialize the variable i, check it against
the length of our nextQuestion variable at an index, and iterate the i variable if it is LESS THAN that check. We then enter
an if statement that checks if our answerText variable evaluates to a given option property within our answers array at an
index, within our nextQuestion array at an index- AND(&&) we also check if the correct property of our answers array at an
index, within our nextQuestion array at an index evaluates to TRUE(checking the value of the clicked button and if its correct
property is true, meaning its a correct answer). If both these checks are passed, we iterate the userScore variable by 10,
indicating a correctly-chosen answer. Then, we enter an else if statement that performs the first check verbatim, but inverts
the second check; instead checking if the correct property within our answers array at an index, within our nextQuestion array
at an index evaluates to FALSE(checking the value of the clicked button and if its correct property is false, meaning its an
incorrect answer). If both the else if checks are passed we decrement the userScore variable by 10, indicating an incorrectly
chosen answer.*/
function isCorrect(event){
  let answerText = event.target.innerHTML;

  for(let i = 0; i < nextQuestion[i].answers.length; i++){

    if(answerText === nextQuestion[currentQuestion].answers[i].option
      &&
      nextQuestion[currentQuestion].answers[i].correct === true){
      userScore += 10;
    }else if(answerText === nextQuestion[currentQuestion].answers[i].option
      &&
      nextQuestion[currentQuestion].answers[i].correct === false){
      userScore -= 10;
    };
  };
};

/*The timer function below is a very good example of a basic countdown. Within this app, it is called in the startGame function,
ensuring the user is immediatly timed upon beginning the quiz. First, we make a variable of timeCount which is used to call
setInterval. The first argument of setInterval is a nameless function; this function selects an element with an Id of
'time-readout' and gives it the text of 'Time left:' with a template literal of ${sec}, which allows the countdown to
dynamically update as time passes. We then enter an if statement that checks if sec IS GREATER THAN 0(checking if we've
ran out of time) and decrements sec if it is greater than zero. If sec is NOT GREATER than 0, we call clearInterval with an
argument of timeCount- clearInterval being a built-in tool of setInterval which will interrupt its typical process, add the
class of 'hide' to the questionContainerEl making it not visible, remove the class of 'hide' from the scoreButton variable
making it visible, select an element with an Id of 'time-readout' and add the class of hide to it making the timer not visible,
and decrement the userScore variable by 10(because the user will have ran out of time). We also have a secondary if statement
that checks if currentQuestion evaluates to the same number as questions.length - 1(which would mean the user has reached the
end of our quiz), and if so also calls clearInterval with an argument of timeCount. Finally, we have setIntervals second
argument- after the curly brace with a comma- 1000, which is a measurment of milliseconds we'd like the setInterval function
to delay itself by(evaluating to a 1 second passage of time).*/
function timer() {

  const timeCount = setInterval(function () {
    document.getElementById("time-readout").innerHTML = `Time left: ${sec}`;
    
    if (sec > 0) {
      sec--;
    }else{
      clearInterval(timeCount);
      questionContainerEl.classList.add("hide");
      scoreButton.classList.remove("hide");
      document.getElementById(`time-readout`).classList.add(`hide`);
      userScore -= 10;
    };

    if(currentQuestion === questions.length - 1){
      clearInterval(timeCount);
    };
  }, 1000);
};
 /*saveScore and loadSavedScores don't actually work as intended currently; saving the user's score between sessions/reloads,
 but it also isn't breaking the app. It's very likely that it's close to correct implimentation and only needs some tweaking
 to work as I wanted it to. Google searching: how to save multiple user scores to a scoreboard javascript - seemed like it may
 be helpful*/
function saveScore(){
  let totalScore = userScore + sec;

  if(totalScore > 0){
    allScores.push(totalScore); //localStorage.setItem('score', totalScore));
    localStorage.setItem('score', JSON.stringify(totalScore));
  };
  console.log(allScores); //here totalScore has been pushed into allScores
  loadSavedScores();
};

function loadSavedScores(){
  let savedScore = localStorage.getItem("score");
  console.log(savedScore) //here we can console.log the score from out savedScore variable
  if(!savedScore){
    return false;
  };

  savedScore = JSON.parse(savedScore);
  console.log(typeof savedScore);
};

/*will need to create a container for saving previous scores, so as to load them upon displaying scoreboard. Function isnt
complete, will write-up once we can save userScore in some way which allows it to be displayed*/
function scorePage(){
  let totalScore = userScore + sec;

  questionContainerEl.classList.add("hide");
  scoreBoard.classList.remove("hide");
    // localStorage.setItem("score", JSON.stringify(sec)); didn't work, but was supposed to save score 
  scoreBoard.innerText = `Your score: ${totalScore}`;
};

/*Below we have three event listeners. First, the event listener on our scoreButton variable allows us to call the scorePage
function. Second, the event listener on our nextButton variable calls an anonymous function which iterates our currentQuestion
variable, and calls the setupNextQuestion function. Third, the event listener on our startButton variable allows us to call
the startGame function.*/
scoreButton.addEventListener("click", saveScore);
scoreButton.addEventListener("click", scorePage); /*Still calls scorePage just fine, will leave for now.*/

nextButton.addEventListener("click", () => {
  currentQuestion++;
  setupNextQuestion();
});

startButton.addEventListener("click", startGame);


//below is a possible quick-ref on how to impliment score-saving via methods on a different repo
/// let saveTasks = function() {
//   localStorage.setItem("tasks", JSON.stringify(tasks));
/// }
/// let loadTasks = function() {
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
/// };

/*Still TODO:
highscores do not save between sessions, previous repo's code could have something that helps-
  -We need to store the value of our highscore data in an array, to make sure we can save several at a time
  -hopefully will be as easy as using .push or some other array method to save highscore data
  -currently still unable to figure out how to save entries to localStorage without overriding previous entries to localStorage

would be nice if users could save their highscore with a name of their choice-
  -We'll have to associate a form html element with the data we want a name assigned to
  -will probaly be packaged in some sort of object (ex. let objWithData = {name: name, score: score})

correct/incorrect indicators to the user upon selecting an answer button
  -should be fairly simple, will likely be implimented via the same add/remove class 'hide' thats utilized throughout rest of app
  -will be more realized once we have basic CSS with correct/incorrect values (ex. gren-colored correct response and red-colored incorrect response)
*/