import React from 'react';
import { NavTab } from './Navbar';
import { ThreeFlower } from './ThreeFlower';
import { 
  Sparkles, 
  Calendar, 
  Activity, 
  ShieldCheck, 
  TrendingUp, 
  Heart, 
  ArrowRight,
  Sparkle,
  CheckCircle2
} from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (tab: NavTab) => void;
  onOpenQuickLog: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, onOpenQuickLog }) => {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-between overflow-hidden">
      
      {/* Background soft gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[28rem] h-[28rem] bg-purple-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-pink-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:py-16 flex-1 flex flex-col justify-center">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left z-10">
            
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-rose-200/70 shadow-xs backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span className="text-xs font-semibold text-rose-900 tracking-wide">
                HERSELF · Women Wellness & Intelligence
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1F1728] leading-[1.12] tracking-tight">
                Understand your body <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600">
                  through your data.
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl font-serif italic text-rose-800/80">
                "Your body. Your patterns. Your wellness."
              </p>
            </div>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-zinc-600 max-w-xl font-normal leading-relaxed">
              Track your menstrual cycle, decode daily wellness rhythms, build supportive routines, and unlock gentle, personalized health insights tailored to your unique biology.
            </p>

            {/* Direct Entry Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-start-tracking-btn"
                onClick={() => onNavigate('cycle')}
                className="group flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-semibold text-sm sm:text-base shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Start Tracking</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-explore-dashboard-btn"
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/90 hover:bg-white text-zinc-800 font-semibold text-sm sm:text-base border border-rose-200/80 shadow-sm hover:shadow-md hover:border-rose-300 transition-all cursor-pointer"
              >
                <Activity className="w-4 h-4 text-rose-500" />
                <span>Explore Dashboard</span>
              </button>
            </div>

            {/* Key trust badges */}
            <div className="pt-4 border-t border-rose-100/80 flex flex-wrap items-center gap-6 text-xs text-zinc-500 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Private & On-Device Local Storage</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-500" />
                <span>Transparent, Explainable Metrics</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-500" />
                <span>Empowering & Non-Diagnostic</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive 3D Visual & Floating Summary Cards */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[360px] sm:min-h-[440px]">
            
            {/* 3D Canvas Container */}
            <div className="w-full h-80 sm:h-96 relative flex items-center justify-center">
              <ThreeFlower className="w-full h-full" />
            </div>

            {/* Floating Glassmorphic preview card 1 */}
            <div className="absolute -top-2 right-2 sm:right-6 glass-card rounded-2xl p-3.5 max-w-[210px] animate-bounce-subtle pointer-events-auto border border-white/60 shadow-lg">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-zinc-800">Follicular Phase</div>
                  <div className="text-[10px] text-zinc-500">Day 9 of Cycle</div>
                </div>
              </div>
              <div className="w-full bg-rose-100 rounded-full h-1.5">
                <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: '32%' }} />
              </div>
            </div>

            {/* Floating Glassmorphic preview card 2 */}
            <div className="absolute -bottom-2 left-2 sm:left-4 glass-card rounded-2xl p-3.5 max-w-[220px] pointer-events-auto border border-white/60 shadow-lg">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-zinc-800">Wellness Index</div>
                  <div className="text-[13px] font-bold text-purple-700">84 / 100</div>
                </div>
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">
                Optimal sleep & steady movement on track.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Feature Pillar Bento Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div 
            id="feature-card-cycle"
            onClick={() => onNavigate('cycle')}
            className="glass-card glass-card-hover rounded-2xl p-4.5 cursor-pointer border border-rose-100/70"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200/60 text-rose-600 flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-zinc-800 mb-1">Adaptive Cycle Tracking</h2>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Personalized interval prediction based on your actual history, not a rigid 28-day assumption.
            </p>
          </div>

          <div 
            id="feature-card-wellness"
            onClick={() => onNavigate('wellness')}
            className="glass-card glass-card-hover rounded-2xl p-4.5 cursor-pointer border border-rose-100/70"
          >
            <div className="w-9 h-9 rounded-xl bg-pink-50 border border-pink-200/60 text-pink-600 flex items-center justify-center mb-3">
              <Activity className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-zinc-800 mb-1">Daily Habit Harmony</h2>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Interactive trackers for sleep, walking steps, hydration, mindful breathing, and daily mood.
            </p>
          </div>

          <div 
            id="feature-card-pattern"
            onClick={() => onNavigate('pattern')}
            className="glass-card glass-card-hover rounded-2xl p-4.5 cursor-pointer border border-purple-100/70"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200/60 text-purple-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-zinc-800 mb-1">Pattern Checks</h2>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Gentle informational pattern indicators to observe potential irregularity with responsible medical guidance.
            </p>
          </div>

          <div 
            id="feature-card-insights"
            onClick={() => onNavigate('insights')}
            className="glass-card glass-card-hover rounded-2xl p-4.5 cursor-pointer border border-rose-100/70"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-zinc-800 mb-1">Data Science Insights</h2>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Transparent correlations between sleep, exercise, cycle phases, and overall energy score.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
