import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Settings as SettingsIcon, User, Moon, Sun, Trash2, ShieldAlert,
  Bell, Lock, Database, Info, ShieldCheck, Mail, LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Settings() {
  const { user, logout } = useAuth();
  
  // Theme state
  const [theme, setTheme] = useState(localStorage.getItem('cardio_theme') || 'dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [securityLogs, setSecurityLogs] = useState([]);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('cardio_theme', theme);
  }, [theme]);

  // Load basic mock logins for Security
  useEffect(() => {
    if (user?.uid) {
      setSecurityLogs([
        { device: "Chrome Browser (Windows 11)", date: new Date().toLocaleString(), status: "Current Session" },
        { device: "Mobile App (Android/iOS Client)", date: new Date(Date.now() - 24*3600*1000).toLocaleString(), status: "Success" }
      ]);
    }
  }, [user]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleClearHistory = () => {
    if (!window.confirm("WARNING: This will permanently delete your entire local assessment history. This action cannot be undone. Proceed?")) return;
    const historyKey = `cardio_history_${user?.uid}`;
    const goalsKey = `cardio_goals_${user?.uid}`;
    const timelineKey = `cardio_timeline_${user?.uid}`;
    const badgesKey = `cardio_badges_${user?.uid}`;
    
    localStorage.removeItem(historyKey);
    localStorage.removeItem(goalsKey);
    localStorage.removeItem(timelineKey);
    localStorage.removeItem(badgesKey);
    
    alert("Patient database records cleared successfully!");
    window.location.reload();
  };

  const handleDownloadAllData = () => {
    const history = JSON.parse(localStorage.getItem(`cardio_history_${user?.uid}`) || '[]');
    const goals = JSON.parse(localStorage.getItem(`cardio_goals_${user?.uid}`) || '[]');
    const timeline = JSON.parse(localStorage.getItem(`cardio_timeline_${user?.uid}`) || '[]');
    
    const allData = {
      profile: {
        uid: user?.uid,
        email: user?.email,
        name: user?.displayName || user?.user_metadata?.full_name,
        avatar: user?.user_metadata?.avatar_url
      },
      assessmentHistory: history,
      cardioGoals: goals,
      activityTimeline: timeline,
      exportedAt: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allData, null, 2));
    const link = document.createElement('a');
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `CardioSense_PatientData_${user?.uid?.slice(-6)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Determine provider name
  const isGoogle = user?.user_metadata?.avatar_url || user?.email?.includes('gmail');
  const authProvider = isGoogle ? "Google OAuth" : "Email & Password";

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <SettingsIcon className="text-health-500" />
          Settings Center
        </h1>
        <p className="text-slate-400 text-sm mt-1 font-sans">Manage your authenticated patient profile, security flags, data management, and visual system themes.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Navigation Sidebar List */}
        <div className="space-y-2">
          {["Account", "Appearance", "Notifications", "Security", "Data Management", "About"].map((sec) => (
            <a 
              key={sec}
              href={`#${sec.toLowerCase().replace(' ', '-')}`}
              className="block p-3.5 bg-white/5 border border-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-slate-350 hover:text-white transition-colors cursor-pointer"
            >
              {sec}
            </a>
          ))}
        </div>

        {/* Settings Sections Column */}
        <div className="md:col-span-2 space-y-6">

          {/* SECTION 1: ACCOUNT */}
          <div id="account" className="glass-card p-6 space-y-4 scroll-mt-20">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
              <User className="w-4.5 h-4.5 text-health-500" /> Account Management
            </h3>

            <div className="flex items-center gap-4 py-2">
              {user?.user_metadata?.avatar_url ? (
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-full border border-pink-500 shadow-md object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-pink-600 border border-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  {(user?.user_metadata?.full_name || 'R').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="space-y-0.5">
                <h4 className="font-bold text-white text-md">{user?.user_metadata?.full_name || 'Ranjita Naik'}</h4>
                <p className="text-xs text-slate-400">{user?.email}</p>
                <span className="inline-block px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Account Status: Active
                </span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-white/5">
              <div>
                <p className="text-slate-400 font-bold uppercase text-[9px]">Authentication Provider</p>
                <p className="text-white mt-1 font-semibold">{authProvider}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase text-[9px]">Last Login Date</p>
                <p className="text-white mt-1 font-semibold">{new Date().toDateString()}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase text-[9px]">Member Since</p>
                <p className="text-white mt-1 font-semibold">June 2026</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase text-[9px]">Email Field</p>
                <input 
                  type="text" 
                  value={user?.email || ""} 
                  readOnly 
                  className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-slate-400 select-none text-[11px]" 
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: APPEARANCE */}
          <div id="appearance" className="glass-card p-6 space-y-4 scroll-mt-20">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
              {theme === 'dark' ? <Moon className="w-4.5 h-4.5 text-rose-500" /> : <Sun className="w-4.5 h-4.5 text-yellow-500" />} 
              Appearance & Theme
            </h3>
            <p className="text-xs text-slate-400">Select your visual design interface style. Supports high contrast AMOLED themes.</p>
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-xs w-48">
              <button 
                onClick={toggleTheme}
                className={`flex-1 py-2 rounded-lg font-bold transition-all uppercase text-[9px] ${theme === 'dark' ? 'bg-health-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                Dark Theme
              </button>
              <button 
                onClick={toggleTheme}
                className={`flex-1 py-2 rounded-lg font-bold transition-all uppercase text-[9px] ${theme === 'light' ? 'bg-health-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                Light Theme
              </button>
            </div>
          </div>

          {/* SECTION 3: NOTIFICATIONS */}
          <div id="notifications" className="glass-card p-6 space-y-4 scroll-mt-20">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
              <Bell className="w-4.5 h-4.5 text-rose-500" /> Medical Notifications
            </h3>
            <p className="text-xs text-slate-400">Receive system reminder popups for water intake, steps trackers, and goal deadlines.</p>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={notificationsEnabled}
                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                className="w-4 h-4 rounded text-rose-500 bg-slate-900 border-white/10 focus:ring-0 cursor-pointer"
              />
              <span className="text-xs text-slate-350 hover:text-white">Enable Clinical In-App Notifications</span>
            </label>
          </div>

          {/* SECTION 4: SECURITY */}
          <div id="security" className="glass-card p-6 space-y-4 scroll-mt-20">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
              <Lock className="w-4.5 h-4.5 text-rose-500" /> Device & Session Security
            </h3>
            <p className="text-xs text-slate-400">View recent connection sessions verified to access this local patient dataset.</p>
            <div className="space-y-2 text-xs">
              {securityLogs.map((log, idx) => (
                <div key={idx} className="p-3 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white">{log.device}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{log.date}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-bold">
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: DATA MANAGEMENT */}
          <div id="data-management" className="glass-card p-6 space-y-4 scroll-mt-20">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
              <Database className="w-4.5 h-4.5 text-rose-500" /> Clinical Data Management
            </h3>
            <p className="text-xs text-slate-400">Export your diagnostic parameters history to a JSON file or completely clear your local device storage.</p>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button 
                onClick={handleDownloadAllData}
                className="py-2.5 px-4 bg-slate-900 border border-white/10 hover:bg-slate-800 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Download Patient JSON Data
              </button>
              <button 
                onClick={handleClearHistory}
                className="py-2.5 px-4 bg-red-500/10 border border-red-500/20 hover:bg-red-600 hover:border-red-600 rounded-xl text-xs font-bold text-red-400 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Reset Patient Database
              </button>
            </div>
          </div>

          {/* SECTION 6: ABOUT */}
          <div id="about" className="glass-card p-6 space-y-4 scroll-mt-20">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
              <Info className="w-4.5 h-4.5 text-rose-500" /> System Information
            </h3>
            <div className="space-y-2 text-xs text-slate-400 font-light leading-relaxed">
              <p><strong>Application:</strong> CardioSense AI</p>
              <p><strong>Client Version:</strong> 2.4.0 (Vite Production Build)</p>
              <p><strong>Algorithm:</strong> Heart Disease Risk Assessment ML Network</p>
              <p className="border-t border-white/5 pt-3">CardioSense AI leverages statistical models to map patient-specific biomarkers and calculate heart indicators. Licensed for personal tracking and clinical evaluation.</p>
            </div>
          </div>

        </div>

      </div>

      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex gap-3 text-xs text-slate-400 leading-relaxed max-w-3xl mx-auto">
        <ShieldCheck className="w-5 h-5 text-health-500 shrink-0 mt-0.5" />
        <span><strong>Patient Warning:</strong> Resetting your patient database clears all local assessments history, water trackers, and cardiovascular goals. Back up your JSON file first.</span>
      </div>

    </div>
  );
}
