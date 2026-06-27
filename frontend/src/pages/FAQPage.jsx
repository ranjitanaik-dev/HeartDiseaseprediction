import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQPage() {
  const faqs = [
    {
      q: "What is Cholesterol?",
      a: "Cholesterol is a waxy, fat-like substance found in all cells in your body. It is essential for making hormones, vitamin D, and cell membranes. However, high levels of LDL ('bad') cholesterol can lead to plaque deposits inside your coronary arteries, restricting blood flow and causing heart disease."
    },
    {
      q: "What is an ECG (Electrocardiogram)?",
      a: "An ECG or EKG is a non-invasive diagnostic test that records the electrical impulses of your heart. It helps assess heart rhythm, check for damaged heart muscle, and determine if arteries are narrow or blocked."
    },
    {
      q: "What is Blood Pressure?",
      a: "Blood pressure is the hydrostatic force exerted by circulating blood against the walls of blood vessels. Measured in mm Hg, persistent high blood pressure (hypertension) strains your heart, accelerates plaque buildup, and weakens blood vessels."
    },
    {
      q: "How does this prediction work?",
      a: "The system runs a machine learning classification model (Logistic Regression or Random Forest) trained on clinical diagnostic datasets. It analyzes inputs like age, gender, cholesterol, resting blood pressure, and ECG readings to compute statistical risk probabilities."
    },
    {
      q: "Is this medically accurate?",
      a: "Our machine learning models show high accuracy on clinical validation sets. However, it computes statistical risk probabilities rather than providing an active diagnosis. It is strictly an educational tool for early awareness and should not replace professional medical evaluations."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <HelpCircle className="text-health-500" />
          Clinical & Technical FAQ
        </h1>
        <p className="text-slate-400 text-sm mt-1">Find answers to key medical definitions and understand how the CardioSense estimation works.</p>
      </div>

      <div className="glass-card p-6">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex gap-3 text-xs text-slate-400 leading-relaxed">
        <ShieldCheck className="w-5 h-5 text-health-500 shrink-0 mt-0.5" />
        <span><strong>Scientific Disclaimer:</strong> Diagnostic definitions and references are aligned with guidelines from the American Heart Association (AHA) and clinical research publications.</span>
      </div>
    </div>
  );
}

function FAQItem({ q, a }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-0 pb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-3 text-white font-bold hover:text-health-500 transition-colors focus:outline-none cursor-pointer"
      >
        <span className="text-sm sm:text-base">{q}</span>
        {isOpen ? <ChevronUp className="w-4.5 h-4.5 text-slate-400" /> : <ChevronDown className="w-4.5 h-4.5 text-slate-400" />}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light mt-2 bg-white/5 p-4 rounded-xl border border-white/5">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
