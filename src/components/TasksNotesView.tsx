import React, { useState } from 'react';
import { TaskItem, PersonalNote } from '../types';
import { 
  CheckSquare, 
  FileText, 
  Plus, 
  Trash2, 
  Check, 
  Calendar, 
  Tag, 
  Search, 
  Sparkles, 
  Clock,
  Heart,
  Droplet,
  Footprints,
  Coffee,
  Moon
} from 'lucide-react';

interface TasksNotesViewProps {
  tasks: TaskItem[];
  notes: PersonalNote[];
  onAddTask: (task: TaskItem) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onAddNote: (note: PersonalNote) => void;
  onDeleteNote: (id: string) => void;
}

export const TasksNotesView: React.FC<TasksNotesViewProps> = ({
  tasks,
  notes,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onAddNote,
  onDeleteNote
}) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'notes'>('tasks');

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState<TaskItem['category']>('water');
  const [taskDueDate, setTaskDueDate] = useState('');

  // Note form state
  const [noteContent, setNoteContent] = useState('');
  const [noteTag, setNoteTag] = useState<PersonalNote['tag']>('reflection');
  const [noteMood, setNoteMood] = useState('Calm');
  const [noteSearch, setNoteSearch] = useState('');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: taskTitle.trim(),
      category: taskCategory,
      dueDate: taskDueDate || undefined,
      completed: false,
      createdAt: new Date().toISOString()
    };
    onAddTask(newTask);
    setTaskTitle('');
    setTaskDueDate('');
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    const newNote: PersonalNote = {
      id: `note-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      content: noteContent.trim(),
      tag: noteTag,
      mood: noteMood,
      createdAt: new Date().toISOString()
    };
    onAddNote(newNote);
    setNoteContent('');
  };

  // Quick preset wellness tasks
  const addQuickPresetTask = (title: string, category: TaskItem['category']) => {
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title,
      category,
      completed: false,
      createdAt: new Date().toISOString()
    };
    onAddTask(newTask);
  };

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const filteredNotes = notes.filter(n => 
    n.content.toLowerCase().includes(noteSearch.toLowerCase()) ||
    n.tag.toLowerCase().includes(noteSearch.toLowerCase()) ||
    (n.mood && n.mood.toLowerCase().includes(noteSearch.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-rose-200/30 via-pink-100/30 to-purple-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900">
              Wellness Reminders & Notes
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600">
              Supportive daily intentions, self-care checklists, and personal body reflections.
            </p>
          </div>

          <div className="bg-white p-1 rounded-2xl border border-rose-200/80 shadow-xs flex self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'tasks'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>To-Do List ({pendingTasks.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'notes'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>My Notes ({notes.length})</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'tasks' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Add Task & Quick Suggestions */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Add Task Form */}
            <div className="glass-card rounded-3xl p-6 border border-rose-100 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-rose-500" />
                <span>Add New Intention / Task</span>
              </h2>

              <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Task Title</label>
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="e.g. 20-minute gentle walk, Drink warm lemon water..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Category</label>
                    <select
                      value={taskCategory}
                      onChange={(e) => setTaskCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-zinc-800 bg-white"
                    >
                      <option value="water">Hydration</option>
                      <option value="movement">Movement</option>
                      <option value="nutrition">Nourishment</option>
                      <option value="selfcare">Self-Care</option>
                      <option value="rest">Rest & Sleep</option>
                      <option value="general">General</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Due Date (Optional)</label>
                    <input
                      type="date"
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-zinc-800"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-200 transition-all cursor-pointer"
                >
                  Add to My List
                </button>
              </form>
            </div>

            {/* Quick Suggested Wellness Habits */}
            <div className="glass-card rounded-3xl p-6 border border-rose-100 shadow-sm space-y-3">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Quick Habit Suggestions</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { title: 'Drink 500ml water', cat: 'water' as const, icon: <Droplet className="w-3 h-3 text-sky-500" /> },
                  { title: '20-minute gentle walk', cat: 'movement' as const, icon: <Footprints className="w-3 h-3 text-pink-500" /> },
                  { title: 'Prepare healthy lunch', cat: 'nutrition' as const, icon: <Coffee className="w-3 h-3 text-emerald-500" /> },
                  { title: '15-min calm meditation', cat: 'selfcare' as const, icon: <Sparkles className="w-3 h-3 text-purple-500" /> },
                  { title: 'Wind down screens early', cat: 'rest' as const, icon: <Moon className="w-3 h-3 text-indigo-500" /> },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => addQuickPresetTask(item.title, item.cat)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-rose-100 hover:border-rose-300 text-zinc-700 text-xs font-semibold hover:bg-rose-50 transition-all shadow-2xs cursor-pointer"
                  >
                    {item.icon}
                    <span>+ {item.title}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Pending & Completed Tasks */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pending Tasks */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-rose-100">
                <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                  <span>Pending Tasks</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                    {pendingTasks.length}
                  </span>
                </h2>
              </div>

              <div className="space-y-2.5">
                {pendingTasks.length > 0 ? (
                  pendingTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-3.5 rounded-2xl bg-white border border-zinc-200/80 hover:border-rose-200 flex items-center justify-between gap-3 text-xs shadow-2xs transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onToggleTask(t.id)}
                          className="w-5 h-5 rounded-lg border-2 border-zinc-300 hover:border-rose-500 transition-colors flex items-center justify-center cursor-pointer shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-zinc-800">{t.title}</div>
                          <div className="text-[10px] text-zinc-400 capitalize mt-0.5">
                            {t.category} {t.dueDate ? `· Due ${t.dueDate}` : ''}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteTask(t.id)}
                        className="p-1.5 text-zinc-300 hover:text-red-500 transition-colors cursor-pointer"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-zinc-400">
                    ✨ All pending wellness intentions are complete! You are in great harmony.
                  </div>
                )}
              </div>
            </div>

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div className="glass-card rounded-3xl p-6 border border-zinc-100 shadow-sm space-y-3 opacity-90">
                <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Completed Tasks ({completedTasks.length})
                </h2>

                <div className="space-y-2">
                  {completedTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onToggleTask(t.id)}
                          className="w-5 h-5 rounded-lg bg-emerald-500 text-white flex items-center justify-center cursor-pointer shrink-0"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <span className="line-through text-zinc-400 font-medium">{t.title}</span>
                      </div>

                      <button
                        onClick={() => onDeleteTask(t.id)}
                        className="p-1 text-zinc-300 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      ) : (
        /* Personal Notes Tab */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Write Note */}
          <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-md space-y-4">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-rose-500" />
              <span>Write a Reflection or Note</span>
            </h2>

            <form onSubmit={handleCreateNote} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Your Reflection</label>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="e.g. Started period today with mild cramps, feeling calmer after drinking warm chamomile tea..."
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Tag / Category</label>
                  <select
                    value={noteTag}
                    onChange={(e) => setNoteTag(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-zinc-800 bg-white"
                  >
                    <option value="reflection">Daily Reflection</option>
                    <option value="cycle">Cycle & Flow</option>
                    <option value="energy">Energy & Sleep</option>
                    <option value="food">Nourishment</option>
                    <option value="gratitude">Gratitude</option>
                    <option value="symptom">Symptom Note</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Mood Feeling</label>
                  <input
                    type="text"
                    value={noteMood}
                    onChange={(e) => setNoteMood(e.target.value)}
                    placeholder="e.g. Radiant, Calm..."
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-zinc-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-200 transition-all cursor-pointer"
              >
                Save Note to Diary
              </button>
            </form>
          </div>

          {/* Right Column: Notes Feed with Search */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Search filter */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={noteSearch}
                onChange={(e) => setNoteSearch(e.target.value)}
                placeholder="Search notes by keyword, tag, or mood..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-rose-100 bg-white/90 text-xs text-zinc-800 shadow-2xs focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>

            {/* Chronological Notes Feed */}
            <div className="space-y-3">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="glass-card rounded-3xl p-5 border border-rose-100 shadow-sm space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                        #{note.tag}
                      </span>
                      {note.mood && (
                        <span className="text-[11px] text-zinc-500 font-medium">
                          Mood: {note.mood}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-zinc-400">
                        {new Date(note.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className="p-1 text-zinc-300 hover:text-red-500 transition-colors cursor-pointer"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-800 leading-relaxed whitespace-pre-wrap">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
