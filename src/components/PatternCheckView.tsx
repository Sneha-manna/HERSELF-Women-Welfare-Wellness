import React, { useState } from 'react';
import { PatternCheckData } from '../types';
import { evaluatePatternAttention } from '../services/analytics';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Heart, 
  Sparkles, 
  Info, 
  Calendar, 
  FileText,
  Activity,
  ArrowRight
} from 'lucide-react';

interface PatternCheckViewProps {
  patternData: PatternCheckData;
  onSavePatternData: (data: PatternCheckData) => void;
}

export const PatternCheckView: React.FC<PatternCheckViewProps> = ({
  patternData,
  onSavePatternData
}) => {
  const [formData, setFormData] = useState<PatternCheckData>({ ...patternData });
  const [isSaved, setIsSaved] = useState(false);

  const evaluation = evaluatePatternAttention(formData);

  const handleToggle = (key: keyof Omit<PatternCheckData, 'lastCheckedDate'>) => {
    const updated = {
      ...formData,
      [key]: !formData[key],
      lastCheckedDate: new Date().toISOString().split('T')[0]
    };
    setFormData(updated);
    setIsSaved(false);
  };

  const handleSave = () => {
    onSavePatternData(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const questions: {
    key: keyof Omit<PatternCheckData, 'lastCheckedDate'>;
    title: string;
    description: string;
    category: string;
  }[] = [
    {
      key: 'irregularPeriods',
      title: 'Irregular or skipping periods',
      description: 'Cycles vary unpredictably by more than 7-9 days or frequently skip months.',
      category: 'Cycle Patterns'
    },
    {
      key: 'unusuallyLongCycles',
      title: 'Cycles consistently longer than 35 days',
      description: 'The interval between consecutive period start dates regularly exceeds 35 days.',
      category: 'Cycle Patterns'
    },
    {
      key: 'acne',
      title: 'Persistent adult or jawline acne',
      description: 'Cystic breakouts primarily along the jawline, chin, or back that resist regular topical skincare.',
      category: 'Skin & Hair'
    },
    {
      key: 'increasedFacialBodyHair',
      title: 'Increased coarse facial or body hair',
      description: 'Noticeable growth of thicker, darker hair on the upper lip, chin, chest, or abdomen.',
      category: 'Skin & Hair'
    },
    {
      key: 'unusualHairThinning',
      title: 'Unusual scalp hair thinning or shedding',
      description: 'Diffuse hair loss or widening part-line not attributable to seasonal shedding.',
      category: 'Skin & Hair'
    },
    {
      key: 'unexpectedWeightChanges',
      title: 'Unexpected weight changes or stubborn midsection gain',
      description: 'Difficulty managing weight despite maintaining a consistent, balanced dietary and activity routine.',
      category: 'Metabolic Signals'
    },
    {
      key: 'fatigue',
      title: 'Chronic daytime fatigue or energy crashes',
      description: 'Feeling persistently drained after full nights of sleep or experiencing severe afternoon sluggishness.',
      category: 'Energy & Mood'
    },
    {
      key: 'moodChanges',
      title: 'Unexplained mood shifts or severe brain fog',
      description: 'Heightened anxiety, low mood, or cognitive sluggishness coinciding with hormonal phases.',
      category: 'Energy & Mood'
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-purple-100/80 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold">
              <span>Informational Pattern Check</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900">
              Hormonal Pattern Observation
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-3xl">
              Track subtle physiological and cycle signals over time. This tool provides non-diagnostic, educational pattern recognition to help you have informed, confident conversations with your healthcare provider.
            </p>
          </div>
        </div>

        {/* Mandatory Medical Non-Diagnosis Notice */}
        <div className="mt-6 p-4 rounded-2xl bg-white/90 border border-purple-200/80 shadow-2xs flex items-start gap-3">
          <Info className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-700 leading-relaxed font-medium">
            <span className="font-bold text-purple-950">Important Medical Disclaimer:</span> HERSELF is a wellness and habit-tracking application. This check does <span className="underline decoration-purple-300 font-semibold">NOT</span> diagnose PCOS, PCOD, thyroid disorders, or any medical disease. All insights are general pattern reflections intended solely for self-awareness and lifestyle guidance.
          </p>
        </div>
      </div>

      {/* Dynamic Attention Level Result Card */}
      <div className={`glass-card rounded-3xl p-6 sm:p-8 border shadow-md transition-all ${
        evaluation.level === 'HIGH ATTENTION'
          ? 'border-amber-200 bg-gradient-to-br from-amber-50/60 to-white'
          : evaluation.level === 'MODERATE'
          ? 'border-purple-200 bg-gradient-to-br from-purple-50/50 to-white'
          : 'border-emerald-200 bg-gradient-to-br from-emerald-50/40 to-white'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Pattern Attention Level</span>
              <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                evaluation.level === 'HIGH ATTENTION'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : evaluation.level === 'MODERATE'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-emerald-600 text-white shadow-xs'
              }`}>
                {evaluation.level}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">
              {evaluation.headline}
            </h2>

            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-2xl">
              {evaluation.explanation}
            </p>
          </div>

          <div className="shrink-0 p-4 rounded-2xl bg-white/90 border border-zinc-200/80 shadow-xs text-center min-w-[170px]">
            <span className="text-[11px] font-bold text-zinc-400 uppercase block mb-1">Active Indicators</span>
            <div className="text-3xl font-serif font-bold text-zinc-900">
              {evaluation.attentionFactors.length} <span className="text-xs font-normal text-zinc-500">/ 8</span>
            </div>
            <span className="text-[10px] text-zinc-500 block mt-1">Logged in check-in</span>
          </div>

        </div>

        {/* Actionable Lifestyle Principles */}
        <div className="mt-6 pt-6 border-t border-zinc-200/70 space-y-3">
          <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Supportive Hormonal Wellness Habits</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {evaluation.recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-zinc-100 text-xs text-zinc-700 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Symptom Pattern Questionnaire */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-md space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold text-zinc-900">Pattern Signal Check-in</h2>
            <p className="text-xs text-zinc-500">Toggle any persistent non-diagnostic sensations you have observed over recent cycles.</p>
          </div>
          
          <button
            id="save-pattern-check-btn"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-full bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-md shadow-purple-200 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Activity className="w-4 h-4" />}
            <span>{isSaved ? 'Patterns Saved!' : 'Save Check-in'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questions.map((q) => {
            const isChecked = formData[q.key];
            return (
              <div
                key={q.key}
                id={`pattern-item-${q.key}`}
                onClick={() => handleToggle(q.key)}
                className={`p-4.5 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-3.5 ${
                  isChecked
                    ? 'bg-purple-50/80 border-purple-300 shadow-xs'
                    : 'bg-white/80 border-zinc-200/80 hover:bg-zinc-50/80'
                }`}
              >
                <div className={`w-5 h-5 rounded-lg border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                  isChecked
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'border-zinc-300 bg-white'
                }`}>
                  {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h2 className={`text-xs font-bold ${isChecked ? 'text-purple-950' : 'text-zinc-800'}`}>
                      {q.title}
                    </h2>
                    <span className="text-[10px] text-zinc-400 font-semibold">{q.category}</span>
                  </div>
                  <p className="text-[11px] text-zinc-600 leading-relaxed">
                    {q.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-full bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-md shadow-purple-200 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Save & Update Pattern Reflection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
