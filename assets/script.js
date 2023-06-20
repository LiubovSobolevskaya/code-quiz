async function fetchData() {
  try {
    const response = await fetch("assets/questions.json");
    const data = await response.json();
    new Quiz(data).start();
  } catch (error) {
    console.error(error);
  }
}

class Quiz {
  constructor(questions) {
    this.modalEl = document.querySelector("#score-container");
    this.board = document.querySelector("#main-area");
    this.countdown = document.querySelector("#seconds");
    this.questionToDisplay = document.querySelector("#question");
    this.answersToChooseFrom = document.querySelector("#answers");
    this.answerResult = document.querySelector("#result");
    this.storedScores = document.querySelector("#scores");
    this.startButton = document.querySelector("#start-quiz");
    this.closeEl = document.querySelector(".close");
    this.questions = questions;
    this.questionCounter = -1;
    this.secondsLeft = 60;
    this.timer;
    this.completedQuiz = false;
    this.lost = false;
    this.totalQuestions = questions.length;
    this.questionsAnswered = Array(this.totalQuestions).fill(false);
    this.correct_index;
  }


  start() {

    this.board.addEventListener("click", this.selectAnAnswer.bind(this));
    this.startButton.addEventListener("click", this.startTheQuiz.bind(this));
    this.closeEl.addEventListener("click", this.close.bind(this));
    this.storedScores.addEventListener("click", this.handleClick.bind(this));
  }


  close() {
    this.modalEl.style.display = "none";
  }

  handleClick(event) {

    // prevent the default behavior of a button nested within a form tag
    event.preventDefault();

    // display the modal
    this.modalEl.style.display = "block";

    // retrieve scores from local storage
    var scores = JSON.parse(localStorage.getItem("scores"));

    // select the table element
    const table = document.querySelector("#table");
    table.innerHTML = "";
    // iterate over each score and add it as a row to the table
    for (var i = 0; i < scores.length; i++) {
      var row = table.insertRow(0);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      cell1.innerHTML = scores[i]["initials"];
      cell2.innerHTML = scores[i]["score"];
    }
  }


  startTimer() {
    // Set up interval timer
    this.timer = setInterval(() => { // change here
      // Decrement the number of seconds left
      this.secondsLeft--;

      // Update the countdown element with the new number of seconds left
      this.countdown.textContent = this.secondsLeft;

      // Check if win condition is met
      if (this.secondsLeft >= 0) {
        if (this.completedQuiz && this.secondsLeft > 0) {
          // If the quiz is completed and there is still time left, stop the timer and display the win screen
          clearInterval(this.timer);
          this.winScreen(); // change here
        }
      }

      // Check if time has run out
      if (this.secondsLeft <= 0 && this.questionCounter < this.totalQuestions) {
        // If there is no time left and not all questions have been answered, stop the timer and display the lose screen
        clearInterval(this.timer);
        this.lost = true;
        this.loseScreen(); // change here
      }
    }, 1000);
  }



  winScreen() {
    // Clear the quiz display
    this.answersToChooseFrom.textContent = "";
    this.questionToDisplay.textContent = "";
    this.answerResult.textContent = "";

    // Get the "Congratulations" element and display the user's score
    var congrats = document.querySelector(".intro");
    congrats.textContent = `Congratulations! You passed the quiz. Your score is ${this.secondsLeft}!`;
    congrats.style.fontSize = "50px";
    congrats.style.color = "red";

    // Prompt the user for their initials and save their score to local storage
    // var initials = prompt("Enter your initials");
    var inputForm = document.createElement("input");
    var labelForm = document.createElement("label");
    var inputFormDiv = document.createElement("div");
    var buttonForm = document.createElement("button");

    buttonForm.textContent = "Save Initials"
    inputForm.style.width = "100px";
    inputFormDiv.style.margin = "20px auto";
    buttonForm.style.margin = "20px auto";
    buttonForm.style.width = "100px";
    labelForm.textContent = "Please enter you Initials: "
    inputFormDiv.appendChild(labelForm);
    inputFormDiv.appendChild(inputForm);
    this.board.append(inputFormDiv)
    this.board.appendChild(buttonForm);


    buttonForm.addEventListener("click", () => {
      const initials = inputForm.value;
      if (initials !== "") {
        var scores = JSON.parse(localStorage.getItem("scores"));
        if (!scores) {
          // If no scores are stored, create a new array
          scores = [];
        }
        scores.push({ initials: initials, score: this.secondsLeft });
        localStorage.setItem("scores", JSON.stringify(scores));
        // after we added the initials, the form disapears and we offer to try again.
        buttonForm.remove();
        inputFormDiv.remove();
        this.startButton.disable = false;
        this.startButton.style.display = "initial";
        this.startButton.textContent = "Try again?"
      }

    });


  }

  resetAll() {
    this.lost = false;
    this.questionCounter = -1;
    this.secondsLeft = 60;
    this.completedQuiz = false;
    this.questionsAnswered = Array(this.totalQuestions).fill(false);
  }


  loseScreen() {
    // Clear the quiz display
    this.answersToChooseFrom.textContent = "";
    this.questionToDisplay.textContent = "";
    this.answerResult.textContent = "";

    // Add an image to the display to indicate the user has lost
    var wasted = document.createElement("img");
    wasted.src = "assets/imgs/wasted.jpeg";
    wasted.style.position = "absolute";
    wasted.style.top = "35px";
    wasted.style.width = "100%";
    wasted.style.height = "100%";
    this.board.appendChild(wasted);
    this.startButton.disable = false;
    this.startButton.style.display = "initial";
    this.startButton.textContent = "Try again?"


  }

  startTheQuiz(event) {

    this.resetAll()
    // Clear any existing content on the page
    document.querySelector(".intro").textContent = "";
    document.querySelector(".title").textContent = "";
    if (document.querySelector("img") !== null) {
      document.querySelector("img").remove();
    }

    // Clear the quiz display and hide the "Start Quiz" button
    this.answersToChooseFrom.textContent = "";
    this.questionToDisplay.textContent = "";
    this.startButton.disable = true;
    this.startButton.style.display = "none";

    // Display the first quiz question and start the timer
    this.displayQuestion();
    this.startTimer();

  }



  displayQuestion() {
    // Increment the question counter
    this.questionCounter++;

    // Check if the quiz is completed
    if (this.questionCounter >= this.totalQuestions && this.questionCounter > 0) {
      this.completedQuiz = true;
      return;
    }

    // Get the list of wrong answers and correct answer for the current question
    var wrong_answers = Array.from(this.questions[this.questionCounter]["list of wrong answers"]);
    var correct_answer = this.questions[this.questionCounter]["correct answer"];

    // Display the question text
    this.questionToDisplay.textContent = this.questions[this.questionCounter]["question"];

    // Shuffle the list of wrong answers and insert the correct answer at a random index
    const total_answers = wrong_answers.length + 1;
    this.correct_index = Math.floor(Math.random() * total_answers);
    wrong_answers.splice(this.correct_index, 0, correct_answer);
    console.log(this.questions[this.questionCounter]["list of wrong answers"])
    // Display the answer options
    for (let i = 0; i < total_answers; i++) {
      const li = document.createElement("li");
      li.id = i;
      li.textContent = wrong_answers[i];
      this.answersToChooseFrom.appendChild(li);
    }


  }

  selectAnAnswer(event) {
    // Check if the current question has not been answered
    if (!this.questionsAnswered[this.questionCounter]) {

      // Get the element that was clicked
      var element = event.target;
      // Check if the element is a list item
      if (element.matches("li")) {

        // Get the index of the answer that was selected


        // Set the background color and text color of the selected answer
        element.style.backgroundColor = "lightblue";
        element.style.color = "darkblue";

        // Check if the selected answer is correct and display a message accordingly
        if (element.id == this.correct_index) {
          document.querySelector("#result").textContent = "Correct!";
        } else {
          document.querySelector("#result").textContent = "Wrong! 5 seconds are subtracted now!";
          this.secondsLeft -= 5;
        }

        // Mark the current question as answered and move on to the next question after a delay
        this.questionsAnswered[this.questionCounter] = true;
        setTimeout(() => this.goToNextQuestion(), 1000);
      }
    }

  }

  // This function clears the previous question, answer options and result message from the board.
  // Then it checks if there are more questions to display and if there is time left. 
  //If yes, it calls the function to display the next question.
  goToNextQuestion() {

    this.questions.textContent = "";

    this.answersToChooseFrom.innerHTML = "";
    document.querySelector("#result").textContent = "";
    if (this.questionCounter < this.totalQuestions && this.secondsLeft >= 0 && !this.lost) {
      this.displayQuestion();
    }
  }


}


window.addEventListener('load', (event) => {
  fetchData();
});
