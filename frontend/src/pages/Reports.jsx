import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FileText, FileDown, FileCheck, Search, Filter, ShieldCheck, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generatePDFReport } from '../lib/pdfGenerator';

export default function Reports() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  
  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("all"); // "all", "today", "week", "month"
  const [riskFilter, setRiskFilter] = useState("all"); // "all", "high", "medium", "low"

  // Load history
  useEffect(() => {
    if (user?.uid) {
      const historyKey = `cardio_history_${user.uid}`;
      const savedHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
      setHistory(savedHistory);
      setFilteredHistory(savedHistory);
    }
  }, [user]);

  // Connect to Top Header Quick Search event listener
  useEffect(() => {
    const handleQuickSearch = () => {
      const q = localStorage.getItem('quick_search_query') || "";
      setSearchQuery(q);
    };
    
    // Check initial search value in local storage
    const initialQ = localStorage.getItem('quick_search_query');
    if (initialQ) {
      setSearchQuery(initialQ);
    }

    window.addEventListener('quick_search_updated', handleQuickSearch);
    return () => window.removeEventListener('quick_search_updated', handleQuickSearch);
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = [...history];

    // 1. Text Search Query (Report ID, Date, Method, Risk Level)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.id.toLowerCase().includes(q) ||
        item.date.toLowerCase().includes(q) ||
        item.mode.toLowerCase().includes(q) ||
        item.riskLevel.toLowerCase().includes(q)
      );
    }

    // 2. Risk Level Filter
    if (riskFilter !== "all") {
      result = result.filter(item => item.riskLevel.toLowerCase() === riskFilter);
    }

    // 3. Time Filter
    if (timeFilter !== "all") {
      const now = new Date();
      result = result.filter(item => {
        const itemDate = new Date(item.date);
        const diffTime = Math.abs(now - itemDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (timeFilter === "today") {
          return itemDate.toDateString() === now.toDateString();
        } else if (timeFilter === "week") {
          return diffDays <= 7;
        } else if (timeFilter === "month") {
          return diffDays <= 30;
        }
        return true;
      });
    }

    setFilteredHistory(result);
  }, [history, searchQuery, timeFilter, riskFilter]);

  const handleDownloadPDF = (record) => {
    const name = user?.displayName || user?.email?.split('@')[0] || "Guest Patient";
    generatePDFReport(name, record);
  };

  // Export full history log as CSV
  const handleExportCSV = () => {
    if (history.length === 0) return;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Report ID,Date,Method,Risk Level,Risk Percentage,Health Score,BMI,Heart Age\n";
    
    history.forEach(r => {
      csvContent += `"${r.id}","${r.date}","${r.mode}","${r.riskLevel}","${r.riskPercentage}%","${r.healthScore}","${r.bmi}","${r.heartAge}"\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CardioSense_ReportLog_${user.uid.slice(-6)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <FileText className="text-health-500" />
            Clinical Reports Browser
          </h1>
          <p className="text-slate-400 text-sm mt-1">Search, filter, and export patient cardiovascular test records.</p>
        </div>
        {history.length > 0 && (
          <button 
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/25 text-emerald-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export All (CSV)
          </button>
        )}
      </div>

      {/* Advanced Filter Widgets */}
      <div className="glass-card p-6 grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-2">Search Input</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search ID, date, risk..." 
              className="w-full bg-[#0f172a]/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-2">Time Horizon</label>
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
            {["all", "today", "week", "month"].map((t) => (
              <button 
                key={t}
                onClick={() => setTimeFilter(t)}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all uppercase text-[9px] ${timeFilter === t ? 'bg-health-500 text-white shadow-sm' : 'text-slate-450 hover:text-white'}`}
              >
                {t === 'week' ? '7 Days' : t === 'month' ? '30 Days' : t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-2">Risk Stratum</label>
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
            {["all", "high", "medium", "low"].map((r) => (
              <button 
                key={r}
                onClick={() => setRiskFilter(r)}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all uppercase text-[9px] ${riskFilter === r ? 'bg-health-500 text-white shadow-sm' : 'text-slate-450 hover:text-white'}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <AnimatePresence mode="wait">
        {filteredHistory.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card p-12 text-center text-slate-500 flex flex-col items-center justify-center min-h-[300px]"
          >
            <FileText className="w-16 h-16 opacity-20 mb-4" />
            <h3 className="text-xl font-bold text-white mb-1">No Matching Reports</h3>
            <p className="text-sm text-slate-400 max-w-md font-light leading-relaxed">
              No reports match your current filter criteria. Reset the search query or risk filters to view your history list.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredHistory.map((record) => (
              <div 
                key={record.id} 
                className="glass-card p-5 flex flex-col justify-between hover:border-rose-500/20 transition-all shadow-md group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-500/10 rounded-xl text-rose-500 border border-rose-500/20">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs leading-tight">{record.mode}</h4>
                      <p className="text-[9px] text-slate-400 mt-1">ID: #{record.id.slice(-6)} • {record.date.split(' ')[0]}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase border ${record.riskLevel === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' : record.riskLevel === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-green-500/10 text-emerald-400 border-green-500/20'}`}>
                    {record.riskLevel}
                  </span>
                </div>

                <div className="border-t border-b border-white/5 py-2.5 my-2.5 grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div>
                    <p className="text-slate-400 font-bold uppercase text-[8px]">Health Score</p>
                    <p className="font-bold text-emerald-400 mt-0.5">{record.healthScore}/100</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-bold uppercase text-[8px]">BMI Index</p>
                    <p className="font-bold text-white mt-0.5">{record.bmi}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-bold uppercase text-[8px]">Heart Age</p>
                    <p className="font-bold text-white mt-0.5">{record.heartAge} yrs</p>
                  </div>
                </div>

                <button 
                  onClick={() => handleDownloadPDF(record)}
                  className="w-full mt-1.5 py-2.5 bg-slate-900 border border-white/10 hover:bg-slate-800 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
                >
                  <FileDown className="w-3.5 h-3.5 text-rose-500" /> Export PDF Report
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex gap-3 text-xs text-slate-400 leading-relaxed max-w-3xl">
        <ShieldCheck className="w-5 h-5 text-health-500 shrink-0 mt-0.5" />
        <span><strong>Export Advice:</strong> Downloading history files allows you to safely save and share your predictive cardiac timeline statistics with medical practitioners.</span>
      </div>

    </div>
  );
}
