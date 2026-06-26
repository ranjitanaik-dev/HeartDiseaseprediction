import React, { useState } from 'react';
import axios from 'axios';
import { Activity, AlertCircle, Info, Database, BarChart3, Brain, FileDown, Heart, ShieldAlert, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { 
  calculateBMI, 
  calculateHeartAge, 
  calculateHealthScore, 
  generateRecommendations, 
  generateAIExplanation 
} from '../lib/healthCalculator';
import { generatePDFReport } from '../lib/pdfGenerator';

export default function AdvancedPrediction() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    age: 55, sex: 1, cp: 0, trestbps: 120, chol: 200, fbs: 0,
    restecg: 0, thalach: 150, exang: 0, oldpeak: 1.0, slope: 1, ca: 0, thal: 2
  });

  // Local-only state for height and weight (to calculate BMI)
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(70);

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    // Multi-step loading messages
    const steps = [
      "Analyzing patient clinical bio-markers...",
      "Running CardioSense Machine Learning Model...",
      "Calculating Health Score & Physiological Heart Age...",
      "Preparing personalized clinical recommendations..."
    ];

    let currentStep = 0;
    setLoadingStep(steps[currentStep]);

    const stepInterval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setLoadingStep(steps[currentStep]);
      }
    }, 800);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      // Call backend API (omitting user_id to bypass remote database constraints)
      const response = await axios.post(`${apiUrl}/api/predict/advanced`, {
        ...formData,
        user_id: null
      });

      // Wait a minimum time to let user view loading states
      await new Promise(resolve => setTimeout(resolve, 3200));

      const apiResult = response.data;

      // Local calculations
      const bmiMetrics = calculateBMI(heightCm, weightKg);
      
      // Merge height and weight into formData clone for calculator logic
      const fullInputs = { ...formData, height_cm: heightCm, weight_kg: weightKg };
      const heartAgeMetrics = calculateHeartAge(formData.age, formData.sex, fullInputs, "Advanced", apiResult.risk_percentage);
      const healthScore = calculateHealthScore(fullInputs, "Advanced", apiResult.risk_percentage);
      const customRecs = generateRecommendations(fullInputs, "Advanced");
      
      // Determine Risk Level
      let riskLevel = "Low";
      if (apiResult.risk_percentage > 70) riskLevel = "High";
      else if (apiResult.risk_percentage > 40) riskLevel = "Medium";

      // Confidence formula: 70 + abs(risk_percentage - 50) * 0.56
      const confidenceScore = Math.round(70 + Math.abs(apiResult.risk_percentage - 50) * 0.56);

      const explanation = generateAIExplanation(formData, "Advanced", apiResult.risk_percentage, riskLevel);

      const finalResult = {
        riskLevel,
        riskPercentage: apiResult.risk_percentage,
        confidenceScore,
        healthScore,
        bmi: bmiMetrics.bmi,
        bmiCategory: bmiMetrics.category,
        heartAge: heartAgeMetrics.heartAge,
        heartAgeDiff: heartAgeMetrics.heartAgeDiff,
        explanation,
        recommendations: customRecs,
        feature_importance: apiResult.feature_importance,
        inputs: fullInputs,
        disclaimer: "This prediction is generated using a machine learning model and is intended only for educational purposes. It is not a substitute for professional medical advice."
      };

      setResult(finalResult);

      // Persist to local history specific to logged-in user
      if (user?.uid) {
        const historyKey = `cardio_history_${user.uid}`;
        const existingHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
        const newRecord = {
          id: Date.now().toString(),
          date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          mode: "Advanced Analysis",
          ...finalResult
        };
        localStorage.setItem(historyKey, JSON.stringify([newRecord, ...existingHistory]));
      }

    } catch (error) {
      console.error("Prediction error", error);
      alert("Failed to connect to backend server. Make sure the FastAPI backend is running.");
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleDownloadPDF = () => {
    if (!result) return;
    const name = user?.displayName || user?.email?.split('@')[0] || "Guest Patient";
    generatePDFReport(name, result);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Database className="text-health-500" />
        Advanced Clinical Analysis
      </h1>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-xl font-semibold border-b border-white/10 pb-2 mb-2">Patient Bio-Markers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Age (Years)" name="age" value={formData.age} onChange={handleChange} />
              <SelectField label="Sex" name="sex" value={formData.sex} onChange={handleChange} options={["Female", "Male"]} />
              
              {/* Optional Height/Weight to enable BMI calculation */}
              <div>
                <label className="block text-xs text-slate-500 mb-1 font-bold uppercase">Height (cm)</label>
                <input 
                  type="number" 
                  value={heightCm} 
                  onChange={(e) => setHeightCm(parseFloat(e.target.value))} 
                  required
                  className="w-full bg-slate-900/50 border border-white/5 rounded-lg py-3 px-4 focus:border-health-500 transition-colors outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1 font-bold uppercase">Weight (kg)</label>
                <input 
                  type="number" 
                  value={weightKg} 
                  onChange={(e) => setWeightKg(parseFloat(e.target.value))} 
                  required
                  className="w-full bg-slate-900/50 border border-white/5 rounded-lg py-3 px-4 focus:border-health-500 transition-colors outline-none" 
                />
              </div>

              <SelectField label="Chest Pain Type (cp)" name="cp" value={formData.cp} onChange={handleChange} options={["Typical Angina", "Atypical Angina", "Non-anginal Pain", "Asymptomatic"]} />
              <InputField label="Resting BP (trestbps) (mm Hg)" name="trestbps" value={formData.trestbps} onChange={handleChange} />
              <InputField label="Serum Cholesterol (chol) (mg/dl)" name="chol" value={formData.chol} onChange={handleChange} />
              <SelectField label="Fasting Blood Sugar > 120 mg/dl (fbs)" name="fbs" value={formData.fbs} onChange={handleChange} options={["False", "True"]} />
              <SelectField label="Resting ECG Results (restecg)" name="restecg" value={formData.restecg} onChange={handleChange} options={["Normal", "ST-T Wave Abnormality", "Left Ventricular Hypertrophy"]} />
              <InputField label="Max Heart Rate (thalach)" name="thalach" value={formData.thalach} onChange={handleChange} />
              <SelectField label="Exercise Induced Angina (exang)" name="exang" value={formData.exang} onChange={handleChange} options={["No", "Yes"]} />
              <InputField label="ST Depression (oldpeak)" name="oldpeak" value={formData.oldpeak} onChange={handleChange} step="0.1" />
              <SelectField label="ST Peak Slope (slope)" name="slope" value={formData.slope} onChange={handleChange} options={["Upsloping", "Flat", "Downsloping"]} />
              <InputField label="Major Vessels (ca) (0-4)" name="ca" value={formData.ca} onChange={handleChange} />
              <SelectField label="Thalassemia (thal)" name="thal" value={formData.thal} onChange={handleChange} options={["Normal", "Fixed Defect", "Reversible Defect", "Unknown"]} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-health-600 hover:bg-health-700 disabled:bg-health-800 rounded-xl font-bold text-lg transition-all text-white cursor-pointer shadow-lg shadow-health-500/20"
          >
            {loading ? "Analyzing..." : "Analyze Clinical Data"}
          </button>
        </form>

        {/* Results / Loading Column */}
        <div className="w-full h-full min-h-[500px]">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass-card p-8 flex flex-col items-center justify-center h-full min-h-[500px] text-center space-y-6"
              >
                <div className="relative flex items-center justify-center">
                  <div className="w-24 h-24 border-4 border-health-500/20 border-t-health-500 rounded-full animate-spin" />
                  <Heart className="w-10 h-10 text-health-500 absolute animate-pulse" />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-bold text-white">Analyzing Clinical Data</p>
                  <p className="text-sm text-slate-400 min-h-[20px] transition-all duration-300 font-medium">{loadingStep}</p>
                </div>
                <div className="w-48 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3.2, ease: "linear" }}
                    className="bg-health-500 h-full"
                  />
                </div>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Main Risk Output */}
                <div className={`glass-card p-6 md:p-8 border-l-8 ${result.riskLevel === 'High' ? 'border-l-red-500' : result.riskLevel === 'Medium' ? 'border-l-yellow-500' : 'border-l-green-500'}`}>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Diagnostic Estimation</h3>
                      <p className="text-3xl md:text-4xl font-black text-white">{result.riskLevel.toUpperCase()} RISK</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Risk Probability</p>
                      <p className={`text-3xl font-black ${result.riskLevel === 'High' ? 'text-red-500' : result.riskLevel === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`}>
                        {result.riskPercentage}%
                      </p>
                    </div>
                  </div>

                  <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden mb-6">
                    <div 
                      className={`h-full ${result.riskLevel === 'High' ? 'bg-red-500' : result.riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${result.riskPercentage}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm border-t border-white/10 pt-4">
                    <div>
                      <span className="text-slate-400">Model Confidence:</span>
                      <span className="font-bold text-white ml-2">{result.confidenceScore}%</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400">Physiological heart age:</span>
                      <span className={`font-bold ml-2 ${result.heartAgeDiff > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {result.heartAge} yrs
                      </span>
                    </div>
                  </div>
                </div>

                {/* Calculators Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Health Score Circular bar */}
                  <div className="glass-card p-4 flex flex-col items-center justify-center relative min-h-[140px]">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle cx="40" cy="40" r="32" className="stroke-white/5 fill-transparent" strokeWidth="6" />
                      <circle 
                        cx="40" 
                        cy="40" 
                        r="32" 
                        className="stroke-health-500 fill-transparent" 
                        strokeWidth="6" 
                        strokeDasharray={2 * Math.PI * 32}
                        strokeDashoffset={2 * Math.PI * 32 * (1 - result.healthScore / 100)} 
                        strokeLinecap="round" 
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center mt-2">
                      <span className="text-lg font-black text-white">{result.healthScore}</span>
                      <span className="text-[9px] uppercase text-slate-400">Health Score</span>
                    </div>
                  </div>

                  {/* Heart Age Card */}
                  <div className="glass-card p-4 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Heart Age Offset</p>
                    <p className={`text-2xl font-black ${result.heartAgeDiff > 0 ? 'text-red-400' : result.heartAgeDiff === 0 ? 'text-white' : 'text-green-400'}`}>
                      {result.heartAgeDiff > 0 ? `+${result.heartAgeDiff}` : result.heartAgeDiff} yrs
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">vs actual age of {formData.age}</p>
                  </div>

                  {/* BMI Card */}
                  <div className="glass-card p-4 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Body Mass Index</p>
                    <p className="text-2xl font-black text-white">{result.bmi}</p>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-white/5 text-slate-300 uppercase mt-1">
                      {result.bmiCategory}
                    </span>
                  </div>
                </div>

                {/* SHAP Importance Feature Bar Chart */}
                {result.feature_importance && (
                  <div className="glass-card p-6">
                    <h4 className="text-sm uppercase tracking-wider font-bold mb-4 flex items-center gap-2 text-white">
                      <BarChart3 className="w-4 h-4 text-health-500" />
                      AI SHAP Feature Importance
                    </h4>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={result.feature_importance}>
                          <XAxis type="number" hide />
                          <YAxis dataKey="feature" type="category" width={80} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                            itemStyle={{ color: '#0ea5e9' }}
                          />
                          <Bar dataKey="importance">
                            {result.feature_importance.map((entry, index) => (
                              <Cell key={index} fill={entry.importance > 0 ? '#ef4444' : '#10b981'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 italic">
                      Red bars indicate factors increasing risk, green bars indicate factors decreasing risk.
                    </p>
                  </div>
                )}

                {/* Diagnostic explanation */}
                <div className="glass-card p-6">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <Info className="w-4 h-4 text-health-500" /> AI-Generated Explanation
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed font-light">{result.explanation}</p>
                </div>

                {/* Recommendations */}
                <div className="glass-card p-6">
                  <h4 className="font-bold text-white mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-health-500" /> Customized Health Guidelines
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="flex gap-2 items-start font-light leading-relaxed">
                        <ChevronRight className="w-4 h-4 text-health-500 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* PDF & Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleDownloadPDF}
                    className="flex-1 py-3 px-6 bg-slate-900 border border-white/10 hover:bg-slate-800 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 text-white cursor-pointer shadow-md"
                  >
                    <FileDown className="w-4 h-4" /> Download PDF Clinical Report
                  </button>
                </div>

                {/* Disclaimer */}
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg flex gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-200/80 leading-relaxed italic">{result.disclaimer}</p>
                </div>
              </motion.div>
            )}

            {!result && !loading && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full min-h-[500px] text-slate-500 border-2 border-dashed border-white/5 rounded-3xl p-12 text-center"
              >
                <Brain className="w-16 h-16 mb-4 opacity-20" />
                <h3 className="text-lg font-bold text-white mb-2">Awaiting Clinical Data</h3>
                <p className="font-light">Complete the form and click "Analyze Clinical Data" to run the machine learning models and view the advanced SHAP feature breakdown here.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange, step = "1" }) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1 font-bold uppercase">{label}</label>
      <input 
        type="number" 
        name={name} 
        value={value} 
        onChange={onChange} 
        step={step} 
        required
        className="w-full bg-slate-900/50 border border-white/10 rounded-lg py-3 px-4 focus:ring-2 focus:ring-health-500 outline-none transition-all text-white" 
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1 font-bold uppercase">{label}</label>
      <select 
        name={name} 
        value={value} 
        onChange={onChange} 
        className="w-full bg-slate-900/50 border border-white/10 rounded-lg py-3 px-4 focus:ring-2 focus:ring-health-500 outline-none transition-all"
      >
        {options.map((opt, i) => <option key={i} value={i}>{opt}</option>)}
      </select>
    </div>
  );
}
