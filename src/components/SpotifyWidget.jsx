import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music, RefreshCw, Disc, Volume2 } from 'lucide-react';
import { SpotifyIcon } from './BrandIcons';
import { AestheticEqualiserIcon } from './AestheticIcons';
import { useGamification } from '../context/GamificationContext';

// 21 bars for the audio visualizer
const VIZ_COLORS = [
  '#9D85C6', '#A5C4DC', '#E8D19E', '#9D85C6', '#98A78A',
  '#BC957D', '#9D85C6', '#A5C4DC', '#E8D19E', '#9D85C6',
  '#98A78A', '#9D85C6', '#A5C4DC', '#E8D19E', '#9D85C6',
  '#BC957D', '#9D85C6', '#A5C4DC', '#E8D19E', '#9D85C6', '#A5C4DC',
];

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
      setLoading(false);
      if (res.success) {
        setPlayback(res.playback);
      } else {
        setErrorMessage(res.error || 'Impossibile caricare la riproduzione Spotify');
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayback();
  }, []);

  const handleStartOAuth = async () => {
    if (!window.electronAPI) return;
    setConnecting(true);
    setErrorMessage('');
    const res = await window.electronAPI.startSpotifyOAuth();
    setConnecting(false);
    if (res.success) {
      fetchPlayback();
      addXp(30, 'Account Spotify collegato!');
    } else {
      setErrorMessage(res.error || 'Errore durante la connessione con Spotify');
    }
  };

  const handleDisconnect = async () => {
    if (window.electronAPI) {
      await window.electronAPI.disconnectSpotify();
      setStatusInfo({ status: 'disconnected', userName: '' });
      setPlayback(null);
    }
  };

  const handlePlay = async () => {
    if (!window.electronAPI) return;
    const res = await window.electronAPI.spotifyPlay();
    if (res.success) setPlayback({ ...playback, isPlaying: true });
    else setErrorMessage(res.error || 'Impossibile avviare la riproduzione');
  };

  const handlePause = async () => {
    if (!window.electronAPI) return;
    const res = await window.electronAPI.spotifyPause();
    if (res.success) setPlayback({ ...playback, isPlaying: false });
    else setErrorMessage(res.error || 'Impossibile mettere in pausa');
  };

  const handleNext = async () => {
    if (!window.electronAPI) return;
    const res = await window.electronAPI.spotifyNext();
    if (res.success) setTimeout(fetchPlayback, 500);
    else setErrorMessage(res.error || 'Impossibile passare al brano successivo');
  };

  const handlePrevious = async () => {
    if (!window.electronAPI) return;
    const res = await window.electronAPI.spotifyPrevious();
    if (res.success) setTimeout(fetchPlayback, 500);
    else setErrorMessage(res.error || 'Impossibile tornare al brano precedente');
  };

  const isPlaying = playback?.isPlaying;

  const handlePlayPause = async () => {
    if (isPlaying) {
      await handlePause();
    } else {
      await handlePlay();
    }
  };

  const isConnected = statusInfo.status === 'connected';

  return (
    <div className="projects-canvas-container select-none overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading font-black text-3xl text-white flex items-center gap-3.5">
          <AestheticEqualiserIcon className="w-10 h-10 shrink-0 filter drop-shadow-md" />
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

        {/* ── PREMIUM PLAYER CARD ── */}
        <div className="lg:col-span-2 dashboard-card bg-[#2b1c47] border border-white/10 overflow-hidden relative flex flex-col min-h-[420px]">

          {/* Album Cover Background Blur */}
          {playback?.albumCover && (
            <div
              className="absolute inset-0 opacity-20 blur-2xl scale-110 pointer-events-none"
              style={{ backgroundImage: `url(${playback.albumCover})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1e1333]/60 to-[#1e1333]/95 pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full p-8 gap-6">

            {/* Album Art + Track Info */}
            <div className="flex flex-col sm:flex-row items-center gap-8 flex-1">
              {/* Cover Art */}
              <div className="w-44 h-44 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl shrink-0 flex items-center justify-center bg-black/40">
                {playback?.albumCover ? (
                  <img
                    src={playback.albumCover}
                    alt={playback.trackName}
                    className={`w-full h-full object-cover transition-all duration-500 ${isPlaying ? 'scale-105' : 'scale-100 brightness-75'}`}
                  />
                ) : (
                  <Disc className={`w-16 h-16 text-[#9D85C6]/50 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
                )}
              </div>

              {/* Track Info */}
              <div className="flex flex-col gap-3 text-center sm:text-left flex-1">
                {playback?.trackName ? (
                  <>
                    <div>
                      <h2 className="font-heading font-black text-2xl text-white leading-tight">{playback.trackName}</h2>
                      <p className="text-sm font-semibold text-[#9D85C6] mt-1">{playback.artistName || 'Artista sconosciuto'}</p>
                    </div>
                    {playback?.deviceName && (
                      <span className="text-xs font-mono text-[#A5C4DC] bg-black/30 px-3 py-1 rounded-full border border-white/10 self-start flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-[#98A78A]" />
                        {playback.deviceName}
                      </span>
                    )}
                  </>
                ) : (
                  <div className="py-6 text-center sm:text-left">
                    <p className="text-sm font-mono text-white/40">Nessuna riproduzione attiva.</p>
                    <p className="text-xs font-mono text-white/25 mt-1">Avvia Spotify su uno dei tuoi dispositivi.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar (simulated) */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full bg-[#9D85C6] rounded-full transition-all ${isPlaying ? 'progress-bar-anim' : ''}`}
                style={{ width: isPlaying ? undefined : '0%', animation: isPlaying ? 'progressbar 30s linear infinite' : 'none' }}
              />
            </div>

            {/* Audio Visualizer */}
            <div className="flex items-end justify-center gap-[3px] h-10">
              {VIZ_COLORS.map((color, i) => (
                <div
                  key={i}
                  className={`vizbar w-[4px]`}
                  style={{
                    background: color,
                    height: 4,
                    opacity: isPlaying ? 1 : 0.2,
                    animationPlayState: isPlaying ? 'running' : 'paused',
                    animationDelay: `${(i * 0.07).toFixed(2)}s`,
                  }}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-4 pt-2 border-t border-white/10">
              {errorMessage && (
                <p className="text-xs font-mono text-rose-300 text-center">{errorMessage}</p>
              )}
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={handlePrevious}
                  disabled={!isConnected}
                  className="p-3 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all disabled:opacity-30"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={handlePlayPause}
                  disabled={!isConnected}
                  className="w-16 h-16 rounded-full bg-[#9D85C6] hover:bg-[#6B5887] text-white flex items-center justify-center transition-all shadow-2xl shadow-[#9D85C6]/40 disabled:opacity-30 active:scale-95"
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 fill-white" />
                  ) : (
                    <Play className="w-7 h-7 fill-white ml-0.5" />
                  )}
                </button>

                <button
                  onClick={handleNext}
                  disabled={!isConnected}
                  className="p-3 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all disabled:opacity-30"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── ACCOUNT INFO CARD ── */}
        <div className="dashboard-card bg-[#7A3F67] border border-[#9D85C6]/40 p-7 flex flex-col justify-between text-white shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading font-bold text-xl text-[#E8D19E]">Account Spotify</h2>
              <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-full border ${
                statusInfo.status === 'connected'
                  ? 'bg-[#98A78A]/30 text-[#98A78A] border-[#98A78A]/50'
                  : statusInfo.status === 'expired'
                  ? 'bg-amber-950/50 text-[#E8D19E] border-amber-400/50'
                  : 'bg-black/30 text-[#A5C4DC] border-white/20'
              }`}>
                {statusInfo.status === 'connected' ? '● Connesso' : statusInfo.status === 'expired' ? '⚠ Scaduto' : '○ Disconnesso'}
              </span>
            </div>

            {statusInfo.status === 'connected' ? (
              <div className="flex flex-col gap-3 font-mono text-xs text-white/90">
                <div className="p-4 bg-[#1e1333]/60 rounded-2xl border border-white/10">
                  <p className="font-bold text-[#E8D19E] text-[10px] uppercase tracking-wider mb-1">Utente Connesso</p>
                  <p className="text-white text-sm font-semibold">{statusInfo.userName || 'Account Attivo'}</p>
                </div>
                <p className="text-[11px] leading-relaxed text-[#A5C4DC]">
                  Controlla la riproduzione direttamente dalla dashboard. I dati si aggiornano ogni 10 secondi.
                </p>
              </div>
            ) : statusInfo.status === 'expired' ? (
              <div className="flex flex-col gap-3 font-mono text-xs">
                <div className="p-4 bg-amber-950/60 border border-amber-400/40 rounded-2xl text-[#E8D19E]">
                  <p className="font-bold">Sessione Scaduta</p>
                  <p className="text-[11px] text-white/80 mt-1">È richiesta la riconnessione rapida per accedere alla riproduzione Spotify.</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#A5C4DC] leading-relaxed font-sans">
                Connetti il tuo account Spotify per controllare il player musicale direttamente in-app in 1-click.
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
                className="action-pill bg-[#1DB954] hover:bg-[#1ed760] text-black w-full justify-center font-black disabled:opacity-50 shadow-lg"
              >
                <span>{connecting ? 'Attendi Browser...' : statusInfo.status === 'expired' ? 'Riconnetti Spotify in 1-Click' : 'Connetti Spotify in 1-Click'}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
