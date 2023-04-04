async function fetchData() {
    try {
      const response = await fetch('assets/questions_few.json');
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
    var gameTimer = document.querySelector(".timer");
    var timer;
    var completedQuiz = false;
    var questionToDisplay = document.querySelector("#question");
    var answersToChooseFrom = document.querySelector("#answers");
    var answerResult = document.querySelector("#result");
    function startTimer() {
        timer = setInterval(function() {
          secondsLeft--;
          countdown.textContent = secondsLeft;
          if (secondsLeft >= 0) {
            // Tests if win condition is met
            if (completedQuiz && secondsLeft > 0) {
              // Clears interval and stops timer
              clearInterval(timer);
              winScreen(); 
            }
          }
          // Tests if time has run out
          if (secondsLeft <= 0 && questionCounter < totalQuestions) {
            // Clears interval
            clearInterval(timer);
            loseScreen();


          }
        }, 1000);
    }

    function winScreen(){
    
        answersToChooseFrom.textContent = "";
        questionToDisplay.textContent = "";
        answerResult.textContent = "";
        var congrats = document.querySelector(".intro");
        congrats.textContent = `Congratulations! You passed the quiz. Your score is ${secondsLeft}`;
        congrats.style.fontsize = "50px";
        congrats.style.color = "red";
        startButton.disable = false;
        startButton.style.display = "initial";
        startButton.textContent = "Try again?";
        startButton.style.position = "relative";
        startButton.style.bottom = "70px";
        startButton.style.marginleft = "auto";
        startButton.style.marginright = "auto";
        startButton.style.zindex = "3";
        storedScores.style.display = "none";
        gameTimer.style.display = "none";
        resetAllValues();
    }
 
    function loseScreen(){
        answersToChooseFrom.textContent = "";
        questionToDisplay.textContent = "";
        answerResult.textContent = "";
   
        wasted = document.createElement("img");
        wasted.src = "assets/imgs/wasted.jpeg";
        wasted.style.width = "100%";
        wasted.style.height = "100%"; 
        wasted.style.zindex = "2";
        board.appendChild(wasted);
        startButton.disable = false;
        startButton.style.display = "initial";
        startButton.textContent = "Start again?";
        startButton.style.position = "relative";
        startButton.style.bottom = "70px";
        startButton.style.marginleft = "auto";
        startButton.style.marginright = "auto";
        startButton.style.zindex = "3";
        storedScores.style.display = "none";
        gameTimer.style.display = "none";
        resetAllValues();
    
    }
    
    function resetAllValues(){
        storedScores.style.display = "initial";
        gameTimer.style.display = "initial";
        questionCounter = -1;
        questionsAnswered = [];
        for (var i=0; i<totalQuestions; i++){
            questionsAnswered.push(false);
        }
        clearInterval(timer);
        secondsLeft = 60;

    }

    function startTheQuiz(event){


        document.querySelector(".intro").textContent = "";
        document.querySelector(".title").textContent = "";
        if (document.querySelector("img")!==null){
            document.querySelector("img").remove();
        }
        answersToChooseFrom.textContent = "";
        questionToDisplay.textContent = "";
        startButton.disable = true;
        startButton.style.display = 'none';
        displayQuestion();
        startTimer();
       
    }

    var correct_index;

    function displayQuestion(){

        questionCounter ++;
    
        if (questionCounter >= totalQuestions && questionCounter>0){
            completedQuiz = true;
            
            return;
        }
               
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
            answersToChooseFrom.appendChild(li);
        }
    }

    function selectAnAnswer(event){
        if (!questionsAnswered[questionCounter]){

            var element = event.target;
            console.log(element);
            
            if (element.matches("li")){ 
                index = element.id;
                element.style.backgroundColor = 'lightblue';
                element.style.color = 'darkblue';
     
                if (index == correct_index){
                    document.querySelector("#result").textContent = 'Correct!';
                    }
                    else{
                        document.querySelector("#result").textContent = 'Wrong! 5 seconds are subtracted now!';
                        secondsLeft -= 5;
                    }
                
                questionsAnswered[questionCounter] = true;
                setTimeout(goToNextQuestion, 1000);
            
            }
        }
    }

    function goToNextQuestion(){
        question.textContent = "";
        answersToChooseFrom.innerHTML = "";
        document.querySelector("#result").textContent = "";
        if (questionCounter < totalQuestions && secondsLeft>=0){
            displayQuestion();
        }
       
  
    }
    
    board.addEventListener("click", selectAnAnswer);
    startButton.addEventListener("click", startTheQuiz);
    
}
fetchData()
