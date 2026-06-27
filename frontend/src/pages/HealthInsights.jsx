import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, Trophy, CheckCircle, ShieldCheck, Heart, HeartPulse, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HealthInsights() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    if (user?.uid) {
      const historyKey = `cardio_history_${user.uid}`;
      const savedHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
      setHistory(savedHistory);

      // Evaluate Badges Dynamically
      const list = [];
      const len = savedHistory.length;

      // 1. First Prediction
      if (len >= 1) {
        list.push({
          id: "first-pred",
          name: "First Prediction",
          desc: "Completed your first cardiac checkup.",
          icon: <Trophy className="w-8 h-8 text-yellow-500" />,
          unlocked: true
        });
      } else {
        list.push({
          id: "first-pred",
          name: "First Prediction",
          desc: "Run a checkup to unlock.",
          icon: <Trophy className="w-8 h-8 text-slate-500" />,
          unlocked: false
        });
      }

      // 2. Returning User
      if (len > 1) {
        list.push({
          id: "returning-user",
          name: "Returning User",
          desc: "Run assessments on multiple dates.",
          icon: <Trophy className="w-8 h-8 text-indigo-500" />,
          unlocked: true
        });
      } else {
        list.push({
          id: "returning-user",
          name: "Returning User",
          desc: "Run 2 or more assessments.",
          icon: <Trophy className="w-8 h-8 text-slate-500" />,
          unlocked: false
        });
      }

      // 3. Healthy Score Above 90
      const has90 = savedHistory.some(h => h.healthScore >= 90);
      if (has90) {
        list.push({
          id: "score-90",
          name: "Healthy Heart Elite",
          desc: "Secured a health score above 90.",
          icon: <Trophy className="w-8 h-8 text-emerald-500" />,
          unlocked: true
        });
      } else {
        list.push({
          id: "score-90",
          name: "Healthy Heart Elite",
          desc: "Achieve a health score of 90+.",
          icon: <Trophy className="w-8 h-8 text-slate-500" />,
          unlocked: false
        });
      }

      // 4. Healthy Lifestyle
      const healthyInputs = savedHistory.some(h => h.inputs?.exercise === 1 || h.inputs?.stress_level === 0);
      if (healthyInputs) {
        list.push({
          id: "lifestyle",
          name: "Healthy Lifestyle",
          desc: "Active fitness check or low stress index.",
          icon: <Trophy className="w-8 h-8 text-pink-500" />,
          unlocked: true
        });
      } else {
        list.push({
          id: "lifestyle",
          name: "Healthy Lifestyle",
          desc: "Enable exercise or keep stress minimal.",
          icon: <Trophy className="w-8 h-8 text-slate-500" />,
          unlocked: false
        });
      }

      // 5. 5 Reports Generated
      const reportsCount = savedHistory.filter(h => !h.id?.startsWith("sample")).length;
      if (reportsCount >= 5) {
        list.push({
          id: "reports-5",
          name: "Dedicated Tracker",
          desc: "Generated 5 clinical PDF records.",
          icon: <Trophy className="w-8 h-8 text-sky-500" />,
          unlocked: true
        });
      } else {
        list.push({
          id: "reports-5",
          name: "Dedicated Tracker",
          desc: `Generate 5 reports (current: ${reportsCount}/5).`,
          icon: <Trophy className="w-8 h-8 text-slate-500" />,
          unlocked: false
        });
      }

      setBadges(list);
    }
  }, [user]);

  const latest = history[0];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <Sparkles className="text-health-500" />
          Health Insights & Badges
        </h1>
        <p className="text-slate-400 text-sm mt-1">Review diagnostic insights and track your achievement milestones.</p>
      </div>

      {/* Badges Panel */}
      <div className="glass-card p-6 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
          <Trophy className="w-5 h-5 text-yellow-500" /> Achievement Badges
        </h3>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-6">
          {badges.map((badge) => (
            <div 
              key={badge.id} 
              className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-between transition-all ${badge.unlocked ? 'bg-rose-500/5 border-rose-500/20 shadow-md' : 'bg-white/5 border-white/5 opacity-50'}`}
            >
              <div className={`p-3 rounded-full mb-3 ${badge.unlocked ? 'bg-rose-500/10' : 'bg-slate-800'}`}>
                {badge.icon}
              </div>
              <div>
                <p className="font-bold text-xs text-white leading-tight">{badge.name}</p>
                <p className="text-[9px] text-slate-400 mt-1.5 leading-relaxed">{badge.desc}</p>
              </div>
              {badge.unlocked && (
                <span className="px-2 py-0.5 mt-3 rounded bg-emerald-500/20 text-emerald-400 text-[8px] font-bold uppercase tracking-wider">
                  Unlocked
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Insights Section */}
      {latest ? (
        <div className="grid md:grid-cols-2 gap-6">
          
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-rose-500" /> Diagnostic Assessment Detail
            </h3>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-sm space-y-3">
              <p className="text-slate-300 font-light leading-relaxed">
                <strong>Explanation:</strong> {latest.explanation}
              </p>
              <div className="border-t border-white/5 pt-3 mt-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Bio-Calculator Offsets</span>
                <ul className="text-xs text-slate-350 list-disc pl-4 space-y-1.5 mt-2 font-sans font-light">
                  <li>BMI Indicator: <strong>{latest.bmi} ({latest.bmiCategory})</strong></li>
                  <li>Estimated Heart Age Offset: <strong>{latest.heartAgeDiff > 0 ? `+${latest.heartAgeDiff}` : latest.heartAgeDiff} years</strong></li>
                  <li>Algorithm confidence: <strong>{latest.confidenceScore}%</strong></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-500" /> Preventive Action Guidelines
            </h3>
            <div className="space-y-2">
              {latest.recommendations?.map((rec, idx) => (
                <div key={idx} className="flex gap-3 p-3 bg-white/5 rounded-xl border border-white/5 text-xs text-slate-200">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-light">{rec}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        <div className="glass-card p-8 text-center text-slate-500">
          <Heart className="w-12 h-12 opacity-20 mx-auto mb-3" />
          <h4 className="font-bold text-white">No Assessment Data Available</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto font-light leading-relaxed">
            Run a prediction checkup to generate detailed medical analysis breakdowns and guidelines.
          </p>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex gap-3 text-xs text-slate-400 leading-relaxed max-w-3xl">
        <ShieldCheck className="w-5 h-5 text-health-500 shrink-0 mt-0.5" />
        <span><strong>Insights Review:</strong> Cardiological calculations are statistical likelihood indices compiled using ML algorithms. Consistently review critical parameters (such as ECG and chest discomfort symptoms) with a consulting doctor.</span>
      </div>
    </div>
  );
}
