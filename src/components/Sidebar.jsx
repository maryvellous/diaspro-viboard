import React from 'react';
import { useSections } from '../context/SectionsContext';
import { 
  AestheticSunIcon, 
  AestheticBriefcaseIcon, 
  AestheticCalendarIcon, 
  AestheticEqualiserIcon, 
  AestheticHeartIcon, 
  AestheticCommentsIcon, 
  AestheticCogIcon,
  AestheticLightBulbIcon,
} from './AestheticIcons';

// Lava lamp bubble configuration
const BUBBLES = [
  { size: 90,  left: '12%', delay: 0,    duration: 12 },
  { size: 60,  left: '55%', delay: 3.5,  duration: 15 },
  { size: 110, left: '30%', delay: 7,    duration: 18 },
  { size: 50,  left: '70%', delay: 1.5,  duration: 11 },
  { size: 75,  left: '45%', delay: 9,    duration: 14 },
  { size: 45,  left: '20%', delay: 5,    duration: 16 },
];

const BUBBLE_COLORS = [
  'rgba(122, 63, 103, 0.55)',  // Plum
  'rgba(157, 133, 198, 0.45)', // Lavender
  'rgba(107, 88, 135, 0.50)',  // Sidebar Purple
  'rgba(165, 196, 220, 0.35)', // Blue Accent
  'rgba(152, 167, 138, 0.40)', // Sage
  'rgba(143, 90, 90, 0.40)',   // Terracotta
];

export default function Sidebar({ currentTab, setCurrentTab }) {
  const { enabledSections } = useSections();

  const navItems = [
    { id: 'today',    icon: AestheticSunIcon,       label: 'Oggi' },
    { id: 'projects', icon: AestheticBriefcaseIcon, label: 'Progetti' },
    { id: 'calendar', icon: AestheticCalendarIcon,  label: 'Calendario' },
    ...(enabledSections.spotify   ? [{ id: 'spotify',    icon: AestheticEqualiserIcon,  label: 'Spotify' }]    : []),
    ...(enabledSections.pinterest ? [{ id: 'pinterest',  icon: AestheticHeartIcon,      label: 'Moodboard' }]  : []),
    { id: 'codequest', icon: AestheticLightBulbIcon, label: 'CodeQuest' },
    { id: 'chat',      icon: AestheticCommentsIcon,  label: 'SnailBot' },
    { id: 'settings',  icon: AestheticCogIcon,       label: 'Impostazioni' },
  ];

  return (
    <aside className="w-24 md:w-28 h-full py-8 px-4 flex flex-col items-center justify-between bg-[#6B5887] select-none z-30 shadow-2xl relative overflow-hidden">
      
      {/* ── Lava Lamp Layer ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {BUBBLES.map((b, i) => (
          <div
            key={i}
            className="lava-bubble"
            style={{
              width:  b.size,
              height: b.size,
              left:   b.left,
              bottom: `-${b.size}px`,
              background: BUBBLE_COLORS[i % BUBBLE_COLORS.length],
              animationDuration:  `${b.duration}s`,
              animationDelay:     `${b.delay}s`,
            }}
          />
        ))}
      </div>

      {/* ── Foreground Content ── */}
      <div className="relative z-10 flex flex-col items-center gap-8 w-full pt-2">
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
                    ? 'bg-white/90 shadow-xl scale-110'
                    : 'hover:bg-white/10 opacity-80 hover:opacity-100 hover:scale-105'
                }`}
              >
                <Icon className="w-9 h-9 shrink-0 filter drop-shadow-md" />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Label */}
      <div className="relative z-10 text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest pb-2">
        epicSnail
      </div>
    </aside>
  );
}
