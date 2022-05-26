var startButton = document.getElementById("start-btn");
var questionContainerEl = document.getElementById("question-container");
var nextQuestion, currentQuestion
var questionEl = document.getElementById("question")
var answerButtonsEl = document.getElementById("answer-buttons")
var questions = [
    {
        question: "What is 2+2",
        answers: [
            { option: "4", correct: true},
            { option: "7", correct: false},
            { option: "99", correct: false},
            { option: "31", correct: false}
        ]
    },
    {
        question: "What is 2+3",
        answers: [
            { option: "5", correct: true},
            { option: "7", correct: false},
            { option: "99", correct: false},
            { option: "31", correct: false}
        ]
    },
    {
        question: "What is 2+1",
        answers: [
            { option: "3", correct: true},
            { option: "7", correct: false},
            { option: "99", correct: false},
            { option: "31", correct: false}
        ]
    },
    {
        question: "What is 2+7",
        answers: [
            { option: "9", correct: true},
            { option: "7", correct: false},
            { option: "99", correct: false},
            { option: "31", correct: false}
        ]
    },
    {
        question: "What is 2+0",
        answers: [
            { option: "2", correct: true},
            { option: "7", correct: false},
            { option: "99", correct: false},
            { option: "31", correct: false}
        ]
    }
]
function startGame() {
startButton.classList.add("hide")
nextQuestion = questions.sort(() => Math.random() - .5)
currentQuestion = 0
questionContainerEl.classList.remove("hide")
setNextQuestion();
};

function setNextQuestion() {
    showQuestion(nextQuestion[currentQuestion])
};
function showQuestion(question) {
    questionEl.innerText= question.question
};

function selectAnswer() {

};

startButton.addEventListener("click", startGame);