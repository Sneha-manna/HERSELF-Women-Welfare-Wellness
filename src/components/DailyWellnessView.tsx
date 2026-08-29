import React, { useState, useEffect } from 'react';
import { DailyWellness } from '../types';
import { 
  Footprints, 
  Moon, 
  Droplet, 
  Flame, 
  Sparkles, 
  Smile, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Plus, 
  Minus, 
  Heart, 
  Sun, 
  Clock,
  TrendingUp,
  Save
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

interface DailyWellnessViewProps {
  todayWellness: DailyWellness;
  weeklyLogs: DailyWellness[];
  onUpdateWellness: (updated: DailyWellness) => void;
}

export const DailyWellnessView: React.FC<DailyWellnessViewProps> = ({
  todayWellness,
  weeklyLogs,
  onUpdateWellness
}) => {
  const [data, setData] = useState<DailyWellness>({ ...todayWellness });
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  // Meditation Breath Pacer state
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathCountdown, setBreathCountdown] = useState(4);
  const [breathSecondsElapsed, setBreathSecondsElapsed] = useState(0);

  // Sync state if props change
  useEffect(() => {
    setData({ ...todayWellness });
  }, [todayWellness]);

  // Breathing loop timer
  useEffect(() => {
    let interval: any = null;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathSecondsElapsed(prev => prev + 1);
        setBreathCountdown(prev => {
          if (prev <= 1) {
            setBreathPhase(currPhase => {
              if (currPhase === 'Inhale') {
                return 'Hold';
              } else if (currPhase === 'Hold') {
                return 'Exhale';
              } else {
                return 'Inhale';
              }
            });
            // Return appropriate phase length
            return breathPhase === 'Inhale' ? 7 : (breathPhase === 'Hold' ? 8 : 4);
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive, breathPhase]);

  const handleSaveAll = () => {
    onUpdateWellness(data);
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 2500);
  };

  const handleFieldChange = <K extends keyof DailyWellness>(field: K, value: DailyWellness[K]) => {
    const updated = { ...data, [field]: value };
    setData(updated);
    onUpdateWellness(updated);
  };

  // Quick water adjustments
  const adjustWater = (delta: number) => {
    const nextVal = Math.max(0, Math.round((data.waterLiters + delta) * 10) / 10);
    handleFieldChange('waterLiters', nextVal);
  };

  // Weekly steps chart data
  const stepsChartData = weeklyLogs.slice(-7).map(log => ({
    day: new Date(log.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'narrow' }),
    steps: log.steps
  }));

  // Weekly sleep chart data
  const sleepChartData = weeklyLogs.slice(-7).map(log => ({
    day: new Date(log.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'narrow' }),
    sleep: log.sleepHours
  }));

  const stepsRatio = Math.min(1, data.steps / (data.stepsGoal || 8000));
  const waterRatio = Math.min(1, data.waterLiters / (data.waterGoalLiters || 2.5));

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-rose-200/30 via-pink-100/30 to-purple-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900">
              Daily Wellness Trackers
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600">
              Interactive trackers for movement, rest, hydration, mindfulness, and emotional balance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="save-daily-wellness-btn"
              onClick={handleSaveAll}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition-all cursor-pointer"
            >
              {isSavedAlert ? <CheckCircle2 className="w-4 h-4 text-emerald-200" /> : <Save className="w-4 h-4" />}
              <span>{isSavedAlert ? 'Saved!' : 'Save All Changes'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of 6 Interactive Trackers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. WALKING TRACKER */}
        <div className="glass-card rounded-3xl p-6 border border-pink-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center">
                  <Footprints className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-zinc-900">Walking & Steps</h2>
              </div>
              <span className="text-[11px] font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full">
                {Math.round(stepsRatio * 100)}% Goal
              </span>
            </div>

            {/* Circular Progress & Input */}
            <div className="flex items-center gap-5 pt-2">
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="32" stroke="#FCE7F3" strokeWidth="6" fill="transparent" />
                  <circle
                    cx="40" cy="40" r="32"
                    stroke="#F43F5E" strokeWidth="6"
                    strokeDasharray={201.06}
                    strokeDashoffset={201.06 - (201.06 * stepsRatio)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute text-center">
                  <Footprints className="w-5 h-5 text-rose-500 mx-auto" />
                </div>
              </div>

              <div className="space-y-1.5 flex-1">
                <label className="text-[11px] font-bold text-zinc-500 uppercase block">Steps Logged</label>
                <input
                  type="number"
                  value={data.steps}
                  onChange={(e) => handleFieldChange('steps', Math.max(0, parseInt(e.target.value) || 0))}
                  step="250"
                  className="w-full px-3 py-1.5 rounded-xl border border-pink-200 text-zinc-900 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <div className="text-[11px] text-zinc-500">
                  Goal: {data.stepsGoal.toLocaleString()} steps (~{(data.steps * 0.00075).toFixed(1)} km)
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Mini Chart */}
          <div className="pt-3 border-t border-pink-50">
            <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">7-Day History</span>
            <div className="h-16 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stepsChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#9CA3AF" fontSize={9} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #FFE4E6', fontSize: '10px' }}
                  />
                  <Bar dataKey="steps" fill="#FB7185" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 2. SLEEP TRACKER */}
        <div className="glass-card rounded-3xl p-6 border border-purple-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Moon className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-zinc-900">Sleep & Rest</h2>
              </div>
              <div className="flex text-amber-400 text-sm">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleFieldChange('sleepQuality', star as any)}
                    className="cursor-pointer hover:scale-110 transition-transform"
                    title={`${star} star quality`}
                  >
                    {star <= data.sleepQuality ? '★' : '☆'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-700">Duration:</span>
                <span className="text-base font-bold text-purple-900">{data.sleepHours.toFixed(1)} hours</span>
              </div>
              <input
                type="range"
                min="3"
                max="12"
                step="0.1"
                value={data.sleepHours}
                onChange={(e) => handleFieldChange('sleepHours', parseFloat(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />

              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Bedtime</label>
                  <input
                    type="time"
                    value={data.bedTime || '23:00'}
                    onChange={(e) => handleFieldChange('bedTime', e.target.value)}
                    className="w-full px-2 py-1 rounded-lg border border-purple-200 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Wake-up</label>
                  <input
                    type="time"
                    value={data.wakeTime || '06:45'}
                    onChange={(e) => handleFieldChange('wakeTime', e.target.value)}
                    className="w-full px-2 py-1 rounded-lg border border-purple-200 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Sleep Mini Chart */}
          <div className="pt-3 border-t border-purple-50">
            <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">7-Day Sleep Duration</span>
            <div className="h-16 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sleepChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#9CA3AF" fontSize={9} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E9D5FF', fontSize: '10px' }}
                  />
                  <Bar dataKey="sleep" fill="#A855F7" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 3. WATER TRACKER */}
        <div className="glass-card rounded-3xl p-6 border border-sky-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Droplet className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-zinc-900">Hydration</h2>
              </div>
              <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
                {Math.round(waterRatio * 100)}% Goal
              </span>
            </div>

            <div className="text-center py-2 space-y-1">
              <div className="text-3xl font-serif font-bold text-zinc-900">
                {data.waterLiters.toFixed(1)} <span className="text-sm font-sans font-normal text-zinc-500">/ {data.waterGoalLiters} L</span>
              </div>
              <div className="text-xs text-zinc-500">
                {Math.round(data.waterLiters / 0.25)} standard (250ml) glasses
              </div>
            </div>

            {/* Quick Adjustment buttons */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => adjustWater(-0.25)}
                className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors cursor-pointer"
                title="Remove 250ml"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => adjustWater(0.25)}
                className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+250ml</span>
              </button>
              <button
                type="button"
                onClick={() => adjustWater(0.5)}
                className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+500ml</span>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-sky-50">
            <div className="w-full bg-sky-100 rounded-full h-2">
              <div className="bg-sky-500 h-2 rounded-full transition-all duration-300" style={{ width: `${Math.min(100, waterRatio * 100)}%` }} />
            </div>
          </div>
        </div>

        {/* 4. EXERCISE TRACKER */}
        <div className="glass-card rounded-3xl p-6 border border-amber-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-zinc-900">Exercise & Movement</h2>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Exercise Duration (Minutes)</label>
                <input
                  type="number"
                  value={data.exerciseMinutes}
                  onChange={(e) => handleFieldChange('exerciseMinutes', Math.max(0, parseInt(e.target.value) || 0))}
                  step="5"
                  className="w-full px-3 py-1.5 rounded-xl border border-amber-200 text-zinc-900 font-bold text-base focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Activity Type</label>
                <select
                  value={data.exerciseType}
                  onChange={(e) => handleFieldChange('exerciseType', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-zinc-200 text-zinc-800 bg-white"
                >
                  <option value="Yoga">Gentle Yoga / Flow</option>
                  <option value="Pilates">Mat Pilates</option>
                  <option value="Walking">Brisk Walk</option>
                  <option value="Strength">Strength Training</option>
                  <option value="Cardio">Cardio / Cycling</option>
                  <option value="Swimming">Swimming</option>
                  <option value="Stretching">Stretching & Mobility</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Intensity</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['gentle', 'moderate', 'high'] as const).map((intensity) => (
                    <button
                      type="button"
                      key={intensity}
                      onClick={() => handleFieldChange('exerciseIntensity', intensity)}
                      className={`py-1.5 rounded-xl capitalize font-semibold border transition-all ${
                        data.exerciseIntensity === intensity
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-white text-zinc-700 border-zinc-200 hover:bg-amber-50'
                      }`}
                    >
                      {intensity}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-amber-50 text-[11px] text-zinc-500">
            Est. Energy: ~{data.exerciseMinutes * (data.exerciseIntensity === 'high' ? 9 : data.exerciseIntensity === 'moderate' ? 6 : 4)} kcal burned
          </div>
        </div>

        {/* 5. MEDITATION & MINDFULNESS WITH BREATH PACER */}
        <div className="glass-card rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-zinc-900">Mindful Meditation</h2>
              </div>
              <span className="text-[11px] font-bold text-emerald-700">
                {data.meditationMinutes} min logged
              </span>
            </div>

            {/* Interactive Breath Pacer Widget */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center space-y-2">
              <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                4-7-8 Parasympathetic Calm Loop
              </div>
              
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className={`w-16 h-16 rounded-full bg-emerald-200/50 flex items-center justify-center transition-all duration-1000 ${
                  isBreathingActive
                    ? breathPhase === 'Inhale'
                      ? 'scale-125 bg-emerald-300/80 shadow-md shadow-emerald-200'
                      : breathPhase === 'Hold'
                      ? 'scale-125 bg-purple-200/80'
                      : 'scale-90 bg-emerald-100'
                    : ''
                }`}>
                  <span className="text-xs font-bold text-emerald-950">
                    {isBreathingActive ? breathCountdown : 'Ready'}
                  </span>
                </div>
              </div>

              <div className="text-xs font-bold text-emerald-900">
                {isBreathingActive ? breathPhase : 'Start 4-7-8 Practice'}
              </div>

              <button
                type="button"
                onClick={() => setIsBreathingActive(!isBreathingActive)}
                className="px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                {isBreathingActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isBreathingActive ? 'Pause Loop' : 'Begin Breathing'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-zinc-600">Manual Minute Adjust:</span>
              <div className="flex items-center gap-1">
                {[5, 10, 15, 20].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => handleFieldChange('meditationMinutes', mins)}
                    className={`px-2 py-0.5 rounded-md font-semibold ${
                      data.meditationMinutes === mins
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 6. MOOD & EMOTIONAL CHECK-IN */}
        <div className="glass-card rounded-3xl p-6 border border-rose-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <Smile className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-zinc-900">Mood & Vitality</h2>
              </div>
              <span className="text-[11px] font-bold text-rose-700 capitalize">
                {data.mood}
              </span>
            </div>

            {/* Mood options */}
            <div className="grid grid-cols-4 gap-1.5 text-xs">
              {[
                { id: 'radiant', label: 'Radiant', emoji: '✨' },
                { id: 'calm', label: 'Calm', emoji: '🌸' },
                { id: 'productive', label: 'Focused', emoji: '⚡' },
                { id: 'sensitive', label: 'Soft', emoji: '🪷' },
                { id: 'anxious', label: 'Restless', emoji: '🌊' },
                { id: 'exhausted', label: 'Tired', emoji: '💤' },
                { id: 'low', label: 'Low', emoji: '🤍' },
              ].map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => handleFieldChange('mood', m.id as any)}
                  className={`p-1.5 rounded-xl text-center border transition-all ${
                    data.mood === m.id
                      ? 'bg-rose-500 text-white border-rose-500 shadow-2xs font-bold'
                      : 'bg-white text-zinc-700 border-zinc-200 hover:bg-rose-50'
                  }`}
                >
                  <div className="text-sm">{m.emoji}</div>
                  <div className="text-[10px] truncate">{m.label}</div>
                </button>
              ))}
            </div>

            {/* Energy Slider */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-700">Energy Level:</span>
                <span className="font-bold text-rose-700">{data.moodEnergy} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={data.moodEnergy}
                onChange={(e) => handleFieldChange('moodEnergy', parseInt(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            {/* Mood Note */}
            <div>
              <input
                type="text"
                value={data.moodNote || ''}
                onChange={(e) => handleFieldChange('moodNote', e.target.value)}
                placeholder="Short reflection note..."
                className="w-full px-3 py-1.5 rounded-xl border border-zinc-200 text-xs text-zinc-800"
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
