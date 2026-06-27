import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Activity, Apple, Moon, Waves, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const mainTips = [
  {
    title: "Vascular Aerobic Exercise",
    desc: "Perform 150 minutes of moderate aerobic activity (e.g. brisk walking, cycling, light jogging) weekly. This enlarges heart stroke volume, lowers resting heart rate, and improves elasticity of the arterial walls.",
    icon: <Activity className="w-6 h-6 text-rose-500" />,
    stats: "150 min/wk target"
  },
  {
    title: "Nutritional Cardiac Fuel",
    desc: "Maintain a heart-healthy diet rich in green vegetables, soluble fibers (beans, oats), omega-3 fatty acids (salmon, walnuts), and plant sterols. Minimize sodium and eliminate trans fat to avoid plaque accumulation.",
    icon: <Apple className="w-6 h-6 text-rose-500" />,
    stats: "Saturated fat < 7% daily"
  },
  {
    title: "Vascular Blood Volume Status",
    desc: "Drink 2.5 to 3 liters of water daily. Proper hydration ensures blood retains optimal viscosity, reducing friction against arterial linings and lowering the force required by the left ventricle to pump blood.",
    icon: <Waves className="w-6 h-6 text-rose-500" />,
    stats: "2.5 - 3.0 Liters daily"
  },
  {
    title: "Autonomic Sleep Recovery",
    desc: "Secure 7-8 hours of uninterrupted sleep. During deep sleep stages, blood pressure drops and heart rate slows, allowing cardiac muscle cells to undergo structural repair and lowering overall sympathetic drive.",
    icon: <Moon className="w-6 h-6 text-rose-500" />,
    stats: "7 - 8 Hours target"
  }
];

export default function HealthTips() {
  const [rotatingTip, setRotatingTip] = useState("");

  useEffect(() => {
    const list = [
      "Replacing table salt with ground spices or lemon juice is a simple way to protect arterial lining.",
      "A 10-minute brisk walk after meals helps clear glucose from the bloodstream, protecting heart blood vessels.",
      "Reducing stress by 20% can decrease your heart disease risk by lowering arterial pressure.",
      "Soluble fiber acts like a sponge in the digestive system, absorbing cholesterol before it reaches the bloodstream."
    ];
    setRotatingTip(list[Math.floor(Math.random() * list.length)]);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <Sparkles className="text-health-500" />
          Cardiovascular Guidelines & Tips
        </h1>
        <p className="text-slate-400 text-sm mt-1">Acquire actionable, science-based habits to support endothelial and myocardial strength.</p>
      </div>

      {/* Daily guideline banner */}
      <div className="glass-card p-6 bg-gradient-to-r from-rose-500/10 to-transparent border border-rose-500/20 flex items-start gap-4">
        <div className="p-3 bg-rose-500/20 rounded-2xl text-rose-500 shrink-0">
          <Heart className="w-6 h-6 fill-current animate-pulse" />
        </div>
        <div>
          <span className="text-[10px] tracking-widest uppercase font-bold text-rose-400">Random Daily Focus Tip</span>
          <p className="text-white text-md font-semibold mt-1 leading-relaxed">"{rotatingTip}"</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {mainTips.map((tip, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -3 }}
            className="glass-card p-6 border border-white/5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="p-2.5 bg-rose-500/10 rounded-xl text-rose-500 border border-rose-500/20">
                  {tip.icon}
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                  {tip.stats}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{tip.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-light">{tip.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex gap-3 text-xs text-slate-400 leading-relaxed max-w-3xl">
        <ShieldCheck className="w-5 h-5 text-health-500 shrink-0 mt-0.5" />
        <span><strong>CardioSense AI Health Statement:</strong> Consistently implementing lifestyle shifts remains the primary way to optimize heart biomarkers (such as blood pressure, BMI, and serum cholesterol). Ensure you review high-intensity diet or exercise plans with your doctor.</span>
      </div>
    </div>
  );
}
