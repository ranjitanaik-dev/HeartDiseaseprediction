import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, HeartPulse, History, FileText, Sparkles, 
  HelpCircle, Settings as SettingsIcon, LogOut, Bell, Sun, Moon, Menu, X,
  ChevronDown, Calendar, Search, TrendingUp, Target, Activity, User
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Theme state: read from local storage
  const [theme, setTheme] = useState(localStorage.getItem('cardio_theme') || 'dark');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Heart Prediction', path: '/predict', icon: <HeartPulse className="w-5 h-5" /> },
    { name: 'Health Analytics', path: '/health-analytics', icon: <TrendingUp className="w-5 h-5" /> },
    { name: 'Prediction History', path: '/history', icon: <History className="w-5 h-5" /> },
    { name: 'Medical Reports', path: '/reports', icon: <FileText className="w-5 h-5" /> },
    { name: 'Health Insights', path: '/health-insights', icon: <Sparkles className="w-5 h-5" /> },
    { name: 'Health Goals', path: '/health-goals', icon: <Target className="w-5 h-5" /> },
    { name: 'Health Tips', path: '/health-tips', icon: <Activity className="w-5 h-5" /> },
    { name: 'FAQ', path: '/faq', icon: <HelpCircle className="w-5 h-5" /> },
    { name: 'Settings', path: '/settings', icon: <SettingsIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 text-health-500 font-bold text-xl">
          <HeartPulse className="w-6 h-6 fill-current animate-pulse text-rose-500" />
          <span className="text-white">CardioSense</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-300"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-rose-500" /> : <Sun className="w-4 h-4 text-yellow-500" />}
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-400 hover:text-white">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 h-screen w-64 border-r border-white/10 bg-slate-950/95 md:bg-slate-900/50 backdrop-blur-xl flex-col
        transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        flex
      `}>
        <div className="p-6 hidden md:flex items-center gap-2 text-health-500 font-bold text-xl border-b border-white/10">
          <HeartPulse className="w-8 h-8 fill-current text-rose-500" />
          CardioSense AI
        </div>

        <div className="p-6 border-b border-white/10">
          <p className="text-xs text-slate-400 leading-none">Welcome back,</p>
          <p className="font-bold text-md truncate text-white mt-1.5">{user?.user_metadata?.full_name || 'Guest User'}</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path === '/predict' && location.pathname.startsWith('/predict'));
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-health-500/10 text-health-500 font-semibold border-l-2 border-rose-500' 
                    : 'text-slate-400 hover:text-slate-55 hover:bg-white/5'}
                `}
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 w-full text-left transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/20 backdrop-blur-md sticky top-0 z-30">
          
          {/* Quick Search */}
          <div className="relative w-72">
            <input 
              type="text" 
              placeholder="Search reports, metrics..." 
              className="w-full bg-[#0f172a]/40 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-rose-500 transition-all font-sans"
              onChange={(e) => {
                // Set keyword in local storage for reports filtering
                localStorage.setItem('quick_search_query', e.target.value);
                // Dispatch custom event to notify Reports component
                window.dispatchEvent(new Event('quick_search_updated'));
              }}
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          </div>
          
          <div className="flex items-center gap-6">
            {/* Notifications */}
            <button className="p-2 text-slate-400 hover:text-white transition-colors relative cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            </button>

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5 text-rose-500" /> : <Sun className="w-5 h-5 text-yellow-500" />}
            </button>

            {/* User Profile Card with Dropdown Menu */}
            <div className="relative">
              <div 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 bg-[#0f172a]/40 hover:bg-[#0f172a]/60 border border-white/5 px-4 py-2 rounded-2xl transition-all cursor-pointer select-none"
              >
                {user?.user_metadata?.avatar_url ? (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt={user.user_metadata.full_name || 'User'} 
                    className="w-10 h-10 rounded-full border border-pink-500 shadow-md object-cover select-none"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-pink-600 border border-pink-500 flex items-center justify-center text-white font-bold text-base shadow-md select-none font-sans">
                    {(user?.user_metadata?.full_name || 'R').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col text-left">
                  <span className="font-bold text-white text-sm leading-none font-sans">{user?.user_metadata?.full_name || 'Ranjita Naik'}</span>
                  <span className="text-[9px] text-slate-400 font-semibold leading-none mt-1 font-sans">{user?.email}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 ml-1 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Profile Dropdown Menu */}
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-slate-905 border border-white/10 rounded-2xl shadow-xl py-2 z-20 text-xs">
                    <Link 
                      to="/profile" 
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 transition-colors font-semibold"
                    >
                      <User className="w-4 h-4 text-rose-500" /> View Profile
                    </Link>
                    <Link 
                      to="/reports" 
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 transition-colors font-semibold"
                    >
                      <FileText className="w-4 h-4 text-rose-500" /> My Reports
                    </Link>
                    <Link 
                      to="/history" 
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 transition-colors font-semibold"
                    >
                      <History className="w-4 h-4 text-rose-500" /> Prediction History
                    </Link>
                    <Link 
                      to="/health-goals" 
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 transition-colors font-semibold"
                    >
                      <Target className="w-4 h-4 text-rose-500" /> Health Goals
                    </Link>
                    <Link 
                      to="/settings" 
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 transition-colors font-semibold"
                    >
                      <SettingsIcon className="w-4 h-4 text-rose-500" /> Settings
                    </Link>
                    <Link 
                      to="/faq" 
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 transition-colors font-semibold"
                    >
                      <HelpCircle className="w-4 h-4 text-rose-500" /> Help & Support
                    </Link>
                    <div className="border-t border-white/5 my-1" />
                    <button 
                      onClick={() => {
                        setProfileOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors font-bold text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content & Footer Wrapper */}
        <main className="flex-1 w-full relative flex flex-col justify-between">
          <div className="container mx-auto p-4 md:p-8 flex-grow space-y-6">
            {/* Date Card matching the shared photo */}
            <div className="flex justify-end mb-2">
              <div className="flex items-center gap-2 bg-[#0f172a]/40 border border-white/5 px-4 py-2.5 rounded-2xl text-slate-300 text-sm font-semibold select-none font-sans shadow-sm">
                <Calendar className="w-4.5 h-4.5 text-slate-400" />
                <span>
                  {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  {" • "}
                  {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            </div>
            <Outlet />
          </div>

          {/* Simple layout footer - no email, no heroes buttons */}
          <footer className="border-t border-white/10 p-6 bg-slate-900/30 text-center text-xs text-slate-400 mt-8">
            <p>&copy; {new Date().getFullYear()} CardioSense AI. All rights reserved. Confidential Patient Portal.</p>
          </footer>
        </main>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
