var startButton = document.getElementById("start-btn");
var nextButton = document.getElementById("next-btn");
var questionContainerEl = document.getElementById("question-container");
var nextQuestion, currentQuestion
var questionEl = document.getElementById("question")
var answerButtonsEl = document.getElementById("answer-buttons")
var questions = [
    {
        question: "What is 2+2?",
        answers: [
            { option: "4", correct: true},
            { option: "7", correct: false},
            { option: "99", correct: false},
            { option: "31", correct: false}
        ]
    },
    {
        question: "What is 2+3?",
        answers: [
            { option: "5", correct: true},
            { option: "7", correct: false},
            { option: "99", correct: false},
            { option: "31", correct: false}
        ]
    },
    {
        question: "What is 2+1?",
        answers: [
            { option: "3", correct: true},
            { option: "7", correct: false},
            { option: "99", correct: false},
            { option: "31", correct: false}
        ]
    },
    {
        question: "What is 2+7?",
        answers: [
            { option: "9", correct: true},
            { option: "7", correct: false},
            { option: "99", correct: false},
            { option: "31", correct: false}
        ]
    },
    {
        question: "What is 2+0?",
        answers: [
            { option: "2", correct: true},
            { option: "7", correct: false},
            { option: "99", correct: false},
            { option: "31", correct: false}
        ]
    }
];
function startGame() {
startButton.classList.add("hide")
nextQuestion = questions.sort(() => Math.random() - .5)
currentQuestion = 0
questionContainerEl.classList.remove("hide")
setNextQuestion();
};

function setNextQuestion() {
    resetState();
    showQuestion(nextQuestion[currentQuestion])
};
function showQuestion(question) {
    questionEl.innerText= question.question
    question.answers.forEach(answer => {
        var button = document.createElement("button")
        button.innerText = answer.option
        button.classList.add("btn")
        if (answer.correct) {
            button.dataset.correct = answer.correct
        };
        button.addEventListener("click", selectAnswer)
        answerButtonsEl.appendChild(button)
    });
};
function resetState() {
    nextButton.classList.add("hide")
    while (answerButtonsEl.firstChild) {
        answerButtonsEl.removeChild(answerButtonsEl.firstChild)
    }
};

function selectAnswer(e) {
    var selectedbutton = e.target
    var correct = selectedbutton.dataset.correct
    setStatusClass(document.body, correct)
    Array.from(answerButtonsEl.children).forEach(button => {
        setStatusClass(button, button.dataset.correct)
    })
    if (nextQuestion.length > currentQuestion + 1) {
    nextButton.classList.remove("hide")
    }
    else{
        startButton.innerHTML = "Highscores"
        startButton.classList.remove("hide")
    }
};
function setStatusClass(element, correct) {
    clearStatusClass(element)
    if (correct) {
        element.classList.add("correct")
    }
    else{
        element.classList.add("wrong")
    }
};
function clearStatusClass(element) {
    element.classList.remove("correct")
    element.classList.remove("wrong")
};
nextButton.addEventListener("click", () => {
    currentQuestion++
    setNextQuestion();
});
startButton.addEventListener("click", startGame);