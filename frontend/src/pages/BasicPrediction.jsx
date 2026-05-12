import React, { useState } from 'react';
import axios from 'axios';
import { Activity, AlertCircle, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BasicPrediction() {
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
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/predict/basic', formData);
      setResult(response.data);
    } catch (error) {
      console.error("Prediction error", error);
      alert("Failed to get prediction. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Activity className="text-health-500" />
        Basic Heart Risk Checkup
      </h1>

      <div className="grid md:grid-cols-2 gap-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-xl font-semibold border-b border-white/10 pb-2 mb-4">Personal Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full bg-slate-800 rounded-lg p-2 border border-white/10" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-slate-800 rounded-lg p-2 border border-white/10">
                  <option value={1}>Male</option>
                  <option value={0}>Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Height (cm)</label>
                <input type="number" name="height_cm" value={formData.height_cm} onChange={handleChange} className="w-full bg-slate-800 rounded-lg p-2 border border-white/10" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Weight (kg)</label>
                <input type="number" name="weight_kg" value={formData.weight_kg} onChange={handleChange} className="w-full bg-slate-800 rounded-lg p-2 border border-white/10" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h2 className="text-xl font-semibold border-b border-white/10 pb-2 mb-4">Lifestyle Factors</h2>
            <div className="space-y-4">
              <SelectGroup label="Smoking Habit" name="smoking" value={formData.smoking} onChange={handleChange} options={["Non-smoker", "Occasional", "Frequent"]} />
              <SelectGroup label="Alcohol Consumption" name="alcohol" value={formData.alcohol} onChange={handleChange} options={["None", "Occasional", "Frequent"]} />
              <SelectGroup label="Exercise Frequency" name="exercise" value={formData.exercise} onChange={handleChange} options={["Rarely", "1-3 times/week", "4+ times/week"]} />
              <SelectGroup label="Stress Level" name="stress_level" value={formData.stress_level} onChange={handleChange} options={["Low", "Moderate", "High"]} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-health-600 hover:bg-health-700 disabled:bg-health-800 rounded-xl font-bold text-lg transition-all shadow-lg shadow-health-500/20"
          >
            {loading ? "Analyzing Data..." : "Calculate Risk"}
          </button>
        </form>

        <AnimatePresence>
          {result ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className={`glass-card p-8 border-l-8 ${result.risk_percentage > 70 ? 'border-l-red-500' : result.risk_percentage > 40 ? 'border-l-yellow-500' : 'border-l-green-500'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm uppercase tracking-widest text-slate-400 font-bold">Estimation Result</h3>
                    <p className="text-4xl font-black">{result.prediction_result}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Risk Score</p>
                    <p className="text-3xl font-bold text-health-500">{result.risk_percentage}%</p>
                  </div>
                </div>
                
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden mb-6">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${result.risk_percentage}%` }}
                    className={`h-full ${result.risk_percentage > 70 ? 'bg-red-500' : result.risk_percentage > 40 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  />
                </div>

                <div className="space-y-4">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="font-bold flex items-center gap-2 mb-2"><Info className="w-4 h-4 text-health-500" /> Possible Causes:</p>
                    <ul className="text-sm text-slate-300 list-disc list-inside">
                      {result.causes.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>
                  <div className="bg-health-500/10 p-4 rounded-lg border border-health-500/20">
                    <p className="font-bold flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 text-health-500" /> Recommendations:</p>
                    <p className="text-sm text-slate-200">{result.recommendations[0]}</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <p className="text-xs text-amber-200/80 italic">{result.disclaimer}</p>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 border-2 border-dashed border-white/5 rounded-3xl p-12 text-center">
              <Activity className="w-16 h-16 mb-4 opacity-20" />
              <p>Complete the form and click "Calculate Risk" to see your results here.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SelectGroup({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm text-slate-400 mb-1">{label}</label>
      <select name={name} value={value} onChange={onChange} className="w-full bg-slate-800 rounded-lg p-2 border border-white/10">
        {options.map((opt, i) => <option key={i} value={i}>{opt}</option>)}
      </select>
    </div>
  );
}
