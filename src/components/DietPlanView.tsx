import React, { useState } from 'react';
import { DietPreferences, DailyDietPlan, CyclePhase } from '../types';
import { generateDietPlan } from '../services/dietGenerator';
import { 
  Utensils, 
  Coffee, 
  Sun, 
  Sunset, 
  Moon, 
  Droplet, 
  Sparkles, 
  Info, 
  Sliders, 
  Check, 
  Apple, 
  Flame, 
  ShieldCheck, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';

interface DietPlanViewProps {
  dietPrefs: DietPreferences;
  currentPhase: CyclePhase;
  onSaveDietPrefs: (prefs: DietPreferences) => void;
}

export const DietPlanView: React.FC<DietPlanViewProps> = ({
  dietPrefs,
  currentPhase,
  onSaveDietPrefs
}) => {
  const [prefs, setPrefs] = useState<DietPreferences>({ ...dietPrefs });
  const [isEditingPrefs, setIsEditingPrefs] = useState(false);

  const plan: DailyDietPlan = generateDietPlan(prefs, currentPhase);

  const handleToggleAllergy = (allergy: string) => {
    const list = prefs.allergies.includes(allergy)
      ? prefs.allergies.filter(a => a !== allergy)
      : [...prefs.allergies, allergy];
    setPrefs({ ...prefs, allergies: list });
  };

  const handleApplyPreferences = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveDietPrefs(prefs);
    setIsEditingPrefs(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-rose-200/30 via-pink-100/30 to-amber-100/20 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/80 text-rose-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>Personalized Holistic Nutrition</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900">
              My Daily Wellness & Diet Plan
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-2xl leading-relaxed">
              Evidence-informed nutritional structure aligned with your daily energy goals, activity level, dietary lifestyle, and menstrual cycle phase.
            </p>
          </div>

          <button
            id="customize-diet-prefs-btn"
            onClick={() => setIsEditingPrefs(!isEditingPrefs)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-rose-200/80 shadow-xs hover:shadow-md text-zinc-800 font-bold text-xs transition-all self-start md:self-auto cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-rose-500" />
            <span>{isEditingPrefs ? 'Close Preferences' : 'Customize Preferences'}</span>
          </button>
        </div>

        {/* Phase Sync Tagline */}
        <div className="mt-5 pt-4 border-t border-rose-100/70 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-rose-900 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span>Cycle-Synced Focus:</span>
            <span className="text-zinc-600 font-normal">{plan.cyclePhaseNote}</span>
          </div>
          <div className="text-[11px] text-zinc-400 font-medium">
            Goal: <span className="text-zinc-700 font-bold capitalize">{prefs.goal.replace('_', ' ')}</span> · <span className="capitalize">{prefs.dietPreference.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      {/* Preferences Form Drawer (if open) */}
      {isEditingPrefs && (
        <form onSubmit={handleApplyPreferences} className="glass-card rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-lg space-y-6 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between pb-3 border-b border-rose-100">
            <h2 className="text-lg font-bold text-zinc-900">Personalize Your Wellness & Meal Parameters</h2>
            <span className="text-xs text-zinc-500">Adapts plan instantly</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            
            {/* 1. Goal */}
            <div className="space-y-2">
              <label className="block font-bold text-zinc-800">Primary Wellness Goal</label>
              <div className="space-y-1.5">
                {[
                  { id: 'maintain', label: 'Maintain Current Weight' },
                  { id: 'weight_management', label: 'Healthy Weight Management' },
                  { id: 'energy', label: 'Improve Daily Energy' },
                  { id: 'routine', label: 'Improve Daily Routine' },
                  { id: 'wellness', label: 'General Wellness & Vitality' },
                ].map((g) => (
                  <button
                    type="button"
                    key={g.id}
                    onClick={() => setPrefs({ ...prefs, goal: g.id as any })}
                    className={`w-full p-2.5 rounded-xl text-left font-semibold border transition-all ${
                      prefs.goal === g.id
                        ? 'bg-rose-500 text-white border-rose-500 shadow-2xs'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:bg-rose-50/50'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Lifestyle & Activity */}
            <div className="space-y-2">
              <label className="block font-bold text-zinc-800">Daily Activity Lifestyle</label>
              <div className="space-y-1.5">
                {[
                  { id: 'low', label: 'Low Activity (Desk-focused, light walking)' },
                  { id: 'moderate', label: 'Moderate Activity (Regular exercise, active days)' },
                  { id: 'high', label: 'High Activity (Daily workouts, intense sports)' },
                ].map((l) => (
                  <button
                    type="button"
                    key={l.id}
                    onClick={() => setPrefs({ ...prefs, lifestyle: l.id as any })}
                    className={`w-full p-2.5 rounded-xl text-left font-semibold border transition-all ${
                      prefs.lifestyle === l.id
                        ? 'bg-rose-500 text-white border-rose-500 shadow-2xs'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:bg-rose-50/50'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Diet Preference & Allergies */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block font-bold text-zinc-800">Dietary Preference</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'vegetarian', label: 'Vegetarian' },
                    { id: 'non_vegetarian', label: 'Non-Vegetarian' },
                    { id: 'eggitarian', label: 'Eggitarian' },
                    { id: 'vegan', label: 'Vegan' },
                  ].map((d) => (
                    <button
                      type="button"
                      key={d.id}
                      onClick={() => setPrefs({ ...prefs, dietPreference: d.id as any })}
                      className={`p-2.5 rounded-xl text-center font-semibold border transition-all ${
                        prefs.dietPreference === d.id
                          ? 'bg-rose-500 text-white border-rose-500 shadow-2xs'
                          : 'bg-white text-zinc-700 border-zinc-200 hover:bg-rose-50/50'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-zinc-800">Allergies / Restrictions (Optional)</label>
                <div className="flex flex-wrap gap-1.5">
                  {['dairy', 'gluten', 'nuts', 'soy'].map((al) => {
                    const active = prefs.allergies.includes(al);
                    return (
                      <button
                        type="button"
                        key={al}
                        onClick={() => handleToggleAllergy(al)}
                        className={`px-3 py-1.5 rounded-full capitalize font-semibold border transition-all ${
                          active
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white text-zinc-600 border-zinc-200 hover:bg-purple-50'
                        }`}
                      >
                        {active ? `✓ No ${al}` : `Avoid ${al}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditingPrefs(false)}
              className="px-4 py-2 rounded-xl text-zinc-600 hover:bg-zinc-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-200 transition-all cursor-pointer"
            >
              Save & Generate Plan
            </button>
          </div>
        </form>
      )}

      {/* Daily Meal Schedule Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
          <span>Daily Nourishment Schedule</span>
          <span className="text-xs font-normal text-zinc-500">Structured for blood sugar stability and sustained vitality</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* 1. Breakfast */}
          <div className="glass-card rounded-3xl p-6 border border-rose-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Morning · 08:00 - 09:30</span>
                  <h2 className="text-sm font-bold text-zinc-900">{plan.breakfast.title}</h2>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-zinc-500">{plan.breakfast.caloriesApprox}</span>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-zinc-500 uppercase">Suggested Food Options:</span>
              <ul className="space-y-1">
                {plan.breakfast.foodOptions.map((opt, idx) => (
                  <li key={idx} className="text-xs text-zinc-800 flex items-start gap-2 bg-rose-50/40 p-2 rounded-xl">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span>{opt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-rose-50 space-y-1 text-xs">
              <p className="text-zinc-600"><span className="font-bold text-zinc-800">Portion Guidance:</span> {plan.breakfast.portionGuidance}</p>
              <p className="text-rose-800 text-[11px]"><span className="font-bold">Why it is useful:</span> {plan.breakfast.whyUseful}</p>
            </div>
          </div>

          {/* 2. Mid-Morning */}
          <div className="glass-card rounded-3xl p-6 border border-rose-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Coffee className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider">Mid-Morning · 11:00</span>
                  <h2 className="text-sm font-bold text-zinc-900">Hydration & Brain Fuel</h2>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-zinc-500 uppercase">Snack Options:</span>
              <ul className="space-y-1">
                {plan.midMorning.snack.map((opt, idx) => (
                  <li key={idx} className="text-xs text-zinc-800 flex items-start gap-2 bg-sky-50/40 p-2 rounded-xl">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                    <span>{opt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-sky-50 space-y-1 text-xs">
              <p className="text-zinc-600"><span className="font-bold text-zinc-800">Hydration Suggestion:</span> {plan.midMorning.hydrationSuggestion}</p>
              <p className="text-sky-800 text-[11px]"><span className="font-bold">Why it is useful:</span> {plan.midMorning.whyUseful}</p>
            </div>
          </div>

          {/* 3. Lunch */}
          <div className="glass-card rounded-3xl p-6 border border-rose-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Apple className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Lunch · 13:00 - 14:00</span>
                  <h2 className="text-sm font-bold text-zinc-900">Complete Macronutrient Balance</h2>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Clean Protein</span>
                <span className="text-zinc-800 text-[11px] mt-0.5 block">{plan.lunch.protein}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Vegetables & Fiber</span>
                <span className="text-zinc-800 text-[11px] mt-0.5 block">{plan.lunch.vegetables}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Complex Carbs</span>
                <span className="text-zinc-800 text-[11px] mt-0.5 block">{plan.lunch.wholeGrains}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-50 space-y-1 text-xs">
              <p className="text-zinc-600"><span className="font-bold text-zinc-800">Portion Guidance:</span> {plan.lunch.portionGuidance}</p>
              <p className="text-emerald-800 text-[11px]"><span className="font-bold">Why it is useful:</span> {plan.lunch.whyUseful}</p>
            </div>
          </div>

          {/* 4. Evening Snack */}
          <div className="glass-card rounded-3xl p-6 border border-rose-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center">
                  <Sunset className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-pink-800 uppercase tracking-wider">Evening · 17:00</span>
                  <h2 className="text-sm font-bold text-zinc-900">Gentle Metabolic Bridge</h2>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-zinc-500 uppercase">Snack & Infusion:</span>
              <ul className="space-y-1">
                {plan.evening.snack.map((opt, idx) => (
                  <li key={idx} className="text-xs text-zinc-800 flex items-start gap-2 bg-pink-50/40 p-2 rounded-xl">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5 shrink-0" />
                    <span>{opt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-pink-50 text-xs">
              <p className="text-pink-800 text-[11px]"><span className="font-bold">Why it is useful:</span> {plan.evening.whyUseful}</p>
            </div>
          </div>

          {/* 5. Dinner */}
          <div className="glass-card rounded-3xl p-6 border border-rose-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider">Dinner · 19:30 - 20:30</span>
                  <h2 className="text-sm font-bold text-zinc-900">{plan.dinner.title}</h2>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-zinc-500">{plan.dinner.caloriesApprox}</span>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-zinc-500 uppercase">Meal Options:</span>
              <ul className="space-y-1">
                {plan.dinner.foodOptions.map((opt, idx) => (
                  <li key={idx} className="text-xs text-zinc-800 flex items-start gap-2 bg-purple-50/40 p-2 rounded-xl">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                    <span>{opt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-purple-50 space-y-1 text-xs">
              <p className="text-zinc-600"><span className="font-bold text-zinc-800">Portion Guidance:</span> {plan.dinner.portionGuidance}</p>
              <p className="text-purple-800 text-[11px]"><span className="font-bold">Why it is useful:</span> {plan.dinner.whyUseful}</p>
            </div>
          </div>

          {/* 6. Hydration Strategy */}
          <div className="glass-card rounded-3xl p-6 border border-rose-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Droplet className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider">Hydration Architecture</span>
                  <h2 className="text-sm font-bold text-zinc-900">Target: {plan.hydration.targetLiters} Liters ({plan.hydration.glasses} glasses)</h2>
                </div>
              </div>
            </div>

            <p className="text-xs text-zinc-600 pt-1 leading-relaxed">
              {plan.hydration.guideline}
            </p>

            <div className="space-y-1 pt-1">
              <span className="text-[11px] font-bold text-zinc-500 uppercase">Timing Guidelines:</span>
              <ul className="space-y-1 text-xs text-zinc-700">
                {plan.hydration.timingTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-sky-500 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-sky-50 text-[10px] text-zinc-400 italic">
              *Hydration disclaimer: Individual fluid requirements vary by climate, sweat rate, body size, and health status.
            </div>
          </div>

        </div>
      </div>

      {/* Why This Plan? Section */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-md space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900">Why this plan?</h2>
            <p className="text-xs text-zinc-500">Transparent rationale behind your tailored nutritional recommendations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {plan.whyThisPlan.map((point, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-white border border-rose-100 text-xs text-zinc-700 shadow-2xs">
              <Check className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{point}</span>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 text-xs text-rose-900 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>
            <strong className="font-bold">General Wellness Statement:</strong> This diet plan provides general healthy nutritional and hydration suggestions. It is not intended as medical nutrition therapy or treatment for any medical condition. Please consult a registered dietitian or healthcare provider for specific clinical dietary needs.
          </span>
        </div>
      </div>

    </div>
  );
};
