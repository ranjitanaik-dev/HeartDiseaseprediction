import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQ() {
  const faqs = [
    {
      q: "What is Cholesterol?",
      a: "Cholesterol is a waxy, fat-like substance found in all the cells in your body. Your body needs some cholesterol to make hormones, vitamin D, and substances that help you digest foods. However, high levels of LDL (low-density lipoprotein or 'bad' cholesterol) can build up in your arteries, forming plaque that restricts blood flow and increases the risk of heart disease and stroke."
    },
    {
      q: "What is an ECG (Electrocardiogram)?",
      a: "An electrocardiogram (ECG or EKG) is a quick, simple, and painless test that records the electrical signals in your heart. Each beat of your heart is triggered by an electrical impulse. An ECG displays these impulses as waves on a monitor or paper, helping doctors detect heart rhythm irregularities (arrhythmias), blocked or narrowed arteries (coronary artery disease), and signs of a previous heart attack."
    },
    {
      q: "What is Blood Pressure?",
      a: "Blood pressure is the force of your blood pushing against the walls of your arteries as your heart pumps it. It is measured in millimeters of mercury (mm Hg) and reported as two numbers: Systolic (pressure when the heart beats) over Diastolic (pressure when the heart rests between beats). Chronic high blood pressure (hypertension) damages arteries, making them stiff and narrow, which forces the heart to work harder."
    },
    {
      q: "What is Heart Rate?",
      a: "Heart rate, or pulse, is the number of times your heart beats per minute (bpm). A normal resting heart rate for adults ranges from 60 to 100 bpm. During exercise, your heart rate increases to pump more oxygenated blood to your muscles. Monitoring your resting and maximum heart rates helps assess cardiovascular fitness and detect potential cardiac conditions."
    },
    {
      q: "How accurate is this prediction?",
      a: "The predictions are generated using an advanced machine learning model (Logistic Regression / Random Forest) trained on standard clinical datasets. While it achieves high classification accuracy under test validations, it estimates statistical probabilities and cannot replace a clinical diagnosis. It is intended solely for educational purposes and early risk awareness."
    }
  ];

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
        <HelpCircle className="w-5 h-5 text-health-500" /> Frequently Asked Questions
      </h3>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FAQItem key={index} q={faq.q} a={faq.a} />
        ))}
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
        className="w-full flex justify-between items-center text-left py-2 text-white font-semibold hover:text-health-500 transition-colors focus:outline-none"
      >
        <span>{q}</span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
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
            <p className="text-sm text-slate-300 leading-relaxed font-light mt-2 bg-white/5 p-4 rounded-xl border border-white/5">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
