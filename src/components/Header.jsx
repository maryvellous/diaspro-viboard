import React from 'react';
import { Search, RefreshCw, Zap } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import { useProjects } from '../context/ProjectsContext';

export default function Header({ onOpenSearch }) {
  const { level, xpInCurrentLevel, xpNeededForNext, levelProgress } = useGamification();
  const { refreshProjects, loading } = useProjects();

  return (
    <header className="h-20 px-10 flex items-center justify-between border-b border-white/10 bg-black/20 backdrop-blur-xl drag-region select-none">
      {/* Search Bar Action Pill */}
      <div className="flex items-center gap-4 no-drag">
        <button
          onClick={onOpenSearch}
          className="action-pill bg-white/10 hover:bg-white/20 border border-white/20 text-purple-100 text-xs shadow-lg transition-all"
        >
          <Search className="w-4 h-4 text-purple-300 shrink-0" />
          <span className="tracking-wide">Cerca repo o task...</span>
          <kbd className="px-2.5 py-0.5 rounded-xl bg-black/50 text-[10px] text-purple-200 font-mono border border-white/20 shadow-inner ml-2">
            Ctrl K
          </kbd>
        </button>

        <button
          onClick={refreshProjects}
          disabled={loading}
          title="Ricarica status Git"
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-purple-300 hover:text-white transition-all disabled:opacity-50 hover:scale-105 shadow-md"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Gamification XP Header Pill */}
      <div className="flex items-center gap-4 no-drag">
        <div className="flex items-center gap-3.5 px-5 py-2 rounded-full bg-black/50 border border-purple-400/30 shadow-lg">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span className="font-extrabold text-xs text-white">Lvl {level}</span>
          </div>

          {/* Progress Bar */}
          <div className="w-28 h-2.5 rounded-full bg-purple-950 overflow-hidden relative border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-400 transition-all duration-500 rounded-full"
              style={{ width: `${levelProgress}%` }}
            />
          </div>

          <span className="text-[11px] text-purple-200 font-mono font-bold">
            {xpInCurrentLevel}/{xpNeededForNext} XP
          </span>
        </div>
      </div>
    </header>
  );
}
