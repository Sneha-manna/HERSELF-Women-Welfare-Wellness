import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Activity, 
  Heart, 
  ShieldAlert, 
  TrendingUp, 
  Utensils, 
  CheckSquare, 
  FileText, 
  LayoutDashboard, 
  Menu, 
  X, 
  PlusCircle, 
  RotateCcw,
  Sparkle
} from 'lucide-react';

export type NavTab = 
  | 'home'
  | 'dashboard'
  | 'cycle'
  | 'wellness'
  | 'symptoms'
  | 'pattern'
  | 'insights'
  | 'diet'
  | 'tasks_notes'
  | 'report';

export interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onQuickLogPeriod: () => void;
  onResetData?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onQuickLogPeriod,
  onResetData
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'cycle', label: 'Cycle Calendar', icon: <Calendar className="w-4 h-4" /> },
    { id: 'wellness', label: 'Daily Wellness', icon: <Activity className="w-4 h-4" /> },
    { id: 'symptoms', label: 'Symptoms', icon: <Heart className="w-4 h-4" /> },
    { id: 'pattern', label: 'Pattern Check', icon: <ShieldAlert className="w-4 h-4" />, badge: 'Info' },
    { id: 'insights', label: 'Insights', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'diet', label: 'Diet Plan', icon: <Utensils className="w-4 h-4" /> },
    { id: 'tasks_notes', label: 'Tasks & Notes', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'report', label: 'Report', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-nav backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <div 
            id="brand-logo-btn"
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-400 via-pink-400 to-purple-300 p-0.5 shadow-md group-hover:shadow-rose-300/50 transition-all duration-300">
              <div className="w-full h-full bg-white/90 rounded-[14px] flex items-center justify-center backdrop-blur-sm">
                <Sparkle className="w-5 h-5 text-rose-500 fill-rose-100 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xl tracking-wider font-semibold text-rose-950">
                  HERSELF
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-rose-100/80 text-rose-700 border border-rose-200/60">
                  Intelligence
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 font-medium hidden sm:block">
                Your body. Your patterns. Your wellness.
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                    active
                      ? 'bg-rose-50 text-rose-800 shadow-xs border border-rose-200/70 font-bold'
                      : 'text-zinc-600 hover:text-rose-900 hover:bg-rose-50/50'
                  }`}
                >
                  <span className={active ? 'text-rose-600' : 'text-zinc-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-0.5 text-[9px] px-1 py-0.2 rounded-md bg-purple-100 text-purple-700 font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              id="quick-log-btn"
              onClick={onQuickLogPeriod}
              className="flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white text-xs sm:text-sm font-semibold shadow-md shadow-rose-200 hover:shadow-lg hover:shadow-rose-300/70 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Log Today</span>
              <span className="sm:hidden">Log</span>
            </button>

            {onResetData && (
              <button
                id="reset-demo-data-btn"
                onClick={onResetData}
                title="Reload Demo Data"
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-rose-50/70 border border-transparent hover:border-rose-100 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {/* Mobile menu toggle button */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-zinc-700 hover:bg-rose-50 border border-rose-100 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-rose-100 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-rose-100/80 text-rose-900 font-bold border border-rose-200'
                      : 'text-zinc-600 hover:bg-rose-50'
                  }`}
                >
                  <span className={active ? 'text-rose-600' : 'text-zinc-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
