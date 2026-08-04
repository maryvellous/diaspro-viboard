import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music, RefreshCw, Disc } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';

export default function SpotifyWidget() {
  const { addXp } = useGamification();
  const [statusInfo, setStatusInfo] = useState({ status: 'disconnected', userName: '' });
  const [playback, setPlayback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchPlayback = async () => {
    if (!window.electronAPI) return;
    setLoading(true);
    setErrorMessage('');

    const st = await window.electronAPI.getSpotifyStatus();
    setStatusInfo(st);

    if (st.status === 'connected') {
      const res = await window.electronAPI.getSpotifyPlayback();
      if (res.success) {
        setPlayback(res);
      } else {
        setErrorMessage(res.error || '');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlayback();
    // Auto-refresh playback status every 10 seconds if connected
    const interval = setInterval(() => {
      if (statusInfo.status === 'connected') {
        fetchPlayback();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [statusInfo.status]);

  const handleStartOAuth = async () => {
    if (!window.electronAPI) return;
    setConnecting(true);
    setErrorMessage('');
    const res = await window.electronAPI.startSpotifyOAuth();
    setConnecting(false);

    if (res.success) {
      addXp(30, 'Account Spotify collegato');
      fetchPlayback();
    } else {
      setErrorMessage(res.error || 'Errore di connessione Spotify');
    }
  };

  const handleDisconnect = async () => {
    if (window.electronAPI) {
      await window.electronAPI.disconnectSpotify();
      setStatusInfo({ status: 'disconnected', userName: '' });
      setPlayback(null);
    }
  };

  const handlePlayPause = async () => {
    if (!window.electronAPI || !playback) return;
    setErrorMessage('');

    if (playback.isPlaying) {
      const res = await window.electronAPI.spotifyPause();
      if (res.success) {
        setPlayback({ ...playback, isPlaying: false });
      } else {
        setErrorMessage(res.error || 'Impossibile mettere in pausa');
      }
    } else {
      const res = await window.electronAPI.spotifyPlay();
      if (res.success) {
        setPlayback({ ...playback, isPlaying: true });
      } else {
        setErrorMessage(res.error || 'Impossibile avviare la riproduzione');
      }
    }
  };

  const handleNext = async () => {
    if (!window.electronAPI) return;
    const res = await window.electronAPI.spotifyNext();
    if (res.success) {
      setTimeout(fetchPlayback, 500);
    } else {
      setErrorMessage(res.error || 'Impossibile passare al brano successivo');
    }
  };

  const handlePrevious = async () => {
    if (!window.electronAPI) return;
    const res = await window.electronAPI.spotifyPrevious();
    if (res.success) {
      setTimeout(fetchPlayback, 500);
    } else {
      setErrorMessage(res.error || 'Impossibile tornare al brano precedente');
    }
  };

  return (
    <div className="projects-canvas-container select-none overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading font-black text-3xl text-white flex items-center gap-3">
          <Music className="w-7 h-7 text-[#9D85C6]" />
          Spotify Web Player
        </h1>

        <button
          onClick={fetchPlayback}
          disabled={loading}
          className="p-2.5 rounded-full bg-[#2b1c47] border border-white/10 text-white/70 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Player Card */}
        <div className="lg:col-span-2 dashboard-card bg-[#2b1c47] border border-white/10 p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-xl text-white">
                In Riproduzione
              </h2>
              {playback?.deviceName && (
                <span className="text-xs font-mono text-[#9D85C6] bg-black/30 px-3 py-1 rounded-full border border-white/10">
                  {playback.deviceName}
                </span>
              )}
            </div>

            {playback && playback.trackName ? (
              <div className="flex flex-col sm:flex-row items-center gap-6 my-4">
                <div className="w-32 h-32 rounded-2xl bg-black/40 overflow-hidden shrink-0 border border-white/10 shadow-lg flex items-center justify-center">
                  {playback.albumCover ? (
                    <img src={playback.albumCover} alt={playback.trackName} className="w-full h-full object-cover" />
                  ) : (
                    <Disc className="w-12 h-12 text-[#9D85C6]/50" />
                  )}
                </div>

                <div className="flex flex-col gap-1 text-center sm:text-left">
                  <h3 className="font-heading font-bold text-2xl text-white leading-snug">
                    {playback.trackName}
                  </h3>
                  <p className="text-sm font-semibold text-[#9D85C6]">
                    {playback.artistName || 'Artista sconosciuto'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs font-mono text-white/60">
                Nessuna riproduzione attiva al momento.
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-4 pt-6 border-t border-white/10">
            {errorMessage && (
              <p className="text-xs font-mono text-rose-300 text-center">{errorMessage}</p>
            )}

            <div className="flex items-center justify-center gap-6">
              <button
                onClick={handlePrevious}
                disabled={statusInfo.status !== 'connected'}
                className="p-3 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all disabled:opacity-30"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={handlePlayPause}
                disabled={statusInfo.status !== 'connected'}
                className="w-14 h-14 rounded-full bg-[#9D85C6] hover:bg-[#6B5887] text-white flex items-center justify-center transition-all shadow-lg disabled:opacity-30"
              >
                {playback && playback.isPlaying ? (
                  <Pause className="w-6 h-6 fill-white" />
                ) : (
                  <Play className="w-6 h-6 fill-white ml-0.5" />
                )}
              </button>

              <button
                onClick={handleNext}
                disabled={statusInfo.status !== 'connected'}
                className="p-3 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all disabled:opacity-30"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Account Info Card */}
        <div className="dashboard-card bg-[#7A3F67] p-7 flex flex-col justify-between text-white">
          <div>
            <h2 className="font-heading font-bold text-xl mb-3">
              Account Spotify
            </h2>

            {statusInfo.status === 'connected' ? (
              <div className="flex flex-col gap-2 font-mono text-xs text-white/90">
                <p className="font-bold">Stato: Connesso</p>
                {statusInfo.userName && <p className="text-white/80">Utente: {statusInfo.userName}</p>}
                <p className="mt-4 text-[11px] leading-relaxed text-white/70">
                  Puoi controllare la musica ed i brani direttamente dalla tua dashboard.
                </p>
              </div>
            ) : statusInfo.status === 'expired' ? (
              <div className="flex flex-col gap-2 font-mono text-xs text-white/90">
                <p className="font-bold text-amber-300">Stato: Token Scaduto</p>
                <p className="text-white/70">È richiesta la riconnessione per accedere a Spotify.</p>
              </div>
            ) : (
              <p className="text-xs text-white/80 leading-relaxed font-mono">
                Connetti il tuo account Spotify per controllare il player musicale e la riproduzione in background.
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
                <span>{connecting ? 'Attendi Browser...' : 'Connetti Spotify'}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
