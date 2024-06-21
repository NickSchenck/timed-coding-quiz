/*variables for targeting specific elements within the DOM. They're roughly grouped into semi-related chunks. In order primerText, rulesList, startButton, scoreButton,
questionContainerEl, questionEl, answerButtons, nextButton, answerCorrect, answerIncorrect, quizSection, scoreSection, scoreBoard, scoreReadout, usernameSection,
usernameInput, submitName, skipName, resetButton, and clearHighscoresButton all select elements with varrying Ids that roughly equate to the name/functionality of
their variable counterpart.*/
/*Primer text that indicates what our user is instructed/greeted with, and rules for outlining our quiz rules*/
let primerText = document.getElementById("primer-text");
let rulesList = document.getElementById("rules-list");

/*Buttons for controlling the start and end of our quiz*/
let startButton = document.getElementById("start-btn");
let scoreButton = document.getElementById("score-btn");
let timeReadout = document.getElementById("time-readout");

/*Containers for displaying our quiz questions and answers- and the correctness of the users choice- and buttons for controlling the answering of questions and
generation of subsequent questions*/
let questionContainerEl = document.getElementById("question-container");
let questionEl = document.getElementById("question");
let answerButtons = document.getElementById("answer-buttons");
let nextButton = document.getElementById("next-btn");
let answerCorrect = document.getElementById("answer-correct");
let answerIncorrect = document.getElementById("answer-incorrect");

/*Containers which allow us to control how/when various sections of our app are visible, and when the user can display them*/
let quizSection = document.getElementById("quiz");
let scoreSection = document.getElementById("score-section");
let scoreBoard = document.getElementById("score-board");
let scoreReadout = document.getElementById("user-score");

/*Containers for handling username submission/assignment, and when they are visible to the user*/
let usernameSection = document.getElementById("prompt");
let usernameInput = document.getElementById("user-name");
let submitName = document.getElementById("submit-name");
let skipName = document.getElementById("skip-name");

/*Buttons for resetting the quiz and the highscore page/list*/
let resetButton = document.getElementById("retry-btn");
let clearHighscoresButton = document.getElementById("score-clear-btn");


/*sec is a variable for storing time. nextQuestion is an array which will contain 5, random-ordered questions from our questions array. currentQuestion is initialized
as zero, and will be iterated on to progress our quiz(used as an index). userScore is a variable initialized to 0, which will be iterated or decremented upon as the
user answers each question correctly or incorrectly, decremented if the user runs out of time, and have any remaining time added to the users score if they finish the
quiz early. userName is a variable initialized to an empty string, which will be assigned value based on what username the user has entered, or if they've decided to
skip username entry. allScores is a variable initialized as an array, which will store objects which evaluate to individual user tests. userDataObj is a variable
initialized as an empty object, is the container which is being stored in allScores, and is what will contain user data upon test completion*/
let sec = 60;
let nextQuestion = [];
let currentQuestion = 0;
let userScore = 0;
let userName = "";
let allScores = [];
let userDataObj = {};

/*this is a helper-function for shuffling arrays, known as the fisher-yates shuffle. This implimentation of it was taken from: https://bost.ocks.org/mike/shuffle/
The old shuffling method used was this: questions.sort(() => Math.random() - 0.5) which apparently is inefficient and not totally random, but was alright for smaller
arrays. The inline comments came with the function, and do a good job of explaining its process.*/
/*shuffle affects the array passed to it as an argument. First, we define the variable m as equal to the passed array's length property, as well as initialize the
variables t and i. We then enter a while loop that checks if m evaluates to truthy. While m is truthy, we set i equal to a whole, random number times(*) m being
decremented(--). Then- still in the while loop- we set t equal to an index of the passed array, set the index of that array equal to another index of that array, and we
set that array's index equal to t(this logic seems very circular, but that's intentional, as this is how index's within the array are shuffled). Once we exit the while
loop- when m has been reduced to 0- we return the now shuffled array.*/
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

/*exceedsLimit tests a prop passed to the function, where its called; the allScores array. It first initializes two variables; limitLength with a value of 5, and
exceedsLimit with a value of false. We enter an if statement that checks if the prop length is equivalent to the limitLength variable, and if it is we set exceedsLimit
value to true. After this check, we return the exceedsLimit variable.*/
function exceedsLimit(prop) {
  let limitLength = 5;
  let exceedsLimit = false;

  if(prop.length === limitLength) {
      exceedsLimit = true;
  };
  return exceedsLimit;
};

/*questions is an array containing 20 objects formatted as questions. Each object is denoted by the curly-brace containing the individual question to the curly-brace
just under the answers property array.*/
let questions = [
  {
    question: "What is a pseudo-class?",
    answers: [
      { option: "A CSS keyword to target an element's state.", correct: true },
      { option: "A CSS declaration that hides the element.", correct: false },
      { option: "A financial class in society that isn't well defined.", correct: false },
      { option: "Uhhhh... a kinda germ??", correct: false }
    ],
    isAnswered: false
  },
  {
    question: "What is the purpose of the alt attribute for images?",
    answers: [
      { option: "To make it easier to style the image with CSS.", correct: false },
      { option: "To give your image a grungy, punk-like filter.", correct: false },
      { option: "To provide context for the image.", correct: true },
      { option: "To alter the image with provided parameters.", correct: false }
    ],
    isAnswered: false
  },
  {
    question: "What is the preferred way to include or link another file in programming?",
    answers: [
      { option: "Relative pathing.", correct: true },
      { option: "Through the browser.", correct: false },
      { option: "Absolute pathing.", correct: false },
      { option: "Filing is for interns... get one of them to do it.", correct: false }
    ],
    isAnswered: false
  },
  {
    question: "What is the command to push code to GitHub?",
    answers: [
      { option: "git init", correct: false },
      { option: "Push? Are you threatening me??", correct: false },
      { option: "git commit -m", correct: false },
      { option: "git push origin main", correct: true }
    ],
    isAnswered: false
  },
  {
    question: "Which of the following is >NOT< a reason to validate a user's responses?",
    answers: [
      { option: "Increases the overall quality of the user data.", correct: false },
      { option: "When they're rude and a jerk.", correct: true },
      { option: "Reduces inaccurate answers getting stored in the database.", correct: false },
      { option: "Offers the user an opportunity to enter a correct response.", correct: false }
    ],
    isAnswered: false
  },
  {
    question: "What are a few common array methods?",
    answers: [
      { option: "Floor, random, min.", correct: false },
      { option: "Map, push, sort.", correct: true },
      { option: "Keys, entries, create.", correct: false },
      { option: "Achoo, gesundheit, thank you.", correct: false }
    ],
    isAnswered: false
  },
  {
    question: "What are a few common type properties on an input HTML element?",
    answers: [
      { option: "Boolean, string, array.", correct: false },
      { option: "Disabled, value, src.", correct: false },
      { option: "Text, number, date.", correct: true },
      { option: "Bacon, lettuce, tomato.", correct: false }
    ],
    isAnswered: false
  },
  {
    question: "What's a symbol that is used as the logical not operator?",
    answers: [
      { option: "?", correct: false },
      { option: "!", correct: true },
      { option: "@", correct: false },
      { option: ":)", correct: false }
    ],
    isAnswered: false
  },
  {
    question: "What is the correct way to wrap an object?",
    answers: [
      { option: "[object]", correct: false },
      { option: "{object}", correct: true },
      { option: "(object)", correct: false },
      { option: "In giftwrap!", correct: false }
    ],
    isAnswered: false
  },
  {
    question: "What behavior will result from using the 'return' keyword?",
    answers: [
      { option: "You will be able to pass information associated with the 'return' more freely.", correct: false },
      { option: "You will exit your current function, and a value will result from the completion of the function.", correct: true },
      { option: "You will looped back to the beginning of the function, from the point of the 'return'.", correct: false },
      { option: "You will be allowed to leave work early, and 'return' home.", correct: false }
    ],
    isAnswered: false
  },
  {
    question: "What is the typical hierarchy of h1 to h6 HTML elements?",
    answers: [
      { option: "h1 tags should be used often, especially to assist navigation of the page.", correct: false },
      { option: "h1 tags should be used to denote major sections, descending tags can be used more freely.", correct: true },
      { option: "h1 to h6 tags are how a developer should render text on a page.", correct: false },
      { option: "Whichever tag is the king would have to notarize their line of succession.", correct: false }
    ],
    isAnswered: false
  },
  {
    question: "What are the tags for linking stylesheets and javascript?",
    answers: [
      { option: "rel and src.", correct: false },
      { option: "link and script.", correct: true },
      { option: "style and java.", correct: false },
      { option: "Forest, fire, water, shadow, and spirit temples.", correct: false }
    ],
    isAnswered: false
  },
  {
    question: "How can you write comments/notes in HTML, CSS, and javascript?",
    answers: [
      { option: "annotate tag for HTML, note property for CSS, and setComment attribute for javascript.", correct: false },
      { option: "'<!---->' for HTML, '/**/' for CSS, and '//' OR '/**/' for javascript.", correct: true },
      { option: "The methods for denoting comments in each are kept homogeneous, to ensure best practices.", correct: false },
      { option: "Notes? I just draw... ☺☻ §♫ ☼♥", correct: false }
    ],
    isAnswered: false
  },
  {
    question: "What is the anchor HTML element responsible for?",
    answers: [
      { option: "Ensuring a page isn't improperly resized when it's loaded on a device with differing screen-size.", correct: false },
      { option: "Creating a hyperlink to web pages, files, email addresses, and locations in the same page.", correct: true },
      { option: "Setting the strength and speed of mouse-wheel scrolling on a webpage.", correct: false },
      { option: "My anchor arms! I'll be a jerk and everyone will love me!", correct: false }
    ],
    isAnswered: false
  },
  {
    question: "What's a good example of semantic HTML elements?",
    answers: [
      { option: "div and span.", correct: false },
      { option: "form and table.", correct: true },
      { option: "p and br.", correct: false },
      { option: "So...uhh...ummmm...yeah.", correct: false }
    ],
    isAnswered: false
  },
  {
    question: "When are function parameters referred to as arguments?",
    answers: [
      { option: "In the function definition, where we supply the logic of the function.", correct: false },
      { option: "When the function is being called, and the parameter would be a variable.", correct: true },
      { option: "Never, these are seperate terms that do not neatly overlap.", correct: false },
      { option: "Whoa, whoa...If you're looking to argue, go be petty on social media, I'm not interested!", correct: false }
    ],
    isAnswered: false
  },
  {
    question: "What are a few common error-types in javascript?",
    answers: [
      { option: "ComputingError, MemoryError, and LogisticError.", correct: false },
      { option: "ReferenceError, SyntaxError, and TypeError.", correct: true },
      { option: "Most errors will only reference a line within a given file, and provide that feedback to the developer.", correct: false },
      { option: "01010111 01110010 01101111 01101110 01100111.", correct: false }
    ],
    isAnswered: false
  },
  {
    question: "When in doubt...",
    answers: [
      { option: "...comment it out.", correct: false },
      { option: "...console.log it out.", correct: true },
      { option: "...bracket it out.", correct: false },
      { option: "...DELETE whatever I BROKE, and START from SCRATCH.", correct: false }
    ],
    isAnswered: false
  },
  {
    question: "What is the DOM?",
    answers: [
      { option: "Domain Oriented Machine, a tool with which developers can allow or deny the access and permissions to web-domains.", correct: false },
      { option: "Document Object Model, a developer standard to dynamically access and update the content, structure, and style of a document.", correct: true },
      { option: "Define Obtain Manipulate, an acronym and development paradigm which assists developers in planning how to use data.", correct: false },
      { option: "Dunk On Marsupials, they're getting far too smart and I'm frankly shocked no-one else is concerned about this!", correct: false }
    ],
    isAnswered: false
  },
  {
    question: "How are CSS selectors defined?",
    answers: [
      { option: "Assigning data-values within a javascript file, that are then targeted and manipulated in a CSS file.", correct: false },
      { option: "Typically by targeting an element- or a class/id of an element- and applying styles to it, wrapped in {curly} braces.", correct: true },
      { option: "You can search for the various pre-defined CSS selectors on the web, then use them as you would methods in a javascript file.", correct: false },
      { option: "You mean those prison-wraith things from Azkaban?", correct: false }
    ],
    isAnswered: false
  }
];

/*setUsername is called through one of two event listeners, which determine what value will be assigned to the userName variable. We first take in a parameter of event,
which will target an event on the page(in this case a 'click'), then pass it into an if/else statement. Within the if/else, we check to see if the id property of the
target effected by the event is equal to the string 'submit-name'. If so, we assign the value property of the usernameInput variable to our userName variable, else we
assign 'Anonymous' as the string-value of our userName variable. After this, we add a class of 'hide' to our usernameSection- making it no-longer visible- and
quizSection has its 'hide' class removed- making it visible- and change the innerText property of our primerText variable to a string.*/
function setUsername(event){

  if(event.target.id === "submit-name"){
    userName = usernameInput.value;
  }else{
    userName = `Anonymous`;
  };
  usernameSection.classList.add("hide");
  quizSection.classList.remove("hide");
  primerText.innerText = `When ready, click the 'Start' button below to begin the quiz, which will also start the timer. Good luck!`;
};

/*determineQuestions is a function which populates our nextQuestion variable with the question the user will see. First, we call the shuffle function on the questions
array, changing the order of the question-objects contained in it. Then, we enter a for loop, where we initialize i, check if i is LESS THAN 5, and iterate i if so. While
i is less than 5, we use the push method to populate nextQuestion with entries that correspond to the questions array at an index. Once we exit our for loop, we return
the now populated nextQuestion variable.*/
function determineQuestions(){
  shuffle(questions);
  for(let i = 0; i < 5; i++){
    nextQuestion.push(questions[i]);
  };
  return nextQuestion;
};

/*The quiz is started through a click event listener which calls this function. startGame first calls the timer function, uses the primerText variable to add a class
of 'hide' to its element, uses the startButton variable to add a class of 'hide' to its element, and removes the 'hide' class from questionContainerEl which makes its
element visible. We then call the setupNextQuestion function*/
function startGame() {
  timer();
  rulesList.classList.add("hide");
  primerText.classList.add("hide");
  startButton.classList.add("hide");
  questionContainerEl.classList.remove("hide");
  setupNextQuestion();
};

/*setupNextQuestion first uses the nextButton variable to add a class of 'hide' to its element. answerCorrect and answerIncorrect are both given a class of hide, to
ensure the correct/incorrect indicators are not visible on question generation. Then we enter a while loop which checks if the provided argument is truthy, and if so
prevents the previous array of answers from remaining rendered. We then call the generateQuestion function with the argument of nextQuestion- our randomized array of
questions- at an index of currentQuestion(initialized as 0).*/
function setupNextQuestion() {
  nextButton.classList.add("hide");
  answerCorrect.classList.add("hide");
  answerIncorrect.classList.add("hide");
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  };
  generateQuestion(nextQuestion[currentQuestion]);
};

/*generateQuestion first manipulates the text of questionEl variable by targeting the array parameter passed to the function and appending the property of question onto
it from the object array. We then call our shuffle function on(randomizing the order which answers are rendered), and target the answers property of the object array,
putting it through a forEach loop. The forEach loop creates a button variable- which will be used to create a button element for each answer in array.answers. It targets
the text of each button with answer.option, populating each button element with each avaliable option property, and appends the button variable onto the answerButtons
variable, creating a button for each of the given answer.option values. A class of 'btn' and 'disableBtn' is added to each button variable appended. Two event listeners
are attached to the button variable, activating on a click and calling the answerSelected function and isCorrect function.*/
function generateQuestion(array) {
  questionEl.innerText = array.question;
  shuffle(array.answers).forEach((answer) => {
    let button = document.createElement("button");
    button.innerText = answer.option;
    answerButtons.appendChild(button);
    button.classList.add("btn", "disableBtn");
    button.addEventListener("click", answerSelected);
    button.addEventListener("click", isCorrect);
  });
};

/*answerSelected creates the disableBtn variable, which selects elements with a class name of 'disableBtn'. We then enter a for loop, where we initialize the variable i,
check it against the length of the disableBtn variable, and iterate i if it is LESS THAN that check. Within the for loop, we set the disabled propery of disableBtn at
an index to true(this prevents the user from clicking button elements after they've already selected one). Entering an if statement, we check if the length of the
nextQuestion array(which is 5) IS GREATER THAN the number which currentQuestion evaluates to + 1(nextQuestion is an array, arrays are 0 indexed). If nextQuestion.length
IS GREATER, then it will remove the class of 'hide' from the nextButton element, making it visible. If nextQuestion.length is NOT GREATER than currentQuestion + 1(which
will happen once the user has reached the end of our array of questions), it will instead remove the class of 'hide' from the scoreButton variable, making the Highscore
button visible. It will also add the class of 'hide' to the timeReadout variable, which makes the timer not visible.*/
function answerSelected() {
  let disableBtn = document.getElementsByClassName("disableBtn");

  for(let i = 0; i < disableBtn.length; i++){
    disableBtn[i].disabled = true;
  };

  if(nextQuestion.length > currentQuestion + 1) {
    nextButton.classList.remove("hide");
  } else {
    scoreButton.classList.remove("hide");
    timeReadout.classList.add("hide");
  };
};

/*isCorrect first sets-up the variable answerText, for holding the target.innerHTML of the event parameter(this evaluates to what HTML is within a clicked answer
button). We then enter a for loop, where we initialize the variable i, check it against the length of the answers property of our nextQuestion array at an index, and
iterate the i variable if it is LESS THAN that check. We then enter an if statement that checks if our answerText variable evaluates to a given option property within
our answers array at an index, within our nextQuestion array at an index- AND(&&) we also check if the correct property of our answers array at an index, within our
nextQuestion array at an index evaluates to TRUE(checking the value of the clicked button and if its correct property is true, meaning its a correct answer). If both
these checks are passed, we iterate the userScore variable by 10- indicating a correctly-chosen answer, remove the class of 'hide' from our answerCorrect variable-
displaying a response that indicates a correctly-chosen answer, and set the isAnswered property of nextQuestion at an index to true. Then, we enter an else if statement
that performs the first check verbatim, but inverts the second check; instead checking if the correct property within our answers array at an index, within our
nextQuestion array at an index evaluates to FALSE(checking the value of the clicked button and if its correct property is false, meaning its an incorrect answer). If
both the else if checks are passed we decrement the userScore variable by 10- indicating an incorrectly chosen answer, remove the class of 'hide' from our
answerIncorrect variable- displaying a response that indicates an incorrectly-chosen answer, and set the isAnswered property of nextQuestion at an index to true.*/
function isCorrect(event){
  let answerText = event.target.innerHTML;

  for(let i = 0; i < nextQuestion[i].answers.length; i++){

    if(answerText === nextQuestion[currentQuestion].answers[i].option
      &&
      nextQuestion[currentQuestion].answers[i].correct === true){
      userScore += 10;
      answerCorrect.classList.remove("hide");
      nextQuestion[currentQuestion].isAnswered = true;
    }else if(answerText === nextQuestion[currentQuestion].answers[i].option
      &&
      nextQuestion[currentQuestion].answers[i].correct === false){
      userScore -= 10;
      answerIncorrect.classList.remove("hide");
      nextQuestion[currentQuestion].isAnswered = true;
    };
  };
};

/*The timer function below is a very good example of a basic countdown. Within this app, it is called in the startGame function, ensuring the user is immediatly timed
upon beginning the quiz. First, we make a variable of timeCount which is used to call setInterval. The first argument of setInterval is a nameless function; this
function selects the variable timeReadout and gives it the text of 'Time left:' with a template literal of ${sec}, which allows the countdown to
dynamically update as time passes. We then enter an if statement that checks if sec IS GREATER THAN 0(checking if we've ran out of time) and decrements sec if it is
greater than zero. If sec is NOT GREATER than 0, we call clearInterval with an argument of timeCount- clearInterval being a built-in tool of setInterval which will
interrupt its typical process(stop the timer), add the class of 'hide' to the questionContainerEl making it not visible, remove the class of 'hide' from the scoreButton
variable making it visible, add a class of 'hide' to our nextButton variable, selects the variable timeReadout and adds the class of hide to it making the
timer not visible, and decrement the userScore variable by 10(because the user will have ran out of time). We also have a secondary if statement that checks if the
isAnswered property of the item at the last index in the nextQuestion array evaluates to truthy(which would mean the user has reached the end of our quiz), and if so
also calls clearInterval with an argument of timeCount(ensuring the timer stops when the user has answered the last question). Finally, we have setIntervals second
argument- after the curly brace with a comma- 1000, which is a measurment of milliseconds we'd like the setInterval function to delay itself by(evaluating to a 1 second
passage of time).*/
function timer() {

  const timeCount = setInterval(function () {
    timeReadout.innerHTML = `Time left: ${sec}`;
    
    if (sec > 0) {
      sec--;
    }else{
      clearInterval(timeCount);
      questionContainerEl.classList.add("hide");
      scoreButton.classList.remove("hide");
      nextButton.classList.add("hide");
      timeReadout.classList.add(`hide`);
      userScore -= 10;
    };

    if(nextQuestion[4].isAnswered){
      clearInterval(timeCount);
    };
  }, 1000);
};

/*saveScore is a function which first defines the variable of totalScore as a combination of the numerical values of userScore and sec, then provides the userDataObj
object-variable with the properties of name and score, which will be saved as user test-data. We then set the value of allScores variable to a JSON object, using its
parse method to access an item saved in localStorage under the name 'scoreEntry' OR(||) we set allScores to an empty array(if there is no data under the described
specifications to equate allScores to). After this, we enter an if statement where we check if the length property of allScores is LESS THAN five AND(&&) if totalScore
is GREATER OR EQUAL TO 10 and if so we push the userDataObj object to our allScores array. We enter an additional check in ouur else if statement, which checks if
calling the exceedsLimit function on our allScores array evaluates to truthy(meaning we've exceeded the limit we want saved in our allScores array) AND(&&) if totalScore
is GREATER THAN the score property of our allScores array at its last index(making sure scores are only replaced if the previously-saved score is exceeded by the users
score of the current session), and if so we call the pop method on our allScores array- deleting the last entry within it, and push the userDataObj object-variable into
our allScores array. After these checks, we call the sort method on our allScores array, using an anonymous function to compare the parameters of (a, b), where b.score
essetially represents a higher-score and a.score a lower-score(suggest looking into examples or other implimentations of the sort method on google if confused, since the
usage of the sort method is fairly simple while more is typically occuring under-the-hood). Finally, we use the setItem method on our localStorage with arguments of
'scoreEntry'(name property of item being set) and passing our allScores array as the argument for the stringify method on our JSON object(value property of item being
set, converts the allScores variable into a JSON string)- then we call the scorePage function.*/
function saveScore(){
  let totalScore = userScore + sec;
  userDataObj = {
    id: 1,
    name: userName,
    score: totalScore
  };
  allScores = JSON.parse(localStorage.getItem("scoreEntry")) || [];
  console.log(allScores)

  if(allScores.length === 0){
    userDataObj = userDataObj;
  }else{
    for(let i = 0; i < allScores.length; i++){ //this is currently not iterating through the whole array properly; if the id's get out of order(ex. highest score has an id of 3, lower scores have ids lower than that) it can/will produce a duplicate id
      if(userDataObj.id === allScores[i].id){
        userDataObj.id++;
      };
    };
  };
  

  if(allScores.length < 5 && totalScore >= 10){
    allScores.push(userDataObj);
  }else if(exceedsLimit(allScores) && totalScore > allScores[4].score){
    allScores.pop();
    allScores.push(userDataObj);
  };
  allScores.sort((a, b) => b.score - a.score);
  localStorage.setItem('scoreEntry', JSON.stringify(allScores));
  scorePage(totalScore);
};
// function saveScore(){
//   let totalScore = userScore + sec;
//   userDataObj = {
//     name: userName,
//     score: totalScore
//   };
//   allScores = JSON.parse(localStorage.getItem("scoreEntry")) || [];

//   if(allScores.length < 5 && totalScore >= 10){
//     allScores.push(userDataObj);
//   }else if(exceedsLimit(allScores) && totalScore > allScores[4].score){
//     allScores.pop();
//     allScores.push(userDataObj);
//   };
//   allScores.sort((a, b) => b.score - a.score);
//   localStorage.setItem('scoreEntry', JSON.stringify(allScores));
//   scorePage(totalScore);
// };

/*scorePage accepts a parameter of sessionScore from the saveScore function(to get the totalScore value from saveScore). Then, it adds the class of 'hide' to the
scoreButton and questionContainerEl variables, removes a class of 'hide' from the scoreSection and resetButton and clearHighscoresButton variables, and sets the innerText
property of our scoreReadout variable to a string with the template literal of ${sessionScore}, to render the users score. We then put the allScores array through a
forEach loop, where score represents an individual item in allScores. We define the variable li to create an li element, set the innerText property of the li variable to
a string with the template literals of ${score.name} and ${score.score} to display the name of the user and their score, and call the appendChild method with an argument
of li on our scoreBoard variable which generates the entries within allScores as highscores on scoreBoard.*/
function scorePage(sessionScore){
  scoreButton.classList.add("hide");
  questionContainerEl.classList.add("hide");
  scoreSection.classList.remove("hide");
  resetButton.classList.remove("hide");
  clearHighscoresButton.classList.remove("hide");
  scoreReadout.innerText = `You scored ${sessionScore} points!`;

  

  allScores.forEach((score) =>{
    let li = document.createElement("li");
    li.innerText = `${score.name}: ${score.score}`;
    scoreBoard.appendChild(li);
  });
};
/*Idea is sound, but need to test other pieces of code. We're trying to alter the message the user will recieve, based on if they've achieved a score that would be saved
but didn't beat previous saved-scores, if they've achieved a score that would be saved and was saved- either because the highscores not being full or beating a previously
saved score, or if they've achieved a score which is too low to be saved- regardless of if the highscores are not full.*/
// for(let i = 0; i < allScores.length; i++){
//   if(userSession.name !== allScores[i].name){
//     scoreReadout.innerText = `You scored ${userSession.score} points, but didn't beat the previous scores!`;
//   }else if(userSession.name === allScores[i].name){
//     scoreReadout.innerText = `You scored ${userSession.score} points, check to see where you placed!`;
//   }
// }

/*reloadQuiz does exactly what it says; calls the reload method on the location property of our window object, reloading the app page and allowing the user to retry the
quiz*/
function reloadQuiz(){
  window.location.reload();
};

/*clearHighscores is very simple, changing the text of our clearHighscoresButton variable, then passing the allScores array to the clear method of our localStorage object,
which will empty-out the highscore section*/
function clearHighscores(){
  clearHighscoresButton.innerText = `Highscores cleared!`;
  scoreBoard.innerText = ``;
  localStorage.clear(allScores);
};

/*Below we have seven event listeners. resetButton calls the reloadQuiz function. clearHighscoresButton will call the clearHighscores function. The event listener on
our scoreButton variable allows us to call the saveScore function. Our nextButton variable has an event listener that calls an anonymous function which iterates our
currentQuestion variable(currentQuestion is used as an index, the iteration here ensures we'll progress through the test by properly targeting the index of following
questions- everytime the next button is clicked), and calls the setupNextQuestion function. The event listener on our startButton variable allows us to call the
startGame function. sumbitName and skipName are both for calling the setUsername function, depending on what name value the user would like associated with their score.*/
resetButton.addEventListener("click", reloadQuiz);

clearHighscoresButton.addEventListener("click", clearHighscores);

scoreButton.addEventListener("click", saveScore);

nextButton.addEventListener("click", () => {
  currentQuestion++;
  setupNextQuestion();
});

startButton.addEventListener("click", startGame);

submitName.addEventListener("click", setUsername);
skipName.addEventListener("click", setUsername);

/*Here have the call for the only function calling itself. This is to ensure a randomized array of 5 questions is selected from the pool of 20 total questions before the
user progresses the quiz further.*/
determineQuestions();