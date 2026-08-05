import { useState, useCallback } from 'react';

const STORAGE_KEY = 'diaspro_viboard_sticky_notes';

function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotes(notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // Storage full or unavailable — silent fail
  }
}

function randomRotation() {
  return (Math.random() * 6 - 3).toFixed(2); // -3° to +3°
}

function randomStartPosition() {
  // Place new notes in top-left area for clean layout
  return {
    x: 40 + Math.random() * 200,
    y: 80 + Math.random() * 180,
  };
}

export function useStickyNotes() {
  const [notes, setNotes] = useState(() => loadNotes());

  const addNote = useCallback(() => {
    const pos = randomStartPosition();
    const newNote = {
      id: `sticky_${Date.now()}`,
      text: '',
      x: pos.x,
      y: pos.y,
      rotation: randomRotation(),
    };
    setNotes((prev) => {
      const updated = [...prev, newNote];
      saveNotes(updated);
      return updated;
    });
  }, []);

  const updateNote = useCallback((id, changes) => {
    setNotes((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, ...changes } : n));
      saveNotes(updated);
      return updated;
    });
  }, []);

  const deleteNote = useCallback((id) => {
    setNotes((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      saveNotes(updated);
      return updated;
    });
  }, []);

  return { notes, addNote, updateNote, deleteNote };
}
