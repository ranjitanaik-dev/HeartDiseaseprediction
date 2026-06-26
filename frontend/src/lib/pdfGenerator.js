import { jsPDF } from "jspdf";
import "jspdf-autotable";

export const generatePDFReport = (patientName, data) => {
  const doc = new jsPDF();
  
  // Header Accent
  doc.setFillColor(225, 29, 72); // rose-600
  doc.rect(0, 0, 210, 8, 'F');

  // Title
  doc.setFontSize(22);
  doc.setTextColor(225, 29, 72);
  doc.text("CardioSense AI - Clinical Report", 14, 22);
  
  // Subtitle
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text("Smart Heart Disease Risk Assessment Tool", 14, 28);
  doc.text(`Date Generated: ${new Date().toLocaleString()}`, 14, 33);
  
  // Patient details section
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(`Patient Name: ${patientName || "Guest Patient"}`, 14, 45);
  
  // Table of clinical data
  const tableData = [
    ["Metric", "Value", "Clinical Significance"],
    ["Risk Level", data.riskLevel.toUpperCase(), data.riskLevel === "High" ? "Elevated risk - cardiologist review suggested" : "Standard baseline parameters"],
    ["Risk Probability", `${data.riskPercentage}%`, "Statistical likelihood score from model"],
    ["Model Confidence", `${data.confidenceScore}%`, "Confidence score based on feature boundaries"],
    ["Health Score", `${data.healthScore}/100`, "Overall biological health score"],
    ["Estimated Heart Age", `${data.heartAge} yrs (Diff: ${data.heartAgeDiff > 0 ? '+' : ''}${data.heartAgeDiff} yrs)`, data.heartAgeDiff > 0 ? "Accelerated cardiac aging" : "Excellent physiological age"],
    ["BMI Index", `${data.bmi} (${data.bmiCategory})`, data.bmiCategory === "Healthy" ? "Within optimal range" : "Weight adjustment advised"]
  ];
  
  // Add other clinical values entered
  const clinicalInputs = data.inputs || {};
  const clinicalRows = [];
  if (clinicalInputs.age !== undefined) clinicalRows.push(["Age", `${clinicalInputs.age} years`, "Age factor"]);
  if (clinicalInputs.gender !== undefined || clinicalInputs.sex !== undefined) {
    const genderVal = clinicalInputs.gender !== undefined ? clinicalInputs.gender : clinicalInputs.sex;
    clinicalRows.push(["Gender", genderVal === 1 ? "Male" : "Female", "Demographic factor"]);
  }
  if (clinicalInputs.trestbps !== undefined) clinicalRows.push(["Resting Blood Pressure", `${clinicalInputs.trestbps} mm Hg`, clinicalInputs.trestbps > 130 ? "Elevated (>130)" : "Normal (<120)"]);
  if (clinicalInputs.chol !== undefined) clinicalRows.push(["Serum Cholesterol", `${clinicalInputs.chol} mg/dl`, clinicalInputs.chol > 200 ? "High (>200)" : "Optimal (<200)"]);
  if (clinicalInputs.thalach !== undefined) clinicalRows.push(["Max Heart Rate", `${clinicalInputs.thalach} bpm`, "Cardiovascular peak"]);
  if (clinicalInputs.smoking !== undefined) clinicalRows.push(["Smoking Habit", clinicalInputs.smoking === 2 ? "Frequent" : clinicalInputs.smoking === 1 ? "Occasional" : "Non-smoker", "Vascular health factor"]);
  if (clinicalInputs.stress_level !== undefined) clinicalRows.push(["Stress Level", clinicalInputs.stress_level === 2 ? "High" : clinicalInputs.stress_level === 1 ? "Medium" : "Low", "Neurological stress factor"]);
  
  doc.autoTable({
    startY: 50,
    head: [tableData[0]],
    body: tableData.slice(1),
    theme: 'grid',
    headStyles: { fillColor: [225, 29, 72] },
    margin: { left: 14, right: 14 }
  });
  
  let finalY = doc.lastAutoTable.finalY || 110;
  
  if (clinicalRows.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Clinical Bio-Markers Entered", 14, finalY + 12);
    doc.autoTable({
      startY: finalY + 16,
      head: [["Biomarker", "Value", "Status / Category"]],
      body: clinicalRows,
      theme: 'striped',
      headStyles: { fillColor: [15, 23, 42] },
      margin: { left: 14, right: 14 }
    });
    finalY = doc.lastAutoTable.finalY || finalY + 60;
  }
  
  // Explanation section
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text("AI Diagnostic Explanation", 14, finalY + 12);
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  const explanationLines = doc.splitTextToSize(data.explanation || "No explanation details provided.", 182);
  doc.text(explanationLines, 14, finalY + 18);
  
  finalY += 18 + (explanationLines.length * 5.2);
  
  // Recommendations section
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text("Custom Clinical Recommendations", 14, finalY + 12);
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  const recs = data.recommendations || [];
  let recsY = finalY + 18;
  recs.forEach((rec) => {
    const recLines = doc.splitTextToSize(`• ${rec}`, 182);
    doc.text(recLines, 14, recsY);
    recsY += recLines.length * 5.2;
  });
  
  // Medical Disclaimer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  const disclaimerText = doc.splitTextToSize("Disclaimer: This prediction is generated using a machine learning model and is intended only for educational purposes. It is not a substitute for professional medical advice, diagnosis, or treatment. Please consult a qualified cardiologist for medical care.", 182);
  doc.text(disclaimerText, 14, 272);
  
  // Footer text
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("Generated by Heart Health Risk Assessment Tool", 14, 287);
  
  // Save PDF
  const filename = `CardioSense_Report_${patientName.trim().replace(/\s+/g, '_') || 'Patient'}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};
