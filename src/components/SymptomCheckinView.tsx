import React, { useState } from 'react';
import { SymptomRecord, SymptomType } from '../types';
import { 
  Heart, 
  Plus, 
  Trash2, 
  AlertCircle, 
  TrendingUp, 
  Calendar, 
  Activity, 
  CheckCircle2, 
  ShieldAlert,
  BarChart2,
  PieChart as PieChartIcon
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

interface SymptomCheckinViewProps {
  symptoms: SymptomRecord[];
  onAddSymptom: (symptom: SymptomRecord) => void;
  onDeleteSymptom: (id: string) => void;
}

export const SymptomCheckinView: React.FC<SymptomCheckinViewProps> = ({
  symptoms,
  onAddSymptom,
  onDeleteSymptom
}) => {
  const [selectedSymptom, setSelectedSymptom] = useState<SymptomType>('cramps');
  const [selectedSeverity, setSelectedSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [customSymptom, setCustomSymptom] = useState<string>('');
  const [showSevereAlert, setShowSevereAlert] = useState<boolean>(false);

  const symptomOptions: { id: SymptomType; label: string; icon: string }[] = [
    { id: 'cramps', label: 'Cramps', icon: '🌸' },
    { id: 'fatigue', label: 'Fatigue / Low Energy', icon: '💤' },
    { id: 'headache', label: 'Headache', icon: '🤕' },
    { id: 'bloating', label: 'Bloating', icon: '🫧' },
    { id: 'abdominal_discomfort', label: 'Abdominal Discomfort', icon: '🪷' },
    { id: 'back_pain', label: 'Lower Back Pain', icon: '🌿' },
    { id: 'acne', label: 'Acne / Breakout', icon: '✨' },
    { id: 'mood_changes', label: 'Mood Shifts', icon: '🌊' },
    { id: 'tender_breasts', label: 'Breast Tenderness', icon: '🤍' },
    { id: 'digestive_changes', label: 'Digestive Changes', icon: '🍃' },
    { id: 'other', label: 'Other Sensation', icon: '📝' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const labelObj = symptomOptions.find(s => s.id === selectedSymptom);
    const finalLabel = selectedSymptom === 'other' && customSymptom.trim()
      ? customSymptom.trim()
      : labelObj?.label || 'Symptom';

    const newRecord: SymptomRecord = {
      id: `sym-${Date.now()}`,
      date,
      symptom: selectedSymptom,
      symptomLabel: finalLabel,
      severity: selectedSeverity,
      notes: notes.trim() ? notes.trim() : undefined
    };

    onAddSymptom(newRecord);

    if (selectedSeverity === 'severe') {
      setShowSevereAlert(true);
    } else {
      setShowSevereAlert(false);
    }

    setNotes('');
    setCustomSymptom('');
  };

  // Symptom frequency distribution data
  const frequencyMap: { [label: string]: number } = {};
  symptoms.forEach(s => {
    frequencyMap[s.symptomLabel] = (frequencyMap[s.symptomLabel] || 0) + 1;
  });

  const chartData = Object.entries(frequencyMap).map(([name, count]) => ({
    name,
    count
  })).sort((a, b) => b.count - a.count).slice(0, 6);

  const colors = ['#F43F5E', '#FB7185', '#FDA4AF', '#C084FC', '#A855F7', '#E879F9'];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-rose-200/30 via-pink-100/30 to-purple-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900">
              How are you feeling today?
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-2xl leading-relaxed">
              Log bodily sensations, pain levels, and physical patterns. Tracking your symptom timeline helps you understand what your body needs at every cycle phase.
            </p>
          </div>
        </div>
      </div>

      {/* Severe Symptom Responsible Health Banner */}
      {(showSevereAlert || symptoms.some(s => s.severity === 'severe')) && (
        <div className="p-4.5 rounded-2xl bg-rose-50/90 border border-rose-200 shadow-xs flex items-start gap-3.5 animate-in fade-in">
          <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xs sm:text-sm font-bold text-rose-900">
              Important Healthcare Note on Severe Symptoms
            </h2>
            <p className="text-xs text-rose-800/90 leading-relaxed">
              Please consider seeking appropriate medical care, especially if symptoms are severe, persistent, worsening, or unusual for you. HERSELF is a wellness tracking application and does not replace clinical medical evaluation.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Logging Form + Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Symptom Logger Form */}
        <div className="lg:col-span-6 glass-card rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-rose-100">
            <h2 className="text-lg font-bold text-zinc-900">Log a Symptom or Sensation</h2>
            <span className="text-xs text-zinc-500">Fast check-in</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            
            {/* Date Picker */}
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 bg-rose-50/30 text-zinc-800 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>

            {/* Symptom Selection Grid */}
            <div>
              <label className="block font-bold text-zinc-700 mb-2">Select Sensation / Symptom</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {symptomOptions.map((sym) => (
                  <button
                    type="button"
                    key={sym.id}
                    onClick={() => setSelectedSymptom(sym.id)}
                    className={`p-2.5 rounded-xl text-left border flex items-center gap-2 transition-all cursor-pointer ${
                      selectedSymptom === sym.id
                        ? 'bg-rose-500 text-white border-rose-500 shadow-xs font-bold'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:bg-rose-50/50'
                    }`}
                  >
                    <span>{sym.icon}</span>
                    <span className="truncate">{sym.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {selectedSymptom === 'other' && (
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Custom Sensation Name</label>
                <input
                  type="text"
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                  placeholder="e.g. Dizziness, Restless legs..."
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>
            )}

            {/* Severity Selector */}
            <div>
              <label className="block font-bold text-zinc-700 mb-2">Severity Level</label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'mild', label: 'Mild', desc: 'Noticeable but manageable' },
                  { id: 'moderate', label: 'Moderate', desc: 'Impacts daily focus' },
                  { id: 'severe', label: 'Severe', desc: 'Disruptive / Intense' },
                ].map((sev) => (
                  <button
                    type="button"
                    key={sev.id}
                    onClick={() => setSelectedSeverity(sev.id as any)}
                    className={`p-3 rounded-2xl text-center border transition-all cursor-pointer ${
                      selectedSeverity === sev.id
                        ? sev.id === 'severe'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : sev.id === 'moderate'
                          ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                          : 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="font-bold text-xs capitalize">{sev.label}</div>
                    <div className={`text-[10px] mt-0.5 ${selectedSeverity === sev.id ? 'text-white/80' : 'text-zinc-400'}`}>
                      {sev.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Notes / Context (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Started after lunch, applied lavender balm..."
                rows={2}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <button
              id="submit-symptom-btn"
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition-all cursor-pointer"
            >
              Log Sensation Record
            </button>
          </form>
        </div>

        {/* Right Column: Historical Symptoms List & Frequency Chart */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Frequency Distribution Chart */}
          <div className="glass-card rounded-3xl p-6 border border-rose-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-rose-500" />
                <span>Most Frequent Sensations</span>
              </h2>
              <span className="text-xs text-zinc-400">{symptoms.length} entries</span>
            </div>

            <div className="h-44 w-full pt-2">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                    <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #FFE4E6',
                        fontSize: '11px'
                      }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-zinc-400">
                  No symptom logs recorded yet.
                </div>
              )}
            </div>
          </div>

          {/* Chronological Symptom Timeline */}
          <div className="glass-card rounded-3xl p-6 border border-rose-100 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-zinc-900">Recent Symptom Timeline</h2>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {symptoms.map((s) => (
                <div 
                  key={s.id}
                  className="p-3 rounded-2xl bg-white border border-rose-100/70 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-800">{s.symptomLabel}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full uppercase ${
                        s.severity === 'severe'
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : s.severity === 'moderate'
                          ? 'bg-amber-100 text-amber-700 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}>
                        {s.severity}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      {new Date(s.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    {s.notes && (
                      <p className="text-[11px] text-zinc-600 italic">{s.notes}</p>
                    )}
                  </div>

                  <button
                    onClick={() => onDeleteSymptom(s.id)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete log"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
