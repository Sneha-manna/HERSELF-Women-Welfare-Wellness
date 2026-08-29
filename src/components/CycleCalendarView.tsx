import React, { useState } from 'react';
import { PeriodEntry, CycleStats } from '../types';
import { calculateCycleStats } from '../services/analytics';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Edit3, 
  Info, 
  TrendingUp, 
  ShieldAlert, 
  Sparkles, 
  Check, 
  Droplet,
  Heart
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';

interface CycleCalendarViewProps {
  periodEntries: PeriodEntry[];
  onAddPeriod: (entry: PeriodEntry) => void;
  onDeletePeriod: (id: string) => void;
}

export const CycleCalendarView: React.FC<CycleCalendarViewProps> = ({
  periodEntries,
  onAddPeriod,
  onDeletePeriod
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalFlow, setModalFlow] = useState<'light' | 'medium' | 'heavy' | 'spotting'>('medium');
  const [modalStartDate, setModalStartDate] = useState(selectedDateStr);
  const [modalEndDate, setModalEndDate] = useState(selectedDateStr);
  const [modalNotes, setModalNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'calendar' | 'insights'>('calendar');

  const cycleStats: CycleStats = calculateCycleStats(periodEntries);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Calendar math
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sun
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Prev month / Next month
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDateStr(new Date().toISOString().split('T')[0]);
  };

  // Helper to check date status
  const getDateStatus = (day: number) => {
    const formatted = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dTime = new Date(formatted).getTime();

    // Check if within any period range
    let isPeriod = false;
    let isStart = false;
    let isEnd = false;
    let flow: PeriodEntry['flow'] = undefined;

    for (const entry of periodEntries) {
      const sTime = new Date(entry.startDate).getTime();
      const eTime = new Date(entry.endDate).getTime();
      if (formatted === entry.startDate) isStart = true;
      if (formatted === entry.endDate) isEnd = true;
      if (dTime >= sTime && dTime <= eTime) {
        isPeriod = true;
        flow = entry.flow;
        break;
      }
    }

    // Check if predicted next period date
    const isPredicted = formatted === cycleStats.estimatedNextPeriodDate;

    // Check if in fertile window
    const fertileStart = new Date(cycleStats.fertileWindowStart).getTime();
    const fertileEnd = new Date(cycleStats.fertileWindowEnd).getTime();
    const isFertile = dTime >= fertileStart && dTime <= fertileEnd;
    const isOvulation = formatted === cycleStats.ovulationDate;

    return { formatted, isPeriod, isStart, isEnd, flow, isPredicted, isFertile, isOvulation };
  };

  // Open modal with selected date
  const handleOpenAddModal = (dateStr?: string) => {
    const target = dateStr || selectedDateStr;
    setModalStartDate(target);
    const end = new Date(target);
    end.setDate(end.getDate() + 4);
    setModalEndDate(end.toISOString().split('T')[0]);
    setModalFlow('medium');
    setModalNotes('');
    setIsModalOpen(true);
  };

  const handleSavePeriod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalStartDate || !modalEndDate) return;
    const newEntry: PeriodEntry = {
      id: `p-${Date.now()}`,
      startDate: modalStartDate,
      endDate: modalEndDate,
      flow: modalFlow,
      notes: modalNotes
    };
    onAddPeriod(newEntry);
    setIsModalOpen(false);
  };

  // Prepare chart data for cycle lengths across months
  const sortedPeriods = [...periodEntries].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  const chartData = [];
  for (let i = 0; i < sortedPeriods.length - 1; i++) {
    const s1 = new Date(sortedPeriods[i].startDate);
    const s2 = new Date(sortedPeriods[i + 1].startDate);
    const diff = Math.round((s2.getTime() - s1.getTime()) / (1000 * 60 * 60 * 24));
    if (diff > 15 && diff < 80) {
      chartData.push({
        cycle: `Cycle ${i + 1}`,
        date: s1.toLocaleDateString('en-US', { month: 'short' }),
        length: diff,
        avg: cycleStats.averageCycleLength
      });
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900">
            Menstrual Cycle Intelligence
          </h1>
          <p className="text-sm text-zinc-600">
            Track your exact cycle intervals, fertile windows, and personal pattern dynamics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-white p-1 rounded-2xl border border-rose-200/80 shadow-xs flex">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'calendar'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Calendar View
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'insights'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Cycle Insights & Trends
            </button>
          </div>

          <button
            id="add-period-btn"
            onClick={() => handleOpenAddModal()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-200 hover:bg-rose-700 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log Period</span>
          </button>
        </div>
      </div>

      {/* Cycle Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass-card rounded-2xl p-4 border border-rose-100">
          <span className="text-[11px] font-bold text-zinc-500 uppercase">Current Day</span>
          <div className="text-xl font-bold text-rose-600 mt-1">
            Day {cycleStats.currentPhaseDay}
          </div>
          <span className="text-[10px] text-zinc-400 capitalize">{cycleStats.currentPhase} phase</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-rose-100">
          <span className="text-[11px] font-bold text-zinc-500 uppercase">Avg Cycle Length</span>
          <div className="text-xl font-bold text-zinc-900 mt-1">
            {cycleStats.averageCycleLength} <span className="text-xs font-normal text-zinc-500">days</span>
          </div>
          <span className="text-[10px] text-zinc-400">Personal history</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-rose-100">
          <span className="text-[11px] font-bold text-zinc-500 uppercase">Previous Cycle</span>
          <div className="text-xl font-bold text-zinc-900 mt-1">
            {cycleStats.previousCycleLength} <span className="text-xs font-normal text-zinc-500">days</span>
          </div>
          <span className="text-[10px] text-zinc-400">Last interval</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-rose-100">
          <span className="text-[11px] font-bold text-zinc-500 uppercase">Tracked Cycles</span>
          <div className="text-xl font-bold text-zinc-900 mt-1">
            {cycleStats.trackedCyclesCount}
          </div>
          <span className="text-[10px] text-zinc-400">Recorded records</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-rose-100">
          <span className="text-[11px] font-bold text-zinc-500 uppercase">Days Since Last</span>
          <div className="text-xl font-bold text-zinc-900 mt-1">
            {cycleStats.daysSinceLastPeriod} <span className="text-xs font-normal text-zinc-500">days</span>
          </div>
          <span className="text-[10px] text-zinc-400">From period start</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-purple-100 bg-purple-50/40">
          <span className="text-[11px] font-bold text-purple-700 uppercase">Estimated Next</span>
          <div className="text-sm font-bold text-purple-950 mt-1 truncate">
            {cycleStats.estimatedNextPeriodDate}
          </div>
          <span className="text-[10px] text-purple-600">Adaptive forecast</span>
        </div>
      </div>

      {activeTab === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Calendar Card */}
          <div className="lg:col-span-8 glass-card rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-md">
            
            {/* Calendar Header Navigation */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900">
                  {monthNames[currentMonth]} {currentYear}
                </h2>
                <button
                  onClick={handleToday}
                  className="text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  Today
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  id="calendar-prev-month-btn"
                  onClick={handlePrevMonth}
                  className="p-2 rounded-xl hover:bg-rose-50 text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  id="calendar-next-month-btn"
                  onClick={handleNextMonth}
                  className="p-2 rounded-xl hover:bg-rose-50 text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
                  title="Next Month"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Day of week labels */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-zinc-400 uppercase tracking-wider">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty leading days */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="h-12 sm:h-14 rounded-2xl bg-zinc-50/40 opacity-30" />
              ))}

              {/* Month Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const { formatted, isPeriod, isStart, isEnd, isPredicted, isFertile, isOvulation } = getDateStatus(day);
                const isSelected = formatted === selectedDateStr;
                const isToday = formatted === new Date().toISOString().split('T')[0];

                return (
                  <button
                    key={day}
                    id={`cal-day-${formatted}`}
                    onClick={() => setSelectedDateStr(formatted)}
                    className={`relative h-12 sm:h-14 rounded-2xl flex flex-col items-center justify-center p-1 transition-all cursor-pointer group ${
                      isSelected
                        ? 'ring-2 ring-rose-500 shadow-md z-10'
                        : 'hover:bg-rose-50/60'
                    } ${
                      isPeriod
                        ? 'bg-rose-500 text-white font-bold shadow-xs'
                        : isFertile
                        ? 'bg-purple-100/70 text-purple-900 font-semibold'
                        : isPredicted
                        ? 'bg-rose-100/80 text-rose-800 border-2 border-dashed border-rose-300 font-semibold'
                        : 'bg-white/70 text-zinc-700'
                    }`}
                  >
                    <span className={`text-xs sm:text-sm font-semibold ${isPeriod ? 'text-white' : ''}`}>
                      {day}
                    </span>

                    {/* Indicators */}
                    <div className="flex items-center gap-1 mt-0.5">
                      {isPeriod && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                      {isOvulation && !isPeriod && (
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" title="Estimated Ovulation" />
                      )}
                      {isToday && !isPeriod && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-5 border-t border-rose-100 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-zinc-600">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-lg bg-rose-500" />
                <span>Period Days</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-lg bg-purple-100 border border-purple-200" />
                <span>Fertile Window</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-lg bg-purple-500" />
                <span>Ovulation Peak</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-lg bg-rose-100 border border-dashed border-rose-300" />
                <span>Predicted Period</span>
              </div>
            </div>

          </div>

          {/* Right Column: Selected Date Actions & Cycle History */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Selected Date Card */}
            <div className="glass-card rounded-3xl p-6 border border-rose-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Selected Date</span>
                  <h2 className="text-base font-bold text-zinc-900">
                    {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </h2>
                </div>
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <CalendarIcon className="w-4 h-4" />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100/80 text-xs text-zinc-700 space-y-1.5">
                <div className="font-bold text-rose-900">Quick Actions for this Date:</div>
                <div className="flex flex-col gap-2 pt-1">
                  <button
                    onClick={() => handleOpenAddModal(selectedDateStr)}
                    className="w-full py-2 px-3 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Period Starting on This Date</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Historical Cycles List */}
            <div className="glass-card rounded-3xl p-6 border border-rose-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-zinc-900">Tracked History Cycles</h2>
                <span className="text-xs text-zinc-500">{periodEntries.length} logged</span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {sortedPeriods.map((entry, idx) => {
                  const s = new Date(entry.startDate + 'T00:00:00');
                  const e = new Date(entry.endDate + 'T00:00:00');
                  const durationDays = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;

                  // Next cycle interval
                  let nextInterval = null;
                  if (idx < sortedPeriods.length - 1) {
                    const nextStart = new Date(sortedPeriods[idx + 1].startDate + 'T00:00:00');
                    nextInterval = Math.round((nextStart.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
                  }

                  return (
                    <div 
                      key={entry.id}
                      className="p-3 rounded-2xl bg-white border border-rose-100 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-zinc-800">
                          {s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {e.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="text-[11px] text-zinc-500">
                          {durationDays} days flow ({entry.flow || 'medium'}) {nextInterval ? `· ${nextInterval}-day cycle` : ''}
                        </div>
                        {entry.notes && (
                          <div className="text-[10px] text-zinc-400 italic mt-0.5 truncate max-w-[180px]">
                            {entry.notes}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => onDeletePeriod(entry.id)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* Cycle Pattern Analysis & Insights Tab */
        <div className="space-y-6">
          
          {/* Variability & Regularity Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-card rounded-2xl p-5 border border-rose-100">
              <span className="text-xs font-bold text-zinc-500 uppercase">Cycle Variability</span>
              <div className="text-2xl font-bold text-zinc-900 mt-1">
                ±{cycleStats.cycleVariabilityDays} <span className="text-xs font-normal text-zinc-500">days</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">Standard deviation across records</p>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-rose-100">
              <span className="text-xs font-bold text-zinc-500 uppercase">Longest Cycle</span>
              <div className="text-2xl font-bold text-zinc-900 mt-1">
                {cycleStats.longestCycleDays} <span className="text-xs font-normal text-zinc-500">days</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">Recorded maximum interval</p>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-rose-100">
              <span className="text-xs font-bold text-zinc-500 uppercase">Shortest Cycle</span>
              <div className="text-2xl font-bold text-zinc-900 mt-1">
                {cycleStats.shortestCycleDays} <span className="text-xs font-normal text-zinc-500">days</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">Recorded minimum interval</p>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-rose-100">
              <span className="text-xs font-bold text-zinc-500 uppercase">Recent Delay</span>
              <div className="text-2xl font-bold text-zinc-900 mt-1">
                {cycleStats.recentDelayDays} <span className="text-xs font-normal text-zinc-500">days</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">Beyond expected baseline</p>
            </div>
          </div>

          {/* Irregularity Warning Callout */}
          {cycleStats.isIrregular ? (
            <div className="p-5 rounded-3xl bg-amber-50/90 border border-amber-200 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-base font-bold text-amber-900">
                  Your recent cycles appear more irregular than your previous cycles.
                </h2>
                <p className="text-xs sm:text-sm text-amber-800/90 leading-relaxed">
                  {cycleStats.irregularityReason} Cycle irregularity can have many possible causes, including travel, stress fluctuations, nutritional adjustments, and hormonal variations. If this pattern continues or concerns you, consider speaking with a qualified healthcare professional.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <div className="text-xs sm:text-sm text-emerald-900">
                <span className="font-bold">Consistent Cycle Rhythm:</span> Your tracked cycle intervals show stable predictability with a {cycleStats.averageCycleLength}-day baseline.
              </div>
            </div>
          )}

          {/* Cycle Length Line Chart */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-md space-y-4">
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Cycle Length Progression</h2>
              <p className="text-xs text-zinc-500">Historical days between consecutive period start dates vs. your average baseline</p>
            </div>

            <div className="h-72 w-full pt-4">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickLine={false} />
                    <YAxis stroke="#9CA3AF" fontSize={12} domain={['dataMin - 3', 'dataMax + 3']} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #FFE4E6',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        fontSize: '12px'
                      }}
                    />
                    <ReferenceLine y={cycleStats.averageCycleLength} stroke="#FB7185" strokeDasharray="3 3" label={{ value: `Avg: ${cycleStats.averageCycleLength}d`, fill: '#E11D48', fontSize: 11 }} />
                    <Line
                      type="monotone"
                      dataKey="length"
                      name="Cycle Length (days)"
                      stroke="#E11D48"
                      strokeWidth={3}
                      dot={{ r: 5, fill: '#E11D48', strokeWidth: 2, stroke: '#FFFFFF' }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-zinc-400">
                  Log at least 2 consecutive periods to visualize your cycle trends.
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Log Period Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-rose-100 space-y-5 animate-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h2 className="text-lg font-bold text-zinc-900">Log Period Cycle</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePeriod} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Period Start Date</label>
                <input
                  type="date"
                  value={modalStartDate}
                  onChange={(e) => setModalStartDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 bg-rose-50/40 text-zinc-800 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Period End Date</label>
                <input
                  type="date"
                  value={modalEndDate}
                  onChange={(e) => setModalEndDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 bg-rose-50/40 text-zinc-800 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Flow Intensity</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['spotting', 'light', 'medium', 'heavy'] as const).map((flow) => (
                    <button
                      type="button"
                      key={flow}
                      onClick={() => setModalFlow(flow)}
                      className={`py-2 rounded-xl capitalize font-semibold border transition-all ${
                        modalFlow === flow
                          ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                          : 'bg-white text-zinc-600 border-zinc-200 hover:bg-rose-50'
                      }`}
                    >
                      {flow}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Notes (Optional)</label>
                <textarea
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="e.g. Mild cramps on day 1, rested with heating pad..."
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-200 transition-all cursor-pointer"
                >
                  Save Period
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
