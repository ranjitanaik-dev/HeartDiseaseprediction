import React, { useState } from 'react';
import axios from 'axios';
import { Activity, AlertCircle, Info, Database, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function AdvancedPrediction() {
  const [formData, setFormData] = useState({
    age: 55, sex: 1, cp: 0, trestbps: 120, chol: 200, fbs: 0,
    restecg: 0, thalach: 150, exang: 0, oldpeak: 1.0, slope: 1, ca: 0, thal: 2
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const response = await axios.post(`${apiUrl}/api/predict/advanced`, formData);
      setResult(response.data);
    } catch (error) {
      console.error("Advanced prediction error", error);
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
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Database className="text-health-500" />
        Advanced Clinical Analysis
      </h1>

      <div className="grid lg:grid-cols-2 gap-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <h2 className="col-span-1 sm:col-span-2 text-xl font-semibold border-b border-white/10 pb-2 mb-2">Patient Bio-Markers</h2>
            <InputField label="Age" name="age" value={formData.age} onChange={handleChange} />
            <SelectField label="Sex" name="sex" value={formData.sex} onChange={handleChange} options={["Female", "Male"]} />
            <SelectField label="Chest Pain Type" name="cp" value={formData.cp} onChange={handleChange} options={["Typical Angina", "Atypical Angina", "Non-anginal Pain", "Asymptomatic"]} />
            <InputField label="Resting BP (mm Hg)" name="trestbps" value={formData.trestbps} onChange={handleChange} />
            <InputField label="Serum Cholestoral (mg/dl)" name="chol" value={formData.chol} onChange={handleChange} />
            <SelectField label="Fasting Blood Sugar > 120" name="fbs" value={formData.fbs} onChange={handleChange} options={["False", "True"]} />
            <SelectField label="Resting ECG Results" name="restecg" value={formData.restecg} onChange={handleChange} options={["Normal", "ST-T Wave Abnormality", "Left Ventricular Hypertrophy"]} />
            <InputField label="Max Heart Rate" name="thalach" value={formData.thalach} onChange={handleChange} />
            <SelectField label="Exercise Induced Angina" name="exang" value={formData.exang} onChange={handleChange} options={["No", "Yes"]} />
            <InputField label="Oldpeak (ST Depression)" name="oldpeak" value={formData.oldpeak} onChange={handleChange} step="0.1" />
            <SelectField label="Slope of Peak Exercise ST" name="slope" value={formData.slope} onChange={handleChange} options={["Upsloping", "Flat", "Downsloping"]} />
            <InputField label="Number of Major Vessels (0-4)" name="ca" value={formData.ca} onChange={handleChange} />
            <SelectField label="Thalassemia" name="thal" value={formData.thal} onChange={handleChange} options={["Normal", "Fixed Defect", "Reversible Defect", "Unknown"]} />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-health-600 hover:bg-health-700 disabled:bg-health-800 rounded-xl font-bold text-lg transition-all"
          >
            {loading ? "Running AI Models..." : "Analyze Clinical Data"}
          </button>
        </form>

        <div className="space-y-6">
          <AnimatePresence>
            {result ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className={`glass-card p-8 border-t-8 ${result.risk_percentage > 50 ? 'border-t-red-500' : 'border-t-green-500'}`}>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">{result.prediction_result}</h3>
                    <div className="text-right">
                      <p className="text-slate-400 text-sm uppercase">Probability</p>
                      <p className="text-3xl font-black text-health-500">{result.risk_percentage}%</p>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 p-6 rounded-2xl">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-health-500" />
                      AI Explanation (SHAP Importance)
                    </h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={result.feature_importance}>
                          <XAxis type="number" hide />
                          <YAxis dataKey="feature" type="category" width={100} tick={{ fontSize: 12, fill: '#94a3b8' }} />
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
                    <p className="text-xs text-slate-500 mt-4 italic">
                      Red bars indicate factors increasing risk, green bars indicate factors decreasing risk.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="glass-card p-12 h-full flex flex-col items-center justify-center text-center text-slate-500 opacity-50">
                <Brain className="w-20 h-20 mb-4" />
                <h3 className="text-xl font-bold">Awaiting Clinical Data</h3>
                <p>The AI models will analyze 13 bio-markers to provide a high-precision probability score.</p>
              </div>
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
      <label className="block text-xs text-slate-500 mb-1 font-bold uppercase">{label}</label>
      <input type="number" name={name} value={value} onChange={onChange} step={step} className="w-full bg-slate-900/50 border border-white/5 rounded-lg py-3 px-4 focus:border-health-500 transition-colors outline-none" />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs text-slate-500 mb-1 font-bold uppercase">{label}</label>
      <select name={name} value={value} onChange={onChange} className="w-full bg-slate-900/50 border border-white/5 rounded-lg py-3 px-4 focus:border-health-500 outline-none">
        {options.map((opt, i) => <option key={i} value={i}>{opt}</option>)}
      </select>
    </div>
  );
}

import { Brain } from 'lucide-react';
