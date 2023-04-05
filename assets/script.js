async function fetchData() {
    try {
      const response = await fetch("assets/questions.json");
      const data = await response.json();
      processData(data);
    } catch (error) {
      console.error(error);
    }
}
  
function processData(questions) {
    var modalEl = document.querySelector("#score-container");
    var board = document.querySelector("#main-area");
    var countdown = document.querySelector("#seconds");
    var questionToDisplay = document.querySelector("#question");
    var answersToChooseFrom = document.querySelector("#answers");
    var answerResult = document.querySelector("#result");
    var storedScores = document.querySelector("#scores");
    var startButton = document.querySelector("#start-quiz");
    
    var totalQuestions = questions.length;
    var questionsAnswered = [];
    for (var i = 0; i < totalQuestions; i++) {
      questionsAnswered.push(false);
    }
    var questionCounter = -1;
    var secondsLeft = 60;
    var timer;
    var completedQuiz = false;
    var lost = false;
    
  
    var closeEl = document.querySelector(".close");
    function close() {
      modalEl.style.display = "none";
    }
  
    function handleClick(event) {
     
        // prevent the default behavior of a button nested within a form tag
        event.preventDefault();
      
        // display the modal
        modalEl.style.display = "block";
      
        // retrieve scores from local storage
        var scores = JSON.parse(localStorage.getItem("scores"));
      
        // select the table element
        table = document.querySelector("#table");
        table.innerHTML = "";
        // iterate over each score and add it as a row to the table
        for (var i = 0; i < scores.length; i++) {
          var row = table.insertRow(0);
          var cell1 = row.insertCell(0);
          var cell2 = row.insertCell(1);
          console.log(scores[i]);
          cell1.innerHTML = scores[i]["initials"];
          cell2.innerHTML = scores[i]["score"];
        }
      }
      

    function startTimer(){
            // Set up interval timer
            timer = setInterval(function () {
            // Decrement the number of seconds left
            secondsLeft--;
        
            // Update the countdown element with the new number of seconds left
            countdown.textContent = secondsLeft;
        
            // Check if win condition is met
            if (secondsLeft >= 0) {
                if (completedQuiz && secondsLeft > 0) {
                    // If the quiz is completed and there is still time left, stop the timer and display the win screen
                    clearInterval(timer);
                    winScreen();
                }
            }
        
            // Check if time has run out
            if (secondsLeft <= 0 && questionCounter < totalQuestions) {
                // If there is no time left and not all questions have been answered, stop the timer and display the lose screen
                clearInterval(timer);
                lost = true;
                loseScreen();

            }
        }, 1000);
    }
  

    function winScreen() {
       // Clear the quiz display
        answersToChooseFrom.textContent = "";
        questionToDisplay.textContent = "";
        answerResult.textContent = "";

        // Get the "Congratulations" element and display the user's score
        var congrats = document.querySelector(".intro");
        congrats.textContent = `Congratulations! You passed the quiz. Your score is ${secondsLeft}!`;
        congrats.style.fontSize = "50px";
        congrats.style.color = "red";

        // Prompt the user for their initials and save their score to local storage
        // var initials = prompt("Enter your initials");
        var inputForm = document.createElement("input");
        var labelForm = document.createElement("label");
        var inputFormDiv= document.createElement("div");
        var buttonForm = document.createElement("button");
        buttonForm.textContent = "Save Initials"
        inputForm.style.width = "100px";
        inputFormDiv.style.margin = "20px auto";
        buttonForm.style.margin = "20px auto";
        buttonForm.style.width = "100px";
        labelForm.textContent = "Please enter you Initials: "
        inputFormDiv.appendChild( labelForm );
        inputFormDiv.appendChild( inputForm );
        board.append(inputFormDiv) 
        board.appendChild( buttonForm);
        
        
        buttonForm.addEventListener("click",  function(){
          initials = inputForm.value;
          if ( initials !== ""){
            var scores = JSON.parse(localStorage.getItem("scores"));
            if (!scores) {
                // If no scores are stored, create a new array
                scores = [];
            }
            scores.push({ initials: initials, score: secondsLeft });
            localStorage.setItem("scores", JSON.stringify(scores));
            // after we added the initials, the form disapears and we offer to try again.
            buttonForm.remove(); 
            inputFormDiv.remove();
            startButton.disable = false;
            startButton.style.display = "initial";
            startButton.textContent = "Try again?"
          }

        });

       
    }
    
    function resetAll(){
      lost = false;
      questionCounter = -1;
      secondsLeft = 60;
      completedQuiz = false;
      questionsAnswered = [];
      for (var i = 0; i < totalQuestions; i++) {
        questionsAnswered.push(false);
      }

    }
   

    function loseScreen() {
        // Clear the quiz display
        answersToChooseFrom.textContent = "";
        questionToDisplay.textContent = "";
        answerResult.textContent = "";

        // Add an image to the display to indicate the user has lost
        var wasted = document.createElement("img");
        wasted.src = "assets/imgs/wasted.jpeg"; 
        wasted.style.position = "absolute"; 
        wasted.style.top = "35px"; 
        wasted.style.width = "100%";
        wasted.style.height = "100%";
        board.appendChild(wasted);
        startButton.disable = false;
        startButton.style.display = "initial";
        startButton.textContent = "Try again?"

  
    }
  
    function startTheQuiz(event) {
        resetAll()
       // Clear any existing content on the page
        document.querySelector(".intro").textContent = "";
        document.querySelector(".title").textContent = "";
        if (document.querySelector("img") !== null) {
            document.querySelector("img").remove();
        }

        // Clear the quiz display and hide the "Start Quiz" button
        answersToChooseFrom.textContent = "";
        questionToDisplay.textContent = "";
        startButton.disable = true;
        startButton.style.display = "none";

        // Display the first quiz question and start the timer
        displayQuestion();
        startTimer();

    }
  
    var correct_index;
  
    function displayQuestion() {
       // Increment the question counter
        questionCounter++;

        // Check if the quiz is completed
        if (questionCounter >= totalQuestions && questionCounter > 0) {
            completedQuiz = true;
            return;
        }

        // Get the list of wrong answers and correct answer for the current question
        var wrong_answers = Array.from(questions[questionCounter]["list of wrong answers"]);
        var correct_answer = questions[questionCounter]["correct answer"];

        // Display the question text
        questionToDisplay.textContent = questions[questionCounter]["question"];

        // Shuffle the list of wrong answers and insert the correct answer at a random index
        total_answers = wrong_answers.length + 1;
        correct_index = Math.floor(Math.random() * total_answers);
        wrong_answers.splice(correct_index, 0, correct_answer);
        console.log(questions[questionCounter]["list of wrong answers"])
        // Display the answer options
        for (var i = 0; i < total_answers; i++) {
            li = document.createElement("li");
            li.id = i;
            li.textContent = wrong_answers[i];
            answersToChooseFrom.appendChild(li);
        }


    }
  
    function selectAnAnswer(event) {
       // Check if the current question has not been answered
        if (!questionsAnswered[questionCounter]) {

            // Get the element that was clicked
            var element = event.target;
            // Check if the element is a list item
            if (element.matches("li")) {
            
                // Get the index of the answer that was selected
                index = element.id;
            
                // Set the background color and text color of the selected answer
                element.style.backgroundColor = "lightblue";
                element.style.color = "darkblue";
            
                // Check if the selected answer is correct and display a message accordingly
                if (index == correct_index) {
                    document.querySelector("#result").textContent = "Correct!";
                } else {
                    document.querySelector("#result").textContent = "Wrong! 5 seconds are subtracted now!";
                    secondsLeft -= 5;
                }
            
                // Mark the current question as answered and move on to the next question after a delay
                questionsAnswered[questionCounter] = true;
                setTimeout(goToNextQuestion, 1000);
            }
        }
  
    }
     
    // This function clears the previous question, answer options and result message from the board.
    // Then it checks if there are more questions to display and if there is time left. 
    //If yes, it calls the function to display the next question.
    function goToNextQuestion() {
      question.textContent = "";
      answersToChooseFrom.innerHTML = "";
      document.querySelector("#result").textContent = "";
      if (questionCounter < totalQuestions && secondsLeft >= 0 && !lost) {
        displayQuestion();
      }
    }
  
    board.addEventListener("click", selectAnAnswer);
    startButton.addEventListener("click", startTheQuiz);
    closeEl.addEventListener("click", close);
    storedScores.addEventListener("click", handleClick);
}


fetchData();
  