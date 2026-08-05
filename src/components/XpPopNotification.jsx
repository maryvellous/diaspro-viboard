import React, { useEffect, useState } from 'react';
import { useGamification } from '../context/GamificationContext';
import { Sparkles } from 'lucide-react';

export default function XpPopNotification() {
  const { activeXpPop } = useGamification();
  const [pop, setPop] = useState(null);

  useEffect(() => {
    if (activeXpPop) {
      setPop(activeXpPop);
      const timer = setTimeout(() => {
        setPop(null);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [activeXpPop]);

  if (!pop) return null;

  return (
    <div
      key={pop.id}
      className="animate-xp-pop fixed top-16 right-8 z-50 pointer-events-none flex items-center gap-2 px-4 py-2 rounded-full shadow-2xl border border-[#E8D19E]/40"
      style={{
        background: 'linear-gradient(135deg, rgba(122, 63, 103, 0.95), rgba(157, 133, 198, 0.95))',
        backdropFilter: 'blur(12px)',
      }}
    >
      <Sparkles className="w-4 h-4 text-[#E8D19E]" />
      <span className="font-bold text-white text-sm">+{pop.amount} XP</span>
      {pop.text && <span className="text-xs text-[#E8D19E]">({pop.text})</span>}
    </div>
  );
}
