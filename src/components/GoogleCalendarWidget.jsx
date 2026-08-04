import React, { useState } from 'react';
import { Calendar, Plus, Clock, Sparkles } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';

export default function GoogleCalendarWidget() {
  const { addXp } = useGamification();
  const [events, setEvents] = useState([
    { id: 'e1', title: 'Sessione di Sviluppo epicSnail', time: '16:00 - 18:00', tag: 'Dev' },
    { id: 'e2', title: 'Review Android Studio App', time: '20:00 - 21:00', tag: 'Project' }
  ]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('');

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    const newEv = {
      id: `ev_${Date.now()}`,
      title: newEventTitle.trim(),
      time: newEventTime.trim() || 'Tutto il giorno',
      tag: 'Event'
    };
    setEvents([...events, newEv]);
    setNewEventTitle('');
    setNewEventTime('');
    addXp(15, 'Evento aggiunto al calendario');
  };

  return (
    <div className="projects-canvas-container select-none">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-heading font-black text-3xl text-white flex items-center gap-3">
            <Calendar className="w-7 h-7 text-[#9D85C6]" />
            Google Calendar & Workspace
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Schedule Card */}
        <div className="lg:col-span-2 dashboard-card theme-lavender p-7 flex flex-col gap-6">
          <h2 className="font-heading font-black text-2xl text-white mb-2">
            Programma di Oggi
          </h2>

          <form onSubmit={handleAddEvent} className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="Titolo evento..."
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              className="flex-1 bg-white/20 border-white/30 text-white text-sm font-semibold rounded-2xl px-5 py-3 placeholder-white/60"
            />
            <input
              type="text"
              placeholder="Orario (es. 15:00)"
              value={newEventTime}
              onChange={(e) => setNewEventTime(e.target.value)}
              className="w-40 bg-white/20 border-white/30 text-white text-sm font-semibold rounded-2xl px-5 py-3 placeholder-white/60"
            />
            <button
              type="submit"
              className="action-pill bg-white text-[#6B5887] hover:bg-white/90"
            >
              <Plus className="w-4 h-4" />
              <span>Aggiungi</span>
            </button>
          </form>

          <div className="flex flex-col gap-3">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="p-4 rounded-2xl bg-black/20 border border-white/15 flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-white/20 text-white">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">{ev.title}</h3>
                    <span className="text-xs font-mono text-white/70">{ev.time}</span>
                  </div>
                </div>

                <span className="badge-pill bg-white/20 text-white border border-white/20">
                  {ev.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Card */}
        <div className="dashboard-card theme-plum p-7 flex flex-col justify-between">
          <div>
            <h2 className="font-heading font-black text-2xl text-white mb-3">
              Google OAuth 2.0
            </h2>
            <p className="text-xs text-white/80 leading-relaxed mb-6 font-mono">
              Connetti il tuo Google Workspace per sincronizzare eventi ed accedere ai documenti Drive.
            </p>
          </div>

          <button
            onClick={() => alert('Avvio server OAuth 2.0 locale per Google Workspace...')}
            className="action-pill bg-white text-[#7A3F67] hover:bg-white/90 w-full justify-center"
          >
            <Sparkles className="w-4 h-4" />
            <span>Connetti Workspace</span>
          </button>
        </div>
      </div>
    </div>
  );
}
