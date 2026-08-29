export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';

export type NavTab = 
  | 'dashboard'
  | 'cycle'
  | 'pattern'
  | 'diet'
  | 'symptoms'
  | 'wellness'
  | 'insights'
  | 'tasks_notes'
  | 'report'
  | 'privacy';

export interface PeriodEntry {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  flow?: 'light' | 'medium' | 'heavy' | 'spotting';
  notes?: string;
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  isPeriodDay?: boolean;
  flow?: 'light' | 'medium' | 'heavy' | 'spotting';
  isPeriodStart?: boolean;
  isPeriodEnd?: boolean;
}

export interface DailyWellness {
  date: string; // YYYY-MM-DD
  sleepHours: number; // e.g. 7.33 (7h 20m)
  sleepQuality: 1 | 2 | 3 | 4 | 5; // 1-5 stars
  bedTime?: string; // e.g. "23:15"
  wakeTime?: string; // e.g. "06:35"
  steps: number; // e.g. 6420
  stepsGoal: number; // e.g. 8000
  waterLiters: number; // e.g. 1.8
  waterGoalLiters: number; // e.g. 2.5
  exerciseMinutes: number; // e.g. 32
  exerciseType: string; // e.g. "Yoga", "Brisk Walk", "Pilates", "Strength"
  exerciseIntensity: 'gentle' | 'moderate' | 'high';
  meditationMinutes: number; // e.g. 15
  mood: 'radiant' | 'calm' | 'productive' | 'sensitive' | 'anxious' | 'exhausted' | 'low';
  moodEnergy: number; // 1-10
  moodNote?: string;
}

export type SymptomType = 
  | 'headache'
  | 'abdominal_discomfort'
  | 'back_pain'
  | 'cramps'
  | 'fatigue'
  | 'bloating'
  | 'acne'
  | 'mood_changes'
  | 'tender_breasts'
  | 'digestive_changes'
  | 'nausea'
  | 'other';

export interface SymptomRecord {
  id: string;
  date: string; // YYYY-MM-DD
  symptom: SymptomType;
  symptomLabel: string;
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

export interface PatternCheckData {
  irregularPeriods: boolean;
  unusuallyLongCycles: boolean;
  acne: boolean;
  increasedFacialBodyHair: boolean;
  unusualHairThinning: boolean;
  unexpectedWeightChanges: boolean;
  fatigue: boolean;
  moodChanges: boolean;
  lastCheckedDate: string;
}

export type AttentionLevel = 'LOW' | 'MODERATE' | 'HIGH ATTENTION';

export interface DietPreferences {
  goal: 'maintain' | 'weight_management' | 'energy' | 'routine' | 'wellness';
  lifestyle: 'low' | 'moderate' | 'high';
  dietPreference: 'vegetarian' | 'non_vegetarian' | 'eggitarian' | 'vegan';
  allergies: string[]; // e.g. ['dairy', 'gluten', 'nuts']
  customNotes?: string;
}

export interface MealItem {
  title: string;
  foodOptions: string[];
  portionGuidance: string;
  whyUseful: string;
  caloriesApprox?: string;
}

export interface DailyDietPlan {
  breakfast: MealItem;
  midMorning: {
    snack: string[];
    hydrationSuggestion: string;
    whyUseful: string;
  };
  lunch: {
    protein: string;
    vegetables: string;
    wholeGrains: string;
    portionGuidance: string;
    whyUseful: string;
  };
  evening: {
    snack: string[];
    whyUseful: string;
  };
  dinner: MealItem;
  hydration: {
    targetLiters: number;
    glasses: number;
    guideline: string;
    timingTips: string[];
  };
  whyThisPlan: string[];
  cyclePhaseNote: string;
}

export interface TaskItem {
  id: string;
  title: string;
  category: 'water' | 'movement' | 'rest' | 'nutrition' | 'selfcare' | 'general';
  dueDate?: string; // YYYY-MM-DD
  completed: boolean;
  createdAt: string;
}

export interface PersonalNote {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
  tag: 'cycle' | 'energy' | 'food' | 'reflection' | 'gratitude' | 'symptom';
  mood?: string;
  createdAt: string;
}

export interface CycleStats {
  currentCycleLength: number; // days
  previousCycleLength: number; // days
  averageCycleLength: number; // days
  trackedCyclesCount: number;
  daysSinceLastPeriod: number;
  estimatedNextPeriodDate: string; // YYYY-MM-DD
  cycleVariabilityDays: number; // standard deviation
  longestCycleDays: number;
  shortestCycleDays: number;
  recentDelayDays: number;
  isIrregular: boolean;
  irregularityReason?: string;
  currentPhase: CyclePhase;
  currentPhaseDay: number;
  fertileWindowStart: string;
  fertileWindowEnd: string;
  ovulationDate: string;
}

export interface WellnessScoreBreakdown {
  totalScore: number; // 0-100
  sleepScore: number; // max 25
  activityScore: number; // max 25
  hydrationScore: number; // max 20
  mindfulnessScore: number; // max 15
  moodScore: number; // max 15
  insights: string[];
}

export interface MonthlyReportData {
  monthName: string;
  year: number;
  cycleSummary: {
    cyclesCount: number;
    averageLength: number;
    periodDaysCount: number;
    status: string;
  };
  wellnessScoreAvg: number;
  sleepAvgHours: number;
  stepsAvg: number;
  waterAvgLiters: number;
  totalExerciseMinutes: number;
  totalMeditationMinutes: number;
  topMood: string;
  symptomFrequency: { [symptom: string]: number };
  changesThisMonth: string[];
  wellnessHighlights: string[];
}
