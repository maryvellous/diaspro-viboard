import React, { useState } from 'react';
import { Calendar, FolderGit2, CheckCircle2, Settings, Sparkles } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';

export default function Sidebar({ currentTab, setCurrentTab }) {
  const { userName, level, streak } = useGamification();
  const [snailSpeech, setSnailSpeech] = useState(false);

  const navItems = [
    { id: 'today', icon: CheckCircle2, label: 'Oggi' },
    { id: 'projects', icon: FolderGit2, label: 'Progetti' },
    { id: 'calendar', icon: Calendar, label: 'Calendario' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-24 md:w-28 h-full py-8 px-4 flex flex-col items-center justify-between bg-[#6B5887] select-none z-30 shadow-2xl">
      {/* Top Logo / App Icon */}
      <div className="flex flex-col items-center gap-8">
        <div className="w-14 h-14 rounded-3xl bg-white/20 flex items-center justify-center shadow-lg border border-white/30">
          <Sparkles className="w-7 h-7 text-white animate-pulse" />
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-col gap-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                title={item.label}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? 'bg-white text-[#6B5887] shadow-xl scale-110'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-6 h-6" />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Mascot - epicSnail */}
      <div className="relative group flex flex-col items-center mb-2">
        {/* Speech Bubble */}
        {snailSpeech && (
          <div className="absolute -top-14 left-16 whitespace-nowrap bg-black/90 text-white font-bold text-xs px-4 py-2 rounded-2xl border border-white/30 shadow-2xl backdrop-blur-xl animate-bounce z-50">
            Ciao {userName || 'Avventuriero'}! 🐌✨ (Lvl {level})
          </div>
        )}

        <button
          onMouseEnter={() => setSnailSpeech(true)}
          onMouseLeave={() => setSnailSpeech(false)}
          className="w-16 h-16 rounded-3xl p-1 bg-white/15 border border-white/30 flex items-center justify-center transition-all duration-300 hover:scale-115 active:scale-95 cursor-pointer shadow-xl"
        >
          <img
            src="/ntp_snail.png"
            alt="epicSnail"
            className="w-14 h-14 object-contain animate-snail filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
          />
        </button>

        {/* Streak Pill */}
        <div className="mt-2 flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-full border border-amber-300/40 text-[11px] font-black text-amber-300 shadow-md">
          🔥 {streak}d
        </div>
      </div>
    </aside>
  );
}
