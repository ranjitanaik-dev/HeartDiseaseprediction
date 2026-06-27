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
  
  // Navigation Menus states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  
  // Real-time Notifications states
  const [notifications, setNotifications] = useState([]);
  const [notifsOpen, setNotifsOpen] = useState(false);
  const [mobileNotifsOpen, setMobileNotifsOpen] = useState(false);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [theme, setTheme] = useState(localStorage.getItem('cardio_theme') || 'dark');

  // Sync date ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync theme
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('cardio_theme', theme);
  }, [theme]);

  // Load and sync notifications
  const loadNotifications = () => {
    if (user?.uid) {
      const saved = JSON.parse(localStorage.getItem(`cardio_notifs_${user.uid}`) || '[]');
      setNotifications(saved);
    }
  };

  useEffect(() => {
    loadNotifications();
    window.addEventListener('notifications_updated', loadNotifications);
    const interval = setInterval(loadNotifications, 5000);
    return () => {
      window.removeEventListener('notifications_updated', loadNotifications);
      clearInterval(interval);
    };
  }, [user]);

  const handleClearNotif = (id) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    if (user?.uid) localStorage.setItem(`cardio_notifs_${user.uid}`, JSON.stringify(updated));
  };

  const handleClearAllNotifs = () => {
    setNotifications([]);
    if (user?.uid) localStorage.removeItem(`cardio_notifs_${user.uid}`);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
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

  const formatHeaderTime = (date) => {
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#020617] text-slate-100 font-sans">
      
      {/* 1. Mobile & Tablet Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-slate-905/80 backdrop-blur-md sticky top-0 z-50 select-none">
        <div className="flex items-center gap-2 text-health-500 font-bold text-lg">
          <HeartPulse className="w-6 h-6 fill-current animate-pulse text-rose-500" />
          <span className="text-white">CardioSense</span>
        </div>
        
        <div className="flex items-center gap-2.5">
          {/* Mobile Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-350"
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-rose-500" /> : <Sun className="w-4 h-4 text-yellow-500" />}
          </button>

          {/* Mobile Notifications Bell */}
          <div className="relative">
            <button 
              onClick={() => setMobileNotifsOpen(!mobileNotifsOpen)}
              className="p-2 text-slate-400 hover:text-white transition-colors relative cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
              )}
            </button>
            {mobileNotifsOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMobileNotifsOpen(false)} />
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-white/10 rounded-2xl shadow-xl py-2 z-20 text-xs max-h-[280px] overflow-y-auto">
                  <div className="px-4 py-1.5 border-b border-white/5 font-bold text-white flex justify-between items-center">
                    <span>Alerts</span>
                    {notifications.length > 0 && (
                      <button onClick={handleClearAllNotifs} className="text-[9px] text-rose-400 font-bold">Clear All</button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <p className="p-4 text-slate-500 text-center font-light">No new alerts</p>
                  ) : (
                    <div className="divide-y divide-white/5">
                      {notifications.map((n) => (
                        <div key={n.id} className="p-3 flex justify-between items-center gap-2">
                          <div>
                            <p className="text-slate-200 leading-tight">{n.text}</p>
                            <span className="text-[8px] text-slate-550 mt-0.5 block">{n.date}</span>
                          </div>
                          <button onClick={() => handleClearNotif(n.id)} className="text-slate-500"><X className="w-3 h-3" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile User Profile Avatar */}
          <div className="relative">
            <button onClick={() => setMobileProfileOpen(!mobileProfileOpen)} className="w-8 h-8 rounded-full overflow-hidden border border-pink-500 shadow-sm cursor-pointer">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full bg-pink-600 flex items-center justify-center text-white font-bold text-xs select-none">
                  {(user?.user_metadata?.full_name || 'R').charAt(0).toUpperCase()}
                </div>
              )}
            </button>
            {mobileProfileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMobileProfileOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-2xl shadow-xl py-2 z-20 text-xs">
                  <Link to="/profile" onClick={() => setMobileProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-slate-300"><User className="w-4 h-4 text-rose-500" /> My Profile</Link>
                  <Link to="/settings" onClick={() => setMobileProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-slate-300"><SettingsIcon className="w-4 h-4 text-rose-500" /> Settings</Link>
                  <div className="border-t border-white/5 my-1" />
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-400 font-bold"><LogOut className="w-4 h-4 inline mr-2" /> Logout</button>
                </div>
              </>
            )}
          </div>

          {/* Hamburger Menu Toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-400 hover:text-white">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 2. Sidebar Drawer (Responsive Collapsible) */}
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

        <div className="p-6 border-b border-white/10 select-none">
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
                  flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold transition-colors
                  ${isActive 
                    ? 'bg-health-500/10 text-health-500 font-bold border-l-2 border-rose-500' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'}
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
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-400/10 w-full text-left transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* 3. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/20 backdrop-blur-md sticky top-0 z-30 select-none">
          {/* Quick Search */}
          <div className="relative w-72">
            <input 
              type="text" 
              placeholder="Search reports, metrics..." 
              className="w-full bg-[#0f172a]/40 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-rose-500 transition-all font-sans"
              onChange={(e) => {
                localStorage.setItem('quick_search_query', e.target.value);
                window.dispatchEvent(new Event('quick_search_updated'));
              }}
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          </div>
          
          <div className="flex items-center gap-6">
            
            {/* Desktop Notifications Bell */}
            <div className="relative">
              <button 
                onClick={() => setNotifsOpen(!notifsOpen)}
                className="p-2 text-slate-400 hover:text-white transition-colors relative cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                )}
              </button>
              {notifsOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setNotifsOpen(false)} />
                  <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-white/10 rounded-2xl shadow-xl py-2 z-20 text-xs text-left max-h-[300px] overflow-y-auto">
                    <div className="px-4 py-1.5 border-b border-white/5 font-bold text-white flex justify-between items-center">
                      <span>Notifications</span>
                      {notifications.length > 0 && (
                        <button onClick={handleClearAllNotifs} className="text-[9px] text-rose-400 font-bold">Clear All</button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <p className="p-4 text-slate-500 text-center font-light">No new alerts</p>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {notifications.map((n) => (
                          <div key={n.id} className="p-3 flex justify-between items-center gap-2">
                            <div>
                              <p className="text-slate-200 leading-normal font-medium">{n.text}</p>
                              <span className="text-[9px] text-slate-500 mt-0.5 block">{n.date}</span>
                            </div>
                            <button onClick={() => handleClearNotif(n.id)} className="text-slate-500"><X className="w-3 h-3" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Desktop Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5 text-rose-500" /> : <Sun className="w-5 h-5 text-yellow-500" />}
            </button>

            {/* Desktop User Profile Card Dropdown Menu */}
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

        {/* Content Section */}
        <main className="flex-1 w-full relative flex flex-col justify-between overflow-x-hidden">
          <div className="container mx-auto p-4 md:p-8 flex-grow space-y-6">
            
            {/* Ticking Time Banner */}
            <div className="flex justify-end mb-2 select-none no-print">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-white/10 rounded-2xl text-xs font-bold text-slate-300">
                <Calendar className="w-4 h-4 text-rose-500" />
                <span className="font-mono">{formatHeaderTime(currentTime)}</span>
              </div>
            </div>

            <Outlet />
          </div>

          {/* Simple Privacy Footer */}
          <footer className="w-full py-4 border-t border-white/10 text-center text-[10px] text-slate-500 no-print select-none">
            Patient Bio-Data Encrypted Client Sandbox • CardioSense AI © {new Date().getFullYear()}
          </footer>
        </main>
      </div>

    </div>
  );
}
