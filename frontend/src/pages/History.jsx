import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { History as HistoryIcon, Trash2, FileDown, ShieldAlert, GitCompare, ChevronRight, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generatePDFReport } from '../lib/pdfGenerator';

export default function History() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  
  // Comparison state
  const [compareIdA, setCompareIdA] = useState("");
  const [compareIdB, setCompareIdB] = useState("");

  useEffect(() => {
    if (user?.uid) {
      const historyKey = `cardio_history_${user.uid}`;
      const savedHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
      setHistory(savedHistory);
    }
  }, [user]);

  const handleDeleteItem = (id) => {
    if (!window.confirm("Are you sure you want to delete this specific assessment record?")) return;
    const historyKey = `cardio_history_${user.uid}`;
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem(historyKey, JSON.stringify(updated));
    // Clear comparison selection if deleted
    if (compareIdA === id) setCompareIdA("");
    if (compareIdB === id) setCompareIdB("");
  };

  const handleClearHistory = () => {
    if (!window.confirm("WARNING: This will permanently delete your entire local assessment history. This action cannot be undone. Proceed?")) return;
    const historyKey = `cardio_history_${user.uid}`;
    setHistory([]);
    localStorage.removeItem(historyKey);
    setCompareIdA("");
    setCompareIdB("");
  };

  const handleDownloadPDF = (record) => {
    const name = user?.displayName || user?.email?.split('@')[0] || "Guest Patient";
    generatePDFReport(name, record);
  };

  // Get selected comparison items
  const recordA = history.find(r => r.id === compareIdA);
  const recordB = history.find(r => r.id === compareIdB);

  // Helper to compare values
  const getDiffText = (valA, valB, lowerIsBetter = true) => {
    const diff = Number((valB - valA).toFixed(1));
    if (diff === 0) return { text: "No change", color: "text-slate-400" };
    
    const isImproved = lowerIsBetter ? diff < 0 : diff > 0;
    const sign = diff > 0 ? "+" : "";
    return {
      text: `${sign}${diff}`,
      color: isImproved ? "text-green-400 font-bold" : "text-red-400 font-bold",
      isImproved
    };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <HistoryIcon className="text-health-500" />
            Prediction Assessment History
          </h1>
          <p className="text-slate-400 text-sm mt-1">Review, delete, and compare side-by-side details of your past health runs.</p>
        </div>
        {history.length > 0 && (
          <button 
            onClick={handleClearHistory}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All History
          </button>
        )}
      </div>

      {/* Prediction Comparison Widget */}
      {history.length >= 2 && (
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-md font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
            <GitCompare className="w-4.5 h-4.5 text-rose-500" /> Compare Health Reports
          </h3>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Select First Report (Base)</label>
              <select 
                className="w-full bg-[#0f172a]/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-rose-500 transition-colors"
                value={compareIdA}
                onChange={(e) => setCompareIdA(e.target.value)}
              >
                <option value="">-- Choose Report A --</option>
                {history.map(h => (
                  <option key={h.id} value={h.id}>{h.date} - {h.mode} ({h.riskLevel})</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Select Second Report (Comparison)</label>
              <select 
                className="w-full bg-[#0f172a]/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-rose-500 transition-colors"
                value={compareIdB}
                onChange={(e) => setCompareIdB(e.target.value)}
              >
                <option value="">-- Choose Report B --</option>
                {history.map(h => (
                  <option key={h.id} value={h.id}>{h.date} - {h.mode} ({h.riskLevel})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison results */}
          <AnimatePresence>
            {recordA && recordB && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden border-t border-white/5 pt-4 mt-4"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-500 font-bold">
                        <th className="pb-2">Clinical Metric</th>
                        <th className="pb-2">Report A (Base)</th>
                        <th className="pb-2">Report B (Comparison)</th>
                        <th className="pb-2 text-right">Progress / Difference</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/5">
                        <td className="py-2.5 font-bold text-white">Assessment Date</td>
                        <td className="py-2.5 text-slate-300">{recordA.date}</td>
                        <td className="py-2.5 text-slate-300">{recordB.date}</td>
                        <td className="py-2.5 text-right text-slate-400 font-semibold">-</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-2.5 font-bold text-white">Health Score</td>
                        <td className="py-2.5 text-emerald-400 font-bold">{recordA.healthScore} / 100</td>
                        <td className="py-2.5 text-emerald-400 font-bold">{recordB.healthScore} / 100</td>
                        <td className={`py-2.5 text-right ${getDiffText(recordA.healthScore, recordB.healthScore, false).color}`}>
                          {getDiffText(recordA.healthScore, recordB.healthScore, false).text} pts
                        </td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-2.5 font-bold text-white">Risk Probability</td>
                        <td className="py-2.5 text-rose-400 font-bold">{recordA.riskPercentage}%</td>
                        <td className="py-2.5 text-rose-400 font-bold">{recordB.riskPercentage}%</td>
                        <td className={`py-2.5 text-right ${getDiffText(recordA.riskPercentage, recordB.riskPercentage, true).color}`}>
                          {getDiffText(recordA.riskPercentage, recordB.riskPercentage, true).text}%
                        </td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-2.5 font-bold text-white">Body Mass Index (BMI)</td>
                        <td className="py-2.5 text-slate-300">{recordA.bmi} ({recordA.bmiCategory})</td>
                        <td className="py-2.5 text-slate-300">{recordB.bmi} ({recordB.bmiCategory})</td>
                        <td className={`py-2.5 text-right ${getDiffText(recordA.bmi, recordB.bmi, true).color}`}>
                          {getDiffText(recordA.bmi, recordB.bmi, true).text}
                        </td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-2.5 font-bold text-white">Estimated Heart Age</td>
                        <td className="py-2.5 text-slate-300">{recordA.heartAge} yrs</td>
                        <td className="py-2.5 text-slate-300">{recordB.heartAge} yrs</td>
                        <td className={`py-2.5 text-right ${getDiffText(recordA.heartAge, recordB.heartAge, true).color}`}>
                          {getDiffText(recordA.heartAge, recordB.heartAge, true).text} yrs
                        </td>
                      </tr>
                      {recordA.inputs?.trestbps !== undefined && recordB.inputs?.trestbps !== undefined && (
                        <tr className="border-b border-white/5">
                          <td className="py-2.5 font-bold text-white">Resting Blood Pressure</td>
                          <td className="py-2.5 text-slate-300">{recordA.inputs.trestbps} mm Hg</td>
                          <td className="py-2.5 text-slate-300">{recordB.inputs.trestbps} mm Hg</td>
                          <td className={`py-2.5 text-right ${getDiffText(recordA.inputs.trestbps, recordB.inputs.trestbps, true).color}`}>
                            {getDiffText(recordA.inputs.trestbps, recordB.inputs.trestbps, true).text} mm Hg
                          </td>
                        </tr>
                      )}
                      {recordA.inputs?.chol !== undefined && recordB.inputs?.chol !== undefined && (
                        <tr className="border-b border-white/5">
                          <td className="py-2.5 font-bold text-white">Serum Cholesterol</td>
                          <td className="py-2.5 text-slate-300">{recordA.inputs.chol} mg/dl</td>
                          <td className="py-2.5 text-slate-300">{recordB.inputs.chol} mg/dl</td>
                          <td className={`py-2.5 text-right ${getDiffText(recordA.inputs.chol, recordB.inputs.chol, true).color}`}>
                            {getDiffText(recordA.inputs.chol, recordB.inputs.chol, true).text} mg/dl
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* History table */}
      <AnimatePresence mode="wait">
        {history.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card p-12 text-center text-slate-500 flex flex-col items-center justify-center min-h-[300px]"
          >
            <HistoryIcon className="w-16 h-16 opacity-20 mb-4" />
            <h3 className="text-xl font-bold text-white mb-1">No History Records Found</h3>
            <p className="text-sm text-slate-400 max-w-md font-light leading-relaxed">
              You haven't run any health prediction checkups yet. Go to Heart Prediction in the sidebar to run your first check!
            </p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-6 animate-fade-in"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 text-slate-500 text-sm">
                    <th className="pb-4 font-bold">Report ID</th>
                    <th className="pb-4 font-bold">Date & Time</th>
                    <th className="pb-4 font-bold">Patient Name</th>
                    <th className="pb-4 font-bold">Risk Level</th>
                    <th className="pb-4 font-bold">Health Score</th>
                    <th className="pb-4 font-bold">BMI</th>
                    <th className="pb-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {history.map((record) => {
                    const patientName = user?.displayName || user?.email?.split('@')[0] || "Guest Patient";
                    return (
                      <tr key={record.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                        <td className="py-4 text-slate-400 font-mono text-[11px]">#{String(record.id).slice(-6).toUpperCase()}</td>
                        <td className="py-4 text-slate-300 font-medium">{record.date}</td>
                        <td className="py-4 text-white font-semibold">{patientName}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${record.riskLevel === 'High' ? 'bg-red-500/20 text-red-500 border border-red-500/10' : record.riskLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/10' : 'bg-green-500/20 text-green-500 border border-green-500/10'}`}>
                            {record.riskLevel} ({record.riskPercentage}%)
                          </span>
                        </td>
                        <td className="py-4 font-bold text-health-500">{record.healthScore}/100</td>
                        <td className="py-4 font-semibold text-white">{record.bmi} ({record.bmiCategory})</td>
                        <td className="py-4 text-right">
                          <div className="flex justify-end items-center gap-2">
                            <Link 
                              to={`/reports/view/${record.id}`}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm"
                            >
                              View Report
                            </Link>
                            <button 
                              onClick={() => handleDownloadPDF(record)}
                              className="p-2 bg-slate-900 border border-white/10 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
                              title="Download PDF"
                            >
                              <FileDown className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteItem(record.id)}
                              className="p-2 bg-red-500/10 border border-red-500/10 hover:bg-red-500 hover:border-red-500 rounded-lg text-red-400 hover:text-white transition-colors cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl flex gap-3 shadow-sm max-w-3xl">
        <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-200/80 leading-relaxed font-light">
          <strong>Privacy Note:</strong> Your diagnostic history is kept locally on this device's memory for maximum privacy. It is never synced to external databases or exposed. Clearing browser cookies or cache may remove local history records.
        </p>
      </div>
    </div>
  );
}
