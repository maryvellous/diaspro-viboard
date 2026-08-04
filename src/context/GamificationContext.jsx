import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/audio';

const GamificationContext = createContext();

export function GamificationProvider({ children }) {
  const [xp, setXp] = useState(150);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(1);
  const [unlockedBadges, setUnlockedBadges] = useState(['b1']);
  const [activeXpPop, setActiveXpPop] = useState(null); // { amount, text, id }

  // Level formula: XP required for level L = 100 * L^1.5
  const getXpForLevel = (lvl) => Math.floor(100 * Math.pow(lvl, 1.5));
  const currentLevelXpNeeded = getXpForLevel(level);
  const prevLevelXpNeeded = level > 1 ? getXpForLevel(level - 1) : 0;
  const xpInCurrentLevel = xp - prevLevelXpNeeded;
  const xpNeededForNext = currentLevelXpNeeded - prevLevelXpNeeded;
  const levelProgress = Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNext) * 100));

  // Load from store if electron API available
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getStoreData().then((data) => {
        if (data && data.user) {
          setXp(data.user.xp || 150);
          setLevel(data.user.level || 1);
          setStreak(data.user.streak || 1);
          setUnlockedBadges(data.user.unlockedBadges || ['b1']);
        }
      });
    }
  }, []);

  // Save changes
  const saveUserProgress = (newXp, newLevel, newStreak, newBadges) => {
    if (window.electronAPI) {
      window.electronAPI.setStoreData('user', {
        xp: newXp,
        level: newLevel,
        streak: newStreak,
        unlockedBadges: newBadges,
      });
    }
  };

  const addXp = (amount, reason = '') => {
    soundFX.playTaskPop();
    const newXp = xp + amount;
    setXp(newXp);

    // Trigger XP Pop notification
    setActiveXpPop({ amount, text: reason, id: Date.now() });

    // Check level up
    let nextLvl = level;
    while (newXp >= getXpForLevel(nextLvl)) {
      nextLvl++;
    }

    if (nextLvl > level) {
      setLevel(nextLvl);
      soundFX.playLevelUp();
      // Burst violet/cyan confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#06b6d4', '#ec4899', '#CBC0E9'],
      });
    }

    saveUserProgress(newXp, nextLvl, streak, unlockedBadges);
  };

  return (
    <GamificationContext.Provider
      value={{
        xp,
        level,
        streak,
        unlockedBadges,
        levelProgress,
        xpInCurrentLevel,
        xpNeededForNext,
        addXp,
        activeXpPop,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  return useContext(GamificationContext);
}
