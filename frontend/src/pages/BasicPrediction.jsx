import React, { useState } from 'react';
import axios from 'axios';
import { Activity, AlertCircle, CheckCircle2, ChevronRight, Info, FileDown, Heart, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  calculateBMI, 
  calculateHeartAge, 
  calculateHealthScore, 
  generateRecommendations, 
  generateAIExplanation 
} from '../lib/healthCalculator';
import { generatePDFReport } from '../lib/pdfGenerator';

export default function BasicPrediction() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    age: 45,
    gender: 1,
    height_cm: 170,
    weight_kg: 70,
    smoking: 0,
    alcohol: 0,
    exercise: 1,
    sleep_hours: 7,
    stress_level: 1,
    family_history: 0,
    chest_pain_freq: 0,
    palpitations: 0,
    daily_activity: 1
  });

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    // Multi-step loading messages
    const steps = [
      "Analyzing patient lifestyle details...",
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
      const response = await axios.post(`${apiUrl}/api/predict/basic`, {
        ...formData,
        user_id: null
      });

      // Wait a minimum time to let user view loading states
      await new Promise(resolve => setTimeout(resolve, 3200));

      const apiResult = response.data;

      // Local calculations
      const bmiMetrics = calculateBMI(formData.height_cm, formData.weight_kg);
      const heartAgeMetrics = calculateHeartAge(formData.age, formData.gender, formData, "Basic", apiResult.risk_percentage);
      const healthScore = calculateHealthScore(formData, "Basic", apiResult.risk_percentage);
      const customRecs = generateRecommendations(formData, "Basic");
      
      // Determine Risk Level
      let riskLevel = "Low";
      if (apiResult.risk_percentage > 70) riskLevel = "High";
      else if (apiResult.risk_percentage > 35) riskLevel = "Medium";

      // Confidence formula: 70 + abs(risk_percentage - 50) * 0.56
      const confidenceScore = Math.round(70 + Math.abs(apiResult.risk_percentage - 50) * 0.56);

      const explanation = generateAIExplanation(formData, "Basic", apiResult.risk_percentage, riskLevel);

      const reportId = `REP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const newRecord = {
        id: reportId,
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        mode: "Basic Checkup",
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
        inputs: formData,
        disclaimer: "This prediction is generated using a machine learning model and is intended only for educational purposes. It is not a substitute for professional medical advice."
      };

      setResult(newRecord);

      // Persist to local history specific to logged-in user
      if (user?.uid) {
        const historyKey = `cardio_history_${user.uid}`;
        const existingHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
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
        <Activity className="text-health-500" />
        Basic Heart Risk Checkup
      </h1>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-xl font-semibold border-b border-white/10 pb-2 mb-4">Personal Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Age (Years)</label>
                <input 
                  type="number" 
                  name="age" 
                  min="1" 
                  max="120" 
                  value={formData.age} 
                  onChange={handleChange} 
                  required
                  className="w-full bg-slate-900/50 rounded-lg py-3 px-4 border border-white/10 focus:ring-2 focus:ring-health-500 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Gender</label>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange} 
                  className="w-full bg-slate-900/50 rounded-lg py-3 px-4 border border-white/10 focus:ring-2 focus:ring-health-500 outline-none transition-all"
                >
                  <option value={1}>Male</option>
                  <option value={0}>Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Height (cm)</label>
                <input 
                  type="number" 
                  name="height_cm" 
                  min="50" 
                  max="250"
                  value={formData.height_cm} 
                  onChange={handleChange} 
                  required
                  className="w-full bg-slate-900/50 rounded-lg py-3 px-4 border border-white/10 focus:ring-2 focus:ring-health-500 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Weight (kg)</label>
                <input 
                  type="number" 
                  name="weight_kg" 
                  min="10" 
                  max="300"
                  value={formData.weight_kg} 
                  onChange={handleChange} 
                  required
                  className="w-full bg-slate-900/50 rounded-lg py-3 px-4 border border-white/10 focus:ring-2 focus:ring-health-500 outline-none transition-all" 
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h2 className="text-xl font-semibold border-b border-white/10 pb-2 mb-4">Lifestyle Factors</h2>
            <div className="space-y-4">
              <SelectGroup label="Smoking Habit" name="smoking" value={formData.smoking} onChange={handleChange} options={["Non-smoker", "Occasional", "Frequent"]} />
              <SelectGroup label="Alcohol Consumption" name="alcohol" value={formData.alcohol} onChange={handleChange} options={["None", "Occasional", "Frequent"]} />
              <SelectGroup label="Exercise Frequency" name="exercise" value={formData.exercise} onChange={handleChange} options={["Rarely / Sedentary", "1-3 times/week", "4+ times/week"]} />
              <SelectGroup label="Stress Level" name="stress_level" value={formData.stress_level} onChange={handleChange} options={["Low Stress", "Moderate", "High Chronic Stress"]} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-health-600 hover:bg-health-700 disabled:bg-health-800 rounded-xl font-bold text-lg transition-all shadow-lg shadow-health-500/20 text-white cursor-pointer"
          >
            {loading ? "Analyzing..." : "Calculate Heart Risk"}
          </button>
        </form>

        {/* Results / Loading Section */}
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
                  <p className="text-xl font-bold text-white">Analyzing Diagnostic Details</p>
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

                {/* PDF & Disclaimer Actions */}
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
                <Activity className="w-16 h-16 mb-4 opacity-20" />
                <p className="font-light">Complete the form and click "Calculate Heart Risk" to run the machine learning model and view the clinical breakdown here.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function SelectGroup({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm text-slate-400 mb-1">{label}</label>
      <select 
        name={name} 
        value={value} 
        onChange={onChange} 
        className="w-full bg-slate-900/50 rounded-lg py-3 px-4 border border-white/10 focus:ring-2 focus:ring-health-500 outline-none transition-all"
      >
        {options.map((opt, i) => <option key={i} value={i}>{opt}</option>)}
      </select>
    </div>
  );
}
