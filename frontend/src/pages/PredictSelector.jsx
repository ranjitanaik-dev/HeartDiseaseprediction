import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Activity, Stethoscope, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PredictSelector() {
  const cards = [
    {
      title: "Basic Health Checkup",
      desc: "An lifestyle-driven risk assessment that evaluates daily habits, body mass index, stress indices, and general biomarkers.",
      icon: <HeartPulse className="w-8 h-8 text-rose-500" />,
      path: "/predict/basic",
      badge: "Fast & General"
    },
    {
      title: "Advanced Clinical Analysis",
      desc: "High-precision cardiovascular estimation utilizing 13 specific clinical lab biomarkers and displaying AI SHAP feature importances.",
      icon: <Activity className="w-8 h-8 text-rose-500" />,
      path: "/predict/advanced",
      badge: "Clinical Lab Report"
    },
    {
      title: "AI Symptom Analyzer",
      desc: "Describe your chest discomfort or symptoms in plain English and receive instant AI analysis and medical guidance recommendations.",
      icon: <Stethoscope className="w-8 h-8 text-rose-500" />,
      path: "/analyze",
      badge: "Natural Language AI"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Cardiovascular Prediction Suite</h1>
        <p className="text-slate-400 text-sm mt-1">Select a prediction modality below to begin your cardiac health assessment.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -5 }}
            className="glass-card p-6 flex flex-col justify-between hover:border-rose-500/20 transition-all shadow-md group"
          >
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20 group-hover:scale-105 transition-transform">
                  {card.icon}
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-slate-300">
                  {card.badge}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-light mb-6">{card.desc}</p>
            </div>
            
            <Link 
              to={card.path}
              className="py-3 px-4 bg-white/5 hover:bg-rose-600 border border-white/10 hover:border-rose-600 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 text-white group-hover:text-white cursor-pointer"
            >
              Launch Tool
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3 text-xs text-amber-200/90 leading-relaxed max-w-3xl">
        <InfoIcon className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <span><strong>Remember:</strong> These evaluations are statistical likelihood estimations using machine learning. They do not constitute clinical diagnoses. For any emergency or high-risk result, consult a qualified cardiologist immediately.</span>
      </div>
    </div>
  );
}

function InfoIcon(props) {
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
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}
