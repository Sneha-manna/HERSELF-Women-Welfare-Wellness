import React from 'react';
import { DailyWellness, PeriodEntry, SymptomRecord, PatternCheckData, CycleStats } from '../types';
import { calculateCycleStats, calculateWellnessScore, evaluatePatternAttention } from '../services/analytics';
import { 
  Printer, 
  Download, 
  Sparkles, 
  Heart, 
  Calendar, 
  Moon, 
  Footprints, 
  Droplet, 
  Activity, 
  ShieldCheck, 
  Smile,
  FileCheck2,
  Award
} from 'lucide-react';

interface MonthlyReportViewProps {
  dailyLogs: DailyWellness[];
  periodEntries: PeriodEntry[];
  symptoms: SymptomRecord[];
  patternData: PatternCheckData;
}

export const MonthlyReportView: React.FC<MonthlyReportViewProps> = ({
  dailyLogs,
  periodEntries,
  symptoms,
  patternData
}) => {
  const cycleStats: CycleStats = calculateCycleStats(periodEntries);
  const patternEval = evaluatePatternAttention(patternData);

  // Compute 30-day aggregate metrics
  const recentLogs = dailyLogs.slice(-30);
  const totalLogsCount = recentLogs.length || 1;

  const totalSteps = recentLogs.reduce((acc, curr) => acc + curr.steps, 0);
  const avgSteps = Math.round(totalSteps / totalLogsCount);

  const totalSleep = recentLogs.reduce((acc, curr) => acc + curr.sleepHours, 0);
  const avgSleep = Math.round((totalSleep / totalLogsCount) * 10) / 10;

  const totalWater = recentLogs.reduce((acc, curr) => acc + curr.waterLiters, 0);
  const avgWater = Math.round((totalWater / totalLogsCount) * 10) / 10;

  const totalExerciseMins = recentLogs.reduce((acc, curr) => acc + curr.exerciseMinutes, 0);
  const totalMeditationMins = recentLogs.reduce((acc, curr) => acc + curr.meditationMinutes, 0);

  const avgWellnessScore = Math.round(
    recentLogs.reduce((acc, curr) => acc + calculateWellnessScore(curr).totalScore, 0) / totalLogsCount
  );

  const handlePrint = () => {
    window.print();
  };

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto">
      
      {/* Action Header Banner (Hidden on Print) */}
      <div className="print:hidden glass-card rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Monthly Health & Wellness Brief</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900">
            Monthly Wellness Report
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            A comprehensive, clean longitudinal summary ready for export or doctor consultation.
          </p>
        </div>

        <button
          id="print-report-btn"
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Printable Report Canvas */}
      <div id="printable-health-report" className="glass-card rounded-3xl p-8 sm:p-10 border border-zinc-200 shadow-lg space-y-8 bg-white print:border-none print:shadow-none print:p-0">
        
        {/* Report Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-200 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-serif font-bold text-lg shadow-sm">
              H
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-zinc-900 tracking-tight">HERSELF · Health & Wellness Summary</h2>
              <p className="text-xs text-zinc-500">Personal Longitudinal Lifestyle & Cycle Record</p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-zinc-500 space-y-0.5">
            <div><strong className="text-zinc-700">Generated:</strong> {currentDateStr}</div>
            <div><strong className="text-zinc-700">Period:</strong> Last 30 Tracked Days</div>
          </div>
        </div>

        {/* Overview Score & Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="p-4.5 rounded-2xl bg-rose-50/60 border border-rose-100">
            <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">Average Wellness Index</span>
            <div className="text-3xl font-serif font-bold text-rose-950 mt-1">
              {avgWellnessScore} <span className="text-xs font-normal text-zinc-500">/ 100</span>
            </div>
            <span className="text-[10px] text-rose-700 mt-0.5 block">Consistent harmony</span>
          </div>

          <div className="p-4.5 rounded-2xl bg-pink-50/60 border border-pink-100">
            <span className="text-[10px] font-bold text-pink-800 uppercase tracking-wider block">Average Daily Steps</span>
            <div className="text-3xl font-serif font-bold text-pink-950 mt-1">
              {avgSteps.toLocaleString()}
            </div>
            <span className="text-[10px] text-pink-700 mt-0.5 block">{totalSteps.toLocaleString()} total steps</span>
          </div>

          <div className="p-4.5 rounded-2xl bg-purple-50/60 border border-purple-100">
            <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block">Average Sleep</span>
            <div className="text-3xl font-serif font-bold text-purple-950 mt-1">
              {avgSleep}h
            </div>
            <span className="text-[10px] text-purple-700 mt-0.5 block">Target: 7.5 - 8.5h</span>
          </div>

          <div className="p-4.5 rounded-2xl bg-sky-50/60 border border-sky-100">
            <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block">Average Hydration</span>
            <div className="text-3xl font-serif font-bold text-sky-950 mt-1">
              {avgWater}L
            </div>
            <span className="text-[10px] text-sky-700 mt-0.5 block">Daily fluid intake</span>
          </div>

        </div>

        {/* Section 1: Cycle Rhythm Observations */}
        <div className="space-y-3 pt-2">
          <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-rose-500" />
            <span>1. Menstrual & Cycle Rhythm Summary</span>
          </h2>

          <div className="p-4.5 rounded-2xl border border-zinc-200 bg-zinc-50/50 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-zinc-500 block text-[11px]">Average Cycle Length:</span>
              <strong className="text-zinc-900 text-sm font-bold">{cycleStats.averageCycleLength} days</strong>
            </div>
            <div>
              <span className="text-zinc-500 block text-[11px]">Cycle Length Variation:</span>
              <strong className="text-zinc-900 text-sm font-bold">±{cycleStats.cycleVariabilityDays} days</strong>
            </div>
            <div>
              <span className="text-zinc-500 block text-[11px]">Current Phase:</span>
              <strong className="text-rose-700 text-sm font-bold capitalize">{cycleStats.currentPhase} Phase</strong>
            </div>
          </div>
        </div>

        {/* Section 2: Informational Pattern Observation */}
        <div className="space-y-3 pt-2">
          <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-600" />
            <span>2. Pattern Check Attention Summary</span>
          </h2>

          <div className="p-4.5 rounded-2xl border border-purple-100 bg-purple-50/40 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-800">Attention Level: <strong className="text-purple-900">{patternEval.level}</strong></span>
              <span className="text-[11px] text-zinc-500">{patternEval.attentionFactors.length} active factors logged</span>
            </div>
            <p className="text-zinc-700 leading-relaxed">
              {patternEval.explanation}
            </p>
          </div>
        </div>

        {/* Section 3: Recorded Symptom Breakdown */}
        <div className="space-y-3 pt-2">
          <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-500" />
            <span>3. Recent Symptom History</span>
          </h2>

          <div className="p-4.5 rounded-2xl border border-zinc-200 bg-white space-y-2 text-xs">
            {symptoms.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {symptoms.slice(0, 6).map((sym) => (
                  <div key={sym.id} className="p-2 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-zinc-800">{sym.symptomLabel}</span>
                      <span className="text-[10px] text-zinc-400 block">{sym.date}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize bg-white border border-zinc-200">
                      {sym.severity}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-400">No acute symptoms reported during this tracking window.</p>
            )}
          </div>
        </div>

        {/* Section 4: Physical Activity & Mindfulness Totals */}
        <div className="space-y-3 pt-2">
          <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>4. Activity & Mindfulness Commitments</span>
          </h2>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100">
              <span className="text-zinc-500 block text-[11px]">Total Exercise Logged:</span>
              <strong className="text-amber-950 text-base font-bold">{totalExerciseMins} minutes</strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
              <span className="text-zinc-500 block text-[11px]">Mindfulness & Breathwork:</span>
              <strong className="text-emerald-950 text-base font-bold">{totalMeditationMins} minutes</strong>
            </div>
          </div>
        </div>

        {/* Motivational Encouragement Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white space-y-1.5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Encouragement for Next Month</span>
          </div>
          <p className="text-xs text-rose-50 leading-relaxed">
            "Your body is constantly communicating through subtle rhythms. By showing up and tuning in each day, you are building deep self-awareness and lifelong harmony. Keep honoring your rest, nourishing your energy, and trusting your journey."
          </p>
        </div>

        {/* Mandatory Clinical Non-Diagnosis Footer */}
        <div className="pt-4 border-t border-zinc-200 text-[10px] text-zinc-500 leading-relaxed space-y-1">
          <p>
            <strong>Informational Notice:</strong> This summary document is generated by HERSELF for personal self-care, habit tracking, and informational awareness only. It is NOT a medical diagnosis, clinical chart, or treatment recommendation. If you have concerns about cycle irregularities, pelvic pain, or hormonal balance, please share this log with your qualified physician, gynecologist, or licensed healthcare practitioner.
          </p>
        </div>

      </div>

    </div>
  );
};
