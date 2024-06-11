/*variables for targeting specific elements within the DOM. They're roughly grouped into semi-related chunks. In order primerText,
startButton, scoreButton, questionContainerEl, questionEl, answerButtons, nextButton, quizSection, scoreSection, scoreBoard,
scoreReadout, usernameSection, usernameInput, submitName, and skipName all select elements with varrying Ids that roughly equate
to the name/functionality of their variable counterpart.*/
/*Primer text that indicates what our user is instructed/greeted with*/
let primerText = document.getElementById("primer-text");

/*Buttons for controlling the start and end of our quiz*/
let startButton = document.getElementById("start-btn");
let scoreButton = document.getElementById("score-btn");

/*Containers for displaying our quiz questions and answers, and buttons for controlling the answering of questions and generation of
subsequent questions*/
let questionContainerEl = document.getElementById("question-container");
let questionEl = document.getElementById("question");
let answerButtons = document.getElementById("answer-buttons");
let nextButton = document.getElementById("next-btn");

/*Containers which allow us to control how/when various sections of our app are visible, and when the user can display them*/
let quizSection = document.getElementById("quiz");
let scoreSection = document.getElementById('score-section');
let scoreBoard = document.getElementById("score-board");
let scoreReadout = document.getElementById("user-score");

/*Containers for handling username submission/assignment, and when they are visible to the user*/
let usernameSection = document.getElementById("prompt");
let usernameInput = document.getElementById("user-name");
let submitName = document.getElementById("submit-name");
let skipName = document.getElementById("skip-name");


/*sec is a variable for storing time. nextQuestion and currentQuestion are two initialized variables to act as
generic containers that will be assigned value as the app progresses. userScore is a variable initialized to 0,
which will be iterated or decremented upon if the user answers each question correctly or incorrectly, decremented
if the user runs out of time, and have any remaining time added to the users score if they finish the quiz early.
userName is a variable initialized to an empty string, which will be assigned value based on what username the user
has entered, or if they've decided to skip username entry. allScores is a variable initialized as an array, which will
store objects which evaluate to individual user tests. userDataObj is a variable initialized as an empty object, is the
container which is being stored in allScores, and is what will contain user data upon test completion*/
let sec = 15;
let nextQuestion, currentQuestion;
let userScore = 0;
let userName = '';
let allScores = [];
let userDataObj = {};

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

/*exceedsLimit tests a prop passed to the function, in this case the allScores array. It first initializes two variables; limitLength with a value of 5, and exceedsLimit
with a value of false. We enter an if statement that checks if the prop length is equivalent to the limitLength variable, and if it is we set exceedsLimit value to true.
After this check, we return the exceedsLimit variable.*/
function exceedsLimit(prop) {
  let limitLength = 5;
  let exceedsLimit = false;

  if(prop.length === limitLength) {
      exceedsLimit = true;
  };
  return exceedsLimit;
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

/*setUsername is called through one of two event listeners, which determine what value will be assigned to the userName variable.
We first take in a parameter of e, which will target an event on the page(in this case a 'click'), then pass it into an if/else
statement. Within the if/else, we check to see if the id property of the target effected by the event is equal to the string
'submit-name'. If so, we assign the value property of the usernameInput variable to our userName variable, else we assign
'Anonymous' as the string-value of our userName variable. After this, we add a class of 'hide' to our usernameSection and
quizSection variables, making them no-longer visible, and change the innerText property of out primerText variable to the string;
'When ready, click the 'Start' button below to begin the quiz, which will also start the timer. Good luck!'*/
function setUsername(e){

  if(e.target.id === 'submit-name'){
    userName = usernameInput.value;
  }else{
    userName = 'Anonymous';
  };
  usernameSection.classList.add("hide");
  quizSection.classList.remove("hide");
  primerText.innerText = `When ready, click the 'Start' button below to begin the quiz, which will also start the timer. Good luck!`;
};

/*The quiz is started through a click event listener which calls this function. startGame first calls the timer function,
uses the primerText variable to add a class of 'hide' to its element, uses the startButton variable to add a class of
'hide' to its element, and removes the 'hide' class from questionContainerEl which makes its element visible. The container
variable nextQuestion is initialized with a value that calls our shuffle function on the array of questions, and
currentQuestion is given a value of 0, which ensures we will start at the beginning of our now randomized nextQuestion array,
once the function setupNextQuestion is called.*/
function startGame() {
  timer();
  primerText.classList.add("hide");
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
arrays are 0 indexed). If nextQuestion.length IS GREATER, then it will remove the class of 'hide' from the nextButton element,
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

/*Is now working, will write-up soon */
function saveScore(){
  let totalScore = userScore + sec;
  userDataObj = {
    name: userName,
    score: totalScore
  };
  allScores = JSON.parse(localStorage.getItem("scoreEntry")) || [];

  if(exceedsLimit(allScores)) {
    allScores.pop();
  };
  allScores.push(userDataObj);
  allScores.sort((a, b) => b.score - a.score);
  localStorage.setItem('scoreEntry', JSON.stringify(allScores));
  // localStorage.clear(allScores); //This will clear localStorage, if needing to be done manually. Doubt it will be needed at this point, but still need to add name prop
  console.log(allScores);
  scorePage();
};

function scorePage(){
  let totalScore = userScore + sec;

  scoreButton.classList.add("hide");
  questionContainerEl.classList.add("hide");
  scoreSection.classList.remove("hide");
  scoreReadout.innerText = `You scored ${totalScore} points!`;

  allScores.forEach((score) =>{
    let li = document.createElement("li");
    li.innerText = `${score.name}: ${score.score}`;
    scoreBoard.appendChild(li);
  });
};

/*Below we have five event listeners. First, the event listener on our scoreButton variable allows us to call the scorePage
function. Second, the event listener on our nextButton variable calls an anonymous function which iterates our currentQuestion
variable, and calls the setupNextQuestion function. Third, the event listener on our startButton variable allows us to call
the startGame function. Fourth and fifth are both for calling the setUsername function, depending on what name value the user
would like associated with their score.*/
scoreButton.addEventListener("click", saveScore);

nextButton.addEventListener("click", () => {
  currentQuestion++;
  setupNextQuestion();
});

startButton.addEventListener("click", startGame);

submitName.addEventListener("click", setUsername);
skipName.addEventListener("click", setUsername);

/*Still TODO:
will need to impliment some if/else logic of replacing score-entries, where existing scores should NOT be replaced if the user did not exceed lowest saved score
  -similarly, we need to have some if/else logic which will simply NOT push a given users score to the scoreboard at all, if it doesn't exceed a certain threshold

correct/incorrect indicators to the user upon selecting an answer button
  -should be fairly simple, will likely be implimented via the same add/remove class 'hide' thats utilized throughout rest of app
  -will be more realized once we have basic CSS with correct/incorrect values (ex. gren-colored correct response and red-colored incorrect response)
  -very likely want to target the isCorrect function to display these inicators, as we're already targeting logic there which affects variables depending on if
  the selected answer is correct/incorrect

Would be nice to have an array of question objects which is larger than the amount of questions we'll have the user answer, so that we can further randomize the
test by applying the shuffle function to that array of question-objects and pushing the first five into an array which will display those questions.
  -we'll probably want to get rid of the current randomizing of the order our questions are displayed, as this would ensure they'll always be randomized from a
  larger selection of questions
*/