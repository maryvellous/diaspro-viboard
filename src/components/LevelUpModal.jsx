import React from 'react';
import { Trophy, Sparkles, Award, ArrowRight, X } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';

export default function LevelUpModal() {
  const { levelUpModalData, closeLevelUpModal } = useGamification();

  if (!levelUpModalData) return null;

  const { newLevel, rank } = levelUpModalData;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn select-none">
      <div className="bg-gradient-to-b from-[#7A3F67] via-[#2b1c47] to-[#1e1333] border-2 border-[#E8D19E] rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6 text-center relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={closeLevelUpModal}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Floating Badge */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#E8D19E] to-[#BC957D] mx-auto flex items-center justify-center shadow-2xl border-4 border-white/20 animate-bounce">
          <Trophy className="w-10 h-10 text-[#1e1333]" />
        </div>

        {/* Level Up Announcement */}
        <div>
          <span className="text-xs font-mono font-black uppercase tracking-widest text-[#E8D19E] bg-[#E8D19E]/20 px-4 py-1.5 rounded-full border border-[#E8D19E]/40">
            LEVEL UP!
          </span>
          <h2 className="font-heading font-black text-4xl text-white mt-3">
            LIVELLO {newLevel}
          </h2>
          <p className="text-sm font-semibold text-[#A5C4DC] mt-1">
            Complimenti! Hai raggiunto un nuovo traguardo di produttività.
          </p>
        </div>

        {/* Rank Card */}
        <div className="p-5 bg-[#1e1333]/90 rounded-2xl border border-white/15 space-y-2 text-left">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#6B5887] text-[#E8D19E]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#A5C4DC] uppercase tracking-wider block">Nuovo Titolo Riconosciuto</span>
              <h3 className="font-heading font-black text-lg text-[#E8D19E]">{rank.title}</h3>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/80">
            <span>Privilegio sbloccato:</span>
            <span className="font-bold text-[#98A78A]">{rank.perk}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={closeLevelUpModal}
          className="action-pill bg-[#E8D19E] hover:bg-white text-[#1e1333] font-black text-sm w-full justify-center py-3.5 shadow-2xl active:scale-95 transition-all"
        >
          <span>Continua la Produttività</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>

      </div>
    </div>
  );
}
