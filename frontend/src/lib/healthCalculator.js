// Health Metrics Calculator Utility for CardioSense AI

export const calculateBMI = (heightCm, weightKg) => {
  if (!heightCm || !weightKg || heightCm <= 0) return { bmi: 0, category: "N/A" };
  const heightM = heightCm / 100;
  const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));
  
  let category = "Healthy";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi >= 18.5 && bmi < 25) category = "Healthy";
  else if (bmi >= 25 && bmi < 30) category = "Overweight";
  else if (bmi >= 30) category = "Obese";
  
  return { bmi, category };
};

export const calculateHeartAge = (actualAge, gender, inputs, mode, riskPercentage) => {
  let heartAge = actualAge;

  if (mode === "Basic") {
    // Smoking: 0 None, 1 Occasional, 2 Frequent
    if (inputs.smoking === 2) heartAge += 4;
    else if (inputs.smoking === 1) heartAge += 2;

    // Alcohol: 0 None, 1 Occasional, 2 Frequent
    if (inputs.alcohol === 2) heartAge += 1;

    // Exercise: 0 Rarely, 1 1-3x/wk, 2 4+x/wk
    if (inputs.exercise === 0) heartAge += 2;
    else if (inputs.exercise === 2) heartAge -= 2;

    // Stress Level: 0 Low, 1 Med, 2 High
    if (inputs.stress_level === 2) heartAge += 3;
    else if (inputs.stress_level === 1) heartAge += 1;

    // BMI adjustments
    const { bmi } = calculateBMI(inputs.height_cm, inputs.weight_kg);
    if (bmi >= 30) heartAge += 3;
    else if (bmi >= 25) heartAge += 1.5;
    else if (bmi < 18.5) heartAge += 0.5;

    // Risk prediction correlation
    if (riskPercentage > 60) heartAge += 4;
    else if (riskPercentage < 30) heartAge -= 1;
  } else {
    // Advanced mode details
    // Sex: 0 Female, 1 Male
    // cp: Chest pain type 0-3
    // trestbps: Blood pressure
    // chol: Cholesterol
    // thalach: Max heart rate
    // exang: Exercise induced angina
    // oldpeak: ST depression
    
    if (inputs.trestbps > 140) heartAge += 4;
    else if (inputs.trestbps > 130) heartAge += 2;
    else if (inputs.trestbps < 120 && inputs.trestbps > 90) heartAge -= 1;

    if (inputs.chol > 240) heartAge += 4;
    else if (inputs.chol > 200) heartAge += 2;

    if (inputs.thalach < 130) heartAge += 2;
    
    if (inputs.oldpeak > 1.5) heartAge += 3;

    if (inputs.exang === 1) heartAge += 2;

    // Risk correlation
    if (riskPercentage > 60) heartAge += 5;
    else if (riskPercentage < 25) heartAge -= 1.5;
  }

  // Round and keep heart age minimum to 18
  heartAge = Math.max(18, Math.round(heartAge));
  const diff = heartAge - actualAge;

  return {
    heartAge,
    heartAgeDiff: diff
  };
};

export const calculateHealthScore = (inputs, mode, riskPercentage) => {
  let score = 100;

  if (mode === "Basic") {
    // Smoking
    if (inputs.smoking === 2) score -= 15;
    else if (inputs.smoking === 1) score -= 6;

    // Alcohol
    if (inputs.alcohol === 2) score -= 6;
    else if (inputs.alcohol === 1) score -= 2;

    // Exercise
    if (inputs.exercise === 0) score -= 12;
    else if (inputs.exercise === 1) score -= 4;

    // Stress
    if (inputs.stress_level === 2) score -= 8;
    else if (inputs.stress_level === 1) score -= 3;

    // BMI
    const { bmi } = calculateBMI(inputs.height_cm, inputs.weight_kg);
    if (bmi >= 30) score -= 12;
    else if (bmi >= 25) score -= 5;
    else if (bmi < 18.5) score -= 3;

    // Risk
    if (riskPercentage > 70) score -= 20;
    else if (riskPercentage > 40) score -= 10;
  } else {
    // Advanced
    if (inputs.trestbps > 140) score -= 15;
    else if (inputs.trestbps > 130) score -= 7;

    if (inputs.chol > 240) score -= 15;
    else if (inputs.chol > 200) score -= 7;

    if (inputs.oldpeak > 1.5) score -= 10;

    if (inputs.exang === 1) score -= 8;

    if (inputs.thalach < 130) score -= 5;

    // Risk
    if (riskPercentage > 70) score -= 20;
    else if (riskPercentage > 45) score -= 12;
  }

  // Ensure score stays inside [10, 100]
  return Math.max(10, Math.min(100, score));
};

export const generateRecommendations = (inputs, mode) => {
  const recs = [];

  if (mode === "Basic") {
    if (inputs.smoking > 0) {
      recs.push("Active smoking detected. Stop smoking to prevent coronary endothelial damage and reduce long-term cardiovascular risk.");
    }
    if (inputs.alcohol === 2) {
      recs.push("Frequent alcohol intake. Limit alcohol consumption to a maximum of 1-2 standard drinks daily to mitigate cardiomyopathy risks.");
    }
    if (inputs.exercise === 0) {
      recs.push("Sedentary lifestyle. Exercise at least 30 minutes daily (e.g. brisk walking, cycling, or swimming) to raise your resting metabolism.");
    }
    if (inputs.stress_level === 2) {
      recs.push("High stress levels. Integrate stress-reduction protocols such as mindfulness meditation, yoga, or professional counseling.");
    }
    
    const { bmi } = calculateBMI(inputs.height_cm, inputs.weight_kg);
    if (bmi >= 25) {
      recs.push("Elevated body mass index. Implement a calorie-controlled diet focusing on whole foods, lean proteins, and complex carbohydrates.");
    }
  } else {
    // Advanced
    if (inputs.trestbps > 130) {
      recs.push("Resting blood pressure is elevated. Reduce dietary sodium (< 1,500 mg daily), increase potassium, and monitor daily blood pressure.");
    }
    if (inputs.chol > 200) {
      recs.push("Serum cholesterol is high. Limit saturated and trans fats, increase soluble fiber intake (oats, beans), and consider plant sterols.");
    }
    if (inputs.thalach < 130) {
      recs.push("Low maximum heart rate. Consult a doctor before starting intense exercise, and consider light cardiovascular aerobic workouts.");
    }
    if (inputs.oldpeak > 1.0) {
      recs.push("ST segment depression detected. Exercise stress on the cardiac muscle was observed. Schedule a stress test consultation with a cardiologist.");
    }
    if (inputs.exang === 1) {
      recs.push("Exercise-induced chest pain. Avoid high-intensity exertion without medical supervision, and keep prescribed cardiovascular medication handy.");
    }
  }

  // Fallback if everything is in optimal ranges
  if (recs.length === 0) {
    recs.push("Keep up the excellent work! Continue maintaining a balanced diet, consistent exercise routine, and sufficient sleep cycles.");
  }

  return recs;
};

export const generateAIExplanation = (inputs, mode, riskPercentage, predictionResult) => {
  const factors = [];
  const positive = [];

  if (mode === "Basic") {
    // Age
    if (inputs.age > 55) factors.push(`increased age (${inputs.age} years)`);
    else positive.push("youthful age profile");

    // Smoking
    if (inputs.smoking > 0) factors.push("tobacco use");
    else positive.push("non-smoking status");

    // Exercise
    if (inputs.exercise === 0) factors.push("sedentary activity level");
    else positive.push("consistent physical workouts");

    // Stress
    if (inputs.stress_level === 2) factors.push("high chronic stress exposure");

    // BMI
    const { bmi } = calculateBMI(inputs.height_cm, inputs.weight_kg);
    if (bmi >= 30) factors.push(`obesity level body mass index (${bmi})`);
    else if (bmi >= 25) factors.push(`overweight body mass index (${bmi})`);
    else if (bmi >= 18.5 && bmi < 25) positive.push("healthy weight range");

  } else {
    // Advanced
    if (inputs.age > 55) factors.push(`older age group (${inputs.age})`);
    
    if (inputs.trestbps > 135) factors.push(`elevated resting blood pressure (${inputs.trestbps} mm Hg)`);
    else positive.push("optimal resting blood pressure");

    if (inputs.chol > 220) factors.push(`high total serum cholesterol (${inputs.chol} mg/dl)`);
    else positive.push("normal cholesterol profile");

    if (inputs.oldpeak > 1.2) factors.push(`ST depression stress response (${inputs.oldpeak})`);
    
    if (inputs.exang === 1) factors.push("exercise-induced angina (chest pain)");
    
    if (inputs.cp > 0) factors.push(`chest pain symptoms (classification type ${inputs.cp})`);
  }

  // Combine factors to build a non-hallucinated medical diagnostic report
  let explanation = "";
  if (riskPercentage > 50 || predictionResult?.toLowerCase().includes("high") || predictionResult?.toLowerCase().includes("likely")) {
    explanation = `The machine learning model predicted an elevated risk profile primarily driven by ${factors.join(", ")}. `;
    if (positive.length > 0) {
      explanation += `Although your ${positive.slice(0, 2).join(" and ")} help offset some risk, the clinical indices suggest further examination.`;
    }
  } else {
    explanation = `Your cardiovascular indicators are positive. This low risk assessment is anchored by your ${positive.join(", ")}. `;
    if (factors.length > 0) {
      explanation += `However, please monitor minor factors like your ${factors.join(" or ")} to maintain this status.`;
    }
  }

  return explanation;
};
