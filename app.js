const COEFF = {
  intercept: 1.0219,
  employment_1: -0.7448,
  employment_2: -0.4517,
  residence_2: -0.3314,
  parity_2: -1.2665,
  parity_3: -0.5030,
  birthwt_2: -0.6274,
  bfinit_1: -1.2647
};

function logistic(x) {
  return 1 / (1 + Math.exp(-x));
}

function classifyRisk(probability) {
  if (probability < 0.2) return { label: "Low risk", className: "low" };
  if (probability < 0.4) return { label: "Moderate risk", className: "medium" };
  return { label: "High risk", className: "high" };
}

function calculate(formValues) {
  let logit = COEFF.intercept;

  if (formValues.employment === "1") logit += COEFF.employment_1;
  if (formValues.employment === "2") logit += COEFF.employment_2;
  if (formValues.residence === "2") logit += COEFF.residence_2;
  if (formValues.parity === "2") logit += COEFF.parity_2;
  if (formValues.parity === "3") logit += COEFF.parity_3;
  if (formValues.birthwt === "2") logit += COEFF.birthwt_2;
  if (formValues.bfinit === "1") logit += COEFF.bfinit_1;

  const probability = logistic(logit);
  return { logit, probability };
}

const form = document.getElementById("risk-form");
const result = document.getElementById("result");
const riskValue = document.getElementById("risk-value");
const riskLevel = document.getElementById("risk-level");
const riskDetails = document.getElementById("risk-details");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const values = {
    employment: document.getElementById("employment").value,
    residence: document.getElementById("residence").value,
    parity: document.getElementById("parity").value,
    birthwt: document.getElementById("birthwt").value,
    bfinit: document.getElementById("bfinit").value
  };

  const { logit, probability } = calculate(values);
  const { label, className } = classifyRisk(probability);
  const pct = (probability * 100).toFixed(1);

  result.classList.remove("hidden");
  riskValue.textContent = `${pct}%`;
  riskLevel.textContent = label;
  riskLevel.className = className;
  riskDetails.textContent = `Model logit score: ${logit.toFixed(3)}. Outcome estimated: non-breastmilk feeding (Yes).`;
});
