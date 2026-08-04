import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, RefreshCw } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';

export default function GoogleCalendarWidget() {
  const { addXp } = useGamification();
  
  const [statusInfo, setStatusInfo] = useState({ status: 'disconnected', userEmail: '' });
  const [connecting, setConnecting] = useState(false);
  const [loading, setLoading] = useState(false);

  const [events, setEvents] = useState([]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('');

  const fetchGoogleData = async () => {
    if (!window.electronAPI) return;
    setLoading(true);

    const st = await window.electronAPI.getGoogleStatus();
    setStatusInfo(st);

    if (st.status === 'connected') {
      const res = await window.electronAPI.getGoogleCalendarEvents(10);
      if (res.success) {
        setEvents(res.events);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchGoogleData();
  }, []);

  const handleStartOAuth = async () => {
    if (!window.electronAPI) return;
    setConnecting(true);
    const res = await window.electronAPI.startGoogleOAuth();
    setConnecting(false);
    if (res.success) {
      addXp(30, 'Account Google Workspace collegato');
      fetchGoogleData();
    } else {
      alert(res.error || 'Errore durante la connessione Google');
    }
  };

  const handleDisconnect = async () => {
    if (window.electronAPI) {
      await window.electronAPI.disconnectGoogle();
      setStatusInfo({ status: 'disconnected', userEmail: '' });
      setEvents([]);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    if (statusInfo.status === 'connected' && window.electronAPI) {
      setLoading(true);
      const res = await window.electronAPI.createGoogleCalendarEvent({
        summary: newEventTitle.trim(),
        startTime: newEventTime.trim() || undefined,
      });
      setLoading(false);

      if (res.success) {
        setNewEventTitle('');
        setNewEventTime('');
        addXp(15, 'Evento aggiunto a Google Calendar');
        fetchGoogleData();
      } else {
        alert(res.error || 'Impossibile aggiungere l\'evento');
      }
    } else {
      // Local fallback event
      const newEv = {
        id: `ev_${Date.now()}`,
        title: newEventTitle.trim(),
        start: newEventTime.trim() || 'Tutto il giorno',
      };
      setEvents([newEv, ...events]);
      setNewEventTitle('');
      setNewEventTime('');
      addXp(15, 'Evento locale creato');
    }
  };

  const formatEventTime = (isoString) => {
    if (!isoString) return 'Tutto il giorno';
    if (!isoString.includes('T')) return isoString;
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="projects-canvas-container select-none overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-black text-3xl text-white flex items-center gap-3">
            <Calendar className="w-7 h-7 text-[#9D85C6]" />
            Google Calendar & Workspace
          </h1>
        </div>

        <button
          onClick={fetchGoogleData}
          disabled={loading}
          className="p-2.5 rounded-full bg-[#2b1c47] border border-white/10 text-white/70 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Events Card */}
        <div className="lg:col-span-2 dashboard-card theme-lavender p-7 flex flex-col gap-6">
          <h2 className="font-heading font-bold text-xl text-white mb-2">
            Programma di Oggi
          </h2>

          <form onSubmit={handleAddEvent} className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="Titolo evento..."
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              className="flex-1 bg-white/20 border-white/30 text-white text-sm font-semibold rounded-2xl px-5 py-3 placeholder-white/60 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Orario (es. 15:00)"
              value={newEventTime}
              onChange={(e) => setNewEventTime(e.target.value)}
              className="w-36 bg-white/20 border-white/30 text-white text-sm font-semibold rounded-2xl px-5 py-3 placeholder-white/60 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !newEventTitle.trim()}
              className="action-pill bg-white text-[#6B5887] hover:bg-white/90 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>Aggiungi</span>
            </button>
          </form>

          <div className="flex flex-col gap-3">
            {events.length === 0 ? (
              <p className="text-xs font-mono text-white/70 py-4">Nessun evento in programma.</p>
            ) : (
              events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-4 rounded-2xl bg-black/20 border border-white/15 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-white/20 text-white">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{ev.title}</h3>
                      <span className="text-xs font-mono text-white/70">{formatEventTime(ev.start)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Account Connection Card */}
        <div className="dashboard-card theme-plum p-7 flex flex-col justify-between">
          <div>
            <h2 className="font-heading font-bold text-xl text-white mb-3">
              Google Workspace
            </h2>
            
            {statusInfo.status === 'connected' ? (
              <div className="flex flex-col gap-2 font-mono text-xs text-white/90">
                <p className="font-bold">Stato: Connesso</p>
                {statusInfo.userEmail && <p className="text-white/70">{statusInfo.userEmail}</p>}
                <p className="mt-4 text-[11px] leading-relaxed text-white/80">
                  Gli eventi ed i task sono sincronizzati in tempo reale con Google Cloud.
                </p>
              </div>
            ) : statusInfo.status === 'expired' ? (
              <div className="flex flex-col gap-2 font-mono text-xs text-white/90">
                <p className="font-bold text-amber-300">Stato: Token Scaduto</p>
                <p className="text-white/70">È richiesta la riconnessione per continuare la sincronizzazione.</p>
              </div>
            ) : (
              <p className="text-xs text-white/80 leading-relaxed font-mono">
                Connetti il tuo account Google per caricare i tuoi eventi di Google Calendar e le liste di Google Tasks.
              </p>
            )}
          </div>

          <div className="mt-6">
            {statusInfo.status === 'connected' ? (
              <button
                onClick={handleDisconnect}
                className="action-pill bg-white/20 hover:bg-white/30 text-white w-full justify-center"
              >
                <span>Disconnetti Account</span>
              </button>
            ) : (
              <button
                onClick={handleStartOAuth}
                disabled={connecting}
                className="action-pill bg-white text-[#7A3F67] hover:bg-white/90 w-full justify-center disabled:opacity-50"
              >
                <span>{connecting ? 'Attendi Browser...' : 'Connetti Workspace'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
