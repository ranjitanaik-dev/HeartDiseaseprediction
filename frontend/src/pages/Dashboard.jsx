import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, TrendingUp, History, User, Activity, Heart, 
  Stethoscope, FileDown, PlusCircle, HelpCircle, ArrowRight, 
  Info, ShieldAlert, Sparkles, FileText, CheckCircle2, ChevronRight
} from 'lucide-react';
import { Chart, registerables } from 'chart.js';
import FAQ from '../components/FAQ';
import { generatePDFReport } from '../lib/pdfGenerator';

Chart.register(...registerables);

const healthTips = [
  "Drink at least 3 liters of water daily to support blood volume consistency and reduce cardiac workload.",
  "Engage in 30 minutes of moderate aerobic activity (e.g. brisk walking) to improve your heart rate variability.",
  "Limit refined sugars and processed food to combat systemic arterial wall inflammation.",
  "Secure 7 to 8 hours of restorative sleep to allow your vascular system to rest and recover.",
  "Incorporate potassium-rich foods like bananas, avocados, and spinach to maintain healthy blood pressure.",
  "Keep your daily sodium intake below 1,500 mg to prevent fluid retention and arterial stress.",
  "Practice 5-10 minutes of controlled breathing daily to lower cortisol and regulate heart rhythm."
];

// Sample baseline history data shown if user has no runs yet
const sampleHistory = [
  {
    id: "sample-1",
    date: "05/10/2026 10:24 AM",
    mode: "Basic Check",
    riskLevel: "Low",
    riskPercentage: 15.4,
    confidenceScore: 84,
    healthScore: 88,
    bmi: 22.4,
    bmiCategory: "Healthy",
    heartAge: 42,
    heartAgeDiff: -3,
    explanation: "Sample Baseline: Your clinical markers are within optimal ranges.",
    recommendations: ["Maintain a balanced diet and regular exercise."],
    inputs: { age: 45, gender: 1, height_cm: 170, weight_kg: 70, smoking: 0, alcohol: 0, exercise: 1, stress_level: 0 }
  },
  {
    id: "sample-2",
    date: "06/15/2026 02:45 PM",
    mode: "Advanced Analysis",
    riskLevel: "Medium",
    riskPercentage: 42.1,
    confidenceScore: 78,
    healthScore: 74,
    bmi: 26.2,
    bmiCategory: "Overweight",
    heartAge: 48,
    heartAgeDiff: 3,
    explanation: "Sample Baseline: Slightly elevated markers due to resting BP and lack of frequent exercise.",
    recommendations: ["Reduce sodium intake and aim for 150 minutes of aerobic exercise weekly."],
    inputs: { age: 45, gender: 1, height_cm: 170, weight_kg: 76, smoking: 0, alcohol: 1, exercise: 0, stress_level: 1 }
  }
];

export default function Dashboard() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [isUsingSample, setIsUsingSample] = useState(false);
  const [activeTab, setActiveTab] = useState("risk-health"); // "risk-health" or "biomarkers"
  const [randomTip, setRandomTip] = useState("");
  
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Select a random health tip on load
    const tipIndex = Math.floor(Math.random() * healthTips.length);
    setRandomTip(healthTips[tipIndex]);

    // Fetch user history from localStorage
    if (user?.uid) {
      const historyKey = `cardio_history_${user.uid}`;
      const savedHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
      if (savedHistory.length > 0) {
        setHistory(savedHistory);
        setIsUsingSample(false);
      } else {
        // Fallback to sample history to keep dashboard looking professional
        setHistory(sampleHistory);
        setIsUsingSample(true);
      }
    }
  }, [user]);

  useEffect(() => {
    if (!chartRef.current || history.length === 0) return;

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    
    // Sort history chronologically for the chart timeline
    const sortedHistory = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
    const labels = sortedHistory.map(h => h.date.split(' ')[0]);

    let datasets = [];
    let options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: document.documentElement.classList.contains('light') ? '#0f172a' : '#f8fafc' }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8' }
        }
      }
    };

    if (activeTab === "risk-health") {
      datasets = [
        {
          label: 'Risk Percentage (%)',
          data: sortedHistory.map(h => h.riskPercentage),
          borderColor: '#e11d48', // rose-600
          backgroundColor: 'rgba(225, 29, 72, 0.1)',
          fill: true,
          tension: 0.3,
          yAxisID: 'y_risk'
        },
        {
          label: 'Health Score (0-100)',
          data: sortedHistory.map(h => h.healthScore),
          borderColor: '#10b981', // green-500
          backgroundColor: 'transparent',
          tension: 0.3,
          yAxisID: 'y_health'
        }
      ];

      options.scales = {
        ...options.scales,
        y_risk: {
          type: 'linear',
          display: true,
          position: 'left',
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          title: { display: true, text: 'Risk %', color: '#94a3b8' },
          ticks: { color: '#94a3b8' }
        },
        y_health: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: { drawOnChartArea: false },
          title: { display: true, text: 'Health Score', color: '#94a3b8' },
          ticks: { color: '#94a3b8' }
        }
      };
    } else {
      // Biomarkers tab
      datasets = [
        {
          label: 'Blood Pressure (BP)',
          data: sortedHistory.map(h => h.inputs?.trestbps || 120),
          borderColor: '#38bdf8', // sky-400
          backgroundColor: 'transparent',
          tension: 0.2
        },
        {
          label: 'Heart Rate (bpm)',
          data: sortedHistory.map(h => h.inputs?.thalach || 140),
          borderColor: '#f59e0b', // amber-500
          backgroundColor: 'transparent',
          tension: 0.2
        },
        {
          label: 'Cholesterol (chol)',
          data: sortedHistory.map(h => h.inputs?.chol || 200),
          borderColor: '#a855f7', // purple-500
          backgroundColor: 'transparent',
          tension: 0.2
        },
        {
          label: 'BMI Index',
          data: sortedHistory.map(h => h.bmi || 23),
          borderColor: '#ec4899', // pink-500
          backgroundColor: 'transparent',
          tension: 0.2
        }
      ];

      options.scales = {
        ...options.scales,
        y: {
          type: 'linear',
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          title: { display: true, text: 'Clinical Values', color: '#94a3b8' },
          ticks: { color: '#94a3b8' }
        }
      };
    }

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [history, activeTab]);

  const getLatestRecord = () => {
    return history[0] || sampleHistory[0];
  };

  const latest = getLatestRecord();
  const userName = user?.displayName || user?.email?.split('@')[0] || "Guest Patient";

  const handleDownloadPDF = (record) => {
    generatePDFReport(userName, record);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3 text-white">
            <LayoutDashboard className="text-health-500" />
            Clinical Health Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">Review diagnostic status cards, calculators, and biomarkers trends.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 px-5 py-2.5 rounded-full border border-white/10 shadow-sm">
          <User className="w-5 h-5 text-health-500" />
          <div>
            <p className="text-xs text-slate-400 font-bold leading-none font-sans">Logged In User</p>
            <p className="text-sm font-semibold text-white leading-tight mt-0.5">{userName}</p>
          </div>
        </div>
      </div>

      {isUsingSample && (
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-center gap-3 text-sm text-amber-200/90 shadow-sm">
          <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
          <span><strong>Notice:</strong> Showing demo clinical history. Complete a Basic check or Advanced analysis to populate the dashboard with your personal metrics.</span>
        </div>
      )}

      {/* Grid of Redesigned Widget Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Heart Health Score */}
        <div className="glass-card p-6 flex flex-col items-center justify-center relative min-h-[220px]">
          <svg className="w-28 h-28 transform -rotate-90">
            <circle cx="56" cy="56" r="44" className="stroke-white/5 fill-transparent" strokeWidth="8" />
            <circle 
              cx="56" 
              cy="56" 
              r="44" 
              className="stroke-health-500 fill-transparent" 
              strokeWidth="8" 
              strokeDasharray={2 * Math.PI * 44}
              strokeDashoffset={2 * Math.PI * 44 * (1 - latest.healthScore / 100)} 
              strokeLinecap="round" 
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center mt-3">
            <span className="text-3xl font-black text-white">{latest.healthScore}</span>
            <span className="text-[10px] uppercase text-slate-400 tracking-wider font-bold">Health Score</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-4 text-center leading-none">Calculated overall physiological wellness rating.</p>
        </div>

        {/* Card 2: BMI Calculator Widget */}
        <div className="glass-card p-6 flex flex-col justify-between min-h-[220px]">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Body Mass Index (BMI)</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-black text-white">{latest.bmi || "N/A"}</span>
              <span className="text-xs font-semibold text-slate-300 uppercase">({latest.bmiCategory || "N/A"})</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Healthy Range: <strong className="text-health-500">18.5 - 24.9</strong></p>
          </div>
          <div className="border-t border-white/5 pt-3 text-xs text-slate-300 leading-relaxed font-light">
            Height: {latest.inputs?.height_cm || "N/A"} cm • Weight: {latest.inputs?.weight_kg || "N/A"} kg
          </div>
        </div>

        {/* Card 3: Heart Age Calculator Widget */}
        <div className="glass-card p-6 flex flex-col justify-between min-h-[220px]">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Physiological Heart Age</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-black text-white">{latest.heartAge || "N/A"}</span>
              <span className="text-xs font-bold text-slate-300">years</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Actual Patient Age: <strong className="text-white">{latest.inputs?.age || "N/A"} years</strong></p>
          </div>
          <div className="border-t border-white/5 pt-3 flex items-center justify-between text-xs">
            <span className="text-slate-300 font-light">Biological Difference:</span>
            <span className={`px-2 py-0.5 rounded font-bold ${latest.heartAgeDiff > 0 ? 'bg-red-500/20 text-red-400' : latest.heartAgeDiff === 0 ? 'bg-white/5 text-slate-300' : 'bg-green-500/20 text-green-400'}`}>
              {latest.heartAgeDiff > 0 ? `+${latest.heartAgeDiff}` : latest.heartAgeDiff} yrs
            </span>
          </div>
        </div>

        {/* Card 4: Risk Level Widget */}
        <div className={`glass-card p-6 border-l-8 flex flex-col justify-between min-h-[200px] ${latest.riskLevel === 'High' ? 'border-l-red-500' : latest.riskLevel === 'Medium' ? 'border-l-yellow-500' : 'border-l-green-500'}`}>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Diagnostic Risk Status</span>
            <p className="text-3xl font-black text-white mt-1 uppercase tracking-tight">{latest.riskLevel} Risk</p>
            <p className="text-xs text-slate-400 mt-1">Confidence rating: <strong>{latest.confidenceScore}%</strong></p>
          </div>
          <div className="border-t border-white/5 pt-3 flex justify-between items-center text-xs">
            <span className="text-slate-300 font-light">Probability Score:</span>
            <span className={`font-black text-md ${latest.riskLevel === 'High' ? 'text-red-500' : latest.riskLevel === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`}>
              {latest.riskPercentage}%
            </span>
          </div>
        </div>

        {/* Card 5: Last Prediction Details */}
        <div className="glass-card p-6 flex flex-col justify-between min-h-[200px]">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Last Assessment Summary</span>
            <p className="text-xs text-slate-400 mt-1 font-sans">Run Date: {latest.date}</p>
            <p className="text-xs text-slate-300 font-light leading-relaxed mt-2 border-t border-white/5 pt-2">
              "{latest.explanation.slice(0, 110)}..."
            </p>
          </div>
          <Link to="/history" className="text-xs text-rose-400 hover:text-rose-300 transition-colors font-bold inline-flex items-center gap-1 mt-2">
            View details in History <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 6: Recent Report PDF Action */}
        <div className="glass-card p-6 flex flex-col justify-between min-h-[200px]">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold font-sans">PDF Clinical Report</span>
            <p className="text-xs text-slate-400 mt-1">Export patient assessment data to a professional PDF layout.</p>
          </div>
          <div>
            <button 
              onClick={() => handleDownloadPDF(latest)}
              className="w-full py-3 bg-slate-900 border border-white/10 hover:bg-slate-800 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
            >
              <FileDown className="w-4 h-4 text-health-500" /> Export Latest PDF Report
            </button>
          </div>
        </div>

      </div>

      {/* Quick Actions & Tips Panel */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Card 7: Quick Actions */}
        <div className="glass-card p-6 md:col-span-1 space-y-4">
          <h3 className="text-md font-bold text-white border-b border-white/10 pb-2">Quick Actions</h3>
          <div className="flex flex-col gap-2">
            <Link to="/predict" className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-sm transition-colors text-slate-200">
              <span className="flex items-center gap-2"><PlusCircle className="w-4 h-4 text-health-500" /> Run Cardiac Prediction</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </Link>
            <Link to="/reports" className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-sm transition-colors text-slate-200">
              <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-health-500" /> Download PDF Reports</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </Link>
            <Link to="/faq" className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-sm transition-colors text-slate-200">
              <span className="flex items-center gap-2"><HelpCircle className="w-4 h-4 text-health-500" /> View FAQ Accordions</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </Link>
          </div>
        </div>

        {/* Card 8: Rotating Health Tips */}
        <div className="glass-card p-6 md:col-span-2 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-health-500 font-bold text-sm uppercase mb-3">
            <Sparkles className="w-4 h-4 fill-current animate-bounce" /> Daily Cardiac Tip
          </div>
          <p className="text-white text-md font-medium leading-relaxed italic">
            "{randomTip}"
          </p>
          <p className="text-[10px] text-slate-400 mt-4 leading-none">Science-based recommendations refreshed on every load.</p>
        </div>

      </div>

      {/* Interactive Charts Widget */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/10 pb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-health-500" /> Patient Biomarkers & Risk Trends
          </h3>
          <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 text-xs">
            <button 
              onClick={() => setActiveTab("risk-health")}
              className={`px-3 py-1.5 rounded-md font-bold transition-all ${activeTab === 'risk-health' ? 'bg-health-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Risk & Health Score
            </button>
            <button 
              onClick={() => setActiveTab("biomarkers")}
              className={`px-3 py-1.5 rounded-md font-bold transition-all ${activeTab === 'biomarkers' ? 'bg-health-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Clinical Biomarkers
            </button>
          </div>
        </div>
        
        <div className="h-72 w-full relative">
          <canvas ref={chartRef} />
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl flex gap-3 shadow-sm max-w-3xl">
        <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs text-amber-200/80 leading-relaxed font-light">
            <strong>Medical Disclaimer:</strong> This application is intended only for educational purposes and should not replace professional medical advice. Always consult with a qualified healthcare provider or cardiologist to discuss clinical symptoms.
          </p>
        </div>
      </div>

    </div>
  );
}
