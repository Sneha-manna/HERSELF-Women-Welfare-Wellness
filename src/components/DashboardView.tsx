import React, { useState } from 'react';
import { 
  DailyWellness, 
  PeriodEntry, 
  CycleStats, 
  WellnessScoreBreakdown 
} from '../types';
import { calculateCycleStats, calculateWellnessScore } from '../services/analytics';
import { NavTab } from './Navbar';
import { 
  Moon, 
  Footprints, 
  Droplet, 
  Flame, 
  Sparkles, 
  Smile, 
  Calendar, 
  ArrowUpRight, 
  Check, 
  Plus, 
  Info, 
  Heart,
  TrendingUp,
  Clock,
  ShieldAlert,
  ChevronRight,
  Sun
} from 'lucide-react';

interface DashboardViewProps {
  todayWellness: DailyWellness;
  periodEntries: PeriodEntry[];
  onUpdateWellness: (updated: DailyWellness) => void;
  onNavigate: (tab: NavTab) => void;
  onOpenQuickLog: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  todayWellness,
  periodEntries,
  onUpdateWellness,
  onNavigate,
  onOpenQuickLog
}) => {
  const [showScoreModal, setShowScoreModal] = useState(false);
  const cycleStats: CycleStats = calculateCycleStats(periodEntries, todayWellness.date);
  const scoreBreakdown: WellnessScoreBreakdown = calculateWellnessScore(todayWellness);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Quick increment water
  const handleQuickAddWater = () => {
    const updated = {
      ...todayWellness,
      waterLiters: Math.round((todayWellness.waterLiters + 0.25) * 100) / 100
    };
    onUpdateWellness(updated);
  };

  // Format sleep
  const sleepHours = Math.floor(todayWellness.sleepHours);
  const sleepMins = Math.round((todayWellness.sleepHours % 1) * 60);

  // Steps percentage
  const stepsPercent = Math.min(100, Math.round((todayWellness.steps / (todayWellness.stepsGoal || 8000)) * 100));
  const waterPercent = Math.min(100, Math.round((todayWellness.waterLiters / (todayWellness.waterGoalLiters || 2.5)) * 100));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner Greeting */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-rose-100/80 shadow-md">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-rose-200/40 via-pink-100/30 to-purple-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-rose-600 font-medium text-xs tracking-wider uppercase">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-zinc-900">
              {getGreeting()}, <span className="text-rose-700">Welcome to HERSELF</span>
            </h1>
            <p className="text-sm text-zinc-600 max-w-xl">
              Here is your holistic wellness overview. Track your rhythm, nourish your energy, and listen to your body's subtle patterns.
            </p>
          </div>

          {/* Wellness Score Hero Badge */}
          <div 
            id="score-badge-card"
            onClick={() => setShowScoreModal(true)}
            className="flex items-center gap-4 p-4 rounded-2xl bg-white/90 border border-rose-200/80 shadow-sm hover:shadow-md cursor-pointer hover:border-rose-300 transition-all self-start md:self-auto group"
          >
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="#FCE7F3"
                  strokeWidth="5"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="url(#score-gradient)"
                  strokeWidth="5"
                  strokeDasharray={163.36}
                  strokeDashoffset={163.36 - (163.36 * scoreBreakdown.totalScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F43F5E" />
                    <stop offset="100%" stopColor="#A855F7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute text-center">
                <span className="text-lg font-bold text-zinc-900">{scoreBreakdown.totalScore}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-zinc-800">Wellness Score</span>
                <Info className="w-3.5 h-3.5 text-zinc-400 group-hover:text-rose-600 transition-colors" />
              </div>
              <span className="text-[11px] text-zinc-500 block">Out of 100 points</span>
              <span className="inline-block mt-0.5 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                {scoreBreakdown.totalScore >= 80 ? 'Optimal Harmony' : scoreBreakdown.totalScore >= 65 ? 'Balanced' : 'Rest Encouraged'}
              </span>
            </div>
          </div>
        </div>

        {/* Cycle Phase Strip */}
        <div className="mt-6 pt-5 border-t border-rose-100/70 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200/70 flex items-center justify-center text-rose-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-800 uppercase tracking-wide">
                  Cycle Day {cycleStats.currentPhaseDay}
                </span>
                <span className="text-[11px] font-semibold text-rose-700 bg-rose-100/80 px-2.5 py-0.5 rounded-full capitalize">
                  {cycleStats.currentPhase} Phase
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Estimated next period on <span className="font-semibold text-zinc-700">{cycleStats.estimatedNextPeriodDate}</span> (~{cycleStats.averageCycleLength}-day baseline)
              </p>
            </div>
          </div>

          <button
            id="open-calendar-quick-btn"
            onClick={() => onNavigate('cycle')}
            className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
          >
            <span>View Period Calendar</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
            <span>Today's Vital Metrics</span>
            <span className="text-xs font-normal text-zinc-500">Click any card or "Update" to modify</span>
          </h2>
          <button
            id="dashboard-edit-metrics-btn"
            onClick={onOpenQuickLog}
            className="text-xs font-bold text-rose-600 hover:text-rose-800 px-3 py-1 rounded-lg bg-rose-50 border border-rose-200/60 transition-colors cursor-pointer"
          >
            Quick Update
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Period / Cycle */}
          <div 
            id="metric-card-cycle"
            onClick={() => onNavigate('cycle')}
            className="glass-card glass-card-hover rounded-2xl p-5 border border-rose-100 cursor-pointer relative"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Period / Cycle</span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-zinc-900 capitalize mb-1">
              {cycleStats.currentPhase}
            </div>
            <div className="text-xs text-zinc-500 mb-3">
              Day {cycleStats.currentPhaseDay} · {cycleStats.daysSinceLastPeriod} days since start
            </div>
            <div className="pt-2 border-t border-rose-50 flex items-center justify-between text-[11px]">
              <span className="text-zinc-500">Avg Cycle</span>
              <span className="font-bold text-zinc-800">{cycleStats.averageCycleLength} days</span>
            </div>
          </div>

          {/* Card 2: Sleep */}
          <div 
            id="metric-card-sleep"
            onClick={onOpenQuickLog}
            className="glass-card glass-card-hover rounded-2xl p-5 border border-purple-100 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Sleep</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Moon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-zinc-900 mb-1">
              {sleepHours}h {sleepMins}m
            </div>
            <div className="text-xs text-zinc-500 mb-3 flex items-center gap-1">
              <span>Quality:</span>
              <span className="text-amber-500 font-bold">{'★'.repeat(todayWellness.sleepQuality)}</span>
              <span className="text-zinc-300">{'★'.repeat(5 - todayWellness.sleepQuality)}</span>
            </div>
            <div className="pt-2 border-t border-purple-50 flex items-center justify-between text-[11px]">
              <span className="text-zinc-500">Target</span>
              <span className="font-bold text-purple-700">7.5 - 8.5 hours</span>
            </div>
          </div>

          {/* Card 3: Walking / Steps */}
          <div 
            id="metric-card-walking"
            onClick={onOpenQuickLog}
            className="glass-card glass-card-hover rounded-2xl p-5 border border-pink-100 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Walking</span>
              <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                <Footprints className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-zinc-900 mb-1">
              {todayWellness.steps.toLocaleString()} <span className="text-xs font-normal text-zinc-500">steps</span>
            </div>
            <div className="text-xs text-zinc-500 mb-3">
              {stepsPercent}% of {todayWellness.stepsGoal.toLocaleString()} goal
            </div>
            <div className="w-full bg-pink-100 rounded-full h-1.5">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 h-1.5 rounded-full" style={{ width: `${stepsPercent}%` }} />
            </div>
          </div>

          {/* Card 4: Water */}
          <div 
            id="metric-card-water"
            className="glass-card glass-card-hover rounded-2xl p-5 border border-sky-100 relative group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Water</span>
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Droplet className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between mb-1">
              <div className="text-xl font-bold text-zinc-900">
                {todayWellness.waterLiters.toFixed(1)} <span className="text-xs font-normal text-zinc-500">/ {todayWellness.waterGoalLiters} L</span>
              </div>
              <button
                id="quick-add-water-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickAddWater();
                }}
                className="text-[11px] font-bold text-sky-600 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-2 py-0.5 rounded-md border border-sky-200 transition-colors flex items-center gap-0.5 cursor-pointer"
                title="Add 250ml glass"
              >
                <Plus className="w-3 h-3" />
                <span>250ml</span>
              </button>
            </div>
            <div className="text-xs text-zinc-500 mb-3">
              {Math.round(todayWellness.waterLiters / 0.25)} glasses consumed
            </div>
            <div className="w-full bg-sky-100 rounded-full h-1.5">
              <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: `${waterPercent}%` }} />
            </div>
          </div>

          {/* Card 5: Exercise */}
          <div 
            id="metric-card-exercise"
            onClick={onOpenQuickLog}
            className="glass-card glass-card-hover rounded-2xl p-5 border border-amber-100 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Exercise</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-zinc-900 mb-1">
              {todayWellness.exerciseMinutes} <span className="text-xs font-normal text-zinc-500">min</span>
            </div>
            <div className="text-xs text-zinc-500 mb-3 capitalize">
              {todayWellness.exerciseType} · {todayWellness.exerciseIntensity}
            </div>
            <div className="pt-2 border-t border-amber-50 flex items-center justify-between text-[11px]">
              <span className="text-zinc-500">Daily Target</span>
              <span className="font-bold text-amber-700">30 min</span>
            </div>
          </div>

          {/* Card 6: Meditation */}
          <div 
            id="metric-card-meditation"
            onClick={onOpenQuickLog}
            className="glass-card glass-card-hover rounded-2xl p-5 border border-emerald-100 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Meditation</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-zinc-900 mb-1">
              {todayWellness.meditationMinutes} <span className="text-xs font-normal text-zinc-500">min</span>
            </div>
            <div className="text-xs text-zinc-500 mb-3">
              Calm diaphragmatic breathing
            </div>
            <div className="pt-2 border-t border-emerald-50 flex items-center justify-between text-[11px]">
              <span className="text-zinc-500">Session Goal</span>
              <span className="font-bold text-emerald-700">15 min</span>
            </div>
          </div>

          {/* Card 7: Mood */}
          <div 
            id="metric-card-mood"
            onClick={onOpenQuickLog}
            className="glass-card glass-card-hover rounded-2xl p-5 border border-rose-100 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Mood</span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Smile className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-zinc-900 capitalize mb-1">
              {todayWellness.mood}
            </div>
            <div className="text-xs text-zinc-500 mb-3">
              Energy level: <span className="font-bold text-zinc-800">{todayWellness.moodEnergy}/10</span>
            </div>
            <div className="pt-2 border-t border-rose-50 flex items-center justify-between text-[11px]">
              <span className="text-zinc-500">Status</span>
              <span className="font-bold text-rose-700">Reflective</span>
            </div>
          </div>

          {/* Card 8: Wellness Score Card */}
          <div 
            id="metric-card-score"
            onClick={() => setShowScoreModal(true)}
            className="glass-card glass-card-hover rounded-2xl p-5 border border-purple-100 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Wellness Score</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-zinc-900 mb-1">
              {scoreBreakdown.totalScore} <span className="text-xs font-normal text-zinc-500">/ 100</span>
            </div>
            <div className="text-xs text-zinc-500 mb-3">
              Rule-based calculation
            </div>
            <div className="pt-2 border-t border-purple-50 flex items-center justify-between text-[11px]">
              <span className="text-zinc-500">Details</span>
              <span className="font-bold text-purple-700 flex items-center gap-0.5">
                Breakdown <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Irregularity Warning / Pattern Reminder Banner if irregular */}
      {cycleStats.isIrregular && (
        <div className="p-4.5 rounded-2xl bg-amber-50/90 border border-amber-200/80 shadow-xs flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-amber-900">
              Gentle Cycle Pattern Observation
            </h2>
            <p className="text-xs text-amber-800/90 leading-relaxed">
              {cycleStats.irregularityReason} Cycle variation is natural and can occur due to stress, schedule shifts, sleep changes, or metabolic adaptations. If this pattern continues or concerns you, consider consulting a qualified healthcare professional.
            </p>
          </div>
        </div>
      )}

      {/* Quick Action Navigation Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div 
          onClick={() => onNavigate('diet')}
          className="glass-card glass-card-hover rounded-2xl p-5 border border-rose-100 cursor-pointer flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wide">Personalized Nutrition</span>
            <h2 className="text-sm font-bold text-zinc-800">Your Daily Wellness Plan</h2>
            <p className="text-xs text-zinc-500">Cycle-synced meals & hydration goals</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('pattern')}
          className="glass-card glass-card-hover rounded-2xl p-5 border border-purple-100 cursor-pointer flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wide">Pattern Check</span>
            <h2 className="text-sm font-bold text-zinc-800">Non-Diagnostic Symptom Check</h2>
            <p className="text-xs text-zinc-500">Monitor hormonal harmony indicators</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('insights')}
          className="glass-card glass-card-hover rounded-2xl p-5 border border-pink-100 cursor-pointer flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-pink-600 uppercase tracking-wide">Data Science</span>
            <h2 className="text-sm font-bold text-zinc-800">Insights & Correlations</h2>
            <p className="text-xs text-zinc-500">Sleep vs. wellness trends</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

      </div>

      {/* Wellness Score Transparent Breakdown Modal */}
      {showScoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-rose-100 space-y-5 animate-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Wellness Score Breakdown</h2>
                <p className="text-xs text-zinc-500">Transparent rule-based calculation ({scoreBreakdown.totalScore}/100)</p>
              </div>
              <button
                onClick={() => setShowScoreModal(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50/70">
                <span className="font-semibold text-purple-900">Sleep Quality & Duration (Max 25 pts)</span>
                <span className="font-bold text-purple-700">{scoreBreakdown.sleepScore} / 25 pts</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-pink-50/70">
                <span className="font-semibold text-pink-900">Walking & Exercise Movement (Max 25 pts)</span>
                <span className="font-bold text-pink-700">{scoreBreakdown.activityScore} / 25 pts</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-sky-50/70">
                <span className="font-semibold text-sky-900">Hydration Progress (Max 20 pts)</span>
                <span className="font-bold text-sky-700">{scoreBreakdown.hydrationScore} / 20 pts</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/70">
                <span className="font-semibold text-emerald-900">Mindfulness & Meditation (Max 15 pts)</span>
                <span className="font-bold text-emerald-700">{scoreBreakdown.mindfulnessScore} / 15 pts</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50/70">
                <span className="font-semibold text-rose-900">Mood Balance & Vitality (Max 15 pts)</span>
                <span className="font-bold text-rose-700">{scoreBreakdown.moodScore} / 15 pts</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100 text-xs text-zinc-600 space-y-1">
              <div className="font-bold text-zinc-800">Key Highlights Today:</div>
              <ul className="list-disc list-inside space-y-0.5 text-zinc-600">
                {scoreBreakdown.insights.map((insight, idx) => (
                  <li key={idx}>{insight}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setShowScoreModal(false)}
              className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
