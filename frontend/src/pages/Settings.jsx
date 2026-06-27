import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Settings as SettingsIcon, User, Moon, Sun, Trash2, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Settings() {
  const { user } = useAuth();
  
  // Theme state
  const [theme, setTheme] = useState(localStorage.getItem('cardio_theme') || 'dark');

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('cardio_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleClearHistory = () => {
    if (!window.confirm("WARNING: This will permanently delete your entire local assessment history. This action cannot be undone. Proceed?")) return;
    const historyKey = `cardio_history_${user?.uid}`;
    localStorage.removeItem(historyKey);
    alert("Prediction history cleared successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <SettingsIcon className="text-health-500" />
          Settings
        </h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account profile, theme interface, and health database settings.</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Card */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
            <User className="w-5 h-5 text-health-500" /> Profile Information
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400 font-bold uppercase text-xs">Full Name</p>
              <p className="text-white text-base font-semibold mt-1">{user?.user_metadata?.full_name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-slate-400 font-bold uppercase text-xs">Email Address</p>
              <p className="text-white text-base font-semibold mt-1">{user?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-slate-400 font-bold uppercase text-xs">Account Type</p>
              <p className="text-white text-base font-semibold mt-1">Firebase Protected User</p>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
            {theme === 'light' ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-rose-500" />}
            Interface Theme
          </h3>
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-white font-bold">Theme Mode Selection</p>
              <p className="text-slate-400 text-xs mt-1">Toggle between a clean light mode and the premium dark mode.</p>
            </div>
            <button 
              onClick={toggleTheme}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all text-white flex items-center gap-2 cursor-pointer shadow-sm"
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-rose-500" /> : <Sun className="w-4 h-4 text-yellow-500" />}
              Switch to {theme === 'light' ? 'Dark' : 'Light'}
            </button>
          </div>
        </div>

        {/* Database Management */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-lg font-bold text-red-400 flex items-center gap-2 border-b border-white/10 pb-2">
            <Trash2 className="w-5 h-5" /> Danger Zone
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
            <div>
              <p className="text-white font-bold">Clear Local Health Assessments</p>
              <p className="text-slate-400 text-xs mt-1">Permanently remove all prediction runs and history from this device.</p>
            </div>
            <button 
              onClick={handleClearHistory}
              className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <Trash2 className="w-4 h-4" /> Clear All History
            </button>
          </div>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl flex gap-3 shadow-sm max-w-3xl">
        <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-200/80 leading-relaxed font-light">
          <strong>Security Protocol:</strong> Your login authentication and settings variables are protected using standard encryption models. No biometric or user clinical markers are stored outside of your local browser context.
        </p>
      </div>
    </div>
  );
}
