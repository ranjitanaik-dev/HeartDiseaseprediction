import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Heart, Activity, TrendingUp, FileText, Calendar, PlusCircle, CheckCircle2,
  FileDown, ChevronRight, Sparkles, Droplet, Dumbbell, AlertTriangle, 
  HelpCircle, ShieldCheck, RefreshCw, Compass
} from 'lucide-react';
import { Chart, registerables } from 'chart.js';
import { generatePDFReport } from '../lib/pdfGenerator';

Chart.register(...registerables);

const motivationalQuotes = [
  "A healthy heart is a source of clean energy and long lifetime.",
  "Your heart beats about 100,000 times a day. Fuel it with good nutrition and active movement.",
  "Small daily habits (brisk walks, drinking water, managing stress) are compound interest for your arteries.",
  "Endurance isn't just build, it is preserved. Give your heart the sleep and peace it deserves.",
  "Vascular elasticity is the key to longevity. Keep moving, stay hydrated."
];

const sampleHistory = [
  {
    id: "sample-1",
    date: "05/10/2026 10:24 AM",
    mode: "Basic Checkup",
    riskLevel: "Low",
    riskPercentage: 15.4,
    confidenceScore: 84,
    healthScore: 88,
    bmi: 22.4,
    bmiCategory: "Healthy",
    heartAge: 42,
    heartAgeDiff: -3,
    explanation: "Sample parameters are normal.",
    recommendations: ["Maintain general fitness and diet."],
    inputs: { age: 45, gender: 1, trestbps: 120, chol: 198, thalach: 152 }
  }
];

export default function Dashboard() {
  const { user } = useAuth();
  
  // Interactive State Variables
  const [history, setHistory] = useState([]);
  const [waterCups, setWaterCups] = useState(0);
  const [reminders, setReminders] = useState([
    { id: 1, text: "Brisk aerobic walk (30 mins)", completed: false },
    { id: 2, text: "Record resting blood pressure", completed: false },
    { id: 3, text: "Omega-3 rich dinner", completed: false }
  ]);
  const [quote, setQuote] = useState("");
  const [tip, setTip] = useState("");

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Load state from localStorage on mount
  useEffect(() => {
    if (user?.uid) {
      // 1. History
      const historyKey = `cardio_history_${user.uid}`;
      const savedHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
      if (savedHistory.length > 0) {
        setHistory(savedHistory);
      } else {
        setHistory(sampleHistory);
      }

      // 2. Water Tracker
      const waterKey = `cardio_water_${user.uid}_${new Date().toDateString()}`;
      setWaterCups(Number(localStorage.getItem(waterKey) || '0'));

      // 3. Reminders
      const remindersKey = `cardio_reminders_${user.uid}`;
      const savedReminders = JSON.parse(localStorage.getItem(remindersKey) || '[]');
      if (savedReminders.length > 0) {
        setReminders(savedReminders);
      }
    }

    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    
    const tipsList = [
      "Limiting processed sodium keeps arterial walls relaxed, decreasing resting blood pressure.",
      "Soluble fiber absorbs cholesterol in the gut before it enters the blood stream.",
      "Just 10 minutes of stretching opens blood flow and releases tension in your vascular net.",
      "Deep breathing lowers sympathetic nervous drive, lowering resting heart rate."
    ];
    setTip(tipsList[Math.floor(Math.random() * tipsList.length)]);
  }, [user]);

  // Chart Rendering
  useEffect(() => {
    if (!chartRef.current || history.length === 0) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    const sorted = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
    const labels = sorted.map(h => h.date.split(' ')[0]);

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Health Score',
            data: sorted.map(h => h.healthScore),
            borderColor: '#10b981', // green-500
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            tension: 0.3,
            fill: true
          },
          {
            label: 'Risk Score (%)',
            data: sorted.map(h => h.riskPercentage),
            borderColor: '#f43f5e', // rose-500
            backgroundColor: 'transparent',
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#94a3b8' } }
        },
        scales: {
          x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
          y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' }, min: 0, max: 100 }
        }
      }
    });

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [history]);

  // Log water cup
  const handleAddWater = () => {
    const newVal = Math.min(waterCups + 1, 12);
    setWaterCups(newVal);
    if (user?.uid) {
      const waterKey = `cardio_water_${user.uid}_${new Date().toDateString()}`;
      localStorage.setItem(waterKey, newVal.toString());
    }
  };

  const handleResetWater = () => {
    setWaterCups(0);
    if (user?.uid) {
      const waterKey = `cardio_water_${user.uid}_${new Date().toDateString()}`;
      localStorage.setItem(waterKey, '0');
    }
  };

  // Toggle Reminder Checkbox
  const handleToggleReminder = (id) => {
    const updated = reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r);
    setReminders(updated);
    if (user?.uid) {
      const remindersKey = `cardio_reminders_${user.uid}`;
      localStorage.setItem(remindersKey, JSON.stringify(updated));
    }
  };

  const latest = history[0] || sampleHistory[0];
  const userName = user?.user_metadata?.full_name || "Guest Patient";
  const numReports = history.filter(h => !h.id?.startsWith("sample")).length;
  const totalPredictions = history.length;

  // Health Score Color
  const getScoreColorClass = (score) => {
    if (score >= 85) return "text-green-400";
    if (score >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  // Risk Color Helper
  const getRiskColor = (level) => {
    if (level === 'High') return 'text-red-500 border-red-500/25 bg-red-500/10';
    if (level === 'Medium') return 'text-yellow-500 border-yellow-500/25 bg-yellow-500/10';
    return 'text-green-500 border-green-500/25 bg-green-500/10';
  };

  // Calculate Speedometer Needle Angle (from -90 to +90 degrees)
  const needleAngle = ((latest.riskPercentage || 0) / 100) * 180 - 90;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* 1. Header Overview Stats Row */}
      <div>
        <h2 className="text-2xl font-black text-white">Clinical Assessment Overview</h2>
        <p className="text-slate-400 text-xs mt-1">Realtime biological indicators aggregated from your latest predictive evaluations.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 flex items-center gap-3 hover:scale-102 transition-transform">
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">Heart Health</p>
            <p className="text-xl font-bold text-white mt-1">{latest.healthScore}/100</p>
          </div>
        </div>
        
        <div className="glass-card p-4 flex items-center gap-3 hover:scale-102 transition-transform">
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">Risk Category</p>
            <p className="text-xl font-bold text-white mt-1">{latest.riskLevel}</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-3 hover:scale-102 transition-transform">
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">PDF Reports</p>
            <p className="text-xl font-bold text-white mt-1">{numReports} Generated</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-3 hover:scale-102 transition-transform">
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">Total Runs</p>
            <p className="text-xl font-bold text-white mt-1">{totalPredictions} Sessions</p>
          </div>
        </div>
      </div>

      {/* 2. Main Dashboard Layout - 3 Columns */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Gauges, Circular progress, and Trend chart */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Risk Gauge & Circular Progress side-by-side */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Speedometer Gauge Widget */}
            <div className="glass-card p-6 flex flex-col justify-between items-center text-center">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Health Risk Gauge</span>
                <p className="text-sm text-slate-350 mt-1">Likelihood score based on inputs</p>
              </div>

              {/* Speedometer Graphic */}
              <div className="relative w-48 h-24 overflow-hidden flex justify-center items-end mt-4">
                <svg className="w-40 h-40 transform -rotate-180 origin-center absolute bottom-0">
                  {/* Gauge Arc */}
                  <circle cx="80" cy="80" r="60" className="stroke-white/5 fill-none" strokeWidth="12" strokeDasharray="188.4" strokeDashoffset="0" />
                  <circle cx="80" cy="80" r="60" className="stroke-rose-600 fill-none" strokeWidth="12" strokeDasharray="188.4" strokeDashoffset={188.4 * (1 - latest.riskPercentage / 100)} />
                </svg>
                
                {/* Needle */}
                <div 
                  className="w-1.5 h-16 bg-white rounded-full origin-bottom absolute bottom-0 transition-transform duration-1000 ease-out" 
                  style={{ transform: `rotate(${needleAngle}deg)` }}
                />
                
                {/* Center Pin */}
                <div className="w-4 h-4 bg-slate-900 border-2 border-white rounded-full absolute bottom-0 z-10" />
              </div>

              <div className="mt-2 space-y-1">
                <p className="text-3xl font-black text-white">{latest.riskPercentage}%</p>
                <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase inline-block border ${getRiskColor(latest.riskLevel)}`}>
                  {latest.riskLevel} RISK CATEGORY
                </span>
              </div>
            </div>

            {/* Health Score Circular Progress Widget */}
            <div className="glass-card p-6 flex flex-col justify-between items-center text-center">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Health Score Circle</span>
                <p className="text-sm text-slate-350 mt-1">Calculated biological health index</p>
              </div>

              <div className="relative w-36 h-36 flex items-center justify-center mt-3">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="54" className="stroke-white/5 fill-none" strokeWidth="8" />
                  <circle 
                    cx="72" 
                    cy="72" 
                    r="54" 
                    className="stroke-emerald-500 fill-none transition-all duration-1000" 
                    strokeWidth="8" 
                    strokeDasharray={2 * Math.PI * 54} 
                    strokeDashoffset={2 * Math.PI * 54 * (1 - latest.healthScore / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-black text-white">{latest.healthScore}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">POINTS</span>
                </div>
              </div>

              <p className={`text-xs font-bold leading-none mt-2 ${getScoreColorClass(latest.healthScore)}`}>
                {latest.healthScore >= 85 ? "Excellent Cardiac Reserve" : latest.healthScore >= 70 ? "Adequate Cardiac Score" : "Vascular Attention Advised"}
              </p>
            </div>

          </div>

          {/* Biomarkers details: BMI, Heart Age, Latest Prediction */}
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* BMI progress card */}
            <div className="glass-card p-5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">BMI Index</span>
                <p className="text-3xl font-black text-white mt-2">{latest.bmi || "N/A"}</p>
                <span className="text-xs text-slate-300 font-semibold">{latest.bmiCategory || "N/A"}</span>
              </div>
              <div className="border-t border-white/5 pt-3 mt-3 text-[10px] text-slate-400">
                Healthy range: <span className="text-emerald-400 font-bold">18.5 - 24.9</span>
              </div>
            </div>

            {/* Heart Age Card */}
            <div className="glass-card p-5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Physiological Heart Age</span>
                <p className="text-3xl font-black text-white mt-2">{latest.heartAge || "N/A"} yrs</p>
                <p className="text-xs text-slate-400 font-medium mt-1">Patient Age: {latest.inputs?.age || "N/A"} yrs</p>
              </div>
              <div className="border-t border-white/5 pt-3 mt-3 flex justify-between items-center text-[10px]">
                <span className="text-slate-400">Biological Offset:</span>
                <span className={`px-2 py-0.5 rounded font-bold ${latest.heartAgeDiff > 0 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  {latest.heartAgeDiff > 0 ? `+${latest.heartAgeDiff}` : latest.heartAgeDiff} yrs
                </span>
              </div>
            </div>

            {/* Latest Prediction Card */}
            <div className="glass-card p-5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Latest Test Method</span>
                <p className="text-lg font-bold text-white mt-3 truncate">{latest.mode}</p>
                <p className="text-[10px] text-slate-400 mt-1">Run Date: {latest.date.split(' ')[0]}</p>
              </div>
              <Link to="/history" className="text-[10px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 border-t border-white/5 pt-3 mt-3">
                Inspect history logs <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

          </div>

          {/* Health score trend chart */}
          <div className="glass-card p-6">
            <h3 className="text-md font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-rose-500" /> Statistical Risk & Health Score Trends
            </h3>
            <div className="h-64 w-full relative">
              <canvas ref={chartRef} />
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive components like Goal checkers, water tracker, quotes, reminders */}
        <div className="space-y-6">
          
          {/* Quick Actions Panel */}
          <div className="glass-card p-5 space-y-3">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2 flex items-center gap-2">
              <Compass className="w-4.5 h-4.5 text-rose-500" /> Patient Quick Actions
            </h3>
            <div className="flex flex-col gap-2">
              <Link to="/predict" className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold text-center block transition-colors cursor-pointer">
                Run Assessment
              </Link>
              <button 
                onClick={() => generatePDFReport(userName, latest)}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-rose-600/10"
              >
                <FileDown className="w-4 h-4" /> Download PDF Report
              </button>
            </div>
          </div>

          {/* Interactive Water Intake Tracker */}
          <div className="glass-card p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Droplet className="w-4.5 h-4.5 text-sky-400" /> Daily Water Tracker
              </h3>
              <button 
                onClick={handleResetWater}
                className="text-[10px] text-slate-500 hover:text-slate-350 cursor-pointer flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-2.5 h-2.5" /> Clear
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-black text-white">{waterCups} <span className="text-xs text-slate-400 font-semibold">/ 8 Cups</span></p>
                <p className="text-[10px] text-slate-450 mt-1 leading-none">Target hydration lower limits.</p>
              </div>
              <button 
                onClick={handleAddWater}
                className="w-10 h-10 bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20 hover:border-sky-500 text-sky-400 rounded-full flex items-center justify-center font-bold text-xl cursor-pointer transition-colors shadow-sm"
              >
                +
              </button>
            </div>

            {/* Visual Glass Grid */}
            <div className="flex gap-2.5 mt-2 justify-center">
              {Array.from({ length: 8 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-3.5 h-6 rounded border transition-all ${i < waterCups ? 'bg-sky-500 border-sky-400 shadow-[0_0_5px_rgba(56,189,248,0.4)]' : 'bg-white/5 border-white/10'}`} 
                />
              ))}
            </div>
          </div>

          {/* Upcoming Reminders with checklists */}
          <div className="glass-card p-5 space-y-3">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">Upcoming Health Reminders</h3>
            <div className="space-y-2">
              {reminders.map(rem => (
                <button 
                  key={rem.id}
                  onClick={() => handleToggleReminder(rem.id)}
                  className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-left text-xs text-slate-200 transition-all cursor-pointer"
                >
                  <CheckCircle2 className={`w-4 h-4 shrink-0 transition-colors ${rem.completed ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span className={rem.completed ? 'line-through text-slate-500 font-light' : 'font-medium'}>{rem.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Motivational Quote & Tips */}
          <div className="glass-card p-5 space-y-4">
            <div className="flex items-center gap-1.5 text-xs text-rose-400 uppercase font-bold tracking-wider">
              <Sparkles className="w-3.5 h-3.5 fill-current animate-bounce" /> Daily Motivation
            </div>
            <p className="text-slate-200 text-sm italic leading-relaxed">
              "{quote}"
            </p>
            <div className="border-t border-white/5 pt-3">
              <span className="text-[10px] text-slate-450 uppercase font-bold tracking-wider block">Health Advisory Focus</span>
              <p className="text-slate-350 text-xs leading-relaxed mt-1 font-light font-sans">
                {tip}
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* 3. Recent Prediction Timeline Widget */}
      <div className="glass-card p-6">
        <h3 className="text-md font-bold text-white mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-rose-500" /> Recent Prediction Timeline
        </h3>
        
        <div className="relative pl-6 border-l-2 border-white/10 space-y-8 ml-2">
          {history.slice(0, 3).map((item, idx) => (
            <div key={item.id} className="relative">
              {/* Point indicator */}
              <span className="absolute -left-[31px] top-1.5 w-4 h-4 bg-slate-900 border-2 border-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.4)]" />
              
              <div className="grid sm:grid-cols-4 gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-rose-500/20 transition-all">
                <div className="sm:col-span-1">
                  <span className="text-xs text-slate-400 font-bold block">{item.date}</span>
                  <span className="text-sm font-black text-white mt-1 block">{item.mode}</span>
                </div>
                <div className="sm:col-span-1">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Risk Probability</span>
                  <span className="text-lg font-bold text-white mt-0.5 block">{item.riskPercentage}% ({item.riskLevel})</span>
                </div>
                <div className="sm:col-span-1">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Health Score</span>
                  <span className="text-lg font-bold text-emerald-400 mt-0.5 block">{item.healthScore} / 100</span>
                </div>
                <div className="sm:col-span-1 flex justify-end items-center">
                  <button 
                    onClick={() => handleDownloadPDF(item)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-white/10 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                  >
                    <FileDown className="w-3.5 h-3.5" /> PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Advanced Security Shield */}
      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex gap-3 text-xs text-slate-400 leading-relaxed max-w-3xl">
        <ShieldCheck className="w-5 h-5 text-health-500 shrink-0 mt-0.5" />
        <span><strong>Vascular Guard Statement:</strong> CardioSense AI runs clinical evaluations through a secure local environment. All indicators inputted are processed dynamically, avoiding storage outside your credentials file. Do not forget to schedule periodic blood sugar tests with a certified diagnostic center.</span>
      </div>

    </div>
  );
}
