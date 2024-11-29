// Add dynamic input fields for Assignments and Quizzes
document.getElementById("addAssignment").addEventListener("click", () => {
    addField("assignmentsSection");
  });
  
  document.getElementById("addQuiz").addEventListener("click", () => {
    addField("quizzesSection");
  });
  
  function addField(sectionId) {
    const section = document.getElementById(sectionId);
    const newField = document.createElement("div");
    newField.classList.add("field-group");
    newField.innerHTML = `
      <input type="number" class="obtained" placeholder="Obtained Marks" required>
      <input type="number" class="total" placeholder="Total Marks" required>
    `;
    section.appendChild(newField);
  }
  
  // Calculate GPA
  document.getElementById("calculateGPA").addEventListener("click", function () {
    const assignments = calculateWeightedScore("assignmentsSection", 15);
    const quizzes = calculateWeightedScore("quizzesSection", 10);
    const midterm = calculateWeightedScore("midtermSection", 25);
    const finals = calculateWeightedScore("finalSection", 50);
  
    if (assignments === -1 || quizzes === -1 || midterm === -1 || finals === -1) {
      // If validation failed, exit
      document.getElementById("percentage").textContent =
        "You have failed! Obtained marks exceeded total marks in one or more fields.";
      document.getElementById("gpa").textContent =
        "Even I, an AI, feel disgusted by this blatant disregard for the laws of mathematics.";
      document.getElementById("result").classList.remove("hidden");
      return;
    }
  
    const totalPercentage = assignments + quizzes + midterm + finals;
  
    // Determine GPA
    let gpa = 0;
    if (totalPercentage >= 85) gpa = 4.0;
    else if (totalPercentage >= 80) gpa = 3.66;
    else if (totalPercentage >= 75) gpa = 3.33;
    else if (totalPercentage >= 71) gpa = 3.0;
    else if (totalPercentage >= 68) gpa = 2.66;
    else if (totalPercentage >= 64) gpa = 2.33;
    else if (totalPercentage >= 61) gpa = 2.0;
    else if (totalPercentage >= 58) gpa = 1.66;
    else if (totalPercentage >= 54) gpa = 1.3;
    else if (totalPercentage >= 50) gpa = 1.0;
    else gpa = 0.0;
  
    // Display result
    document.getElementById("percentage").textContent = `Total Percentage: ${totalPercentage.toFixed(2)}%`;
    document.getElementById("gpa").textContent = `GPA: ${gpa.toFixed(2)}`;
    document.getElementById("result").classList.remove("hidden");
  });
  
  function calculateWeightedScore(sectionId, weight) {
    const section = document.getElementById(sectionId);
    const fields = section.querySelectorAll(".field-group");
    let obtainedTotal = 0;
    let maxTotal = 0;
  
    for (const field of fields) {
      const obtained = parseFloat(field.querySelector(".obtained").value) || 0;
      const total = parseFloat(field.querySelector(".total").value) || 0;
  
      // Validation: Obtained marks should not exceed total marks
      if (obtained > total) {
        return -1; // Signal validation failure
      }
  
      obtainedTotal += obtained;
      maxTotal += total;
    }
  
    return (obtainedTotal / maxTotal) * weight || 0;
  }
  