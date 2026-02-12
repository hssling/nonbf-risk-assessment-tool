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

function getReasons(formValues) {
  const reasons = [];

  if (formValues.bfinit === "1") {
    reasons.push("Early breastfeeding initiation (<1 hour) is linked to lower estimated risk in this model.");
  } else {
    reasons.push("Delayed breastfeeding initiation (>1 hour) is linked to higher estimated risk in this model.");
  }

  if (formValues.birthwt === "2") {
    reasons.push("Normal birth weight (2.5-4.0 kg) lowers estimated risk compared with low birth weight.");
  } else {
    reasons.push("Low birth weight (1.5-2.5 kg) raises estimated risk in this model.");
  }

  if (formValues.parity === "2") {
    reasons.push("Second parity is associated with lower estimated risk compared with primi.");
  } else if (formValues.parity === "3") {
    reasons.push("Multi parity is slightly lower risk than primi in this model.");
  } else {
    reasons.push("Primi is the reference group in this model.");
  }

  if (formValues.residence === "2") {
    reasons.push("Urban residence has slightly lower estimated risk than rural in this dataset.");
  } else {
    reasons.push("Rural residence is the reference category in this model.");
  }

  if (formValues.employment === "1") {
    reasons.push("Self-employment is associated with lower estimated risk than unemployment.");
  } else if (formValues.employment === "2") {
    reasons.push("Employment is associated with somewhat lower estimated risk than unemployment.");
  } else {
    reasons.push("Unemployment is the reference category in this model.");
  }

  return reasons;
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
const riskMeaning = document.getElementById("risk-meaning");
const riskDetails = document.getElementById("risk-details");
const riskReasons = document.getElementById("risk-reasons");

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
  const outOf100 = Math.round(probability * 100);
  const reasons = getReasons(values);

  result.classList.remove("hidden");
  riskValue.textContent = `${pct}%`;
  riskLevel.textContent = label;
  riskLevel.className = className;
  riskMeaning.textContent = `This means about ${outOf100} out of 100 mothers with similar inputs may have non-breastmilk feeding.`;
  riskDetails.textContent = `Model output: probability of non-breastmilk feeding (Yes). Logit score: ${logit.toFixed(3)}.`;
  riskReasons.innerHTML = reasons.map((reason) => `<li>${reason}</li>`).join("");
});
