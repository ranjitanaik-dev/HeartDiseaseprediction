import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FileText, FileDown, FileCheck, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generatePDFReport } from '../lib/pdfGenerator';

export default function Reports() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (user?.uid) {
      const historyKey = `cardio_history_${user.uid}`;
      const savedHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
      setHistory(savedHistory);
    }
  }, [user]);

  const handleDownloadPDF = (record) => {
    const name = user?.displayName || user?.email?.split('@')[0] || "Guest Patient";
    generatePDFReport(name, record);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <FileText className="text-health-500" />
          Clinical Reports Center
        </h1>
        <p className="text-slate-400 text-sm mt-1">Export, review, or print clinical PDF reports of your cardiac diagnostic test runs.</p>
      </div>

      <AnimatePresence mode="wait">
        {history.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card p-12 text-center text-slate-500 flex flex-col items-center justify-center min-h-[300px]"
          >
            <FileText className="w-16 h-16 opacity-20 mb-4" />
            <h3 className="text-xl font-bold text-white mb-1">No Printable Reports</h3>
            <p className="text-sm text-slate-400 max-w-md font-light leading-relaxed">
              No reports are available because you haven't completed any cardiac assessments yet. Run a prediction to automatically compile a clinical PDF report.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {history.map((record) => (
              <div 
                key={record.id} 
                className="glass-card p-6 flex flex-col justify-between hover:border-rose-500/20 transition-all shadow-md group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-rose-500/10 rounded-xl text-rose-500 border border-rose-500/20">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white leading-tight">{record.mode} Report</h4>
                      <p className="text-[10px] text-slate-400 mt-1">Ref ID: #{record.id.slice(-6)} • Date: {record.date.split(' ')[0]}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${record.riskLevel === 'High' ? 'bg-red-500/20 text-red-500 border border-red-500/10' : record.riskLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/10' : 'bg-green-500/20 text-green-500 border border-green-500/10'}`}>
                    {record.riskLevel} Risk
                  </span>
                </div>

                <div className="border-t border-b border-white/5 py-3 my-3 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-semibold">Health Score</p>
                    <p className="font-bold text-health-500 mt-0.5">{record.healthScore}/100</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-semibold">BMI Index</p>
                    <p className="font-bold text-white mt-0.5">{record.bmi}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-semibold">Heart Age</p>
                    <p className="font-bold text-white mt-0.5">{record.heartAge} yrs</p>
                  </div>
                </div>

                <button 
                  onClick={() => handleDownloadPDF(record)}
                  className="w-full mt-2 py-2.5 bg-slate-900 border border-white/10 hover:bg-slate-800 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all hover:scale-[1.01]"
                >
                  <FileDown className="w-3.5 h-3.5" /> Download Report PDF
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
