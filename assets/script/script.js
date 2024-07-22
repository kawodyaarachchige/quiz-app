const questionArray=[];
var correctAnswersCount = 0;
$(document).ready(() => {
    let currentUserName = localStorage.getItem('lastUserName');
    console.log("Current Username : "+currentUserName)
    $('#playerName').html(currentUserName);
    async function fetchQuestions() {
        try {
            let response = await fetch('https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple');
            let data = await response.json();
            let fetchedQuestions = data.results;
            console.log(fetchedQuestions)
            for (let i = 0; i < fetchedQuestions.length; i++) {
                let answer01 = fetchedQuestions[i].correct_answer.toLowerCase();
                let answer02 = fetchedQuestions[i].incorrect_answers[0].toLowerCase();
                let answer03 = fetchedQuestions[i].incorrect_answers[1].toLowerCase();
                let answer04 = fetchedQuestions[i].incorrect_answers[2].toLowerCase();
                let answerArray = [answer01, answer02, answer03, answer04];
                answerArray = shuffleArray(answerArray);
                questionArray.push({
                    question: fetchedQuestions[i].question,
                    answer: answerArray,
                    correctAnswer: fetchedQuestions[i].correct_answer.toLowerCase()
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    fetchQuestions();
    console.log(questionArray);

    let quizRound=0;
    let interval=setInterval(()=>{
        if(!(quizRound>4)){
            startCountdown();
        }
        quizCardLoader(quizRound);
        quizRound++
        if(quizRound>5){
            quizRound=0
            clearInterval(interval)
            console.log("Your Score is : "+correctAnswersCount)
            finalScoreLoader();
        }
    },10000)

})
let countdownInterval;
let startCountdown = () => {
    let timeLeft = 10;
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        timeLeft--;
        $('#countdown').text(`Time left: ${timeLeft} seconds`);
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
        }
    }, 1000);
};


let quizCardLoader = (number) => {
    $('#question').html("");
    $("#questionNumber").text(number + 1 + " / 5 Question");
    let question = questionArray[number].question;
    let correctAnswer = questionArray[number].correctAnswer
    let escapedCorrectAnswer = correctAnswer.replace(/'/g, ',').replace(/\s/g, '');
    console.log("Correct Answer : "+correctAnswer)
    console.log("Escaped Answer : "+escapedCorrectAnswer)

    let questionTemp = `
            <h4>${number + 1}. ${question}</h4><br>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="answer" value= ${questionArray[number].answer[0].replace(/'/g, ',').replace(/\s/g, '')} id="answer${number + 1}">
              <label class="form-check-label text-success" for="answer${number + 1}">
                ${questionArray[number].answer[0]}
              </label>
            </div><br>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="answer" value=${questionArray[number].answer[1].replace(/'/g, ',').replace(/\s/g, '')} id="answer${number + 2}">
              <label class="form-check-label text-success" for="answer${number + 2}">
                ${questionArray[number].answer[1]}
              </label>
            </div><br>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="answer" value=${questionArray[number].answer[2].replace(/'/g, ',').replace(/\s/g, '')} id="answer${number + 3}">
              <label class="form-check-label text-success" for="answer${number + 3}">
                ${questionArray[number].answer[2]}
              </label>
            </div><br>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="answer" value=${questionArray[number].answer[3].replace(/'/g, ',').replace(/\s/g, '')} id="answer${number + 4}">
              <label class="form-check-label text-success" for="answer${number + 4}">
                ${questionArray[number].answer[3]}
              </label>
            </div><br>
            <div class="card-footer text-end">
                 <a class="btn btn-success" id="nextBtn" onclick="getSelectedAnswer(${number},'${escapedCorrectAnswer}')">Confirm</a>
            </div>
        `;
    $("#question").append(questionTemp);
}
let getSelectedAnswer=(currentQuestionNumber,correctAnswer) => {
    let checkedInput = document.querySelector('input[name="answer"]:checked');
    document.querySelector('input[name="answer"]:checked').style.backgroundColor = "yellow";
    console.log("replacedCheckedInput : ",checkedInput)
    if (checkedInput.value==correctAnswer) {
        correctAnswersCount++;
        console.log("Question number : "+currentQuestionNumber+", Answer is Correct..")
    }else{
        console.log("Oops wrong answer..");
    }
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let finalScoreLoader =()=>{
    let finalScoreTemp = `
        <h5 style="color: green">Total Score : ${correctAnswersCount}/5 </h5>
        <div class="accordion" id="accordion">
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
        1. ${questionArray[0].question}
      </button>
    </h2>
    <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
      <div class="accordion-body">
         ${questionArray[0].correctAnswer}
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
        2. ${questionArray[1].question}
      </button>
    </h2>
    <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        ${questionArray[1].correctAnswer}
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
       3. ${questionArray[2].question}
      </button>
    </h2>
    <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        ${questionArray[2].correctAnswer}
       </div>
    </div>
    <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseThree">
       4. ${questionArray[3].question}
      </button>
    </h2>
    <div id="collapseFour" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        ${questionArray[3].correctAnswer}
       </div>
    </div>
    <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseThree">
       5. ${questionArray[4].question}
      </button>
    </h2>
    <div id="collapseFive" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        ${questionArray[4].correctAnswer}
       </div>
    </div>
  </div>
</div>
    `;
    $("#question").html("");
    $('#questionNumber').html("Answers for the previous questions");
    $("#question").append(finalScoreTemp);
}