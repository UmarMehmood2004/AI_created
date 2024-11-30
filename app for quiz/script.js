document.getElementById("createQuizBtn").addEventListener("click", () => {
    document.getElementById("quizCreation").classList.remove("hidden");
    document.getElementById("quizTaking").classList.add("hidden");
  });
  
  document.getElementById("takeQuizBtn").addEventListener("click", () => {
    document.getElementById("quizCreation").classList.add("hidden");
    document.getElementById("quizTaking").classList.remove("hidden");
    loadQuiz();
  });
  
  document.getElementById("addQuestionBtn").addEventListener("click", () => {
    const questionsContainer = document.getElementById("questionsContainer");
  
    const questionBlock = document.createElement("div");
    questionBlock.classList.add("question-block");
    questionBlock.innerHTML = `
      <label>Question: <input type="text" class="question"></label>
      <label>Option 1: <input type="text" class="option"></label>
      <label>Option 2: <input type="text" class="option"></label>
      <label>Option 3: <input type="text" class="option"></label>
      <label>Option 4: <input type="text" class="option"></label>
      <label>Correct Answer: <input type="text" class="correct-answer"></label>
    `;
  
    questionsContainer.appendChild(questionBlock);
  });
  
  document.getElementById("saveQuizBtn").addEventListener("click", () => {
    const questions = document.querySelectorAll("#questionsContainer .question-block");
    const quizData = [];
  
    questions.forEach((block) => {
      const question = block.querySelector(".question").value;
      const options = Array.from(block.querySelectorAll(".option")).map((opt) => opt.value);
      const correctAnswer = block.querySelector(".correct-answer").value;
  
      if (question && options.length === 4 && correctAnswer) {
        quizData.push({ question, options, correctAnswer });
      }
    });
  
    localStorage.setItem("quizData", JSON.stringify(quizData));
    alert("Quiz saved successfully!");
    document.getElementById("quizCreation").classList.add("hidden");
  });
  
  function loadQuiz() {
    const quizData = JSON.parse(localStorage.getItem("quizData")) || [];
    const form = document.getElementById("takeQuizForm");
    form.innerHTML = ""; // Clear previous quiz
  
    if (quizData.length === 0) {
      form.innerHTML = "<p>No quiz available! Please create a quiz first.</p>";
      document.getElementById("submitQuizBtn").classList.add("hidden");
      return;
    }
  
    quizData.forEach((data, index) => {
      const questionBlock = document.createElement("div");
      questionBlock.classList.add("question-block");
  
      const questionHTML = `
        <p><strong>${index + 1}. ${data.question}</strong></p>
        ${data.options
          .map(
            (opt) => `
          <label>
            <input type="radio" name="question${index}" value="${opt}" required>
            ${opt}
          </label>
        `
          )
          .join("")}
      `;
  
      questionBlock.innerHTML = questionHTML;
      form.appendChild(questionBlock);
    });
  
    document.getElementById("submitQuizBtn").classList.remove("hidden");
  }
  
  document.getElementById("submitQuizBtn").addEventListener("click", () => {
    const quizData = JSON.parse(localStorage.getItem("quizData")) || [];
    const formData = new FormData(document.getElementById("takeQuizForm"));
    let score = 0;
  
    quizData.forEach((data, index) => {
      const selectedAnswer = formData.get(`question${index}`);
      if (selectedAnswer === data.correctAnswer) {
        score++;
      }
    });
  
    const result = `You scored ${score} out of ${quizData.length}`;
    document.getElementById("quizResult").textContent = result;
    document.getElementById("quizResult").classList.remove("hidden");
  });
  