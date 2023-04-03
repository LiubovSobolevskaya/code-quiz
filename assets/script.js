async function fetchData() {
    try {
      const response = await fetch('assets/questions.json');
      const data = await response.json();
      processData(data)
    } catch (error) {
      console.error(error);
    }
}
  
function processData(questions) {

    var totalQuestions = questions.length;
    var questionsAnswered = [];
    for (var i=0; i<totalQuestions; i++){
        questionsAnswered.push(false);
    }
    var questionCounter = -1;
    var storedScores =  document.querySelector(".scores");
    var startButton = document.querySelector(".start-quiz");
    var timer = document.querySelector(".timer");
    var secondsLeft = 60;
    var board = document.querySelector(".main-area");

    function startTheQuiz(event){

        board.innerHTML = "";
        displayQuestion();

    }

    var correct_index;
    var answers;

    function displayQuestion(){
        questionCounter ++;
        if (questions[questionCounter]== null){
            var statementToDisplay = document.createElement("h1");
            statementToDisplay.textContent = "YOU WON!"
            board.append(statementToDisplay)

            return;
        }
        var questionToDisplay = document.createElement("p");
        questionToDisplay.id = "question"
        board.append(questionToDisplay)
        answers = document.createElement("ul");
        board.append(answers)
        
        var wrong_answers = questions[questionCounter]["list of wrong answers"];
        var correct_answer = questions[questionCounter]["correct answer"];
        questionToDisplay.textContent = questions[questionCounter]["question"];
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
        if (!questionsAnswered[questionCounter]){

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
                        result.textContent = 'Wrong! 5 seconds are subtracted now!'
                    }
                
                questionsAnswered[questionCounter] = true;
                setTimeout(goToNextQuestion, 1000);
            
            }


        }
  

    }

    function goToNextQuestion(){
        board.innerHTML = "";
        displayQuestion();
    }

    board.addEventListener("click", selectAnAnswer);
    startButton.addEventListener("click", startTheQuiz)

}
fetchData()
