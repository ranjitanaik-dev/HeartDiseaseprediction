import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Target, Plus, Trash2, CheckCircle2, ChevronRight, Sparkles, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const defaultGoals = [
  { id: "def-1", title: "Maintain optimal BMI range (18.5 - 24.9)", category: "BMI", percentage: 50, completed: false },
  { id: "def-2", title: "Complete 150 minutes of aerobic exercise weekly", category: "Fitness", percentage: 40, completed: false },
  { id: "def-3", title: "Maintain serum cholesterol below 200 mg/dl", category: "Cholesterol", percentage: 80, completed: false },
  { id: "def-4", title: "Keep resting blood pressure below 120/80 mm Hg", category: "Blood Pressure", percentage: 90, completed: false }
];

export default function HealthGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Fitness");

  useEffect(() => {
    if (user?.uid) {
      const goalsKey = `cardio_goals_${user.uid}`;
      const saved = JSON.parse(localStorage.getItem(goalsKey) || '[]');
      if (saved.length > 0) {
        setGoals(saved);
      } else {
        setGoals(defaultGoals);
      }
    }
  }, [user]);

  const saveGoals = (updatedGoals) => {
    setGoals(updatedGoals);
    if (user?.uid) {
      const goalsKey = `cardio_goals_${user.uid}`;
      localStorage.setItem(goalsKey, JSON.stringify(updatedGoals));
    }
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newGoal = {
      id: `custom-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      percentage: 0,
      completed: false
    };
    const updated = [...goals, newGoal];
    saveGoals(updated);
    setNewTitle("");
  };

  const handleDeleteGoal = (id) => {
    const updated = goals.filter(g => g.id !== id);
    saveGoals(updated);
  };

  const handleSliderChange = (id, val) => {
    const percentage = Number(val);
    const updated = goals.map(g => 
      g.id === id ? { ...g, percentage, completed: percentage === 100 } : g
    );
    saveGoals(updated);
  };

  const handleToggleComplete = (id) => {
    const updated = goals.map(g => 
      g.id === id ? { ...g, completed: !g.completed, percentage: !g.completed ? 100 : 0 } : g
    );
    saveGoals(updated);
  };

  const calculateOverallProgress = () => {
    if (goals.length === 0) return 0;
    const totalPercentage = goals.reduce((acc, g) => acc + g.percentage, 0);
    return Math.round(totalPercentage / goals.length);
  };

  const progress = calculateOverallProgress();

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Target className="text-health-500" />
            Cardiovascular Goals Tracker
          </h1>
          <p className="text-slate-400 text-sm mt-1">Set, track, and complete lifestyle goals to optimize your cardiac biomarkers.</p>
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left column: progress summary & add goal form */}
        <div className="space-y-6">
          
          {/* Progress circle box */}
          <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Overall Goal Completion</span>
            
            <div className="relative w-36 h-36 flex items-center justify-center mt-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="54" className="stroke-white/5 fill-none" strokeWidth="8" />
                <circle 
                  cx="72" 
                  cy="72" 
                  r="54" 
                  className="stroke-rose-500 fill-none transition-all duration-500" 
                  strokeWidth="8" 
                  strokeDasharray={2 * Math.PI * 54} 
                  strokeDashoffset={2 * Math.PI * 54 * (1 - progress / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black text-white">{progress}%</span>
                <span className="text-[9px] font-bold text-slate-450 uppercase tracking-widest mt-1">Completed</span>
              </div>
            </div>
          </div>

          {/* Form to add custom goal */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">Add New Health Goal</h3>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Goal Description</label>
                <input 
                  type="text" 
                  placeholder="e.g. Brisk walk 30 mins daily" 
                  className="w-full bg-[#0f172a]/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 transition-colors"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Category Focus</label>
                <select 
                  className="w-full bg-[#0f172a]/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-350 focus:outline-none focus:border-rose-500 transition-colors"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  <option value="BMI">BMI</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Cholesterol">Cholesterol</option>
                  <option value="Blood Pressure">Blood Pressure</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Goal
              </button>
            </form>
          </div>

        </div>

        {/* Right column: goals list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">Your Biological & Fitness Goals</h3>
            
            <div className="space-y-4">
              <AnimatePresence>
                {goals.map((goal) => (
                  <motion.div 
                    key={goal.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-rose-500/20"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <button 
                        onClick={() => handleToggleComplete(goal.id)}
                        className="p-1 rounded-full text-slate-500 hover:text-rose-500 cursor-pointer"
                      >
                        <CheckCircle2 className={`w-5 h-5 ${goal.completed ? 'text-emerald-400' : 'text-slate-500'}`} />
                      </button>
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/10 uppercase tracking-widest">
                          {goal.category}
                        </span>
                        <p className={`text-xs font-bold leading-relaxed ${goal.completed ? 'line-through text-slate-500 font-light' : 'text-white'}`}>
                          {goal.title}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
                      <div className="flex items-center gap-2 flex-1 sm:flex-none">
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          step="10"
                          className="w-24 accent-rose-500 bg-white/10 h-1 rounded-lg cursor-pointer"
                          value={goal.percentage}
                          onChange={(e) => handleSliderChange(goal.id, e.target.value)}
                        />
                        <span className="text-xs font-bold text-slate-300 w-8 text-right">{goal.percentage}%</span>
                      </div>

                      <button 
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-2 bg-red-500/10 hover:bg-red-500 border border-red-500/10 hover:border-red-500 rounded-lg text-red-400 hover:text-white transition-colors cursor-pointer"
                        title="Delete Goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>

      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex gap-3 text-xs text-slate-400 leading-relaxed max-w-3xl">
        <ShieldCheck className="w-5 h-5 text-health-500 shrink-0 mt-0.5" />
        <span><strong>Goals Advice:</strong> Consistently checking off exercise and dietary targets directly correlates with improvements in blood pressure and serum cholesterol biomarkers during subsequent checkup logs.</span>
      </div>

    </div>
  );
}
