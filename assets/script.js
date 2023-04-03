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
    var secondsLeft = 60;
    var board = document.querySelector(".main-area");
    var countdown = document.querySelector("#seconds");
    var timer;
    var completedQuiz = false;

    function startTimer() {
        timer = setInterval(function() {
          secondsLeft--;
          countdown.textContent = secondsLeft;
          if (secondsLeft >= 0) {
            // Tests if win condition is met
            if (completedQuiz && econdsLeft > 0) {
              // Clears interval and stops timer
              clearInterval(timer);
              winScreen(); 
            }
          }
          // Tests if time has run out
          if (secondsLeft <= 0) {
            // Clears interval
            clearInterval(timer);
            loseScreen();
          }
        }, 1000);
    }
    
    function winScreen(){
        board.innerHTML = "";
        congr = document.createElement("h1");
        congr.textContent = `Congratulations! You passt the quiz. Your score is ${secondsLeft}`;
        board.appendChild(congr);
    }

    function loseScreen(){
        board.innerHTML = "";
        wasted = document.createElement("img");
        wasted.src = "assets/imgs/wasted.jpeg";
        wasted.width = 80%
        board.appendChild(wasted);
    }


    function startTheQuiz(event){

        board.innerHTML = "";
        displayQuestion();
        startTimer();
        board.appendChild(answers);

    }

    var correct_index;
    var answers;

    function displayQuestion(){
        questionCounter ++;
        if (questions[questionCounter]== null){
            won = true;
            return;
        }
        var questionToDisplay = document.createElement("p");
        questionToDisplay.id = "question"
        board.appendChild(questionToDisplay)
        answers = document.createElement("ul");
        board.appendChild(answers)
        
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
            answers.appendChild(li);
        }
    }

    function selectAnAnswer(event){
        if (!questionsAnswered[questionCounter]){

            var element = event.target;
            console.log(element);
            
            if (element.matches("li")){ 
                index = element.id;
                
                var result = document.createElement("h3");
                board.appendChild(result);  
                result.id = "result";
                if (index == correct_index){
                        result.textContent = 'Correct!';
                    }
                    else{
                        result.textContent = 'Wrong! 5 seconds are subtracted now!';
                        secondsLeft -= 5;
                    }
                
                questionsAnswered[questionCounter] = true;
                setTimeout(goToNextQuestion, 1000);
            
            }
        }
    }

    function goToNextQuestion(){
        if (questionCounter < totalQuestions && secondsLeft>0){
            board.innerHTML = "";
            displayQuestion();
        }
        else{
            won = True;
        }
    }

    board.addEventListener("click", selectAnAnswer);
    startButton.addEventListener("click", startTheQuiz)

}
fetchData()
