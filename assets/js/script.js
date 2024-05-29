/*variables for targeting specific elements within the DOM. In order startButton, scoreButton, nextButton,
questionContainerEl, questionEl, answerButtonsEl, scoreBoard, and controls all select elements with varrying Ids
that roughly equate to the name of their variable counterpart.*/
let startButton = document.getElementById("start-btn");
let scoreButton = document.getElementById("score-btn");
let nextButton = document.getElementById("next-btn");
let questionContainerEl = document.getElementById("question-container");
let questionEl = document.getElementById("question");
let answerButtonsEl = document.getElementById("answer-buttons");
let scoreBoard = document.getElementById("score-board");
let controls = document.getElementById("controls");

/*sec is a variable for storing time. nextQuestion and currentQuestion are two initialized variables to act as
generic containers that will be assigned value as the app progresses. userScore is a variable initialized to 0,
which will be iterated or decremented upon if the user answers each question correctly or incorrectly, or
decremented if the user runs out of time.*/
let sec = 8;
let nextQuestion, currentQuestion;
let userScore = 0;

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
  }
  return array;
}

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
we will start at the beginning of our now randomized nextQuestion array, when we call the function setupNextQuestion.*/
function startGame() {
  timer();
  startButton.classList.add("hide");
  questionContainerEl.classList.remove("hide");
  nextQuestion = shuffle(questions);
  currentQuestion = 0;
  setupNextQuestion();
};

/*setupNextQuestion first uses the nextButton variable to add a class of 'hide' to its element. Then we enter a while loop
which checks if the provided argument is truthy, and if so prevents the empty buttons from our html file from
generating. We then call the generateQuestion function with the argument of nextQuestion- our randomized array of questions-
at an index of currentQuestion(initialized as 0 in the startGame function).*/
function setupNextQuestion() {
  nextButton.classList.add("hide");
  while (answerButtonsEl.firstChild) {
    answerButtonsEl.removeChild(answerButtonsEl.firstChild);
  };
  generateQuestion(nextQuestion[currentQuestion]);
};

/*generateQuestion first manipulates the text of questionEl variable by targeting the array parameter passed to the function
and appending the value of question onto it from the object array. We then target the answers property of the object array,
putting it through a forEach loop. The forEach loop creates a button variable- which will create a button element- for each
answer in array.answers. It targets the text of each button with answer.option, populating each button element with each
avaliable option property, and appends the button variable onto the answerButtonsEl variable, creating a button for each
of the given answer.option values. A class of 'btn' is added to each button variable appended. Two event listeners are
attached to the button variable, activating on a click and calling the answerSelected function and isCorrect function.*/
function generateQuestion(array) {
  questionEl.innerText = array.question;
  array.answers.forEach((answer) => {                        
    let button = document.createElement("button");
    button.innerText = answer.option;
    answerButtonsEl.appendChild(button);
    button.classList.add("btn");
    button.addEventListener("click", answerSelected);
    button.addEventListener('click', isCorrect);
  });
};

/*answerSelected checks if the length of the nextQuestion array(which is 5) IS GREATER THAN the number which currentQuestion
evaluates to + 1(nextQuestion is an array, arrays are 0 indexed). If nextQuestion.length is greater, then it will remove
the class of 'hide' from the nextButton element, making it visible. If nextQuestion.length is NOT GREATER than
currentQuestion + 1(which will happen once the user has reached the end of our array of questions), it will instead remove
the class of 'hide' from the scoreButton variable and determine its text, making the Highscore button visible. It will also
add the class of 'hide' to an element with an Id of 'time-readout' which makes the timer not visible.*/
function answerSelected() {
  if (nextQuestion.length > currentQuestion + 1) {
    nextButton.classList.remove("hide");
  } else {
    scoreButton.classList.remove("hide");
    document.getElementById(`time-readout`).classList.add(`hide`);
  };
};

/*isCorrect first sets-up the variable answerText, for holding the target.innerHTML of the event parameter(this evaluates to
what HTML is within a clicked answer button). We then enter a for loop, where we initialize the variable i, check it against
the length of our answers array at an index of our nextQuestion variable, and iterate the i variable if it is LESS THAN that
check. We then enter an if statement that checks if our answerText variable evaluates to a given option property within our
answers array at an index, within our nextQuestion array at an index- AND(&&) we also check if the correct property of our
answers array at an index, within our nextQuestion array at an index evaluates to TRUE(checking the value of the clicked
button and if its correct property is true, meaning its a correct answer). If both these checks are passed, we iterate the
userScore variable by 10, indicating a correctly-chosen answer. Then, we enter an else if statement that performs the first
check verbatim, but inverts the second check; instead checking if the correct property within our answers array at an index,
within our nextQuestion array at an index evaluates to FALSE(checking the value of the clicked button and if its correct
property is false, meaning its an incorrect answer). If both these checks are passed we decrement the userScore variable by 10,
indicating an incorrectly-chose answer.*/
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
    // console.log(nextQuestion[currentQuestion].answers[i].option)
  };
    // console.log(`userScore`,userScore);
  // console.log(nextQuestion[currentQuestion].answers[0].correct) //this accurately targets the true/false property
  // console.log(event.target.innerHTML);
};

/*The timer function below is a very good example of a basic countdown. Within this app, it is called in the startGame function,
ensuring the user is immediatly timed upon beginning the quiz. First, we make a variable of timeCount which is used to call
setInterval. The first argument of setInterval is a nameless function; this function selects an element with an Id of
'time-readout' and gives it the text of 'Time left:' with a template literal of ${sec}, which allows the countdown to
dynamically update as time passes. We then enter an if statement that checks if sec IS GREATER THAN 0(checking if we've
ran out of time) and decrements sec if it is greater than zero. If sec is NOT GREATER than 0, we call clearInterval with an
argument of timeCount- clearInterval being a built-in tool of setInterval which will interrupt its typical process(in this
case, decrementing sec). We also have a secondary if statement that checks if currentQuestion evaluates to the same number
as questions.length - 1(which would mean the user has reached the end of our quiz), and if so also calls clearInterval with
an argument of timeCount. Finally, we have setIntervals second argument- after the curly brace with a comma- 1000, which is
a measurment of milliseconds we'd like the setInterval function to delay itself by(evaluating to a 1 second passage of time).*/
function timer() {
  const timeCount = setInterval(function () {
    document.getElementById("time-readout").innerHTML = `Time left: ${sec}`;
    
    if (sec > 0) {
      sec--;
    }else{
      clearInterval(timeCount);
      questionContainerEl.classList.add("hide");
      controls.classList.add("hide");
      scoreButton.classList.remove("hide");
      document.getElementById(`time-readout`).classList.add(`hide`);
      userScore -= 10;
    } 

    if(currentQuestion === questions.length - 1){
      clearInterval(timeCount);
    }

  }, 1000);
};

/*will need to create a container for saving previous scores, so as to load them upon displaying scoreboard. Function isnt
complete, will write-up once we can save userScore in some way which allows it to be displayed*/
function scorePage(){
    questionContainerEl.classList.add("hide");
    scoreBoard.classList.remove("hide");
    // localStorage.setItem("score", JSON.stringify(sec)); didn't work, but was supposed to save score 
    scoreBoard.innerText = `Your score: ${userScore}`;
};

/*Below we have three event listeners. First, the event listener on our scoreButton variable allows us to call the scorePage
function. Second, the event listener on our nextButton variable calls an anonymous function which iterates our currentQuestion
variable, and calls the setupNextQuestion function. Third, the event listener on our startButton variable allows us to call
the startGame function.*/
scoreButton.addEventListener("click", scorePage);

nextButton.addEventListener("click", () => {
  currentQuestion++;
  setupNextQuestion();
});

startButton.addEventListener("click", startGame);

//highscores do not save between sessions, previous repo's code could have something that helps

//below is a possible quick-ref on how to impliment score-saving via methods on a different repo
// let saveTasks = function() {
//   localStorage.setItem("tasks", JSON.stringify(tasks));
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