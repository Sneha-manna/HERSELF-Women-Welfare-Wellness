import React, { useState, useEffect } from 'react';
import { 
  NavTab, 
  PeriodEntry, 
  DailyWellness, 
  SymptomRecord, 
  PatternCheckData, 
  DietPreferences, 
  TaskItem, 
  PersonalNote 
} from './types';
import { StorageService } from './services/storage';
import { calculateCycleStats } from './services/analytics';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DashboardView } from './components/DashboardView';
import { CycleCalendarView } from './components/CycleCalendarView';
import { PatternCheckView } from './components/PatternCheckView';
import { DietPlanView } from './components/DietPlanView';
import { SymptomCheckinView } from './components/SymptomCheckinView';
import { DailyWellnessView } from './components/DailyWellnessView';
import { DataScienceInsightsView } from './components/DataScienceInsightsView';
import { TasksNotesView } from './components/TasksNotesView';
import { MonthlyReportView } from './components/MonthlyReportView';
import { PrivacyView } from './components/PrivacyView';
import { Heart, ShieldCheck, Sparkles, Plus, Calendar, Droplets } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  
  // State from local storage
  const [periodEntries, setPeriodEntries] = useState<PeriodEntry[]>([]);
  const [dailyLogs, setDailyLogs] = useState<DailyWellness[]>([]);
  const [todayWellness, setTodayWellness] = useState<DailyWellness>(() => StorageService.getTodayWellness());
  const [symptoms, setSymptoms] = useState<SymptomRecord[]>([]);
  const [patternData, setPatternData] = useState<PatternCheckData>(() => StorageService.getPatternData());
  const [dietPrefs, setDietPrefs] = useState<DietPreferences>(() => StorageService.getDietPreferences());
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [notes, setNotes] = useState<PersonalNote[]>([]);

  // Period log modal quick action
  const [isQuickPeriodModalOpen, setIsQuickPeriodModalOpen] = useState(false);
  const [quickPeriodStart, setQuickPeriodStart] = useState(new Date().toISOString().split('T')[0]);
  const [quickPeriodEnd, setQuickPeriodEnd] = useState('');
  const [quickPeriodFlow, setQuickPeriodFlow] = useState<'light' | 'medium' | 'heavy'>('medium');

  // Load all data on mount
  useEffect(() => {
    setPeriodEntries(StorageService.getPeriodEntries());
    setDailyLogs(StorageService.getDailyWellnessLogs());
    setTodayWellness(StorageService.getTodayWellness());
    setSymptoms(StorageService.getSymptoms());
    setPatternData(StorageService.getPatternData());
    setDietPrefs(StorageService.getDietPreferences());
    setTasks(StorageService.getTasks());
    setNotes(StorageService.getNotes());
  }, []);

  // Handlers for Period Entries
  const handleAddPeriodEntry = (entry: PeriodEntry) => {
    StorageService.savePeriodEntry(entry);
    setPeriodEntries(StorageService.getPeriodEntries());
  };

  const handleDeletePeriodEntry = (id: string) => {
    StorageService.deletePeriodEntry(id);
    setPeriodEntries(StorageService.getPeriodEntries());
  };

  // Quick Period Form submit
  const handleQuickPeriodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: PeriodEntry = {
      id: `period-${Date.now()}`,
      startDate: quickPeriodStart,
      endDate: quickPeriodEnd || quickPeriodStart,
      flow: quickPeriodFlow
    };
    handleAddPeriodEntry(newEntry);
    setIsQuickPeriodModalOpen(false);
  };

  // Handlers for Daily Wellness
  const handleUpdateTodayWellness = (updated: DailyWellness) => {
    StorageService.saveDailyWellness(updated);
    setTodayWellness(updated);
    setDailyLogs(StorageService.getDailyWellnessLogs());
  };

  // Handlers for Symptoms
  const handleAddSymptom = (symptom: SymptomRecord) => {
    StorageService.saveSymptom(symptom);
    setSymptoms(StorageService.getSymptoms());
  };

  const handleDeleteSymptom = (id: string) => {
    StorageService.deleteSymptom(id);
    setSymptoms(StorageService.getSymptoms());
  };

  // Handlers for Pattern Data
  const handleSavePatternData = (data: PatternCheckData) => {
    StorageService.savePatternData(data);
    setPatternData(data);
  };

  // Handlers for Diet Preferences
  const handleSaveDietPrefs = (prefs: DietPreferences) => {
    StorageService.saveDietPreferences(prefs);
    setDietPrefs(prefs);
  };

  // Handlers for Tasks
  const handleAddTask = (task: TaskItem) => {
    StorageService.saveTask(task);
    setTasks(StorageService.getTasks());
  };

  const handleToggleTask = (id: string) => {
    StorageService.toggleTask(id);
    setTasks(StorageService.getTasks());
  };

  const handleDeleteTask = (id: string) => {
    StorageService.deleteTask(id);
    setTasks(StorageService.getTasks());
  };

  // Handlers for Notes
  const handleAddNote = (note: PersonalNote) => {
    StorageService.saveNote(note);
    setNotes(StorageService.getNotes());
  };

  const handleDeleteNote = (id: string) => {
    StorageService.deleteNote(id);
    setNotes(StorageService.getNotes());
  };

  const handleDataReset = () => {
    setPeriodEntries([]);
    setDailyLogs([]);
    setSymptoms([]);
    setTasks([]);
    setNotes([]);
  };

  // Derive cycle stats for active display
  const cycleStats = calculateCycleStats(periodEntries);

  return (
    <div className="min-h-screen flex flex-col selection:bg-rose-100 selection:text-rose-900">
      
      {/* Top Glass Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onQuickLogPeriod={() => setIsQuickPeriodModalOpen(true)}
        onResetData={() => {
          setPeriodEntries(StorageService.getPeriodEntries());
          setDailyLogs(StorageService.getDailyWellnessLogs());
          setTodayWellness(StorageService.getTodayWellness());
          setSymptoms(StorageService.getSymptoms());
          setPatternData(StorageService.getPatternData());
          setDietPrefs(StorageService.getDietPreferences());
          setTasks(StorageService.getTasks());
          setNotes(StorageService.getNotes());
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        
        {/* Render Active View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-12">
            <HeroSection
              onStartTracking={() => setActiveTab('cycle')}
              onExploreDiet={() => setActiveTab('diet')}
              onPatternCheck={() => setActiveTab('pattern')}
            />
            
            <DashboardView
              periodEntries={periodEntries}
              todayWellness={todayWellness}
              dailyLogs={dailyLogs}
              symptoms={symptoms}
              patternData={patternData}
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {activeTab === 'cycle' && (
          <CycleCalendarView
            periodEntries={periodEntries}
            onAddPeriodEntry={handleAddPeriodEntry}
            onDeletePeriodEntry={handleDeletePeriodEntry}
          />
        )}

        {activeTab === 'pattern' && (
          <PatternCheckView
            patternData={patternData}
            onSavePatternData={handleSavePatternData}
          />
        )}

        {activeTab === 'diet' && (
          <DietPlanView
            dietPrefs={dietPrefs}
            currentPhase={cycleStats.currentPhase}
            onSaveDietPrefs={handleSaveDietPrefs}
          />
        )}

        {activeTab === 'symptoms' && (
          <SymptomCheckinView
            symptoms={symptoms}
            onAddSymptom={handleAddSymptom}
            onDeleteSymptom={handleDeleteSymptom}
          />
        )}

        {activeTab === 'wellness' && (
          <DailyWellnessView
            todayWellness={todayWellness}
            weeklyLogs={dailyLogs}
            onUpdateWellness={handleUpdateTodayWellness}
          />
        )}

        {activeTab === 'insights' && (
          <DataScienceInsightsView
            dailyLogs={dailyLogs}
            periodEntries={periodEntries}
            symptoms={symptoms}
          />
        )}

        {activeTab === 'tasks_notes' && (
          <TasksNotesView
            tasks={tasks}
            notes={notes}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
          />
        )}

        {activeTab === 'report' && (
          <MonthlyReportView
            dailyLogs={dailyLogs}
            periodEntries={periodEntries}
            symptoms={symptoms}
            patternData={patternData}
          />
        )}

        {activeTab === 'privacy' && (
          <PrivacyView onDataReset={handleDataReset} />
        )}

      </main>

      {/* Global Quick Period Log Modal */}
      {isQuickPeriodModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-rose-100 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-rose-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <Droplets className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-zinc-900">Quick Log Period</h2>
              </div>
              <button
                onClick={() => setIsQuickPeriodModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickPeriodSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={quickPeriodStart}
                  onChange={(e) => setQuickPeriodStart(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">End Date (Optional)</label>
                <input
                  type="date"
                  value={quickPeriodEnd}
                  onChange={(e) => setQuickPeriodEnd(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-2">Flow Intensity</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['light', 'medium', 'heavy'] as const).map((flow) => (
                    <button
                      type="button"
                      key={flow}
                      onClick={() => setQuickPeriodFlow(flow)}
                      className={`py-2 rounded-xl capitalize font-bold border transition-all cursor-pointer ${
                        quickPeriodFlow === flow
                          ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                          : 'bg-white text-zinc-700 border-zinc-200 hover:bg-rose-50'
                      }`}
                    >
                      {flow}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuickPeriodModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-zinc-600 hover:bg-zinc-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold shadow-md shadow-rose-200 transition-all cursor-pointer"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="print:hidden border-t border-rose-100 bg-white/70 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg text-rose-950">HERSELF</span>
              <span className="text-zinc-300">|</span>
              <span className="text-xs text-zinc-500 font-medium">Women's Wellness & Rhythmic Intelligence</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
              <button 
                onClick={() => { setActiveTab('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="hover:text-rose-600 transition-colors cursor-pointer"
              >
                Local Privacy
              </button>
              <button 
                onClick={() => { setActiveTab('pattern'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="hover:text-rose-600 transition-colors cursor-pointer"
              >
                Pattern Check
              </button>
              <button 
                onClick={() => { setActiveTab('diet'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="hover:text-rose-600 transition-colors cursor-pointer"
              >
                Diet Plan
              </button>
              <button 
                onClick={() => { setActiveTab('report'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="hover:text-rose-600 transition-colors cursor-pointer"
              >
                Monthly Summary
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-rose-50 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400 gap-2">
            <p>
              © {new Date().getFullYear()} HERSELF. All records remain encrypted in your local browser sandbox.
            </p>
            <p className="flex items-center gap-1 text-zinc-500">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>General wellness guidance — Not a medical diagnosis.</span>
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
