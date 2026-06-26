import React, { useState } from 'react';
import axios from 'axios';
import { MessageSquare, Send, Bot, AlertTriangle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SymptomAnalyzer() {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const response = await axios.post(`${apiUrl}/api/analyze/symptoms`, { symptoms });
      setAnalysis(response.data);
    } catch (error) {
      alert("Analysis failed. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-health-500/20 rounded-2xl">
          <Bot className="w-8 h-8 text-health-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">AI Symptom Analyzer</h1>
          <p className="text-slate-400">Describe how you feel in plain English.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3 space-y-6">
          <div className="glass-card p-6">
            <label className="block text-sm font-bold mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Your Description
            </label>
            <textarea 
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g., I feel sharp chest pain when walking and my heart beats very fast..."
              className="w-full h-48 bg-slate-900/50 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-health-500 outline-none resize-none"
            />
            <button 
              onClick={handleAnalyze}
              disabled={loading || !symptoms}
              className="mt-4 w-full py-4 bg-health-600 hover:bg-health-700 disabled:opacity-50 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              {loading ? "Analyzing..." : <>Analyze Symptoms <Send className="w-4 h-4" /></>}
            </button>
          </div>

          <div className="bg-slate-900/30 p-6 rounded-2xl border border-white/5 italic text-slate-400 text-sm">
            Example: "I've been feeling dizzy lately and noticed swelling in my ankles after standing for a long time. Sometimes I get shortness of breath."
          </div>
        </div>

        <div className="md:col-span-2">
          {analysis ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div className={`glass-card p-6 border-l-4 ${analysis.estimated_risk_level === 'High' ? 'border-red-500' : analysis.estimated_risk_level === 'Medium' ? 'border-yellow-500' : 'border-green-500'}`}>
                <h3 className="text-slate-400 text-xs font-bold uppercase mb-1">Estimated Risk Level</h3>
                <p className={`text-3xl font-black ${analysis.estimated_risk_level === 'High' ? 'text-red-500' : analysis.estimated_risk_level === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`}>
                  {analysis.estimated_risk_level} Risk
                </p>
                
                {analysis.detected_symptoms.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-slate-500 mb-2">Detected Indicators:</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.detected_symptoms.map((s, i) => (
                        <span key={i} className="px-2 py-1 bg-white/5 rounded text-xs border border-white/10 capitalize">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="glass-card p-6 bg-health-500/5 border-health-500/20">
                <h3 className="font-bold mb-4">Suggested Next Steps:</h3>
                <div className="space-y-3">
                  {analysis.next_steps.map((step, i) => (
                    <div key={i} className="flex gap-3 text-sm text-slate-300">
                      <ArrowRight className="w-4 h-4 text-health-500 shrink-0 mt-0.5" />
                      <p>{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-[10px] text-red-200/60 leading-tight italic">{analysis.disclaimer}</p>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-600 border-2 border-dashed border-white/5 rounded-3xl">
              <Bot className="w-12 h-12 mb-4 opacity-10" />
              <p>Your analysis will appear here after description.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
