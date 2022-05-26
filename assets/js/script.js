var startButton = document.getElementById("start-btn");
var questionContainerEl = document.getElementById("question-container");

function startGame() {
startGame.classList.add("hide")
questionContainerEl.classList.remove("hide")
setNextQuestion();
};

function setNextQuestion() {

};

function selectAnswer() {

};

startButton.addEventListener("click", startGame);