import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FileText, FileDown, ArrowLeft, Heart, Activity, ShieldCheck, User } from 'lucide-react';
import { generatePDFReport } from '../lib/pdfGenerator';

export default function ReportView() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);

  useEffect(() => {
    if (user?.uid && id) {
      const historyKey = `cardio_history_${user.uid}`;
      const savedHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
      const found = savedHistory.find(r => r.id === id);
      if (found) {
        setRecord(found);
      }
    }
  }, [user, id]);

  if (!record) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center text-slate-500">
        <FileText className="w-16 h-16 opacity-20 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-1">Report Not Found</h3>
        <p className="text-sm text-slate-400 mb-6">The requested clinical report ID could not be retrieved from this device.</p>
        <Link to="/reports" className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all">
          Back to Reports
        </Link>
      </div>
    );
  }

  const patientName = user?.displayName || user?.email?.split('@')[0] || "Guest Patient";

  const handleDownloadPDF = () => {
    generatePDFReport(patientName, record);
  };

  const getRiskColor = (level) => {
    if (level === 'High') return 'text-red-500 border-red-500/20 bg-red-500/10';
    if (level === 'Medium') return 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10';
    return 'text-green-500 border-green-500/20 bg-green-500/10';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Back Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
        <button 
          onClick={() => navigate("/dashboard")}
          className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-2 cursor-pointer font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </button>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={handleDownloadPDF}
            className="flex-1 sm:flex-initial py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
          >
            <FileDown className="w-4 h-4" /> Download PDF
          </button>
          
          <button 
            onClick={() => window.print()}
            className="flex-1 sm:flex-initial py-2.5 px-4 bg-slate-900 border border-white/10 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
          >
            Print Report
          </button>
        </div>
      </div>

      {/* Main Report Page Visual */}
      <div className="glass-card p-8 space-y-8 border-t-8 border-t-rose-600">
        
        {/* Hospital Header Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl animate-pulse">
              <Heart className="w-8 h-8 fill-current" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">CardioSense AI</h2>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Smart Preventive Clinical Report</span>
            </div>
          </div>
          <div className="text-right text-xs text-slate-400 space-y-1">
            <p><strong>Report ID:</strong> {record.id}</p>
            <p><strong>Generated:</strong> {record.date}</p>
          </div>
        </div>

        {/* Patient Info Details */}
        <div className="bg-white/5 border border-white/5 p-5 rounded-2xl grid sm:grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-slate-400 font-bold uppercase text-[9px]">Patient Name</p>
            <p className="text-white text-sm font-semibold mt-1 flex items-center gap-2">
              <User className="w-4 h-4 text-rose-500" /> {patientName}
            </p>
          </div>
          <div>
            <p className="text-slate-400 font-bold uppercase text-[9px]">Patient Email</p>
            <p className="text-white text-sm font-semibold mt-1">{user?.email || "N/A"}</p>
          </div>
        </div>

        {/* Diagnostic Risk Classification */}
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="glass-card p-5 text-center flex flex-col justify-center items-center">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Health Score</span>
            <p className="text-4xl font-black text-emerald-400 mt-2">{record.healthScore} <span className="text-xs text-slate-400">/ 100</span></p>
          </div>

          <div className="glass-card p-5 text-center flex flex-col justify-center items-center">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Risk Probability</span>
            <p className="text-4xl font-black text-rose-500 mt-2">{record.riskPercentage}%</p>
          </div>

          <div className="glass-card p-5 text-center flex flex-col justify-center items-center">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Risk Level</span>
            <span className={`px-4 py-1.5 mt-2 rounded-full text-xs font-bold uppercase border ${getRiskColor(record.riskLevel)}`}>
              {record.riskLevel}
            </span>
          </div>
        </div>

        {/* Input Parameters table */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Clinical Bio-Markers Entered</h3>
          <div className="overflow-x-auto border border-white/10 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-slate-400">
                  <th className="p-3 font-bold">Biomarker</th>
                  <th className="p-3 font-bold">Value</th>
                  <th className="p-3 font-bold">Clinical Significance</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="p-3 font-semibold text-white">Estimated Heart Age</td>
                  <td className="p-3 text-slate-200">{record.heartAge} years</td>
                  <td className={`p-3 font-semibold ${record.heartAgeDiff > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    Offset: {record.heartAgeDiff > 0 ? `+${record.heartAgeDiff}` : record.heartAgeDiff} yrs
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-3 font-semibold text-white">BMI Index</td>
                  <td className="p-3 text-slate-200">{record.bmi}</td>
                  <td className="p-3 text-slate-350">{record.bmiCategory} range</td>
                </tr>
                {record.inputs && Object.entries(record.inputs).map(([key, val]) => (
                  <tr key={key} className="border-b border-white/5 last:border-0">
                    <td className="p-3 font-semibold text-white capitalize">{key.replace('_', ' ')}</td>
                    <td className="p-3 text-slate-200">{val}</td>
                    <td className="p-3 text-slate-400">Input parameter</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Explanation and Recommendations */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Diagnostic Explanation</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-light bg-white/5 p-4 rounded-xl border border-white/5">
              {record.explanation}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Lifestyle Recommendations</h3>
            <div className="space-y-2">
              {record.recommendations?.map((rec, idx) => (
                <div key={idx} className="flex gap-2 p-3 bg-white/5 rounded-xl border border-white/5 text-xs text-slate-200">
                  <Activity className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-light">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Consult Advisory card */}
        <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl flex gap-3 text-xs text-red-200/90 leading-relaxed">
          <AlertCircleIcon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p>
            <strong>Cardiology Review Required:</strong> If you have high/medium probability warnings, print this PDF report and consult a medical practitioner. Statistical risks are computed using group datasets and must be verified by direct medical screening.
          </p>
        </div>

      </div>

      {/* Advisory security footer */}
      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex gap-3 text-xs text-slate-400 leading-relaxed max-w-3xl mx-auto">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <span><strong>Advisory:</strong> CardioSense AI matches statistical biomarkers to predict likelihood indices. Do not modify prescriptions without direct clinician consultation.</span>
      </div>

    </div>
  );
}

function AlertCircleIcon(props) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
