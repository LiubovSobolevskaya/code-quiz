var questons;

fetch('assets/questions.json')
  .then(response => response.json())
  .then(data => { 
    questons = data;
    console.log(data);})
  .catch(error => console.error(error));



var questionCounter = 0
var storedScores =  document.querySelector(".scores");
var startButton = document.querySelector(".start-quiz");
var timer = document.querySelector(".timer");
var secondsLeft = 60;
var board = document.querySelector(".main-area");

function startTheQuiz(event){
    event.preventDefault();
    
    board.innerHTML = "";
    displayQuestion();

}

var correct_index;
var answers;

function displayQuestion(){
    var questionToDisplay = document.createElement("p");
    questionToDisplay.id = "question"
    board.append(questionToDisplay)
    answers = document.createElement("ul");
    board.append(answers)
    var wrong_answers = questons[questionCounter]["list of wrong answers"];
    var correct_answer = questons[questionCounter]["correct answer"];
    questionToDisplay.textContent = questons[questionCounter]["question"];
    total_answers = wrong_answers.length + 1;
    correct_index = Math.floor(Math.random() * total_answers);
    wrong_answers.splice(correct_index, 0, correct_answer);
    console.log(wrong_answers)
   
    for (var i = 0; i< total_answers; i++){
        console.log(wrong_answers[i])
        li = document.createElement("li");
        li.id = i;
        console.log(typeof wrong_answers[i])
        li.textContent = wrong_answers[i];
        answers.append(li);
    }

}

function selectAnAnswer(event){
    var element = event.target;
    console.log(element);
    if (element.matches("li")){ 
       index = element.id;
       var result = document.createElement("h3");
       board.append(result);  
       result.id = "result";
       if (index == correct_index){
            console.log('we are correct!')
            result.textContent = 'Correct!';
        }
        else{
            console.log('we are wrong!')
            result.textContent = 'Wrong!\n 5 secons is sunbstructed now!'
        }

        
       
    }
    

}

board.addEventListener("click", selectAnAnswer);
startButton.addEventListener("click", startTheQuiz)