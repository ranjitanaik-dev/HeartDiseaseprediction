import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HeartPulse, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Visual Side */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-health-900/40 to-slate-900/80 border-r border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-health-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />
          
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 text-health-500 font-bold text-2xl mb-8">
              <HeartPulse className="w-8 h-8 fill-current" />
              CardioSense AI
            </Link>
            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
              Welcome back to your health companion.
            </h2>
            <p className="text-slate-400">
              Access your personalized risk assessments, clinical insights, and health history securely.
            </p>
          </div>
          
          <div className="relative z-10 glass-card p-6 mt-8">
            <p className="text-sm italic text-slate-300">
              "The lifestyle assessment made me more aware of my heart health. Simple, understandable, and very helpful."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-health-500/20 flex items-center justify-center text-health-500 font-bold text-xs">MK</div>
              <span className="text-sm font-medium text-slate-400">Michael K.</span>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="md:hidden flex items-center gap-2 text-health-500 font-bold text-xl mb-8">
            <HeartPulse className="w-6 h-6 fill-current" />
            CardioSense AI
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-2xl font-bold text-white mb-2">Sign in to your account</h1>
            <p className="text-slate-400 mb-8 text-sm">
              Don't have an account? <Link to="/register" className="text-health-500 hover:text-health-400 font-medium transition-colors">Sign up securely</Link>
            </p>

            {error && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-health-500/50 focus:border-health-500 transition-all placeholder:text-slate-600"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-300">Password</label>
                  <button type="button" className="text-xs text-health-500 hover:text-health-400 transition-colors">Forgot password?</button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-health-500/50 focus:border-health-500 transition-all placeholder:text-slate-600"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-health-600 hover:bg-health-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-3 px-4 font-bold transition-all flex items-center justify-center gap-2 group mt-8"
              >
                {loading ? 'Signing in...' : 'Sign In'}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
