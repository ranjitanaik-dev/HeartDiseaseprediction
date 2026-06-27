import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  HeartPulse, ShieldCheck, Activity, Brain, ArrowRight, CheckCircle2, 
  FileText, Lock, Users, Phone, Mail, MapPin, Stethoscope, 
  ChevronRight, Heart, BarChart3, LineChart, MessageSquare
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <div className="bg-slate-950 text-slate-50 font-sans selection:bg-rose-500/30 selection:text-rose-200 overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-16 md:pt-40 md:pb-32 flex items-start lg:items-center min-h-screen overflow-hidden">
        {/* Abstract Glow Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-rose-600/20 rounded-full blur-[120px] mix-blend-screen opacity-60 animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-600/15 rounded-full blur-[150px] mix-blend-screen opacity-40" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 z-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 text-rose-300 text-sm font-semibold mb-8 border border-rose-500/20 backdrop-blur-sm shadow-[0_0_15px_rgba(244,63,94,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              AI-Powered Preventive Healthcare
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 leading-[1.1] tracking-tight">
              Your Heart Deserves <br className="hidden md:block"/> Early Care, <br className="hidden md:block"/>
              <span className="bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent">Not Late Regret.</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-8 sm:mb-10 max-w-xl leading-relaxed font-light">
              AI-powered heart risk assessment platform helping people understand their heart health through smart lifestyle and clinical analysis.
            </p>
             <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link to={user ? "/dashboard" : "/login"} className="w-full sm:w-auto px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-full font-bold text-lg transition-all transform hover:-translate-y-1 shadow-[0_0_30px_rgba(225,29,72,0.4)] flex items-center justify-center gap-2 group">
                Start Prediction
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-bold text-lg transition-all text-center backdrop-blur-md flex items-center justify-center gap-2 text-slate-200">
                Learn More
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative block h-[380px] sm:h-[480px] lg:h-[600px] w-full mt-8 lg:mt-0"
          >
            {/* Main Interactive Glass Element */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-800/40 to-slate-900/40 rounded-[2rem] sm:rounded-[3rem] backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden rotate-2">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
              
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <Heart className="w-32 h-32 sm:w-48 sm:h-48 text-rose-500 fill-rose-500/20 drop-shadow-[0_0_30px_rgba(225,29,72,0.4)]" />
                {/* Heartbeat EKG line inside */}
                <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-20 sm:h-20 text-white opacity-80" />
              </motion.div>

              {/* Floating Stat 1 */}
              <motion.div 
                animate={{ y: [-15, 15, -15] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-8 left-4 sm:top-16 sm:left-8 bg-slate-900/80 backdrop-blur-md p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 shadow-xl flex items-center gap-3 sm:gap-4"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-medium">AI Accuracy</p>
                  <p className="font-bold text-sm sm:text-lg text-white">98.5%</p>
                </div>
              </motion.div>

              {/* Floating Stat 2 */}
              <motion.div 
                animate={{ y: [15, -15, 15] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-8 right-4 sm:bottom-24 sm:right-8 bg-slate-900/80 backdrop-blur-md p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 shadow-xl flex items-center gap-3 sm:gap-4"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-medium">Risk Status</p>
                  <p className="font-bold text-sm sm:text-lg text-white">Analyzed</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. TRUST / AWARENESS SECTION */}
      <section className="py-24 bg-slate-900 relative border-y border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-900/10 via-slate-900/0 to-slate-900/0"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
            <HeartPulse className="w-12 h-12 text-rose-500 mx-auto mb-6 opacity-80" />
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-6 sm:mb-8 leading-tight">
              Millions of people ignore early symptoms until it becomes serious.
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 font-light italic">
              "Early awareness can save lives. Our mission is to provide you with the insights you need to take proactive steps towards a healthier, longer life."
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <StatCounter end="10K+" label="Users Screened" />
            <StatCounter end="98%" label="AI Accuracy" />
            <StatCounter end="24/7" label="Symptom Analysis" />
            <StatCounter end="100%" label="Data Privacy" />
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section id="features" className="py-20 sm:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Advanced Healthcare Intelligence</h2>
            <p className="text-base sm:text-lg text-slate-400 font-light">A comprehensive suite of tools designed to provide clarity, safety, and actionable insights about your heart health.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <FeatureCard 
              icon={<HeartPulse />} title="Basic Lifestyle Risk Check"
              description="Quick, non-invasive assessment based on daily habits and metrics."
            />
            <FeatureCard 
              icon={<Activity />} title="Advanced Clinical Prediction"
              description="High-accuracy ML prediction utilizing detailed medical lab reports."
            />
            <FeatureCard 
              icon={<MessageSquare />} title="AI Symptom Analyzer"
              description="Describe how you feel naturally, and our AI will assess potential risks."
            />
            <FeatureCard 
              icon={<Brain />} title="Explainable AI Insights"
              description="Understand exactly why the AI made a prediction using SHAP visualization."
            />
            <FeatureCard 
              icon={<FileText />} title="Medical Report Upload"
              description="Download comprehensive PDF reports to share directly with your doctor."
            />
            <FeatureCard 
              icon={<LineChart />} title="Prediction History Dashboard"
              description="Track your heart health risk trends over time with beautiful charts."
            />
            <FeatureCard 
              icon={<CheckCircle2 />} title="Personalized Recommendations"
              description="Receive actionable lifestyle and medical advice based on your unique profile."
            />
            <FeatureCard 
              icon={<Lock />} title="Secure Supabase Auth"
              description="Bank-level security ensuring your private health data stays completely confidential."
            />
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 bg-slate-900/50 border-y border-white/5 relative">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Your Path to Awareness</h2>
            <p className="text-lg text-slate-400 font-light">A seamless, secure experience designed to give you clarity in minutes.</p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute left-1/2 top-10 bottom-10 w-0.5 bg-gradient-to-b from-rose-500 via-blue-500 to-slate-800 -translate-x-1/2" />

            <div className="space-y-16">
              <TimelineStep number="1" title="Register / Login" desc="Create a secure, private account using our encrypted authentication system." align="left" icon={<Users />} />
              <TimelineStep number="2" title="Choose Prediction Mode" desc="Select Basic for lifestyle questions, or Advanced if you have recent clinical lab results." align="right" icon={<BarChart3 />} />
              <TimelineStep number="3" title="Enter Symptoms or Medical Details" desc="Provide your health data into our intuitive, user-friendly clinical forms." align="left" icon={<Stethoscope />} />
              <TimelineStep number="4" title="AI Analyzes Risk" desc="Our advanced machine learning models process your data in milliseconds." align="right" icon={<Brain />} />
              <TimelineStep number="5" title="View Insights & Recommendations" desc="Receive a detailed breakdown of your risk profile, explainable metrics, and what to do next." align="left" icon={<FileText />} />
            </div>
          </div>
        </div>
      </section>

      {/* 5. AI HEALTH INSIGHTS SECTION */}
      <section className="py-20 sm:py-32 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-rose-600/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                Understand Your Heart <br/> With <span className="text-rose-500">Precision AI.</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-300 font-light mb-6 sm:mb-8">
                CardioSense doesn't just give you a number. Our Explainable AI breaks down exactly which factors (like cholesterol, stress, or age) are contributing most to your risk, empowering you with knowledge.
              </p>
              <ul className="space-y-5 mb-10">
                <li className="flex items-center gap-4 text-slate-200">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  Highly accurate preventive healthcare models
                </li>
                <li className="flex items-center gap-4 text-slate-200">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  Smart natural language symptom analysis
                </li>
                <li className="flex items-center gap-4 text-slate-200">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  Actionable, personalized health recommendations
                </li>
              </ul>
              <Link to={user ? "/dashboard" : "/login"} className="inline-flex items-center gap-2 text-rose-400 font-bold hover:text-rose-300 transition-colors">
                Explore the Dashboard <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.div>

            {/* Dashboard Mockup */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl relative z-10 backdrop-blur-xl">
                {/* Mock Header */}
                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <HeartPulse className="w-6 h-6 text-rose-500" />
                    <span className="font-bold text-lg">Health Overview</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-800" />
                </div>
                
                {/* Mock Content */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5">
                      <p className="text-xs text-slate-400 mb-1">Current Risk Level</p>
                      <p className="text-2xl font-black text-rose-500">18.4%</p>
                    </div>
                    <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5">
                      <p className="text-xs text-slate-400 mb-1">Status</p>
                      <p className="text-lg font-bold text-green-400">Stable</p>
                    </div>
                  </div>
                  
                  {/* Mock Chart */}
                  <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 h-40 flex items-end gap-2 justify-between pt-10">
                    {[30, 45, 25, 60, 40, 20, 50].map((height, i) => (
                      <div key={i} className="w-full bg-blue-500/20 rounded-t-sm hover:bg-blue-500/40 transition-colors relative group" style={{ height: `${height}%` }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {height}%
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-start gap-4">
                    <Brain className="w-6 h-6 text-rose-500 shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-bold text-rose-200 mb-1">AI Recommendation</p>
                      <p className="text-xs text-slate-300">Your cholesterol levels indicate a slight elevation. Consider increasing cardiovascular exercise to 3 times a week.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Blur behind mockup */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-rose-600/20 to-blue-600/20 rounded-[2rem] blur-xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIAL SECTION */}
      <section className="py-24 bg-slate-900 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stories of Awareness</h2>
            <p className="text-slate-400">Real people taking control of their heart health.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <TestimonialCard 
              quote="CardioSense AI helped me become more aware of my lifestyle habits before they became serious. It's incredibly easy to use and very eye-opening."
              name="Sarah Jenkins"
              role="Working Professional"
            />
            <TestimonialCard 
              quote="Uploading my lab results into the Advanced Clinical tool gave me a clear, understandable breakdown of my risk. It made my doctor's visit much more productive."
              name="Michael Chang"
              role="Patient"
            />
            <TestimonialCard 
              quote="The Symptom Analyzer is brilliant. I was feeling fatigued and it helped map my symptoms to suggest a check-up. Truly a life-saving awareness platform."
              name="David Rodriguez"
              role="Health Enthusiast"
            />
          </div>
        </div>
      </section>

      {/* 7. ABOUT SECTION */}
      <section id="about" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-5xl text-center relative z-10">
          <Heart className="w-16 h-16 text-rose-500 mx-auto mb-8" />
          <h2 className="text-4xl font-bold mb-8">Our Vision for Preventive Healthcare</h2>
          <p className="text-xl text-slate-300 leading-relaxed font-light mb-8">
            CardioSense AI was born from a simple but powerful idea: <span className="text-white font-medium">Early awareness matters.</span> 
            We believe that by leveraging state-of-the-art Artificial Intelligence, we can democratize access to preventive health insights. Our platform bridges the gap between complex medical data and everyday lifestyle choices, providing a safe, supportive space for individuals to understand and protect their most vital organ.
          </p>
          <div className="inline-flex items-center gap-2 text-rose-400 font-semibold bg-rose-500/10 px-6 py-3 rounded-full">
            <ShieldCheck className="w-5 h-5" /> Empowering patients with knowledge.
          </div>
        </div>
      </section>

      {/* 8. CONTACT SECTION */}
      <section id="contact" className="py-24 bg-slate-900 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-bold mb-6">Get in Touch</h2>
              <p className="text-slate-400 font-light mb-10">
                Have questions about our AI models, need technical support, or want to partner with us? Our team is here to help you.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-950/50 rounded-xl border border-white/5">
                  <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Email Us</p>
                    <p className="font-medium text-white">support@cardiosense.ai</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-950/50 rounded-xl border border-white/5">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Call Us</p>
                    <p className="font-medium text-white">+1 (800) HEART-AI</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-950/50 rounded-xl border border-white/5">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Location</p>
                    <p className="font-medium text-white">San Francisco, CA Medical District</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 border border-white/10 p-8 rounded-2xl shadow-2xl">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                  <input type="text" placeholder="John Doe" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Message</label>
                  <textarea rows="4" placeholder="How can we help you?" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"></textarea>
                </div>
                <button type="button" className="w-full bg-rose-600 hover:bg-rose-500 text-white rounded-xl py-3 font-bold transition-colors">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-slate-950 pt-16 pb-8 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white">
              <HeartPulse className="w-8 h-8 text-rose-500" />
              CardioSense AI
            </Link>
            <div className="flex gap-8">
              <Link to="/login" className="text-slate-400 hover:text-rose-400 transition-colors">Login</Link>
              <Link to="/register" className="text-slate-400 hover:text-rose-400 transition-colors">Register</Link>
              <a href="#features" className="text-slate-400 hover:text-rose-400 transition-colors">Features</a>
              <a href="#contact" className="text-slate-400 hover:text-rose-400 transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <p className="text-slate-500 text-sm text-center md:text-left max-w-2xl">
              <span className="font-bold text-slate-400">Medical Disclaimer:</span> This platform provides preventive insights using artificial intelligence and is strictly <span className="text-rose-500 font-medium">not a substitute for professional medical diagnosis</span>, advice, or treatment. Always consult with a qualified healthcare provider.
            </p>
            <div className="flex flex-col items-center md:items-end gap-3 text-right">
              <a 
                href="https://digitalheroesco.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white rounded-full font-bold text-xs transition-all shadow-[0_0_20px_rgba(225,29,72,0.3)] inline-block uppercase tracking-widest cursor-pointer transform hover:scale-105"
              >
                Built for Digital Heroes
              </a>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <div className="text-center sm:text-left">
              <p className="font-bold text-slate-300 text-sm">Ranjita Naik</p>
              <p className="text-slate-400">ranjitanaik062@gmail.com</p>
            </div>
            <div className="flex gap-6">
              <a href="https://github.com/ranjitanaik-dev/HeartDiseaseprediction" target="_blank" rel="noopener noreferrer" className="hover:text-rose-400 transition-colors font-semibold">GitHub Repository</a>
              <a href="https://linkedin.com/in/ranjita-naik" target="_blank" rel="noopener noreferrer" className="hover:text-rose-400 transition-colors font-semibold">LinkedIn Profile</a>
            </div>
            <div className="text-center sm:text-right">
              <p>Copyright &copy; {new Date().getFullYear()} CardioSense AI. Made with ❤️ using Machine Learning</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Reusable Components

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-white/5 hover:border-rose-500/30 transition-all group relative overflow-hidden shadow-lg"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(244,63,94,0.1)]">
        {React.cloneElement(icon, { className: "w-7 h-7" })}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed font-light">{description}</p>
    </motion.div>
  );
}

function TimelineStep({ number, title, desc, align, icon }) {
  const isLeft = align === 'left';
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      {/* Timeline Node */}
      <div className="hidden md:flex absolute left-1/2 top-1/2 w-12 h-12 rounded-full bg-slate-900 border-4 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)] -translate-x-1/2 -translate-y-1/2 z-10 items-center justify-center text-rose-500 font-bold">
        {number}
      </div>
      
      <div className={`w-full md:w-1/2 ${isLeft ? 'md:text-right' : 'md:text-left'} flex flex-col ${isLeft ? 'md:items-end' : 'md:items-start'}`}>
        <div className="flex items-center gap-4 mb-3 md:hidden">
          <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold shadow-[0_0_15px_rgba(244,63,94,0.4)]">{number}</div>
          <h3 className="text-2xl font-bold">{title}</h3>
        </div>
        <h3 className="hidden md:block text-2xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-slate-400 font-light leading-relaxed max-w-sm">{desc}</p>
      </div>

      <div className={`w-full md:w-1/2 flex ${isLeft ? 'justify-start' : 'justify-end md:justify-start'}`}>
        <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-rose-500 shadow-2xl hidden md:flex hover:scale-105 transition-transform hover:border-rose-500/30">
          {React.cloneElement(icon, { className: "w-10 h-10" })}
        </div>
      </div>
    </motion.div>
  );
}

function StatCounter({ end, label }) {
  return (
    <div className="p-6 bg-slate-950/50 rounded-2xl border border-white/5 text-center hover:border-rose-500/20 transition-colors">
      <p className="text-3xl md:text-4xl font-black text-rose-500 mb-2">{end}</p>
      <p className="text-sm text-slate-400 font-medium">{label}</p>
    </div>
  );
}

function TestimonialCard({ quote, name, role }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-slate-950 p-8 rounded-2xl border border-white/5 relative shadow-xl"
    >
      <div className="absolute top-6 right-6 text-rose-500/10">
        <svg width="45" height="36" className="fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.415.001C6.07 5.185.887 13.681.887 23.041c0 7.632 4.608 12.096 9.936 12.096 5.04 0 8.784-4.032 8.784-8.784 0-4.752-3.312-8.208-7.632-8.208-.864 0-2.016.144-2.304.288.72-4.896 5.328-10.656 9.936-13.68L13.415.001zm24.768 0c-7.2 5.184-12.384 13.68-12.384 23.04 0 7.632 4.608 12.096 9.936 12.096 4.896 0 8.784-4.032 8.784-8.784 0-4.752-3.456-8.208-7.776-8.208-.864 0-1.872.144-2.16.288.72-4.896 5.184-10.656 9.792-13.68L38.183.001z"/>
        </svg>
      </div>
      <p className="text-slate-300 italic mb-8 relative z-10 font-light leading-relaxed">"{quote}"</p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-500 font-bold shadow-[0_0_10px_rgba(244,63,94,0.2)]">
          {name.charAt(0)}
        </div>
        <div>
          <h4 className="font-bold text-white">{name}</h4>
          <p className="text-xs text-slate-500">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}
