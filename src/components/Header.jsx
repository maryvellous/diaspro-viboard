import React from 'react';
import { Search, RefreshCw, Zap, Trophy, Flame } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import { useProjects } from '../context/ProjectsContext';

export default function Header({ onOpenSearch }) {
  const { level, xpInCurrentLevel, xpNeededForNext, levelProgress, streak, currentRank } = useGamification();
  const { refreshProjects, loading } = useProjects();

  return (
    <header className="h-20 pl-10 pr-36 flex items-center justify-between border-b border-[#7A3F67]/30 bg-[#1e1333]/60 backdrop-blur-xl drag-region select-none">
      {/* Search Bar Action Pill */}
      <div className="flex items-center gap-4 no-drag">
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#2b1c47] border border-[#9D85C6]/30 text-white/70 hover:text-white hover:border-[#9D85C6] transition-all cursor-pointer shadow-md group"
        >
          <Search className="w-4 h-4 text-[#9D85C6] group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold">Cerca progetti o task...</span>
          <kbd className="text-[10px] font-mono font-bold bg-[#1e1333] px-2 py-0.5 rounded border border-white/20 text-[#A5C4DC]">Ctrl+K</kbd>
        </button>

        <button
          onClick={refreshProjects}
          disabled={loading}
          className="p-2.5 rounded-2xl bg-[#2b1c47] border border-[#9D85C6]/30 text-[#9D85C6] hover:text-white hover:bg-[#7A3F67] transition-all cursor-pointer shadow-md disabled:opacity-50"
          title="Aggiorna lista progetti"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* CUTE GAMIFICATION HEADER PILL */}
      <div className="flex items-center gap-3 no-drag">
        {/* Rank Title Badge */}
        {currentRank && (
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#6B5887]/40 border border-[#9D85C6]/40 text-xs font-bold text-[#E8D19E]">
            <Trophy className="w-3.5 h-3.5 text-[#E8D19E]" />
            <span>{currentRank.title}</span>
          </div>
        )}

        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#7A3F67]/40 border border-[#E8D19E]/30 text-xs font-black text-[#E8D19E] shadow-sm">
          <Flame className="w-3.5 h-3.5 text-[#E8D19E]" />
          <span>{streak}d</span>
        </div>

        {/* Soft Glassmorphism Level & Progress Card */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#2b1c47]/80 border border-[#9D85C6]/40 shadow-xl backdrop-blur-md">
          {/* Level Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#7A3F67] border border-[#E8D19E]/40 text-[#E8D19E] font-black text-xs shadow-inner" title={currentRank?.perk || ''}>
            <Zap className="w-3.5 h-3.5 fill-[#E8D19E] animate-pulse" />
            <span>Lvl {level}</span>
          </div>

          {/* Soft Pastel Progress Bar */}
          <div className="w-32 h-2.5 rounded-full bg-[#1e1333] overflow-hidden relative p-0.5 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-[#9D85C6] via-[#7A3F67] to-[#E8D19E] transition-all duration-500 rounded-full shadow-sm"
              style={{ width: `${levelProgress}%` }}
            />
          </div>

          <span className="text-[11px] text-[#A5C4DC] font-mono font-bold">
            {xpInCurrentLevel}/{xpNeededForNext} XP
          </span>
        </div>
      </div>
    </header>
  );
}
