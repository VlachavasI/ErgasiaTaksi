const questionContainer = document.getElementById('question-container');
const inputContainer = document.getElementById('input-container');
const userInput = document.getElementById('user-input');
const submitButton = document.getElementById('submit-btn');
const resultsContainer = document.getElementById('results-container');
const resultsList = document.getElementById('results-list')

let questions = [];
let currentQuestionIndex = 0;
const answers = {};

// Function to load questions from JSON file
async function loadQuestions() {
    try {
        const response = await fetch('all-questions-en.json');
        questions = await response.json();
    } catch (error) {
        console.error("Error loading questions:", error);
        questionContainer.textContent = "Failed to load questions. Please try again later.";
    }
}
//Function to display a question
function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
      questionContainer.textContent = "Chat completed!";
      inputContainer.style.display = 'none';
      displayResults();
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    questionContainer.textContent = `Question ${currentQuestionIndex + 1}: ${currentQuestion.question}`;

    if (currentQuestion.options) {
      // create options
      userInput.style.display = 'none'; //hide user input
      submitButton.style.display = 'none'; // hide submit button
      
      const optionsContainer = document.createElement('div');
      optionsContainer.classList.add('govgr-button-group');
      
      currentQuestion.options.forEach((option, index)=>{
          const optionButton = document.createElement('button');
          optionButton.textContent = option;
          optionButton.classList.add('govgr-btn','govgr-btn-secondary');

          optionButton.addEventListener('click',()=>{
            answers[currentQuestion.id] = option;
            currentQuestionIndex++;
            displayQuestion();
          });

        optionsContainer.appendChild(optionButton);
      });
      questionContainer.appendChild(optionsContainer);
    } else {
      userInput.style.display = 'block'; // show input
      submitButton.style.display = 'block'; // show submit button
        
    }

}
//display the results
function displayResults(){
  const heading = document.createElement('h2');
  heading.textContent= "Your Answers:";
  heading.classList.add('govgr-heading-m');
  resultsContainer.appendChild(heading)


  for(const questionData of questions){
    const answer = answers[questionData.id]

    const listItem = document.createElement('li');
    listItem.textContent = `Question ${questionData.id +1}: ${questionData.question} `;
    listItem.classList.add('govgr-list__item');

    const answerItem = document.createElement('li');
    answerItem.textContent = `   Answer: ${answer}`;
      answerItem.classList.add('govgr-list__item', 'govgr-pl-4');
    
    resultsList.appendChild(listItem);
    resultsList.appendChild(answerItem);


  }
    resultsContainer.appendChild(resultsList);
}


// Event listener for the submit button
submitButton.addEventListener('click', ()=>{
    if(userInput.value.trim() !== ""){
        answers[questions[currentQuestionIndex].id] = userInput.value.trim();
        userInput.value = '';
        currentQuestionIndex++;
        displayQuestion();

    }else {
        alert("Please enter an answer.")
    }
});



// Initialize the chat
async function initializeChat() {
    await loadQuestions();
    displayQuestion();
}

initializeChat();