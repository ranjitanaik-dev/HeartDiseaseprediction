import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, HeartPulse, History, FileText, Sparkles, 
  HelpCircle, Settings as SettingsIcon, LogOut, Bell, Sun, Moon, Menu, X 
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Theme state: read from local storage
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
    { name: 'Prediction History', path: '/history', icon: <History className="w-5 h-5" /> },
    { name: 'Reports', path: '/reports', icon: <FileText className="w-5 h-5" /> },
    { name: 'Health Tips', path: '/health-tips', icon: <Sparkles className="w-5 h-5" /> },
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
                      ? 'bg-health-500/10 text-health-500' 
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
          <div className="text-sm text-slate-400 font-medium">
            Welcome back, <span className="text-white font-bold">{user?.user_metadata?.full_name || 'User'}</span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-4.5 h-4.5 text-rose-500" /> : <Sun className="w-4.5 h-4.5 text-yellow-500" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors relative cursor-pointer">
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
              </button>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-2 border-l border-white/10">
              <div className="w-9 h-9 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-500 font-bold text-sm shadow-sm select-none">
                {(user?.user_metadata?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-white text-xs leading-none">{user?.user_metadata?.full_name || 'User'}</span>
                <span className="text-[9px] text-slate-400 font-semibold mt-1 leading-none">{user?.email}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content & Footer Wrapper */}
        <main className="flex-1 w-full relative flex flex-col justify-between">
          <div className="container mx-auto p-4 md:p-8 flex-grow">
            <Outlet />
          </div>

          {/* Required Layout Footer */}
          <footer className="border-t border-white/10 p-6 bg-slate-900/30 text-center flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400 mt-8">
            <div className="text-left">
              <p className="font-bold text-white text-sm leading-tight">Ranjita Naik</p>
              <p className="text-[11px] text-slate-400 mt-1">ranjitanaik062@gmail.com</p>
            </div>
            <div>
              <a 
                href="https://digitalheroesco.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white rounded-full font-bold text-xs transition-all shadow-[0_0_20px_rgba(225,29,72,0.3)] inline-block uppercase tracking-widest cursor-pointer transform hover:scale-105"
              >
                Built for Digital Heroes
              </a>
            </div>
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
