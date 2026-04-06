/* ============================================================
   GRADE MAPPING
   ============================================================ */
const gradePoints = {
  S: 10, A: 9, B: 8, C: 7, D: 6, E: 5, F: 0, P: 0
};

/* ============================================================
   STATE  (session-only — no cross-page sharing)
   ============================================================ */
let subjects = [];

/* ============================================================
   ADD SUBJECT
   ============================================================ */
function addSubject() {
  const subjectEl = document.getElementById("subject");
  const creditsEl = document.getElementById("credits");
  const gradeEl   = document.getElementById("grade");

  const subject = subjectEl?.value.trim();
  const credits  = Number(creditsEl?.value);
  const grade    = gradeEl?.value;

  if (!subject || !credits || !grade) {
    showToast("Please fill all fields before adding.");
    return;
  }

  subjects.push({ subject, credits, grade, points: gradePoints[grade] });

  subjectEl.value = "";
  creditsEl.value = "";
  gradeEl.value   = "";
  subjectEl.focus();

  renderSubjects();
  calculateSGPA();
}

/* ============================================================
   RENDER TABLE
   ============================================================ */
function renderSubjects() {
  const list = document.getElementById("subjectList");
  if (!list) return;

  if (subjects.length === 0) {
    list.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--text-muted);padding:1.5rem">No subjects added yet.</td></tr>`;
    return;
  }

  list.innerHTML = subjects
    .map(
      (s, i) => `
      <tr>
        <td>${s.subject}</td>
        <td>${s.credits}</td>
        <td>${s.grade}</td>
        <td><button onclick="deleteSubject(${i})" title="Remove" style="color:#c0392b">✕</button></td>
      </tr>`
    )
    .join("");
}

/* ============================================================
   DELETE SUBJECT
   ============================================================ */
function deleteSubject(index) {
  subjects.splice(index, 1);
  renderSubjects();
  calculateSGPA();
}

/* ============================================================
   CALCULATE SGPA
   ============================================================ */
function calculateSGPA() {
  let totalCredits = 0;
  let gpaCredits   = 0;
  let totalPoints  = 0;

  subjects.forEach(s => {
    totalCredits += s.credits;
    if (s.grade !== "P") {
      gpaCredits  += s.credits;
      totalPoints += s.credits * s.points;
    }
  });

  const sgpa = gpaCredits ? (totalPoints / gpaCredits).toFixed(2) : "0.00";

  const sgpaEl   = document.getElementById("sgpa");
  const creditsEl = document.getElementById("totalCredits");
  if (sgpaEl)    sgpaEl.innerText    = sgpa;
  if (creditsEl) creditsEl.innerText = totalCredits;

  /* Store for the inline CGPA panel on this same page */
  window._sgpaResult = { sgpa: parseFloat(sgpa), gpaCredits, totalCredits };

  /* Show/hide CGPA panel + SGPA share section */
  const cgpaPanel = document.getElementById("cgpaPanel");
  const shareSection = document.getElementById("sgpaShareSection");
  if (cgpaPanel)    cgpaPanel.style.display    = gpaCredits > 0 ? "block" : "none";
  if (shareSection) shareSection.style.display = gpaCredits > 0 ? "block" : "none";

  if (gpaCredits > 0) {
    /* Pre-fill the sem credits field */
    const semCrEl = document.getElementById("semCredits");
    if (semCrEl) semCrEl.value = gpaCredits;
  }
}

/* ============================================================
   INLINE CGPA CALCULATOR (on the SGPA page)
   ============================================================ */
function calculateCGPAFromSGPA() {
  const prevCgpa   = parseFloat(document.getElementById("prevCgpaInline")?.value);
  const prevCr     = parseFloat(document.getElementById("prevCreditsInline")?.value);
  const semCr      = parseFloat(document.getElementById("semCredits")?.value);
  const result     = window._sgpaResult;

  if (!result || result.gpaCredits === 0) {
    showToast("No SGPA calculated yet.");
    return;
  }
  if (isNaN(prevCgpa) || prevCgpa <= 0) {
    showToast("Please enter a valid Previous CGPA.");
    return;
  }
  if (isNaN(prevCr) || prevCr <= 0) {
    showToast("Please enter valid Previous Credits.");
    return;
  }
  if (isNaN(semCr) || semCr <= 0) {
    showToast("Please enter valid Semester Credits.");
    return;
  }

  const combinedPoints  = prevCgpa * prevCr + result.sgpa * semCr;
  const combinedCredits = prevCr + semCr;
  const finalCgpa       = (combinedPoints / combinedCredits).toFixed(2);

  const cgpaResEl = document.getElementById("cgpaResultInline");
  if (cgpaResEl) {
    cgpaResEl.innerText = finalCgpa;
    document.getElementById("cgpaResultBox").style.display = "block";
  }
}

/* ============================================================
   SHARE VIA EMAIL — SGPA
   ============================================================ */
function shareViaSGPAEmail() {
  const result = window._sgpaResult;
  if (!result || result.gpaCredits === 0) {
    showToast("No SGPA calculated yet.");
    return;
  }

  const recipient = document.getElementById("sgpaRecipientEmail")?.value.trim() || "";
  if (recipient && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    showToast("Please enter a valid email address.");
    return;
  }

  /* Build subject list lines */
  const subjectLines = subjects
    .map(s => `  ${s.subject.padEnd(20)} | ${String(s.credits).padStart(3)} credits | Grade: ${s.grade}`)
    .join("\n") || "  (no subjects entered)";

  const sgpaVal = document.getElementById("sgpa")?.innerText || "0.00";
  const totalCr = document.getElementById("totalCredits")?.innerText || "0";

  const subject = encodeURIComponent("My SGPA Calculation Result");
  const body = encodeURIComponent(
`Here are my SGPA calculation details:

Subjects:
${subjectLines}

───────────────────────────
  Total Credits  : ${totalCr}
  SGPA ✦         : ${sgpaVal}
───────────────────────────

Calculated using the SGPA Calculator.`
  );

  openMailto(`mailto:${recipient}?subject=${subject}&body=${body}`);
  showToast(recipient ? `Opening email to ${recipient}…` : "Opening email client…");
}

/* ============================================================
   SHARE VIA EMAIL — CGPA (inline panel on SGPA page)
   ============================================================ */
function shareViaCGPAEmail() {
  const cgpaVal = document.getElementById("cgpaResultInline")?.innerText;
  if (!cgpaVal || document.getElementById("cgpaResultBox")?.style.display === "none") {
    showToast("Please calculate your CGPA first.");
    return;
  }

  const recipient   = document.getElementById("cgpaRecipientEmail")?.value.trim() || "";
  if (recipient && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    showToast("Please enter a valid email address.");
    return;
  }

  const sgpaVal   = document.getElementById("sgpa")?.innerText || "0.00";
  const prevCgpa  = document.getElementById("prevCgpaInline")?.value || "—";
  const prevCr    = document.getElementById("prevCreditsInline")?.value || "—";
  const semCr     = document.getElementById("semCredits")?.value || "—";

  const subject = encodeURIComponent("My CGPA Calculation Result");
  const body = encodeURIComponent(
`Here are my CGPA calculation details:

───────────────────────────
  SGPA This Semester : ${sgpaVal}
  Credits This Sem   : ${semCr}
  Previous CGPA      : ${prevCgpa}
  Prev. Credits      : ${prevCr}
───────────────────────────
  Updated CGPA ✦     : ${cgpaVal}
───────────────────────────

Calculated using the SGPA Calculator.`
  );

  openMailto(`mailto:${recipient}?subject=${subject}&body=${body}`);
  showToast(recipient ? `Opening email to ${recipient}…` : "Opening email client…");
}

/* ============================================================
   MAILTO HELPER — anchor-click is most reliable cross-browser
   ============================================================ */
function openMailto(href) {
  const a = document.createElement("a");
  a.href = href;
  a.target = "_blank";   /* keeps the current page intact */
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => document.body.removeChild(a), 300);
}

/* ============================================================
   TOAST HELPER
   ============================================================ */
function showToast(msg) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.style.cssText = `
      position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);
      background:#3b2f2f;color:#faf8f4;padding:.75rem 1.5rem;
      border-radius:999px;font-size:.9rem;z-index:9999;
      box-shadow:0 8px 24px rgba(0,0,0,.2);opacity:0;
      transition:opacity .3s ease;pointer-events:none`;
    document.body.appendChild(toast);
  }
  toast.innerText = msg;
  toast.style.opacity = "1";
  setTimeout(() => { toast.style.opacity = "0"; }, 2800);
}

/* ============================================================
   INIT
   ============================================================ */
window.addEventListener("DOMContentLoaded", () => {
  renderSubjects();
  calculateSGPA();
});
