import React, { useState, useEffect } from 'react';
import { 
  Settings, FolderPlus, Trash2, ExternalLink, User, Bot, 
  FolderGit2, Calendar, Music, HardDrive, CheckCircle2, Key, ShieldCheck,
  Sparkles, RotateCcw, Trophy, Sliders, Pin, ChevronDown, Lock, RefreshCw, Zap
} from 'lucide-react';
import { useProjects } from '../context/ProjectsContext';
import { useGamification } from '../context/GamificationContext';
import { useSections } from '../context/SectionsContext';

import { PROVIDER_INFO as providerInfo } from '../constants/providers';
import { GoogleIcon, SpotifyIcon, PinterestIcon, GithubIcon } from './BrandIcons';
import { 
  AestheticCogIcon, 
  AestheticIdCardIcon, 
  AestheticChartPieIcon, 
  AestheticKeyIcon, 
  AestheticGlobeIcon, 
  AestheticImacIcon 
} from './AestheticIcons';


export default function SettingsView() {
  const { refreshProjects } = useProjects();
  const { 
    userName, 
    completeOnboarding, 
    xpRules, 
    updateXpRules, 
    resetXpRulesToDefault, 
    difficulty, 
    updateDifficulty,
    addXp
  } = useGamification();

  const { enabledSections, updateSection } = useSections();
  const [googleExpanded, setGoogleExpanded] = useState(false);
  const [spotifyExpanded, setSpotifyExpanded] = useState(false);
  const [pinterestExpanded, setPinterestExpanded] = useState(false);
  const [githubExpanded, setGithubExpanded] = useState(false);

  const [nameInput, setNameInput] = useState(userName || '');
  const [scanPaths, setScanPaths] = useState([]);
  const [newPath, setNewPath] = useState('');

  // AI Provider states
  const [aiProvider, setAiProvider] = useState('gemini');
  const [aiKey, setAiKey] = useState('');
  const [aiStatus, setAiStatus] = useState(null);
  const [testingAi, setTestingAi] = useState(false);

  // GitHub State
  const [githubToken, setGithubToken] = useState('');
  const [githubUser, setGithubUser] = useState(null);
  const [validatingGh, setValidatingGh] = useState(false);

  // Google OAuth Credentials
  const [googleClientId, setGoogleClientId] = useState('');
  const [googleClientSecret, setGoogleClientSecret] = useState('');
  const [googleStatus, setGoogleStatus] = useState({ status: 'disconnected', userEmail: '' });
  const [connectingGoogle, setConnectingGoogle] = useState(false);

  // Spotify Status
  const [spotifyStatus, setSpotifyStatus] = useState({ status: 'disconnected', userName: '' });
  const [connectingSpotify, setConnectingSpotify] = useState(false);

  // Pinterest Status
  const [pinterestStatus, setPinterestStatus] = useState({ status: 'disconnected', userName: '' });
  const [connectingPinterest, setConnectingPinterest] = useState(false);

  useEffect(() => {
    setNameInput(userName);

    if (window.electronAPI) {
      window.electronAPI.getStoreData().then((data) => {
        if (data && data.scanPaths) {
          setScanPaths(data.scanPaths);
        }
      });

      // Load selected provider & keys
      window.electronAPI.getToken('selected_ai_provider').then((prov) => {
        const activeProv = prov || 'gemini';
        setAiProvider(activeProv);
        window.electronAPI.getToken(`${activeProv}_api_key`).then((k) => {
          if (k) setAiKey(k);
        });
      });

      window.electronAPI.getToken('github').then((t) => {
        if (t) {
          setGithubToken(t);
          window.electronAPI.validateGitHubToken(t).then((res) => {
            if (res.valid) setGithubUser(res.user);
          });
        }
      });

      window.electronAPI.getToken('google_client_id').then((cid) => {
        if (cid) setGoogleClientId(cid);
      });
      window.electronAPI.getToken('google_client_secret').then((cs) => {
        if (cs) setGoogleClientSecret(cs);
      });
      window.electronAPI.getGoogleStatus().then((st) => {
        if (st) setGoogleStatus(st);
      });

      window.electronAPI.getSpotifyStatus().then((st) => {
        if (st) setSpotifyStatus(st);
      });

      window.electronAPI.getPinterestStatus().then((st) => {
        if (st) setPinterestStatus(st);
      });
    }
  }, [userName]);

  const handleProviderChange = (e) => {
    const newProv = e.target.value;
    setAiProvider(newProv);
    setAiKey('');
    setAiStatus(null);
    if (window.electronAPI) {
      window.electronAPI.saveToken('selected_ai_provider', newProv);
      window.electronAPI.getToken(`${newProv}_api_key`).then((k) => {
        if (k) setAiKey(k);
      });
    }
  };

  const handleSaveName = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    completeOnboarding(nameInput.trim());
  };

  const handleSaveAiKey = async () => {
    if (aiProvider !== 'ollama' && !aiKey.trim()) return;
    setTestingAi(true);
    setAiStatus(null);
    if (window.electronAPI) {
      const res = await window.electronAPI.testAiKey(aiProvider, aiKey.trim());
      setTestingAi(false);
      setAiStatus(res);
      if (res.success) {
        await window.electronAPI.saveToken(`${aiProvider}_api_key`, aiKey.trim());
        await window.electronAPI.saveToken('selected_ai_provider', aiProvider);
      }
    } else {
      setTestingAi(false);
      setAiStatus({ success: true, message: 'Demo Web OK' });
    }
  };

  const handleSaveGitHubToken = async () => {
    if (!githubToken.trim()) return;
    setValidatingGh(true);
    if (window.electronAPI) {
      const res = await window.electronAPI.validateGitHubToken(githubToken.trim());
      setValidatingGh(false);
      if (res.valid) {
        setGithubUser(res.user);
        await window.electronAPI.saveToken('github', githubToken.trim());
        addXp(30, 'GitHub collegato con successo!');
        refreshProjects();
      } else {
        alert(res.error || 'Token non valido');
      }
    }
  };

  const handleStartGoogleOAuth = async () => {
    if (!window.electronAPI) return;
    setConnectingGoogle(true);
    const res = await window.electronAPI.startGoogleOAuth();
    setConnectingGoogle(false);
    if (res.success) {
      const st = await window.electronAPI.getGoogleStatus();
      setGoogleStatus(st);
      addXp(30, 'Google Workspace collegato!');
    } else {
      alert(res.error || 'Errore durante la connessione Google');
    }
  };

  const handleDisconnectGoogle = async () => {
    if (window.electronAPI) {
      await window.electronAPI.disconnectGoogle();
      setGoogleStatus({ status: 'disconnected', userEmail: '' });
    }
  };

  const handleStartSpotifyOAuth = async () => {
    if (!window.electronAPI) return;
    setConnectingSpotify(true);
    const res = await window.electronAPI.startSpotifyOAuth();
    setConnectingSpotify(false);
    if (res.success) {
      const st = await window.electronAPI.getSpotifyStatus();
      setSpotifyStatus(st);
      addXp(30, 'Spotify collegato!');
    } else {
      alert(res.error || 'Errore di connessione Spotify');
    }
  };

  const handleDisconnectSpotify = async () => {
    if (window.electronAPI) {
      await window.electronAPI.disconnectSpotify();
      setSpotifyStatus({ status: 'disconnected', userName: '' });
    }
  };

  const handleStartPinterestOAuth = async () => {
    if (!window.electronAPI) return;
    setConnectingPinterest(true);
    const res = await window.electronAPI.startPinterestOAuth();
    setConnectingPinterest(false);
    if (res.success) {
      const st = await window.electronAPI.getPinterestStatus();
      setPinterestStatus(st);
      addXp(30, 'Pinterest collegato!');
    } else {
      alert(res.error || 'Errore di connessione Pinterest');
    }
  };

  const handleDisconnectPinterest = async () => {
    if (window.electronAPI) {
      await window.electronAPI.disconnectPinterest();
      setPinterestStatus({ status: 'disconnected', userName: '' });
    }
  };

  const handleSaveGoogleCredentials = async () => {
    if (window.electronAPI) {
      if (googleClientId.trim()) {
        await window.electronAPI.saveToken('google_client_id', googleClientId.trim());
      }
      if (googleClientSecret.trim()) {
        await window.electronAPI.saveToken('google_client_secret', googleClientSecret.trim());
      }
      alert('Credenziali Google salvate cifrate nel Vault.');
    }
  };

  const handleAddPath = (e) => {
    e.preventDefault();
    if (!newPath.trim()) return;
    const updated = [...scanPaths, newPath.trim()];
    setScanPaths(updated);
    setNewPath('');
    if (window.electronAPI) {
      window.electronAPI.setStoreData('scanPaths', updated);
    }
    refreshProjects();
  };

  const handleRemovePath = (index) => {
    const updated = scanPaths.filter((_, i) => i !== index);
    setScanPaths(updated);
    if (window.electronAPI) {
      window.electronAPI.setStoreData('scanPaths', updated);
    }
    refreshProjects();
  };

  return (
    <div className="projects-canvas-container select-none overflow-y-auto">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
        <div>
          <h1 className="font-heading font-black text-3xl text-white flex items-center gap-3.5">
            <AestheticCogIcon className="w-10 h-10 shrink-0 filter drop-shadow-md" />
            Impostazioni & Connessioni
          </h1>
          <p className="text-xs text-[#A5C4DC] mt-1 font-sans">
            Gestisci profilo, provider IA, integrazioni app e percorsi di scansione locale
          </p>
        </div>
      </div>

      {/* BALANCED 2-COLUMN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start pb-16">
        
        {/* LEFT COLUMN: User Profile, Gamification & AI Config */}
        <div className="flex flex-col gap-8">
          
          {/* User Profile Card - Vibrant Lavender & Plum */}
          <div className="dashboard-card bg-gradient-to-br from-[#2b1c47] to-[#1e1333] border-2 border-[#9D85C6]/60 p-7 flex flex-col gap-4 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#9D85C6]/30 pb-3">
              <h2 className="font-heading font-bold text-lg text-white flex items-center gap-3">
                <AestheticIdCardIcon className="w-8 h-8 shrink-0 filter drop-shadow-md" />
                Profilo Utente
              </h2>
              <span className="text-xs font-mono font-bold text-[#E8D19E] bg-[#7A3F67]/60 px-3 py-1 rounded-full border border-[#E8D19E]/30">
                Utente Locale
              </span>
            </div>

            <form onSubmit={handleSaveName} className="flex gap-3 pt-1">
              <input
                type="text"
                placeholder="Inserisci il tuo nome..."
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="flex-1 bg-[#1e1333] border border-[#9D85C6]/40 text-white text-sm font-semibold rounded-2xl px-4 py-3 focus:outline-none focus:border-[#E8D19E] transition-colors"
              />
              <button type="submit" className="action-pill bg-[#7A3F67] hover:bg-[#9D85C6] text-white font-black shadow-lg">
                Salva Nome
              </button>
            </form>
          </div>

          {/* Gamification & XP Rules Card - Rich Plum & Sand */}
          <div className="dashboard-card bg-gradient-to-br from-[#2b1c47] via-[#1e1333] to-[#7A3F67]/30 border-2 border-[#7A3F67]/60 p-7 flex flex-col gap-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#7A3F67]/40 pb-3">
              <h2 className="font-heading font-bold text-lg text-white flex items-center gap-3">
                <AestheticChartPieIcon className="w-8 h-8 shrink-0 filter drop-shadow-md" />
                Gamification & Regole XP
              </h2>
              <button
                onClick={resetXpRulesToDefault}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-mono font-bold text-[#E8D19E] border border-[#E8D19E]/30 transition-all cursor-pointer shadow-sm"
                title="Ripristina valori consigliati di default"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ripristina Default</span>
              </button>
            </div>

            {/* Difficulty Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono font-bold text-[#E8D19E] uppercase tracking-wider">
                Difficoltà di Progressione Livelli
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'easy', label: 'Facile (0.7x)', desc: 'Progressione rapida' },
                  { id: 'normal', label: 'Normale (1.0x)', desc: 'Bilanciamento standard' },
                  { id: 'hard', label: 'Difficile (1.5x)', desc: 'Per veri pro' },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => updateDifficulty(d.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      difficulty === d.id
                        ? 'bg-[#7A3F67] border-[#E8D19E] shadow-lg text-white font-bold'
                        : 'bg-[#1e1333] border-white/10 text-white/70 hover:border-white/30'
                    }`}
                  >
                    <p className="text-xs font-bold text-white">{d.label}</p>
                    <span className="text-[10px] text-[#A5C4DC] font-mono block mt-0.5">{d.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action XP Rules Grid */}
            <div className="flex flex-col gap-3 pt-2">
              <label className="text-xs font-mono font-bold text-[#9D85C6] uppercase tracking-wider">
                Punti XP Assegnati per Azione
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'taskComplete', label: 'Task Post-it completata' },
                  { key: 'taskCreate', label: 'Creazione nuova task' },
                  { key: 'calendarEvent', label: 'Evento Google Calendar' },
                  { key: 'aiChat', label: 'Interazione con Chatbot AI' },
                  { key: 'spotifySession', label: 'Sessione musica Spotify' },
                  { key: 'dailyStreak', label: 'Accesso quotidiano (Streak)' },
                ].map((rule) => (
                  <div key={rule.key} className="p-3 bg-[#1e1333] rounded-2xl border border-[#9D85C6]/30 flex items-center justify-between shadow-inner">
                    <span className="text-xs font-bold text-white">
                      {rule.label}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="1"
                        max="200"
                        value={xpRules[rule.key] || 0}
                        onChange={(e) => updateXpRules({ [rule.key]: parseInt(e.target.value) || 1 })}
                        className="w-16 bg-[#2b1c47] border border-[#E8D19E]/50 text-center text-xs font-mono font-bold text-[#E8D19E] rounded-xl px-2 py-1 focus:outline-none focus:border-[#E8D19E]"
                      />
                      <span className="text-[10px] font-mono text-[#A5C4DC]">XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Multi-Provider AI BYOK Card - Deep Purple & Glowing Blue */}
          <div className="dashboard-card bg-gradient-to-br from-[#2b1c47] to-[#1e1333] border-2 border-[#A5C4DC]/50 p-7 flex flex-col gap-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#A5C4DC]/20 pb-3">
              <h2 className="font-heading font-bold text-lg text-white flex items-center gap-3">
                <AestheticKeyIcon className="w-8 h-8 shrink-0 filter drop-shadow-md" />
                Configurazione IA (Multi-Provider BYOK)
              </h2>
              <ShieldCheck className="w-5 h-5 text-[#98A78A]" />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono font-bold text-[#A5C4DC] uppercase tracking-wider">
                  Provider Selezionato
                </label>
                <select
                  value={aiProvider}
                  onChange={handleProviderChange}
                  className="bg-[#1e1333] border border-[#A5C4DC]/40 text-white rounded-2xl px-4 py-3 font-bold text-sm focus:outline-none focus:border-[#A5C4DC] cursor-pointer"
                >
                  <option value="gemini" className="bg-[#2b1c47] text-white">Google Gemini</option>
                  <option value="deepseek" className="bg-[#2b1c47] text-white">DeepSeek</option>
                  <option value="anthropic" className="bg-[#2b1c47] text-white">Anthropic (Claude)</option>
                  <option value="openai" className="bg-[#2b1c47] text-white">OpenAI</option>
                  <option value="ollama" className="bg-[#2b1c47] text-white">Ollama (Locale)</option>
                </select>
              </div>

              {aiProvider !== 'ollama' && (
                <div className="flex flex-col gap-2 pt-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-mono font-bold text-[#A5C4DC] uppercase tracking-wider">
                      Chiave API {providerInfo[aiProvider]?.name}
                    </label>
                    <a
                      href={providerInfo[aiProvider]?.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#A5C4DC] hover:underline flex items-center gap-1 font-mono"
                    >
                      Ottieni Chiave <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="flex gap-3">
                    <input
                      type="password"
                      placeholder={providerInfo[aiProvider]?.placeholder}
                      value={aiKey}
                      onChange={(e) => setAiKey(e.target.value)}
                      className="flex-1 bg-[#1e1333] border border-[#A5C4DC]/30 text-white font-mono text-xs rounded-2xl px-4 py-3 focus:outline-none focus:border-[#A5C4DC]"
                    />
                    <button
                      onClick={handleSaveAiKey}
                      disabled={testingAi}
                      className="action-pill bg-[#A5C4DC] text-[#1e1333] hover:bg-white font-black disabled:opacity-50 shadow-md"
                    >
                      {testingAi ? 'Verifica...' : 'Salva & Test'}
                    </button>
                  </div>
                </div>
              )}

              {aiProvider === 'ollama' && (
                <div className="flex justify-between items-center p-3.5 bg-[#1e1333] rounded-2xl border border-white/10">
                  <span className="text-xs font-mono text-[#A5C4DC]">Endpoint: http://localhost:11434</span>
                  <button
                    onClick={handleSaveAiKey}
                    disabled={testingAi}
                    className="action-pill bg-[#6B5887] hover:bg-[#7A3F67] text-white font-bold"
                  >
                    {testingAi ? 'Verifica...' : 'Test Ollama'}
                  </button>
                </div>
              )}

              {aiStatus && (
                <div className={`p-3 rounded-xl border text-xs font-mono font-semibold ${
                  aiStatus.success 
                    ? 'bg-[#98A78A]/20 border-[#98A78A]/50 text-[#98A78A]' 
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                }`}>
                  {aiStatus.message || aiStatus.error}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Unified Hub Connessioni & Scan Paths */}
        <div className="flex flex-col gap-8">

          {/* ── UNIFIED HUB CONNESSIONI PREMIUM ── */}
          <div className="dashboard-card bg-gradient-to-br from-[#2b1c47] via-[#1e1333] to-[#2b1c47] border-2 border-[#E8D19E]/60 p-7 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#E8D19E]/25 pb-4">
              <div>
                <h2 className="font-heading font-black text-xl text-white flex items-center gap-3">
                  <AestheticGlobeIcon className="w-9 h-9 shrink-0 filter drop-shadow-md" />
                  Hub Connessioni
                </h2>
                <p className="text-xs text-[#A5C4DC] font-sans mt-0.5">
                  Tutte le tue app e servizi integrati con login 1-click in un unico pannello
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#E8D19E] bg-[#7A3F67]/60 px-3 py-1 rounded-full border border-[#E8D19E]/30 uppercase tracking-wider">
                App &amp; Servizi
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">

              {/* 1. GOOGLE WORKSPACE SECTION */}
              <div className="bg-[#1e1333] rounded-2xl border border-[#A5C4DC]/40 overflow-hidden transition-all shadow-md">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#2b1c47] to-[#1e1333]">
                  <div
                    onClick={() => setGoogleExpanded(!googleExpanded)}
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-[#1e1333] border border-[#A5C4DC]/40 flex items-center justify-center shrink-0 shadow-md">
                      <GoogleIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white flex items-center gap-2">
                        Google Workspace
                        <ChevronDown className={`w-4 h-4 text-[#A5C4DC] transition-transform duration-200 ${googleExpanded ? 'rotate-180' : ''}`} />
                      </p>
                      <p className="text-[11px] font-mono text-white/60">
                        {googleStatus.status === 'connected' ? googleStatus.userEmail || 'Account Google attivo' : 'Google Calendar, Tasks & Drive'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-mono font-black px-3 py-1.5 rounded-full border ${
                      googleStatus.status === 'connected'
                        ? 'bg-[#98A78A]/25 text-[#98A78A] border-[#98A78A]/50'
                        : 'bg-[#8F5A5A]/25 text-[#BC957D] border-[#8F5A5A]/40'
                    }`}>
                      {googleStatus.status === 'connected' ? '● Connesso' : '○ Disconnesso'}
                    </span>
                  </div>
                </div>

                {/* Expanded Inline Google Login & Sub-services */}
                <div className="p-4 border-t border-white/10 flex flex-col gap-3 bg-[#1e1333]">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {googleStatus.status === 'connected' ? (
                      <div className="flex items-center justify-between w-full p-3 bg-[#2b1c47] rounded-xl border border-[#98A78A]/30 font-mono text-xs">
                        <span className="text-[#98A78A] font-bold">Email: {googleStatus.userEmail}</span>
                        <button
                          onClick={handleDisconnectGoogle}
                          className="action-pill bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs py-1 px-3"
                        >
                          Disconnetti Google
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleStartGoogleOAuth}
                        disabled={connectingGoogle}
                        className="action-pill bg-[#A5C4DC] hover:bg-white text-[#1e1333] font-black w-full justify-center shadow-md text-xs py-2.5"
                      >
                        <Zap className="w-4 h-4 text-[#EA4335]" />
                        <span>{connectingGoogle ? 'Attendi Browser...' : 'Login Rapido 1-Click Google (Browser)'}</span>
                      </button>
                    )}
                  </div>

                  {/* Chiclets Sub-Services */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div className="p-2 bg-[#2b1c47] rounded-xl border border-[#98A78A]/40 flex items-center justify-between text-[11px]">
                      <span className="font-bold text-white">Calendar</span>
                      <span className="text-[9px] font-mono text-[#98A78A]">Attivo</span>
                    </div>
                    <div className="p-2 bg-[#2b1c47] rounded-xl border border-[#98A78A]/40 flex items-center justify-between text-[11px]">
                      <span className="font-bold text-white">Tasks</span>
                      <span className="text-[9px] font-mono text-[#98A78A]">Attivo</span>
                    </div>
                    <div className="p-2 bg-[#2b1c47] rounded-xl border border-[#98A78A]/40 flex items-center justify-between text-[11px]">
                      <span className="font-bold text-white">Drive</span>
                      <span className="text-[9px] font-mono text-[#98A78A]">Attivo</span>
                    </div>
                  </div>

                  {/* Advanced GCP Credentials Accordion */}
                  {googleExpanded && (
                    <details className="text-xs text-[#A5C4DC] font-mono mt-1 pt-2 border-t border-white/10">
                      <summary className="cursor-pointer hover:underline text-white/80 font-bold mb-2">
                        Opzioni Avanzate (Credenziali GCP Custom)
                      </summary>
                      <div className="flex flex-col gap-2 pt-2">
                        <input
                          type="text"
                          placeholder="Google Client ID (.apps.googleusercontent.com)"
                          value={googleClientId}
                          onChange={(e) => setGoogleClientId(e.target.value)}
                          className="bg-[#2b1c47] border border-[#9D85C6]/30 text-white font-mono text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#9D85C6]"
                        />
                        <input
                          type="password"
                          placeholder="Google Client Secret (Opzionale)"
                          value={googleClientSecret}
                          onChange={(e) => setGoogleClientSecret(e.target.value)}
                          className="bg-[#2b1c47] border border-[#9D85C6]/30 text-white font-mono text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#9D85C6]"
                        />
                        <button
                          onClick={handleSaveGoogleCredentials}
                          className="action-pill bg-[#6B5887] hover:bg-[#7A3F67] text-white font-bold self-start mt-1 text-xs"
                        >
                          Salva Credenziali GCP
                        </button>
                      </div>
                    </details>
                  )}
                </div>
              </div>



              {/* 2. SPOTIFY SECTION */}
              <div className="bg-[#1e1333] rounded-2xl border border-[#1DB954]/40 overflow-hidden transition-all shadow-md">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#1DB954]/20 to-[#1e1333]">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#1e1333] border border-[#1DB954]/40 flex items-center justify-center shrink-0 shadow-md">
                      <SpotifyIcon className="w-6 h-6 text-[#1DB954]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Spotify Web Player</p>
                      <p className="text-[11px] font-mono text-white/60">
                        {spotifyStatus.status === 'connected' ? spotifyStatus.userName || 'Account Spotify Attivo' : 'Controllo musica in-app'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-mono font-black px-2.5 py-1 rounded-full border ${
                      spotifyStatus.status === 'connected'
                        ? 'bg-[#98A78A]/25 text-[#98A78A] border-[#98A78A]/50'
                        : spotifyStatus.status === 'expired'
                        ? 'bg-amber-950/40 text-[#E8D19E] border-amber-400/40'
                        : 'bg-[#8F5A5A]/25 text-[#BC957D] border-[#8F5A5A]/40'
                    }`}>
                      {spotifyStatus.status === 'connected' ? '● Connesso' : spotifyStatus.status === 'expired' ? '⚠ Scaduto' : '○ Disconnesso'}
                    </span>
                    <label className="hub-toggle" title="Mostra/Nascondi Spotify nella sidebar">
                      <input
                        type="checkbox"
                        checked={!!enabledSections.spotify}
                        onChange={(e) => updateSection('spotify', e.target.checked)}
                      />
                      <span className="hub-toggle-slider"></span>
                    </label>
                  </div>
                </div>

                {/* Inline Login/Disconnect Spotify */}
                <div className="p-4 border-t border-white/10 bg-[#1e1333]">
                  {spotifyStatus.status === 'connected' ? (
                    <div className="flex items-center justify-between p-3 bg-[#2b1c47] rounded-xl border border-white/10 font-mono text-xs">
                      <span className="text-[#1DB954] font-bold">Account: {spotifyStatus.userName}</span>
                      <button
                        onClick={handleDisconnectSpotify}
                        className="action-pill bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs py-1 px-3"
                      >
                        Disconnetti Spotify
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleStartSpotifyOAuth}
                      disabled={connectingSpotify}
                      className="action-pill bg-[#1DB954] hover:bg-[#1ed760] text-black font-black w-full justify-center shadow-md text-xs py-2.5"
                    >
                      <Zap className="w-4 h-4 fill-black" />
                      <span>{connectingSpotify ? 'Attendi Browser...' : 'Connetti Spotify in 1-Click (Browser)'}</span>
                    </button>
                  )}
                </div>
              </div>


              {/* 3. PINTEREST MOODBOARD SECTION */}
              <div className="bg-[#1e1333] rounded-2xl border border-[#E60023]/40 overflow-hidden transition-all shadow-md">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#E60023]/20 to-[#1e1333]">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#1e1333] border border-[#E60023]/40 flex items-center justify-center shrink-0 shadow-md">
                      <PinterestIcon className="w-6 h-6 text-[#E60023]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Pinterest Moodboard</p>
                      <p className="text-[11px] font-mono text-white/60">
                        {pinterestStatus.status === 'connected' ? pinterestStatus.userName || 'Account Pinterest Attivo' : 'Bacheche visive d\'ispirazione'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-mono font-black px-2.5 py-1 rounded-full border ${
                      pinterestStatus.status === 'connected'
                        ? 'bg-[#98A78A]/25 text-[#98A78A] border-[#98A78A]/50'
                        : pinterestStatus.status === 'expired'
                        ? 'bg-amber-950/40 text-[#E8D19E] border-amber-400/40'
                        : 'bg-[#8F5A5A]/25 text-[#BC957D] border-[#8F5A5A]/40'
                    }`}>
                      {pinterestStatus.status === 'connected' ? '● Connesso' : pinterestStatus.status === 'expired' ? 'Scaduto' : '○ Disconnesso'}
                    </span>
                    <label className="hub-toggle" title="Mostra/Nascondi Moodboard nella sidebar">
                      <input
                        type="checkbox"
                        checked={!!enabledSections.pinterest}
                        onChange={(e) => updateSection('pinterest', e.target.checked)}
                      />
                      <span className="hub-toggle-slider"></span>
                    </label>
                  </div>
                </div>

                {/* Inline Login/Disconnect Pinterest */}
                <div className="p-4 border-t border-white/10 bg-[#1e1333]">
                  {pinterestStatus.status === 'connected' ? (
                    <div className="flex items-center justify-between p-3 bg-[#2b1c47] rounded-xl border border-white/10 font-mono text-xs">
                      <span className="text-[#E60023] font-bold">Account: @{pinterestStatus.userName}</span>
                      <button
                        onClick={handleDisconnectPinterest}
                        className="action-pill bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs py-1 px-3"
                      >
                        Disconnetti Pinterest
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleStartPinterestOAuth}
                      disabled={connectingPinterest}
                      className="action-pill bg-[#E60023] hover:bg-[#ff1a3c] text-white font-black w-full justify-center shadow-md text-xs py-2.5"
                    >
                      <Zap className="w-4 h-4 fill-white" />
                      <span>{connectingPinterest ? 'Attendi Browser...' : 'Connetti Pinterest in 1-Click (Browser)'}</span>
                    </button>
                  )}
                </div>
              </div>


              {/* 4. GITHUB SECTION */}
              <div className="bg-[#1e1333] rounded-2xl border border-white/30 overflow-hidden transition-all shadow-md">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-white/10 to-[#1e1333]">
                  <div
                    onClick={() => setGithubExpanded(!githubExpanded)}
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-[#1e1333] border border-white/30 flex items-center justify-center shrink-0 shadow-md">
                      <GithubIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white flex items-center gap-2">
                        GitHub Personal Access Token
                        <ChevronDown className={`w-4 h-4 text-white/70 transition-transform duration-200 ${githubExpanded ? 'rotate-180' : ''}`} />
                      </p>
                      <p className="text-[11px] font-mono text-white/60">
                        {githubUser ? `@${githubUser.login}` : 'Integrazione Repository & Issues'}
                      </p>
                    </div>
                  </div>

                  <span className={`text-xs font-mono font-black px-3 py-1.5 rounded-full border ${
                    githubUser
                      ? 'bg-[#98A78A]/25 text-[#98A78A] border-[#98A78A]/50'
                      : 'bg-[#8F5A5A]/25 text-[#BC957D] border-[#8F5A5A]/40'
                  }`}>
                    {githubUser ? '● Connesso' : '○ Disconnesso'}
                  </span>
                </div>

                {/* Inline Token Form / Account status */}
                <div className="p-4 border-t border-white/10 bg-[#1e1333] flex flex-col gap-3">
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="Token ghp_..."
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                      className="flex-1 bg-[#2b1c47] border border-white/20 text-white font-mono text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-white"
                    />
                    <button
                      onClick={handleSaveGitHubToken}
                      disabled={validatingGh}
                      className="action-pill bg-[#6B5887] hover:bg-[#7A3F67] text-white font-black text-xs py-2 px-4 disabled:opacity-50 shadow-md"
                    >
                      {validatingGh ? 'Verifica...' : 'Connetti'}
                    </button>
                  </div>

                  {githubUser && (
                    <div className="flex items-center gap-3 font-mono text-xs text-[#98A78A] bg-[#2b1c47] p-3 rounded-xl border border-white/10">
                      <img src={githubUser.avatar_url} alt={githubUser.login} className="w-6 h-6 rounded-full border border-[#98A78A]" />
                      <span>Account GitHub collegato: @{githubUser.login}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>



          {/* Local Disk Scan Paths Card - Vibrant Sage & Lavender */}
          <div className="dashboard-card bg-gradient-to-br from-[#2b1c47] to-[#1e1333] border-2 border-[#98A78A]/50 p-7 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#98A78A]/25 pb-3">
              <h2 className="font-heading font-bold text-lg text-white flex items-center gap-3">
                <AestheticImacIcon className="w-8 h-8 shrink-0 filter drop-shadow-md" />
                Percorsi Scansione Disco
              </h2>
              <span className="text-xs font-mono font-bold text-[#98A78A] bg-[#98A78A]/20 px-3 py-1 rounded-full border border-[#98A78A]/40">
                {scanPaths.length} percorsi attivi
              </span>
            </div>

            <form onSubmit={handleAddPath} className="flex gap-3">
              <input
                type="text"
                placeholder="Aggiungi percorso locale..."
                value={newPath}
                onChange={(e) => setNewPath(e.target.value)}
                className="flex-1 bg-[#1e1333] border border-[#98A78A]/30 text-white text-xs font-semibold rounded-2xl px-4 py-3 placeholder-white/40 focus:outline-none focus:border-[#98A78A]"
              />
              <button type="submit" className="action-pill bg-[#98A78A] hover:bg-[#88977A] text-[#15260f] font-black shadow-md">
                <FolderPlus className="w-4 h-4" />
                <span>Aggiungi</span>
              </button>
            </form>

            <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto pr-1">
              {scanPaths.map((p, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-[#1e1333] border border-white/10 flex items-center justify-between font-mono text-xs text-white"
                >
                  <span className="truncate mr-2">{p}</span>
                  <button
                    onClick={() => handleRemovePath(idx)}
                    className="p-1.5 rounded-xl text-white/50 hover:text-[#8F5A5A] transition-colors cursor-pointer"
                    title="Rimuovi percorso"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
