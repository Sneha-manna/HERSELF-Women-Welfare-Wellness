import { 
  PeriodEntry, 
  DailyWellness, 
  SymptomRecord, 
  PatternCheckData, 
  DietPreferences, 
  TaskItem, 
  PersonalNote 
} from '../types';

const STORAGE_KEYS = {
  PERIOD_ENTRIES: 'herself_period_entries_v1',
  DAILY_WELLNESS: 'herself_daily_wellness_v1',
  SYMPTOMS: 'herself_symptoms_v1',
  PATTERN_CHECK: 'herself_pattern_check_v1',
  DIET_PREFS: 'herself_diet_prefs_v1',
  TASKS: 'herself_tasks_v1',
  NOTES: 'herself_notes_v1',
  IS_INITIALIZED: 'herself_initialized_v1'
};

// Generate realistic default demo dataset
function generateInitialDemoData() {
  const today = new Date();
  
  // 4 historic cycles
  const periodEntries: PeriodEntry[] = [
    {
      id: 'p-1',
      startDate: new Date(today.getFullYear(), today.getMonth() - 3, 4).toISOString().split('T')[0],
      endDate: new Date(today.getFullYear(), today.getMonth() - 3, 8).toISOString().split('T')[0],
      flow: 'medium',
      notes: 'Normal flow, mild cramps on day 1.'
    },
    {
      id: 'p-2',
      startDate: new Date(today.getFullYear(), today.getMonth() - 2, 3).toISOString().split('T')[0],
      endDate: new Date(today.getFullYear(), today.getMonth() - 2, 7).toISOString().split('T')[0],
      flow: 'medium',
      notes: 'Very smooth cycle, stayed well hydrated.'
    },
    {
      id: 'p-3',
      startDate: new Date(today.getFullYear(), today.getMonth() - 1, 2).toISOString().split('T')[0],
      endDate: new Date(today.getFullYear(), today.getMonth() - 1, 6).toISOString().split('T')[0],
      flow: 'heavy',
      notes: 'Mild fatigue on start day.'
    },
    {
      id: 'p-4',
      startDate: new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0],
      endDate: new Date(today.getFullYear(), today.getMonth(), 5).toISOString().split('T')[0],
      flow: 'medium',
      notes: 'On track with personal rhythm.'
    }
  ];

  // Daily wellness logs for past 30 days
  const dailyWellness: DailyWellness[] = [];
  const moods: DailyWellness['mood'][] = ['radiant', 'calm', 'productive', 'calm', 'radiant', 'sensitive', 'productive'];
  const exercises = ['Morning Yoga', 'Brisk Park Walk', 'Pilates Flow', 'Light Stretching', 'Gentle Cardio', 'Evening Walk'];

  for (let i = 30; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const sleepHours = 7.0 + Math.sin(i * 0.7) * 1.2;
    const steps = Math.floor(6200 + Math.cos(i * 0.5) * 2200);
    const waterLiters = Math.round((1.9 + Math.sin(i * 0.9) * 0.6) * 10) / 10;
    const exerciseMinutes = i % 2 === 0 ? Math.floor(25 + Math.random() * 20) : 15;
    const meditationMinutes = i % 3 === 0 ? 15 : (i % 2 === 0 ? 10 : 5);

    dailyWellness.push({
      date: dateStr,
      sleepHours: Math.round(sleepHours * 10) / 10,
      sleepQuality: (sleepHours >= 7.5 ? 5 : sleepHours >= 6.5 ? 4 : 3) as 1 | 2 | 3 | 4 | 5,
      bedTime: '23:15',
      wakeTime: '06:45',
      steps,
      stepsGoal: 8000,
      waterLiters,
      waterGoalLiters: 2.5,
      exerciseMinutes,
      exerciseType: exercises[i % exercises.length],
      exerciseIntensity: exerciseMinutes > 30 ? 'moderate' : 'gentle',
      meditationMinutes,
      mood: moods[i % moods.length],
      moodEnergy: Math.floor(7 + Math.sin(i) * 2),
      moodNote: i === 0 ? 'Feeling energized and balanced.' : undefined
    });
  }

  // Symptoms
  const symptoms: SymptomRecord[] = [
    {
      id: 'sym-1',
      date: new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0],
      symptom: 'cramps',
      symptomLabel: 'Cramps',
      severity: 'mild',
      notes: 'Relieved by warm chamomile tea and a heating pad.'
    },
    {
      id: 'sym-2',
      date: new Date(today.getFullYear(), today.getMonth(), 2).toISOString().split('T')[0],
      symptom: 'fatigue',
      symptomLabel: 'Fatigue',
      severity: 'mild',
      notes: 'Took a short 20m afternoon power nap.'
    },
    {
      id: 'sym-3',
      date: new Date(today.getFullYear(), today.getMonth(), 12).toISOString().split('T')[0],
      symptom: 'bloating',
      symptomLabel: 'Bloating',
      severity: 'mild',
      notes: 'After heavy restaurant dinner.'
    },
    {
      id: 'sym-4',
      date: new Date(today.getFullYear(), today.getMonth(), 18).toISOString().split('T')[0],
      symptom: 'headache',
      symptomLabel: 'Headache',
      severity: 'mild',
      notes: 'Spent 6 hours in front of laptop screens.'
    }
  ];

  const patternCheck: PatternCheckData = {
    irregularPeriods: false,
    unusuallyLongCycles: false,
    acne: false,
    increasedFacialBodyHair: false,
    unusualHairThinning: false,
    unexpectedWeightChanges: false,
    fatigue: false,
    moodChanges: false,
    lastCheckedDate: today.toISOString().split('T')[0]
  };

  const dietPrefs: DietPreferences = {
    goal: 'energy',
    lifestyle: 'moderate',
    dietPreference: 'vegetarian',
    allergies: [],
    customNotes: 'Prefers whole plant-based foods, fresh leafy greens, and seasonal fruits.'
  };

  const tasks: TaskItem[] = [
    {
      id: 't-1',
      title: 'Drink 500ml warm lemon water upon waking',
      category: 'water',
      completed: true,
      createdAt: today.toISOString()
    },
    {
      id: 't-2',
      title: '20-minute mindful morning stroll in the sun',
      category: 'movement',
      completed: true,
      createdAt: today.toISOString()
    },
    {
      id: 't-3',
      title: 'Prepare colorful lunch with protein and leafy greens',
      category: 'nutrition',
      completed: false,
      createdAt: today.toISOString()
    },
    {
      id: 't-4',
      title: '10-minute 4-7-8 relaxing breathing practice',
      category: 'selfcare',
      completed: false,
      createdAt: today.toISOString()
    },
    {
      id: 't-5',
      title: 'Wind down screens 45 mins before bedtime',
      category: 'rest',
      completed: false,
      createdAt: today.toISOString()
    }
  ];

  const notes: PersonalNote[] = [
    {
      id: 'n-1',
      date: today.toISOString().split('T')[0],
      content: 'Woke up feeling deeply rested today after 7.5 hours of calm sleep. Enjoyed a morning matcha and 15 minutes of gentle yoga.',
      tag: 'reflection',
      mood: 'Radiant',
      createdAt: today.toISOString()
    },
    {
      id: 'n-2',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3).toISOString().split('T')[0],
      content: 'Noticed much higher sustained energy throughout the afternoon by swapping sugary afternoon snacks for raw walnuts and herbal tea.',
      tag: 'food',
      mood: 'Productive',
      createdAt: new Date(today.getTime() - 3 * 86400000).toISOString()
    },
    {
      id: 'n-3',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7).toISOString().split('T')[0],
      content: 'Finished a relaxing 6,800-step park walk with evening breeze. Mind felt clear and peaceful.',
      tag: 'energy',
      mood: 'Calm',
      createdAt: new Date(today.getTime() - 7 * 86400000).toISOString()
    }
  ];

  return {
    periodEntries,
    dailyWellness,
    symptoms,
    patternCheck,
    dietPrefs,
    tasks,
    notes
  };
}

// Storage helpers
function getItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error('Error reading localStorage key', key, e);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error writing localStorage key', key, e);
  }
}

export const StorageService = {
  initialize() {
    const initialized = localStorage.getItem(STORAGE_KEYS.IS_INITIALIZED);
    if (!initialized) {
      this.resetToDemoData();
    }
  },

  resetToDemoData() {
    const demo = generateInitialDemoData();
    setItem(STORAGE_KEYS.PERIOD_ENTRIES, demo.periodEntries);
    setItem(STORAGE_KEYS.DAILY_WELLNESS, demo.dailyWellness);
    setItem(STORAGE_KEYS.SYMPTOMS, demo.symptoms);
    setItem(STORAGE_KEYS.PATTERN_CHECK, demo.patternCheck);
    setItem(STORAGE_KEYS.DIET_PREFS, demo.dietPrefs);
    setItem(STORAGE_KEYS.TASKS, demo.tasks);
    setItem(STORAGE_KEYS.NOTES, demo.notes);
    localStorage.setItem(STORAGE_KEYS.IS_INITIALIZED, 'true');
  },

  clearAllData() {
    localStorage.clear();
    this.initialize();
  },

  // Periods
  getPeriodEntries(): PeriodEntry[] {
    return getItem<PeriodEntry[]>(STORAGE_KEYS.PERIOD_ENTRIES, []);
  },

  savePeriodEntries(entries: PeriodEntry[]): void {
    setItem(STORAGE_KEYS.PERIOD_ENTRIES, entries);
  },

  addPeriodEntry(entry: PeriodEntry): void {
    const current = this.getPeriodEntries();
    const filtered = current.filter(e => e.id !== entry.id);
    filtered.push(entry);
    this.savePeriodEntries(filtered);
  },

  deletePeriodEntry(id: string): void {
    const current = this.getPeriodEntries();
    this.savePeriodEntries(current.filter(e => e.id !== id));
  },

  // Daily Wellness
  getAllDailyWellness(): DailyWellness[] {
    return getItem<DailyWellness[]>(STORAGE_KEYS.DAILY_WELLNESS, []);
  },

  getDailyWellness(dateStr: string): DailyWellness {
    const all = this.getAllDailyWellness();
    const found = all.find(w => w.date === dateStr);
    if (found) return found;

    // Default template for date
    return {
      date: dateStr,
      sleepHours: 7.3,
      sleepQuality: 4,
      bedTime: '23:00',
      wakeTime: '06:45',
      steps: 6420,
      stepsGoal: 8000,
      waterLiters: 1.8,
      waterGoalLiters: 2.5,
      exerciseMinutes: 32,
      exerciseType: 'Walking & Yoga',
      exerciseIntensity: 'gentle',
      meditationMinutes: 15,
      mood: 'calm',
      moodEnergy: 8,
      moodNote: 'Balanced and focused'
    };
  },

  saveDailyWellness(wellness: DailyWellness): void {
    const all = this.getAllDailyWellness();
    const index = all.findIndex(w => w.date === wellness.date);
    if (index >= 0) {
      all[index] = wellness;
    } else {
      all.push(wellness);
    }
    setItem(STORAGE_KEYS.DAILY_WELLNESS, all);
  },

  // Symptoms
  getSymptoms(): SymptomRecord[] {
    return getItem<SymptomRecord[]>(STORAGE_KEYS.SYMPTOMS, []);
  },

  saveSymptoms(symptoms: SymptomRecord[]): void {
    setItem(STORAGE_KEYS.SYMPTOMS, symptoms);
  },

  addSymptom(symptom: SymptomRecord): void {
    const all = this.getSymptoms();
    all.unshift(symptom);
    this.saveSymptoms(all);
  },

  deleteSymptom(id: string): void {
    const all = this.getSymptoms();
    this.saveSymptoms(all.filter(s => s.id !== id));
  },

  // Pattern Check
  getPatternCheck(): PatternCheckData {
    return getItem<PatternCheckData>(STORAGE_KEYS.PATTERN_CHECK, {
      irregularPeriods: false,
      unusuallyLongCycles: false,
      acne: false,
      increasedFacialBodyHair: false,
      unusualHairThinning: false,
      unexpectedWeightChanges: false,
      fatigue: false,
      moodChanges: false,
      lastCheckedDate: new Date().toISOString().split('T')[0]
    });
  },

  savePatternCheck(data: PatternCheckData): void {
    setItem(STORAGE_KEYS.PATTERN_CHECK, data);
  },

  // Diet Prefs
  getDietPrefs(): DietPreferences {
    return getItem<DietPreferences>(STORAGE_KEYS.DIET_PREFS, {
      goal: 'energy',
      lifestyle: 'moderate',
      dietPreference: 'vegetarian',
      allergies: []
    });
  },

  saveDietPrefs(prefs: DietPreferences): void {
    setItem(STORAGE_KEYS.DIET_PREFS, prefs);
  },

  // Tasks
  getTasks(): TaskItem[] {
    return getItem<TaskItem[]>(STORAGE_KEYS.TASKS, []);
  },

  saveTasks(tasks: TaskItem[]): void {
    setItem(STORAGE_KEYS.TASKS, tasks);
  },

  addTask(task: TaskItem): void {
    const all = this.getTasks();
    all.unshift(task);
    this.saveTasks(all);
  },

  updateTask(task: TaskItem): void {
    const all = this.getTasks();
    const idx = all.findIndex(t => t.id === task.id);
    if (idx >= 0) {
      all[idx] = task;
      this.saveTasks(all);
    }
  },

  deleteTask(id: string): void {
    const all = this.getTasks();
    this.saveTasks(all.filter(t => t.id !== id));
  },

  toggleTask(id: string): void {
    const all = this.getTasks();
    const target = all.find(t => t.id === id);
    if (target) {
      target.completed = !target.completed;
      this.saveTasks(all);
    }
  },

  // Notes
  getNotes(): PersonalNote[] {
    return getItem<PersonalNote[]>(STORAGE_KEYS.NOTES, []);
  },

  saveNotes(notes: PersonalNote[]): void {
    setItem(STORAGE_KEYS.NOTES, notes);
  },

  addNote(note: PersonalNote): void {
    const all = this.getNotes();
    all.unshift(note);
    this.saveNotes(all);
  },

  deleteNote(id: string): void {
    const all = this.getNotes();
    this.saveNotes(all.filter(n => n.id !== id));
  },

  // Method aliases and helpers for seamless usage
  getTodayWellness(): DailyWellness {
    return this.getDailyWellness(new Date().toISOString().split('T')[0]);
  },

  getDailyWellnessLogs(): DailyWellness[] {
    return this.getAllDailyWellness();
  },

  savePeriodEntry(entry: PeriodEntry): void {
    this.addPeriodEntry(entry);
  },

  saveSymptom(symptom: SymptomRecord): void {
    this.addSymptom(symptom);
  },

  getPatternData(): PatternCheckData {
    return this.getPatternCheck();
  },

  savePatternData(data: PatternCheckData): void {
    this.savePatternCheck(data);
  },

  getDietPreferences(): DietPreferences {
    return this.getDietPrefs();
  },

  saveDietPreferences(prefs: DietPreferences): void {
    this.saveDietPrefs(prefs);
  },

  saveTask(task: TaskItem): void {
    this.addTask(task);
  },

  saveNote(note: PersonalNote): void {
    this.addNote(note);
  },

  exportAllData(): string {
    return this.exportDataJSON();
  },

  importData(jsonStr: string): boolean {
    return this.importDataJSON(jsonStr);
  },

  // JSON Export / Import
  exportDataJSON(): string {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      periodEntries: this.getPeriodEntries(),
      dailyWellness: this.getAllDailyWellness(),
      symptoms: this.getSymptoms(),
      patternCheck: this.getPatternCheck(),
      dietPrefs: this.getDietPrefs(),
      tasks: this.getTasks(),
      notes: this.getNotes()
    };
    return JSON.stringify(data, null, 2);
  },

  importDataJSON(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.periodEntries) setItem(STORAGE_KEYS.PERIOD_ENTRIES, parsed.periodEntries);
      if (parsed.dailyWellness) setItem(STORAGE_KEYS.DAILY_WELLNESS, parsed.dailyWellness);
      if (parsed.symptoms) setItem(STORAGE_KEYS.SYMPTOMS, parsed.symptoms);
      if (parsed.patternCheck) setItem(STORAGE_KEYS.PATTERN_CHECK, parsed.patternCheck);
      if (parsed.dietPrefs) setItem(STORAGE_KEYS.DIET_PREFS, parsed.dietPrefs);
      if (parsed.tasks) setItem(STORAGE_KEYS.TASKS, parsed.tasks);
      if (parsed.notes) setItem(STORAGE_KEYS.NOTES, parsed.notes);
      return true;
    } catch (e) {
      console.error('Failed to import json', e);
      return false;
    }
  }
};
