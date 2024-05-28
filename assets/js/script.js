//variables for targeting specific elements within the DOM. In order startButton, scoreButton, nextButton,
//questionContainerEl, questionEl, answerButtonsEl, and scoreBoard all select elements with varrying Ids
//that roughly equate to the name of their variable counterpart.
let startButton = document.getElementById("start-btn");
let scoreButton = document.getElementById("score-btn");
let nextButton = document.getElementById("next-btn");
let questionContainerEl = document.getElementById("question-container");
let questionEl = document.getElementById("question");
let answerButtonsEl = document.getElementById("answer-buttons");
let scoreBoard = document.getElementById("score-board");
let controls = document.getElementById("controls");

//sec is a variable for storing time. nextQuestion and currentQuestion are two initialized variables to act as
//generic containers that will be assigned value as the app progresses.
let sec = 8;
let nextQuestion, currentQuestion, userScore;

//this is a helper-function for shuffling arrays, known as the fisher-yates shuffle. This implimentation of it was
//taken from: https://bost.ocks.org/mike/shuffle/
//The old shuffling method used was this: /*questions.sort(() => Math.random() - 0.5)*/
//which apparently is inefficient and not totally random, but was alright for smaller arrays
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

//questions is an array containing several objects formatted as questions. Each object is
//denoted by the curly-brace containing the individual question to the curly-brace just under
//the answers property array.
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

//app is started through a click event listener which calls this function. startGame first calls the timer function,
//uses the startButton variable to add a class of 'hide' to an element, and removes the 'hide' class from
//questionContainerEl which makes its element visible. The container variable nextQuestion is initialized with a value
//that calls our shuffle function on the array of questions, and currentQuestion is given a value of 0, which ensures
//we will start at the beginning of our now randomized nextQuestion array, when we call the function setNextQuestion.
function startGame() {
  timer();
  startButton.classList.add("hide");
  questionContainerEl.classList.remove("hide");
  nextQuestion = shuffle(questions);
  // console.log(questions[4].answers[3].correct); //This is how I will target the true/false boolean value of the correct property
  currentQuestion = 0;
  setNextQuestion();
};

//setNextQuestion first uses the nextButton variable to add a class of 'hide' to its element. Then we enter a while loop
//which checks if the provided argument is truthy, and if so prevents the empty buttons from our html file from
//generating. We then call the showQuestion function with the argument of nextQuestion- our randomized array of questions-
//at an index of currentQuestion(initialized as 0 in the startGame function).
function setNextQuestion() {
  nextButton.classList.add("hide");
  while (answerButtonsEl.firstChild) {
    answerButtonsEl.removeChild(answerButtonsEl.firstChild);
  };
  showQuestion(nextQuestion[currentQuestion]);
  
};

//showQuestion first manipulates the text of questionEl variable by targeting the array parameter passed to the function
//and appending the value of question onto it from the object array(questions => question => answers => option). We then
//target the answers property of the object array, putting it through a forEach loop. The forEach loop creates a button
//variable- which creates a button element- for each answer in array.answers. It targets the text of each button with
//answer.option, populating each button element with each avaliable option property, and appends the button variable onto
//the answerButtonsEl variable, creating a button for each of the given answer.option values. A class of 'btn' is added to
//each button variable appended. Finally, an event listener is attached to the button variable, activating on a click and
//calling the selectAnswer function.
function showQuestion(array) {
  questionEl.innerText = array.question;
  array.answers.forEach((answer) => {                        
    let button = document.createElement("button");
    button.innerText = answer.option;
    answerButtonsEl.appendChild(button);
    button.classList.add("btn");
    // if (answer.correct) {
    //   button.dataset.correct = answer.correct;
    // }   I believe this had previously determined if a selected answer was correct or not, not sure if needed here                         
    button.addEventListener("click", selectAnswer);
  });
};

//selectAnswer checks if the length of the nextQuestion array(which is 5) IS GREATER THAN the number which currentQuestion
//evaluates to + 1. If nextQuestion.length is greater, then it will remove the class of 'hide' from the nextButton element,
//making it visible. If nextQuestion.length is NOT GREATER than currentQuestion + 1(which will happen once the user has
//reached the end of our array of questions), it will instead remove the class of 'hide' from the scoreButton variable and
//determine its text, making the Highscore button visible. It will also add the class of 'hide' to an element with an Id of
//'time-readout' which makes the timer not visible.
function selectAnswer() {
  let userScore = 0;

  if (nextQuestion.length > currentQuestion + 1) {
    nextButton.classList.remove("hide");
  } else {
    scoreButton.classList.remove("hide");
    scoreButton.innerHTML = "Highscores";
    document.getElementById(`time-readout`).classList.add(`hide`);
  };

  for(let i = 0; i < nextQuestion.length; i++){
    for(let j = 0; j < nextQuestion[i].answers.length; j++){
      if(nextQuestion[i].answers[j].correct === true){
        userScore += 10;
      }else{
        userScore -= 10;
      }
      console.log(`userScore`,userScore);
    };
  };
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
      scoreButton.innerHTML = "Highscores";
      document.getElementById(`time-readout`).classList.add(`hide`);
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