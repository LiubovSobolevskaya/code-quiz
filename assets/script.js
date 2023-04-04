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
    var modalEl = document.querySelector("#score-container");
    var modalSave = document.querySelector("#save-results");
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
    
    
    var closeEl = document.querySelector(".close");
    function close() {
        modalEl.style.display = "none";
    }
      
    function handleClick(event) {
        //check to see if the element clicked is a button
        
          //prevent the default behavior of a button nested within a form tag
        event.preventDefault();
          
        modalEl.style.display = "block";
        var scores =  JSON.parse(localStorage.getItem("scores"));
        table = document.querySelector("#table");

        for (var i =0; i<scores.length; i++){
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            cell1.innerHTML = scores[i]["initials"];
            cell2.innerHTML = scores[i]["score"];
        }
          
    }
    closeEl.addEventListener("click", close);
    storedScores.addEventListener("click", handleClick)
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
        callSaving()

    }
    function callSaving(){
        modalSave.style.display = "block";
        var nameEl = document.querySelector("#initials");
        var name = nameEl.value;
        var scores = JSON.parse(localStorage.getItem("scores"));
        if (!scores){
            scores = [];
        }
        scores.push({"initials":name, "score": secondsLeft})
        
        localStorage.setItem("ArrayStringify", JSON.stringify(scores));
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
