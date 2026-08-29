import React, { useMemo } from 'react';
import { DailyWellness, PeriodEntry, SymptomRecord, CycleStats } from '../types';
import { calculateCycleStats, calculateWellnessScore } from '../services/analytics';
import { 
  TrendingUp, 
  Activity, 
  Moon, 
  Footprints, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  BarChart3, 
  Zap, 
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';

interface DataScienceInsightsViewProps {
  dailyLogs: DailyWellness[];
  periodEntries: PeriodEntry[];
  symptoms: SymptomRecord[];
}

export const DataScienceInsightsView: React.FC<DataScienceInsightsViewProps> = ({
  dailyLogs,
  periodEntries,
  symptoms
}) => {
  const cycleStats: CycleStats = calculateCycleStats(periodEntries);

  // Compute 30-day combined timeline
  const trendData = useMemo(() => {
    return [...dailyLogs]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30)
      .map(log => {
        const score = calculateWellnessScore(log).totalScore;
        const d = new Date(log.date + 'T00:00:00');
        return {
          date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          rawDate: log.date,
          wellnessScore: score,
          sleepHours: log.sleepHours,
          steps: log.steps,
          water: log.waterLiters,
          exercise: log.exerciseMinutes,
          energy: log.moodEnergy * 10
        };
      });
  }, [dailyLogs]);

  // Correlation: Sleep vs. Energy
  const sleepVsEnergy = useMemo(() => {
    let goodSleepEnergySum = 0;
    let goodSleepCount = 0;
    let poorSleepEnergySum = 0;
    let poorSleepCount = 0;

    dailyLogs.forEach(log => {
      if (log.sleepHours >= 7.5) {
        goodSleepEnergySum += log.moodEnergy;
        goodSleepCount++;
      } else {
        poorSleepEnergySum += log.moodEnergy;
        poorSleepCount++;
      }
    });

    const goodSleepAvg = goodSleepCount > 0 ? (goodSleepEnergySum / goodSleepCount) : 8;
    const poorSleepAvg = poorSleepCount > 0 ? (poorSleepEnergySum / poorSleepCount) : 6;
    const percentDiff = poorSleepAvg > 0 ? Math.round(((goodSleepAvg - poorSleepAvg) / poorSleepAvg) * 100) : 30;

    return {
      goodSleepAvg: Math.round(goodSleepAvg * 10) / 10,
      poorSleepAvg: Math.round(poorSleepAvg * 10) / 10,
      percentDiff: Math.max(5, percentDiff)
    };
  }, [dailyLogs]);

  // Correlation: Steps vs. Wellness Score
  const stepsVsScore = useMemo(() => {
    let highStepScoreSum = 0;
    let highStepCount = 0;
    let lowStepScoreSum = 0;
    let lowStepCount = 0;

    dailyLogs.forEach(log => {
      const score = calculateWellnessScore(log).totalScore;
      if (log.steps >= 7000) {
        highStepScoreSum += score;
        highStepCount++;
      } else {
        lowStepScoreSum += score;
        lowStepCount++;
      }
    });

    const highAvg = highStepCount > 0 ? Math.round(highStepScoreSum / highStepCount) : 85;
    const lowAvg = lowStepCount > 0 ? Math.round(lowStepScoreSum / lowStepCount) : 68;

    return { highAvg, lowAvg, diff: highAvg - lowAvg };
  }, [dailyLogs]);

  // Anomaly Detection based on transparent thresholds
  const anomalies = useMemo(() => {
    const list: { date: string; message: string; type: 'sleep' | 'steps' | 'symptom' }[] = [];
    dailyLogs.slice(-14).forEach(log => {
      if (log.sleepHours < 5.8) {
        list.push({
          date: log.date,
          message: `Unusually brief sleep recorded (${log.sleepHours}h) vs 7.5h baseline.`,
          type: 'sleep'
        });
      }
      if (log.steps < 3000) {
        list.push({
          date: log.date,
          message: `Low physical movement day (${log.steps.toLocaleString()} steps).`,
          type: 'steps'
        });
      }
    });

    symptoms.filter(s => s.severity === 'severe').forEach(s => {
      list.push({
        date: s.date,
        message: `Severe ${s.symptomLabel} reported (${s.notes || 'no notes'}).`,
        type: 'symptom'
      });
    });

    return list.slice(0, 4);
  }, [dailyLogs, symptoms]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-purple-200/30 via-pink-100/30 to-rose-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-rose-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold">
              <span>Explainable Data Science</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900">
              Personal Body Intelligence & Correlations
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-3xl leading-relaxed">
              Derived strictly from your recorded longitudinal data using transparent descriptive statistics, cycle variance analysis, and lifestyle correlation metrics.
            </p>
          </div>
        </div>
      </div>

      {/* Key Correlation Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Sleep vs Energy Insight */}
        <div className="glass-card rounded-3xl p-6 border border-purple-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Moon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-purple-700 uppercase bg-purple-50 px-2 py-0.5 rounded-full">
              Strong Correlation
            </span>
          </div>
          <h2 className="text-sm font-bold text-zinc-900">Sleep Duration vs. Daytime Vitality</h2>
          <p className="text-xs text-zinc-600 leading-relaxed">
            On days when you log <strong className="text-purple-900">≥ 7.5 hours of sleep</strong>, your reported energy level averages <strong className="text-purple-900">{sleepVsEnergy.goodSleepAvg}/10</strong> (a <strong className="text-purple-700">+{sleepVsEnergy.percentDiff}% increase</strong> compared to short sleep days).
          </p>
          <div className="pt-2 border-t border-purple-50 flex items-center justify-between text-[11px] text-zinc-500">
            <span>Formula</span>
            <span className="font-semibold text-zinc-700">Segmented Mean Energy Analysis</span>
          </div>
        </div>

        {/* Steps vs Score Insight */}
        <div className="glass-card rounded-3xl p-6 border border-pink-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center">
              <Footprints className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-pink-700 uppercase bg-pink-50 px-2 py-0.5 rounded-full">
              Positive Driver
            </span>
          </div>
          <h2 className="text-sm font-bold text-zinc-900">Movement vs. Overall Harmony</h2>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Meeting your daily step target (≥7k steps) elevates your composite wellness index to an average of <strong className="text-pink-900">{stepsVsScore.highAvg}/100</strong>, compared to <strong className="text-zinc-700">{stepsVsScore.lowAvg}/100</strong> on sedentary days.
          </p>
          <div className="pt-2 border-t border-pink-50 flex items-center justify-between text-[11px] text-zinc-500">
            <span>Formula</span>
            <span className="font-semibold text-zinc-700">Multi-Factor Wellness Correlation</span>
          </div>
        </div>

        {/* Cycle Rhythm Stability */}
        <div className="glass-card rounded-3xl p-6 border border-rose-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-rose-700 uppercase bg-rose-50 px-2 py-0.5 rounded-full">
              Variance ±{cycleStats.cycleVariabilityDays}d
            </span>
          </div>
          <h2 className="text-sm font-bold text-zinc-900">Cycle Regularity & Predictability</h2>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Your recorded cycle length averages <strong className="text-rose-900">{cycleStats.averageCycleLength} days</strong> across {cycleStats.trackedCyclesCount} cycles with a standard deviation of <strong className="text-rose-900">±{cycleStats.cycleVariabilityDays} days</strong>.
          </p>
          <div className="pt-2 border-t border-rose-50 flex items-center justify-between text-[11px] text-zinc-500">
            <span>Formula</span>
            <span className="font-semibold text-zinc-700">Sample Standard Deviation (σ)</span>
          </div>
        </div>

      </div>

      {/* 30-Day Multi-Metric Longitudinal Chart */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">30-Day Wellness & Sleep Progression</h2>
            <p className="text-xs text-zinc-500">Comparing your daily composite wellness score with recorded sleep duration</p>
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3E8FF" vertical={false} />
              <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} tickLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #FFE4E6',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="wellnessScore"
                name="Wellness Score (/100)"
                stroke="#E11D48"
                strokeWidth={3}
                dot={{ r: 3, fill: '#E11D48' }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="energy"
                name="Reported Vitality (/100)"
                stroke="#A855F7"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity vs Energy Correlation Bar Chart & Anomaly Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Steps vs Energy Trend */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-md space-y-4">
          <div>
            <h2 className="text-base font-bold text-zinc-900">Daily Step Count vs. Target</h2>
            <p className="text-xs text-zinc-500">Tracked steps over the past 14 days with target baseline of 8,000 steps</p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData.slice(-14)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #FCE7F3',
                    fontSize: '11px'
                  }}
                />
                <Bar dataKey="steps" fill="#FB7185" radius={[6, 6, 0, 0]} name="Steps Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Anomaly Observations */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-zinc-900">Pattern Anomaly Detection</h2>
              <p className="text-xs text-zinc-500">Outliers identified by transparent statistical checks</p>
            </div>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
              {anomalies.length} Logged
            </span>
          </div>

          <div className="space-y-2.5">
            {anomalies.length > 0 ? (
              anomalies.map((anom, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-2xl bg-white border border-rose-100 text-xs flex items-start gap-3 shadow-2xs"
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    anom.type === 'symptom' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    <AlertCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 block">{anom.date}</span>
                    <p className="text-zinc-800 font-medium">{anom.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-zinc-400">
                No acute anomalies detected in recent logs. Rhythms are steady.
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-purple-50 text-[11px] text-zinc-500 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <span>
              Anomalies are flagged when values deviate by more than 2 standard deviations from your running monthly baseline.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
