import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { History as HistoryIcon, Trash2, FileDown, Sparkles, AlertCircle, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generatePDFReport } from '../lib/pdfGenerator';

export default function History() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);

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
  };

  const handleClearHistory = () => {
    if (!window.confirm("WARNING: This will permanently delete your entire local assessment history. This action cannot be undone. Proceed?")) return;
    const historyKey = `cardio_history_${user.uid}`;
    setHistory([]);
    localStorage.removeItem(historyKey);
  };

  const handleDownloadPDF = (record) => {
    const name = user?.displayName || user?.email?.split('@')[0] || "Guest Patient";
    generatePDFReport(name, record);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <HistoryIcon className="text-health-500" />
            Prediction Assessment History
          </h1>
          <p className="text-slate-400 text-sm mt-1">Review, delete, and download PDF reports of your past health runs.</p>
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
            className="glass-card p-6"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 text-slate-500 text-sm">
                    <th className="pb-4 font-bold">Date & Time</th>
                    <th className="pb-4 font-bold">Method</th>
                    <th className="pb-4 font-bold">Risk Level</th>
                    <th className="pb-4 font-bold">Health Score</th>
                    <th className="pb-4 font-bold">BMI</th>
                    <th className="pb-4 font-bold">Heart Age Offset</th>
                    <th className="pb-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {history.map((record) => (
                    <tr key={record.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                      <td className="py-4 text-slate-300 font-medium">{record.date}</td>
                      <td className="py-4 font-semibold text-white">{record.mode}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${record.riskLevel === 'High' ? 'bg-red-500/20 text-red-500 border border-red-500/10' : record.riskLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/10' : 'bg-green-500/20 text-green-500 border border-green-500/10'}`}>
                          {record.riskLevel} ({record.riskPercentage}%)
                        </span>
                      </td>
                      <td className="py-4 font-bold text-health-500">{record.healthScore}/100</td>
                      <td className="py-4 font-semibold text-white">{record.bmi} ({record.bmiCategory})</td>
                      <td className="py-4">
                        <span className={`font-semibold ${record.heartAgeDiff > 0 ? 'text-red-400' : record.heartAgeDiff === 0 ? 'text-slate-300' : 'text-green-400'}`}>
                          {record.heartAgeDiff > 0 ? `+${record.heartAgeDiff}` : record.heartAgeDiff} yrs
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
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
                  ))}
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
