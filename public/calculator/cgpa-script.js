/* ============================================================
   CGPA CALCULATOR  — fully standalone, no shared localStorage
   ============================================================ */

function calculateCGPA() {
  const currentCgpa   = parseFloat(document.getElementById("currentCgpa")?.value);
  const creditsDone   = parseFloat(document.getElementById("creditsDone")?.value);
  const semSgpa       = parseFloat(document.getElementById("semSgpa")?.value);
  const semCredits    = parseFloat(document.getElementById("semCredits")?.value);

  /* Validation */
  if (isNaN(currentCgpa) || currentCgpa <= 0 || currentCgpa > 10) {
    showToast("Please enter a valid Current CGPA (0–10).");
    return;
  }
  if (isNaN(creditsDone) || creditsDone <= 0) {
    showToast("Please enter valid Credits Completed so far.");
    return;
  }
  if (isNaN(semSgpa) || semSgpa <= 0 || semSgpa > 10) {
    showToast("Please enter a valid SGPA for this semester (0–10).");
    return;
  }
  if (isNaN(semCredits) || semCredits <= 0) {
    showToast("Please enter valid Credits for this semester.");
    return;
  }

  const combinedPoints  = currentCgpa * creditsDone + semSgpa * semCredits;
  const combinedCredits = creditsDone + semCredits;
  const newCgpa         = (combinedPoints / combinedCredits).toFixed(2);

  /* Display result */
  const resultEl  = document.getElementById("finalCgpa");
  const resultBox = document.getElementById("resultBox");

  if (resultEl)  resultEl.innerText = newCgpa;
  if (resultBox) {
    resultBox.style.display = "block";
    resultBox.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  /* Colour-code the result */
  if (resultEl) {
    if (parseFloat(newCgpa) >= 8.5)       resultEl.style.color = "#2e7d32";
    else if (parseFloat(newCgpa) >= 6.5)  resultEl.style.color = "var(--brown-main)";
    else                                   resultEl.style.color = "#c0392b";
  }
}

function resetForm() {
  ["currentCgpa", "creditsDone", "semSgpa", "semCredits", "recipientEmail"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  const resultBox = document.getElementById("resultBox");
  if (resultBox) resultBox.style.display = "none";
}

/* ============================================================
   SHARE VIA EMAIL
   ============================================================ */
function shareViaEmail() {
  /* Grab displayed values */
  const currentCgpa = document.getElementById("currentCgpa")?.value || "—";
  const creditsDone = document.getElementById("creditsDone")?.value || "—";
  const semSgpa     = document.getElementById("semSgpa")?.value     || "—";
  const semCredits  = document.getElementById("semCredits")?.value  || "—";
  const finalCgpa   = document.getElementById("finalCgpa")?.innerText || "—";

  if (finalCgpa === "—" || document.getElementById("resultBox")?.style.display === "none") {
    showToast("Please calculate your CGPA first.");
    return;
  }

  const recipient = document.getElementById("recipientEmail")?.value.trim() || "";

  /* Validate email only if provided */
  if (recipient && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    showToast("Please enter a valid email address.");
    return;
  }

  const subject = encodeURIComponent("My CGPA Calculation Result");

  const body = encodeURIComponent(
`Here are my CGPA calculation details:

───────────────────────────
  Previous CGPA      : ${currentCgpa}
  Credits Completed  : ${creditsDone}
  SGPA This Semester : ${semSgpa}
  Credits This Sem   : ${semCredits}
───────────────────────────
  Updated CGPA ✦     : ${finalCgpa}
───────────────────────────

Calculated using the CGPA Calculator.`
  );

  const mailto = `mailto:${recipient}?subject=${subject}&body=${body}`;
  openMailto(mailto);
  showToast(recipient ? `Opening email to ${recipient}…` : "Opening email client…");
}

/* ============================================================
   MAILTO HELPER  — anchor-click is the most reliable trigger
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

/* Allow Enter key to trigger calculation */
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("input").forEach(input => {
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") calculateCGPA();
    });
  });
});
