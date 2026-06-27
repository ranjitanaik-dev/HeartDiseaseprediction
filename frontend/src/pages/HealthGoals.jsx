import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Target, Plus, Trash2, CheckCircle2, ChevronRight, Sparkles, 
  ShieldCheck, Calendar, Bell, Trophy, Activity, Flame, 
  TrendingUp, BarChart3, Star, AlertCircle, PlusCircle, Check, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Daily challenges based on weekday
const WEEKLY_CHALLENGES = [
  { day: 0, title: "Perform 5 minutes of mindful box breathing", reward: "Stress Management Badge" },
  { day: 1, title: "Walk 8000 steps (aerobic activity)", reward: "Fitness Badge" },
  { day: 2, title: "Drink 2.5L of pure water", reward: "Hydration Badge" },
  { day: 3, title: "Eat 5 servings of leafy green vegetables", reward: "Diet Badge" },
  { day: 4, title: "Sleep 8 hours of restorative rest", reward: "Recovery Badge" },
  { day: 5, title: "Limit sodium intake to under 1500mg today", reward: "BP Badge" },
  { day: 6, title: "Perform 20 minutes of cardiovascular exercise", reward: "Fitness Badge" }
];

export default function HealthGoals() {
  const { user } = useAuth();
  
  // Tabs: "overview", "goals", "calendar", "suggestions"
  const [activeTab, setActiveTab] = useState("overview");

  // Core Goal Tracker States
  const [goals, setGoals] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [badges, setBadges] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [streak, setStreak] = useState(0);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  
  // Goal Form Fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Fitness");
  const [priority, setPriority] = useState("Medium");
  const [targetValue, setTargetValue] = useState(100);
  const [currentValue, setCurrentValue] = useState(0);
  const [targetDate, setTargetDate] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [notes, setNotes] = useState("");

  // Load patient prediction to generate smart suggestions
  const [lastPrediction, setLastPrediction] = useState(null);

  useEffect(() => {
    if (user?.uid) {
      const uid = user.uid;
      
      // 1. Load Goals
      const goalsKey = `cardio_goals_${uid}`;
      const savedGoals = JSON.parse(localStorage.getItem(goalsKey) || '[]');
      setGoals(savedGoals.length > 0 ? savedGoals : []);

      // 2. Load Timeline
      const timelineKey = `cardio_timeline_${uid}`;
      const savedTimeline = JSON.parse(localStorage.getItem(timelineKey) || '[]');
      setTimeline(savedTimeline);

      // 3. Load Badges
      const badgesKey = `cardio_badges_${uid}`;
      const savedBadges = JSON.parse(localStorage.getItem(badgesKey) || '[]');
      setBadges(savedBadges);

      // 4. Load Notifications
      const notifsKey = `cardio_notifs_${uid}`;
      const savedNotifs = JSON.parse(localStorage.getItem(notifsKey) || '[]');
      setNotifications(savedNotifs);

      // 5. Load Streak
      const streakKey = `cardio_streak_${uid}`;
      setStreak(Number(localStorage.getItem(streakKey) || '3')); // default 3 day mock streak to look active

      // 6. Load Challenge Completion for Today
      const challengeKey = `cardio_challenge_${uid}_${new Date().toDateString()}`;
      setChallengeCompleted(localStorage.getItem(challengeKey) === 'true');

      // 7. Load Latest Prediction for Suggestions
      const historyKey = `cardio_history_${uid}`;
      const savedHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
      if (savedHistory.length > 0) {
        setLastPrediction(savedHistory[0]);
      }
    }
  }, [user]);

  // Persist State Utilities
  const saveGoalsState = (newGoals) => {
    setGoals(newGoals);
    if (user?.uid) localStorage.setItem(`cardio_goals_${user.uid}`, JSON.stringify(newGoals));
  };

  const addTimelineEvent = (title, type) => {
    const newEvent = {
      id: `time-${Date.now()}`,
      title,
      type,
      date: new Date().toLocaleString()
    };
    const updated = [newEvent, ...timeline];
    setTimeline(updated);
    if (user?.uid) localStorage.setItem(`cardio_timeline_${user.uid}`, JSON.stringify(updated));
  };

  const addNotification = (text, type) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      text,
      type,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updated = [newNotif, ...notifications];
    setNotifications(updated);
    if (user?.uid) localStorage.setItem(`cardio_notifs_${user.uid}`, JSON.stringify(updated));
  };

  // Form Submit handler
  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newGoal = {
      id: `goal-${Date.now()}`,
      name,
      category,
      priority,
      targetValue: Number(targetValue),
      currentValue: Number(currentValue),
      targetDate: targetDate || new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0],
      frequency,
      notes,
      percentage: Math.min(Math.round((Number(currentValue) / Number(targetValue)) * 100), 100),
      completed: Number(currentValue) >= Number(targetValue),
      lastUpdated: new Date().toLocaleDateString()
    };

    const updated = [...goals, newGoal];
    saveGoalsState(updated);
    addTimelineEvent(`Goal Created: ${name}`, "goal");
    addNotification(`New goal set: ${name}`, "info");

    // Award First Goal badge if checking off a pre-completed item
    if (newGoal.completed) {
      awardBadge("first-goal", "Goal Getter", "Completed your first cardiovascular goal.");
    }

    // Reset Form
    setName("");
    setNotes("");
    setCurrentValue(0);
    setTargetDate("");
  };

  // Delete goal
  const handleDeleteGoal = (id, name) => {
    const updated = goals.filter(g => g.id !== id);
    saveGoalsState(updated);
    addTimelineEvent(`Goal Deleted: ${name}`, "delete");
  };

  // Update current value of a goal
  const handleUpdateProgress = (id, value) => {
    const currentVal = Math.min(Math.max(Number(value), 0), 10000);
    const updated = goals.map(g => {
      if (g.id === id) {
        const percentage = Math.min(Math.round((currentVal / g.targetValue) * 100), 100);
        const completed = currentVal >= g.targetValue;
        
        if (completed && !g.completed) {
          awardBadge("first-goal", "Goal Getter", "Completed your first cardiovascular goal.");
          addNotification(`Goal Completed: ${g.name}! 🎉`, "success");
          addTimelineEvent(`Goal Completed: ${g.name}`, "completed");
        }
        
        return {
          ...g,
          currentValue: currentVal,
          percentage,
          completed,
          lastUpdated: new Date().toLocaleDateString()
        };
      }
      return g;
    });
    saveGoalsState(updated);
  };

  // Award achievements badges
  const awardBadge = (id, name, desc) => {
    if (badges.some(b => b.id === id)) return; // already unlocked
    const newBadge = { id, name, desc, date: new Date().toLocaleDateString() };
    const updated = [...badges, newBadge];
    setBadges(updated);
    if (user?.uid) localStorage.setItem(`cardio_badges_${user.uid}`, JSON.stringify(updated));
    addNotification(`Badge Unlocked: ${name}! 🏆`, "achievement");
    addTimelineEvent(`Achievement Earned: ${name}`, "badge");
  };

  // Complete Daily Challenge
  const handleToggleChallenge = () => {
    const nextVal = !challengeCompleted;
    setChallengeCompleted(nextVal);
    if (user?.uid) {
      const challengeKey = `cardio_challenge_${user.uid}_${new Date().toDateString()}`;
      localStorage.setItem(challengeKey, nextVal.toString());
      
      const streakKey = `cardio_streak_${user.uid}`;
      const newStreak = nextVal ? streak + 1 : Math.max(streak - 1, 0);
      setStreak(newStreak);
      localStorage.setItem(streakKey, newStreak.toString());

      if (newStreak >= 7) awardBadge("streak-7", "7-Day Warrior", "Maintain a 7-day health completion streak.");
    }

    if (nextVal) {
      addNotification("Daily Challenge Complete! 🔥", "success");
      addTimelineEvent("Completed Daily Health Challenge", "challenge");
    }
  };

  // Clear a single notification
  const handleClearNotif = (id) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    if (user?.uid) localStorage.setItem(`cardio_notifs_${user.uid}`, JSON.stringify(updated));
  };

  // Get Suggestions based on Last Prediction metrics
  const getSuggestions = () => {
    if (!lastPrediction) return [
      { text: "Log a prediction run to generate customized guidelines.", cat: "Custom" }
    ];

    const list = [];
    const sys = lastPrediction.inputs?.trestbps || 120;
    const chol = lastPrediction.inputs?.chol || 198;
    const bmi = lastPrediction.bmi || 22.4;

    if (chol > 200) {
      list.push({ text: "Reduce fried food and trans fat intake", cat: "Diet", val: 1, target: 7, unit: "days/wk" });
      list.push({ text: "Walk 30 minutes daily to raise HDL", cat: "Fitness", val: 0, target: 30, unit: "mins" });
      list.push({ text: "Eat soluble fiber (oats, legumes) daily", cat: "Diet", val: 0, target: 1, unit: "serving" });
    }
    if (sys > 130) {
      list.push({ text: "Reduce sodium intake under 1500mg daily", cat: "Diet", val: 1, target: 7, unit: "days/wk" });
      list.push({ text: "Monitor resting BP in morning and evening", cat: "Blood Pressure", val: 0, target: 2, unit: "times" });
      list.push({ text: "Perform 10 minutes of deep box breathing", cat: "Stress Management", val: 0, target: 10, unit: "mins" });
    }
    if (bmi > 25) {
      list.push({ text: "Incorporate 45 minutes of aerobic exercise", cat: "Exercise", val: 0, target: 45, unit: "mins" });
      list.push({ text: "Drink 2.5 Liters of water daily", cat: "Water Intake", val: 0, target: 2500, unit: "ml" });
      list.push({ text: "Reduce daily calorie intake by 300 kcal", cat: "Diet", val: 0, target: 300, unit: "kcal" });
    }
    if (lastPrediction.riskLevel === "Low") {
      list.push({ text: "Maintain regular physical fitness runs", cat: "Fitness", val: 3, target: 3, unit: "runs/wk" });
      list.push({ text: "Secure 7-8 hours of sound sleep daily", cat: "Sleep", val: 6, target: 8, unit: "hours" });
    }

    return list;
  };

  const suggestions = getSuggestions();

  // Add suggested goal
  const handleAddSuggestion = (sug) => {
    setName(sug.text);
    setCategory(sug.cat);
    setTargetValue(sug.target);
    setActiveTab("goals"); // switch to creator form
  };

  // Calendar render helper variables
  const currentChallenge = WEEKLY_CHALLENGES[new Date().getDay()] || WEEKLY_CHALLENGES[0];
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.completed).length;
  const pendingGoals = totalGoals - completedGoals;
  const overallProgress = totalGoals > 0 ? Math.round(goals.reduce((acc, g) => acc + g.percentage, 0) / totalGoals) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* 1. Header Navigation Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Target className="text-health-500" />
            Cardio Goals & Health Tracker
          </h1>
          <p className="text-slate-400 text-sm mt-1">Set biomarker goals, log progress sliders, and review customized medical recommendations.</p>
        </div>

        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
          {["overview", "goals", "calendar", "suggestions"].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-bold uppercase transition-all ${activeTab === tab ? 'bg-health-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              {tab === "suggestions" ? "Smart Suggestions" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Notifications Board (If any) */}
      <AnimatePresence>
        {notifications.length > 0 && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {notifications.slice(0, 3).map((notif) => (
              <motion.div 
                key={notif.id}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-white/10 p-4 rounded-xl flex justify-between items-center gap-3 shadow-md"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping shrink-0" />
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">{notif.text}</p>
                </div>
                <button 
                  onClick={() => handleClearNotif(notif.id)}
                  className="p-1 text-slate-500 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* 3. Tab contents */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid lg:grid-cols-3 gap-6"
          >
            {/* Left 2 columns: Stats dashboard & challenge */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Core Stats Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-card p-4 text-center relative">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Overall Completion</span>
                  <p className="text-2xl font-black text-emerald-400 mt-2">{overallProgress}%</p>
                </div>
                <div className="glass-card p-4 text-center flex flex-col justify-center items-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500 fill-current" /> Streak Days
                  </span>
                  <p className="text-2xl font-black text-amber-400 mt-2">{streak} Days</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Total Goals</span>
                  <p className="text-2xl font-black text-white mt-2">{totalGoals}</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Completed</span>
                  <p className="text-2xl font-black text-white mt-2">{completedGoals} / {totalGoals}</p>
                </div>
              </div>

              {/* Daily Challenge Card */}
              <div className="glass-card p-6 bg-gradient-to-r from-rose-500/10 to-transparent border border-rose-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-rose-500/20 rounded-2xl text-rose-500 shrink-0">
                    <Flame className="w-6 h-6 fill-current animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Today's Daily Challenge</span>
                    <p className="text-white text-md font-bold mt-1">"{currentChallenge.title}"</p>
                    <p className="text-[10px] text-slate-400 mt-1">Reward: {currentChallenge.reward}</p>
                  </div>
                </div>

                <button 
                  onClick={handleToggleChallenge}
                  className={`px-5 py-3 rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer flex items-center gap-2 ${challengeCompleted ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' : 'bg-rose-600 hover:bg-rose-500 text-white'}`}
                >
                  {challengeCompleted ? <Check className="w-4 h-4" /> : null}
                  {challengeCompleted ? "Challenge Completed" : "Mark as Complete"}
                </button>
              </div>

              {/* Achievements Badges Grid */}
              <div className="glass-card p-6 space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2 flex items-center gap-2">
                  <Trophy className="w-4.5 h-4.5 text-yellow-500" /> Patient Achievement Badges
                </h3>
                {badges.length === 0 ? (
                  <p className="text-xs text-slate-500">Complete goals and challenges to unlock trophies here.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {badges.map((b) => (
                      <div key={b.id} className="p-4 bg-white/5 border border-rose-500/15 rounded-xl text-center flex flex-col items-center">
                        <Trophy className="w-8 h-8 text-yellow-500 mb-2" />
                        <span className="font-bold text-xs text-white block">{b.name}</span>
                        <span className="text-[8.5px] text-slate-400 mt-1 block leading-tight">{b.desc}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Right column: Recent Activity Timeline */}
            <div className="glass-card p-6 space-y-4 h-fit">
              <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">Health Log Activity Timeline</h3>
              {timeline.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No historical timeline logs found yet.</p>
              ) : (
                <div className="relative pl-4 border-l border-white/10 space-y-6 text-xs max-h-[360px] overflow-y-auto pr-2">
                  {timeline.map((event) => (
                    <div key={event.id} className="relative">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-slate-950 border border-rose-500 rounded-full" />
                      <p className="font-bold text-slate-200">{event.title}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{event.date}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </motion.div>
        )}

        {/* TAB 2: GOALS LIST & CREATION */}
        {activeTab === "goals" && (
          <motion.div 
            key="goals"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid lg:grid-cols-3 gap-6"
          >
            {/* Left column: Add goal form */}
            <div className="glass-card p-5 space-y-4 h-fit">
              <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">Create Custom Goal</h3>
              <form onSubmit={handleCreateGoal} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Goal Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Reduce daily calories by 400" 
                    className="w-full bg-[#0f172a]/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Category</label>
                    <select 
                      className="w-full bg-[#0f172a]/40 border border-white/10 rounded-xl px-3 py-2.5 text-slate-300"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {["Fitness", "BMI", "Weight", "Cholesterol", "Blood Pressure", "Heart Rate", "Water Intake", "Sleep", "Diet", "Medication", "Exercise", "Smoking", "Stress Management", "Custom"].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Priority</label>
                    <select 
                      className="w-full bg-[#0f172a]/40 border border-white/10 rounded-xl px-3 py-2.5 text-slate-300"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Target Value</label>
                    <input 
                      type="number" 
                      className="w-full bg-[#0f172a]/40 border border-white/10 rounded-xl px-3 py-2.5 text-white"
                      value={targetValue}
                      onChange={(e) => setTargetValue(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Current Value</label>
                    <input 
                      type="number" 
                      className="w-full bg-[#0f172a]/40 border border-white/10 rounded-xl px-3 py-2.5 text-white"
                      value={currentValue}
                      onChange={(e) => setCurrentValue(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Target Date</label>
                    <input 
                      type="date" 
                      className="w-full bg-[#0f172a]/40 border border-white/10 rounded-xl px-3 py-2.5 text-slate-350"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Frequency</label>
                    <select 
                      className="w-full bg-[#0f172a]/40 border border-white/10 rounded-xl px-3 py-2.5 text-slate-300"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Goal Notes</label>
                  <textarea 
                    rows="3" 
                    placeholder="Provide details about medications or habits..."
                    className="w-full bg-[#0f172a]/40 border border-white/10 rounded-xl px-4 py-2 text-white"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <PlusCircle className="w-4.5 h-4.5" /> Save Health Goal
                </button>
              </form>
            </div>

            {/* Right column: Goals progress cards */}
            <div className="lg:col-span-2 space-y-4">
              <div className="glass-card p-6 space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">Active Goals & Sliders</h3>
                
                {goals.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No goals set yet. Use the left panel form to add your first goal!</p>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {goals.map((g) => {
                      const daysRemaining = Math.max(0, Math.ceil((new Date(g.targetDate) - new Date()) / (1000*60*60*24)));
                      return (
                        <div key={g.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col justify-between gap-3 hover:border-rose-500/20 transition-all">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/10 uppercase tracking-widest">
                                {g.category}
                              </span>
                              <h4 className="font-bold text-xs text-white">{g.name}</h4>
                              <p className="text-[10px] text-slate-400 font-light">{g.notes}</p>
                            </div>
                            
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${g.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                              {g.priority} Priority
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-white/10 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-rose-500 h-full transition-all" style={{ width: `${g.percentage}%` }} />
                            </div>
                            <span className="text-xs font-bold text-slate-300 w-10 text-right">{g.percentage}%</span>
                          </div>

                          <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-white/5 pt-2.5">
                            <div className="flex items-center gap-2">
                              <span>Value: </span>
                              <input 
                                type="number" 
                                className="w-12 bg-white/5 border border-white/10 rounded px-1 text-center font-bold text-white text-[10.5px]"
                                value={g.currentValue}
                                onChange={(e) => handleUpdateProgress(g.id, e.target.value)}
                              />
                              <span>/ {g.targetValue}</span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span>{daysRemaining} days left</span>
                              <button 
                                onClick={() => handleDeleteGoal(g.id, g.name)}
                                className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: CALENDAR VIEW */}
        {activeTab === "calendar" && (
          <motion.div 
            key="calendar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-6 space-y-6"
          >
            <h3 className="text-md font-bold text-white border-b border-white/10 pb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-rose-500" /> Goal Calendar Schedule (June 2026)
            </h3>
            
            {/* Simple Grid Calendar representation */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="font-bold text-slate-400 py-2">{day}</div>
              ))}
              
              {/* Empty offset days for June 2026 (starts on Monday, offset 1 day) */}
              <div className="p-4" />

              {Array.from({ length: 30 }).map((_, i) => {
                const dayNum = i + 1;
                // Format day string matching goals targetDate (e.g. 2026-06-27)
                const formattedDay = `2026-06-${dayNum < 10 ? '0' + dayNum : dayNum}`;
                const dueGoals = goals.filter(g => g.targetDate === formattedDay);
                
                return (
                  <div key={i} className="p-2 bg-white/5 border border-white/5 rounded-xl min-h-[70px] flex flex-col justify-between hover:bg-white/10 transition-all text-left">
                    <span className="font-bold text-slate-400 text-[10px]">{dayNum}</span>
                    <div className="mt-1 space-y-1">
                      {dueGoals.map(g => (
                        <div 
                          key={g.id}
                          className={`px-1.5 py-0.5 rounded-[3px] text-[7.5px] font-bold truncate leading-none ${g.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}
                          title={g.name}
                        >
                          {g.name}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* TAB 4: SMART SUGGESTIONS */}
        {activeTab === "suggestions" && (
          <motion.div 
            key="suggestions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-6 space-y-6"
          >
            <h3 className="text-md font-bold text-white border-b border-white/10 pb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-500" /> Personalized Cardiac Goal Suggestions
            </h3>
            
            <p className="text-slate-400 text-xs leading-relaxed">
              Based on your latest cardiac prediction inputs, the CardioSense AI engine recommends adding these specific goals to your tracker list to manage cardiovascular risk factors.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {suggestions.map((sug, idx) => (
                <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center gap-4">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/10 uppercase tracking-widest">
                      {sug.cat}
                    </span>
                    <p className="font-bold text-xs text-white leading-normal">{sug.text}</p>
                    {sug.target && (
                      <p className="text-[10px] text-slate-400">Target Value: {sug.target} {sug.unit}</p>
                    )}
                  </div>
                  {sug.target ? (
                    <button 
                      onClick={() => handleAddSuggestion(sug)}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-sm"
                    >
                      Pre-fill Form
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex gap-3 text-xs text-slate-400 leading-relaxed max-w-3xl">
        <ShieldCheck className="w-5 h-5 text-health-500 shrink-0 mt-0.5" />
        <span><strong>Health Statement:</strong> Goals updates and streak days are processed within your patient context. Ensure you consult with your clinical cardiologist when making significant shifts to your workout or diet.</span>
      </div>

    </div>
  );
}
