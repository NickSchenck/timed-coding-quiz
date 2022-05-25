var beginEl = document.querySelector("#btn-begin");
var textEl = document.querySelector("#first-text");
var nextPage = document.querySelector("#input-given");

var allQuestions = [
    {
        question: "What color is your hair?",
        choices: ["BRN", "BLK", "BLND", "RED"],
        answer: 3  
    },
    {
        question: "a",
        choices: ["a", "a", "a", "a"],
        answer: 3
    },
    {
        question: "",
        choices: ["", "", "", ""],
        answer: 3
    },
    {
        question: "",
        choices: ["", "", "", ""],
        answer: 3
    },
    {
        question: "",
        choices: ["", "", "", ""],
        answer: 3
    },
    
];
console.dir(allQuestions)




var startQuiz = function() {
    beginEl.remove()
    renderQuestions();
};
var renderQuestions = function() {
    textEl.textContent = allQuestions[0].question
    renderChoices();
};
var renderChoices = function() {
    for (let i = 0; i < allQuestions[0].choices.length; i++) {
        var btn = document.createElement('input');
        btn.id = "input-given"
        btn.setAttribute('type' , 'button');
        btn.setAttribute('value', (allQuestions[0].choices[i]));
        document.body.appendChild(btn);
    
    }
    
};

beginEl.addEventListener(
    "click", startQuiz 
)