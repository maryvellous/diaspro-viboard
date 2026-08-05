import React, { useState, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

export default function StickyNote({ id, text, x, y, rotation, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(text === ''); // auto-focus on new notes
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const noteRef = useRef(null);

  // ── Drag logic (mouse) ──────────────────────────────────────
  const handleMouseDown = useCallback(
    (e) => {
      // Don't drag when clicking textarea or delete button
      if (e.target.tagName === 'TEXTAREA' || e.target.closest('button')) return;
      e.preventDefault();
      dragging.current = true;
      dragOffset.current = {
        x: e.clientX - x,
        y: e.clientY - y,
      };

      const onMouseMove = (mv) => {
        if (!dragging.current) return;
        onUpdate(id, {
          x: mv.clientX - dragOffset.current.x,
          y: mv.clientY - dragOffset.current.y,
        });
      };

      const onMouseUp = () => {
        dragging.current = false;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    },
    [id, x, y, onUpdate]
  );

  return (
    <div
      ref={noteRef}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `rotate(${rotation}deg)`,
        zIndex: 20,
        width: 210,
        minHeight: 160,
        cursor: 'grab',
        userSelect: 'none',
      }}
      className="group"
    >
      {/* Paper */}
      <div
        style={{
          background: 'rgba(232, 209, 158, 0.93)',
          border: '1px solid rgba(188, 149, 125, 0.55)',
          borderRadius: 14,
          boxShadow: '0 8px 32px rgba(0,0,0,0.35), 0 2px 8px rgba(157,133,198,0.18)',
          padding: '10px 12px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {/* Top bar: delete button */}
        <div className="flex justify-end">
          <button
            onClick={() => onDelete(id)}
            style={{
              background: 'none',
              border: 'none',
              padding: 2,
              cursor: 'pointer',
              color: 'rgba(59,44,15,0.4)',
              display: 'flex',
              alignItems: 'center',
              borderRadius: 6,
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#8F5A5A')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(59,44,15,0.4)')}
            title="Elimina nota"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* Text area */}
        <textarea
          value={text}
          autoFocus={isEditing}
          placeholder="Scrivi una nota..."
          onChange={(e) => onUpdate(id, { text: e.target.value })}
          onFocus={() => setIsEditing(true)}
          onBlur={() => setIsEditing(false)}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            fontWeight: 600,
            color: '#3b2c0f',
            lineHeight: 1.6,
            width: '100%',
            minHeight: 100,
            cursor: isEditing ? 'text' : 'grab',
          }}
          rows={5}
        />
      </div>
    </div>
  );
}
