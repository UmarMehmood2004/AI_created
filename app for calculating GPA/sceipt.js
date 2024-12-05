// GPA Calculator Functionality
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

document.getElementById("calculateGPA").addEventListener("click", function () {
  const assignments = calculateWeightedScore("assignmentsSection", 15);
  const quizzes = calculateWeightedScore("quizzesSection", 10);
  const midterm = calculateWeightedScore("midtermSection", 25);
  const finals = calculateWeightedScore("finalSection", 50);

  if (assignments === -1 || quizzes === -1 || midterm === -1 || finals === -1) {
      document.getElementById("percentage").textContent =
          "Validation Error: Obtained marks exceeded total marks.";
      document.getElementById("gpa").textContent = "Cannot compute GPA.";
      document.getElementById("gpaResult").classList.remove("hidden");
      return;
  }

  const totalPercentage = assignments + quizzes + midterm + finals;

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

  document.getElementById("percentage").textContent = `Total Percentage: ${totalPercentage.toFixed(2)}%`;
  document.getElementById("gpa").textContent = `GPA: ${gpa.toFixed(2)}`;
  document.getElementById("gpaResult").classList.remove("hidden");
});

function calculateWeightedScore(sectionId, weight) {
  const section = document.getElementById(sectionId);
  const fields = section.querySelectorAll(".field-group");
  let obtainedTotal = 0;
  let maxTotal = 0;

  for (const field of fields) {
      const obtained = parseFloat(field.querySelector(".obtained").value) || 0;
      const total = parseFloat(field.querySelector(".total").value) || 0;

      if (obtained > total) {
          return -1;
      }

      obtainedTotal += obtained;
      maxTotal += total;
  }

  return (obtainedTotal / maxTotal) * weight || 0;
}

// CGPA Calculator Functionality
let gpaWindow = null;

document.getElementById("openGPAWindow").addEventListener("click", () => {
  const windowName = prompt("Enter a name for the new GPA window:", "GPA Entry");
  if (windowName) {
      gpaWindow = window.open("", windowName, "width=600,height=400");
      gpaWindow.document.write(`
          <html>
          <head>
              <title>${windowName}</title>
              <style>
                  body { font-family: Arial; text-align: center; margin: 20px; }
                  .field { margin: 10px 0; }
                  input { padding: 5px; margin: 5px; }
                  button { padding: 10px; background-color: #4CAF50; color: white; border: none; cursor: pointer; }
                  button:hover { background-color: #000000; }
              </style>
          </head>
          <body>
              <h2>${windowName} - Subject GPA Entry</h2>
              <div class="field">
                  <input type="text" id="subjectName" placeholder="Subject Name" required>
                  <input type="number" id="creditHours" placeholder="Credit Hours" required>
                  <input type="number" step="0.01" id="subjectGPA" placeholder="Subject GPA" required>
              </div>
              <button onclick="storeSubject()">Next Subject</button>
              <button onclick="closeWindow()">Close & Return</button>
              <script>
                  function storeSubject() {
                      const subjectName = document.getElementById("subjectName").value || "Unnamed";
                      const creditHours = parseFloat(document.getElementById("creditHours").value) || 0;
                      const subjectGPA = parseFloat(document.getElementById("subjectGPA").value) || 0;

                      if (creditHours && subjectGPA) {
                          const storedData = JSON.parse(localStorage.getItem("subjects")) || [];
                          storedData.push({ subjectName, creditHours, subjectGPA });
                          localStorage.setItem("subjects", JSON.stringify(storedData));

                          alert(\`Stored: \${subjectName}, Credit Hours: \${creditHours}, GPA: \${subjectGPA}\`);
                          document.getElementById("subjectName").value = "";
                          document.getElementById("creditHours").value = "";
                          document.getElementById("subjectGPA").value = "";
                      } else {
                          alert("Please fill in all fields correctly.");
                      }
                  }

                  function closeWindow() {
                      window.close();
                  }
              </script>
          </body>
          </html>
      `);
  }
});

document.getElementById("directCGPACalc").addEventListener("click", () => {
  calculateCGPA();
});

function calculateCGPA() {
  const subjects = JSON.parse(localStorage.getItem("subjects")) || [];
  let totalCredits = 0;
  let weightedGPA = 0;

  for (const subject of subjects) {
      totalCredits += subject.creditHours;
      weightedGPA += subject.creditHours * subject.subjectGPA;
  }

  const cgpa = totalCredits ? (weightedGPA / totalCredits).toFixed(2) : 0;
  document.getElementById("cgpa").textContent = `CGPA: ${cgpa}`;
  document.getElementById("cgpaResult").classList.remove("hidden");
}
