/* ---------- GRADE MAPPING ---------- */
const gradePoints = {
  S: 10,
  A: 9,
  B: 8,
  C: 7,
  D: 6,
  E: 5,
  F: 0,
  P: 0
};

/* ---------- SHARED STATE ---------- */
let subjects = JSON.parse(localStorage.getItem("subjects")) || [];

/* =========================================================
   ===================== SGPA PAGE =========================
   ========================================================= */

function addSubject() {
  const subject = document.getElementById("subject")?.value;
  const credits = Number(document.getElementById("credits")?.value);
  const grade = document.getElementById("grade")?.value;

  if (!subject || !credits || !grade) {
    alert("Please fill all fields");
    return;
  }

  subjects.push({
    subject,
    credits,
    grade,
    points: gradePoints[grade]
  });

  localStorage.setItem("subjects", JSON.stringify(subjects));

  clearInputs();
  renderSubjects();
  calculateSGPA();
}

function clearInputs() {
  if (document.getElementById("subject")) document.getElementById("subject").value = "";
  if (document.getElementById("credits")) document.getElementById("credits").value = "";
  if (document.getElementById("grade")) document.getElementById("grade").value = "";
}

function renderSubjects() {
  const list = document.getElementById("subjectList");
  if (!list) return;

  list.innerHTML = "";

  subjects.forEach((s, index) => {
    list.innerHTML += `
      <tr>
        <td>${s.subject}</td>
        <td>${s.credits}</td>
        <td>${s.grade}</td>
        <td>
          <button onclick="deleteSubject(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
}

function deleteSubject(index) {
  subjects.splice(index, 1);
  localStorage.setItem("subjects", JSON.stringify(subjects));
  renderSubjects();
  calculateSGPA();
}

function calculateSGPA() {
  let totalCredits = 0;   // includes P
  let gpaCredits = 0;     // excludes P
  let totalPoints = 0;    // excludes P

  subjects.forEach(s => {
    totalCredits += s.credits;

    if (s.grade !== "P") {
      gpaCredits += s.credits;
      totalPoints += s.credits * s.points;
    }
  });

  const sgpa = gpaCredits
    ? (totalPoints / gpaCredits).toFixed(2)
    : "0.00";

  const sgpaSpan = document.getElementById("sgpa");
  const creditsSpan = document.getElementById("totalCredits");

  if (sgpaSpan) sgpaSpan.innerText = sgpa;
  if (creditsSpan) creditsSpan.innerText = totalCredits;

  localStorage.setItem(
    "sgpaData",
    JSON.stringify({
      totalCredits,  // includes P (progress)
      gpaCredits,    // excludes P (GPA math)
      totalPoints    // excludes P
    })
  );
}

/* Auto-load SGPA page */
if (document.getElementById("subjectList")) {
  renderSubjects();
  calculateSGPA();
}

/* =========================================================
   ===================== CGPA PAGE =========================
   ========================================================= */

/* Display SGPA on CGPA page */
const sgpaSpan = document.getElementById("sgpa");

if (sgpaSpan) {
  const sgpaData = JSON.parse(localStorage.getItem("sgpaData"));

  if (sgpaData && sgpaData.gpaCredits > 0) {
    const sgpa = (sgpaData.totalPoints / sgpaData.gpaCredits).toFixed(2);
    sgpaSpan.innerText = sgpa;
  } else {
    sgpaSpan.innerText = "0.00";
  }
}

function calculateFinalCGPA() {
  const prevCgpa = Number(document.getElementById("prevCgpa")?.value);
  const prevCredits = Number(document.getElementById("prevCredits")?.value);
  const manualSemesterGpa = Number(document.getElementById("semesterGpa")?.value);

  if (!prevCgpa || !prevCredits) {
    alert("Please enter previous CGPA and credits");
    return;
  }

  const sgpaData = JSON.parse(localStorage.getItem("sgpaData"));

  if (!sgpaData || sgpaData.gpaCredits === 0) {
    alert("Please calculate SGPA first");
    return;
  }

  /* Use manual GPA if provided, else fallback to SGPA */
  const semesterGpa = manualSemesterGpa
    ? manualSemesterGpa
    : (sgpaData.totalPoints / sgpaData.gpaCredits);

  const semesterCredits = sgpaData.gpaCredits;

  const combinedPoints =
    prevCgpa * prevCredits + semesterGpa * semesterCredits;

  const combinedCredits =
    prevCredits + semesterCredits;

  const finalCgpa = (combinedPoints / combinedCredits).toFixed(2);

  document.getElementById("finalCgpa").innerText = finalCgpa;
}

