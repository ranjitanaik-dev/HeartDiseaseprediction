import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TrendingUp, BarChart3, Activity, Heart, ShieldAlert, Sparkles } from 'lucide-react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const sampleHistory = [
  {
    id: "sample-1",
    date: "05/10/2026 10:24 AM",
    mode: "Basic Checkup",
    riskLevel: "Low",
    riskPercentage: 15.4,
    healthScore: 88,
    bmi: 22.4,
    heartAge: 42,
    inputs: { age: 45 }
  },
  {
    id: "sample-2",
    date: "06/15/2026 02:45 PM",
    mode: "Advanced Analysis",
    riskLevel: "Medium",
    riskPercentage: 42.1,
    healthScore: 74,
    bmi: 26.2,
    heartAge: 48,
    inputs: { age: 45 }
  }
];

export default function HealthAnalytics() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    avgHealth: 0,
    highestHealth: 0,
    lowestHealth: 0,
    avgRisk: 0
  });

  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [activeMetric, setActiveMetric] = useState("all"); // "all", "health", "risk", "bmi", "heartAge"

  useEffect(() => {
    if (user?.uid) {
      const historyKey = `cardio_history_${user.uid}`;
      const savedHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
      const currentHistory = savedHistory.length > 0 ? savedHistory : sampleHistory;
      
      setHistory(currentHistory);

      // Calculate Stats
      const total = currentHistory.length;
      const healthScores = currentHistory.map(h => h.healthScore);
      const riskScores = currentHistory.map(h => h.riskPercentage);

      const avgHealth = Math.round(healthScores.reduce((a, b) => a + b, 0) / total);
      const highestHealth = Math.max(...healthScores);
      const lowestHealth = Math.min(...healthScores);
      const avgRisk = Math.round(riskScores.reduce((a, b) => a + b, 0) / total);

      setStats({
        total,
        avgHealth,
        highestHealth,
        lowestHealth,
        avgRisk
      });
    }
  }, [user]);

  useEffect(() => {
    if (!chartRef.current || history.length === 0) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    const sorted = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
    const labels = sorted.map(h => h.date.split(' ')[0]);

    let datasets = [];

    if (activeMetric === "all") {
      datasets = [
        {
          label: 'Health Score Trend',
          data: sorted.map(h => h.healthScore),
          borderColor: '#10b981', // green-500
          backgroundColor: 'rgba(16, 185, 129, 0.05)',
          fill: true,
          tension: 0.3
        },
        {
          label: 'Risk Probability (%)',
          data: sorted.map(h => h.riskPercentage),
          borderColor: '#f43f5e', // rose-500
          backgroundColor: 'transparent',
          tension: 0.3
        }
      ];
    } else if (activeMetric === "health") {
      datasets = [{
        label: 'Health Score',
        data: sorted.map(h => h.healthScore),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.3
      }];
    } else if (activeMetric === "risk") {
      datasets = [{
        label: 'Risk Percentage (%)',
        data: sorted.map(h => h.riskPercentage),
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        fill: true,
        tension: 0.3
      }];
    } else if (activeMetric === "bmi") {
      datasets = [{
        label: 'BMI Trend',
        data: sorted.map(h => h.bmi),
        borderColor: '#38bdf8', // sky-400
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        fill: true,
        tension: 0.2
      }];
    } else if (activeMetric === "heartAge") {
      datasets = [
        {
          label: 'Heart Age',
          data: sorted.map(h => h.heartAge),
          borderColor: '#a855f7', // purple-500
          backgroundColor: 'transparent',
          tension: 0.2
        },
        {
          label: 'Actual Age',
          data: sorted.map(h => h.inputs?.age || 45),
          borderColor: '#94a3b8',
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          tension: 0
        }
      ];
    }

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#94a3b8' } }
        },
        scales: {
          x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
          y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } }
        }
      }
    });

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [history, activeMetric]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <TrendingUp className="text-health-500" />
          Health & Metrics Analytics
        </h1>
        <p className="text-slate-400 text-sm mt-1">Review statistical graphs, historic averages, and biomarker trend indicators.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glass-card p-5 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Runs</p>
          <p className="text-3xl font-black text-white mt-2">{stats.total}</p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Avg Health Score</p>
          <p className="text-3xl font-black text-emerald-400 mt-2">{stats.avgHealth}</p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Max Health Score</p>
          <p className="text-3xl font-black text-white mt-2">{stats.highestHealth}</p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Min Health Score</p>
          <p className="text-3xl font-black text-white mt-2">{stats.lowestHealth}</p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Avg Risk Score</p>
          <p className="text-3xl font-black text-rose-500 mt-2">{stats.avgRisk}%</p>
        </div>
      </div>

      {/* Main Trends Panel */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/10 pb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-health-500" /> Metric Trends Graph
          </h3>
          
          <div className="flex flex-wrap bg-white/5 p-1 rounded-lg border border-white/10 text-xs">
            <button 
              onClick={() => setActiveMetric("all")}
              className={`px-3 py-1.5 rounded-md font-bold transition-all ${activeMetric === 'all' ? 'bg-health-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              All Trends
            </button>
            <button 
              onClick={() => setActiveMetric("health")}
              className={`px-3 py-1.5 rounded-md font-bold transition-all ${activeMetric === 'health' ? 'bg-health-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Health Score
            </button>
            <button 
              onClick={() => setActiveMetric("risk")}
              className={`px-3 py-1.5 rounded-md font-bold transition-all ${activeMetric === 'risk' ? 'bg-health-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Risk Trend
            </button>
            <button 
              onClick={() => setActiveMetric("bmi")}
              className={`px-3 py-1.5 rounded-md font-bold transition-all ${activeMetric === 'bmi' ? 'bg-health-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              BMI Trend
            </button>
            <button 
              onClick={() => setActiveMetric("heartAge")}
              className={`px-3 py-1.5 rounded-md font-bold transition-all ${activeMetric === 'heartAge' ? 'bg-health-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Heart Age
            </button>
          </div>
        </div>

        <div className="h-96 w-full relative">
          <canvas ref={chartRef} />
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl flex gap-3 shadow-sm max-w-3xl">
        <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-200/80 leading-relaxed font-light">
          <strong>Statistical Statement:</strong> Averages and indicators are calculated based on your historical assessment sessions. Consistent trend tracking provides cardiologists with secondary insight into baseline cardiac parameters.
        </p>
      </div>

    </div>
  );
}
