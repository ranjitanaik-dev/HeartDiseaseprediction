import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, HeartPulse, Activity, Stethoscope, History, FileText, User, LogOut, Menu, X } from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = [
    { name: 'Dashboard Home', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Basic Health Check', path: '/predict/basic', icon: <HeartPulse className="w-5 h-5" /> },
    { name: 'Advanced Analysis', path: '/predict/advanced', icon: <Activity className="w-5 h-5" /> },
    { name: 'AI Symptom Analyzer', path: '/analyze', icon: <Stethoscope className="w-5 h-5" /> },
    // You can add paths to these when you create the pages:
    // { name: 'Prediction History', path: '/history', icon: <History className="w-5 h-5" /> },
    // { name: 'Reports', path: '/reports', icon: <FileText className="w-5 h-5" /> },
  ];

  const getFirstName = () => {
    const fullName = user?.user_metadata?.full_name || 'User';
    return fullName.split(' ')[0];
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 text-health-500 font-bold text-xl">
          <HeartPulse className="w-6 h-6 fill-current" />
          CardioSense
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-400 hover:text-white">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 h-screen w-64 border-r border-white/10 bg-slate-900/50 backdrop-blur-md flex-col
        transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        flex
      `}>
        <div className="p-6 hidden md:flex items-center gap-2 text-health-500 font-bold text-xl border-b border-white/10">
          <HeartPulse className="w-8 h-8 fill-current" />
          CardioSense AI
        </div>

        <div className="p-6 border-b border-white/10">
          <p className="text-sm text-slate-400">Welcome back,</p>
          <p className="font-bold text-lg truncate">{user?.user_metadata?.full_name || user?.email}</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-health-500/10 text-health-500' 
                    : 'text-slate-400 hover:text-slate-50 hover:bg-white/5'}
                `}
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          {/* <button className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-50 hover:bg-white/5 w-full text-left transition-colors">
            <User className="w-5 h-5" />
            Profile
          </button> */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 w-full text-left transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full relative">
        <div className="container mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>

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
