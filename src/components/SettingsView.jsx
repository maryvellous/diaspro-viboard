import React, { useState, useEffect } from 'react';
import { 
  Settings, FolderPlus, Trash2, ExternalLink, User, Bot, 
  FolderGit2, Calendar, Music, HardDrive, CheckCircle2, Key, ShieldCheck
} from 'lucide-react';
import { useProjects } from '../context/ProjectsContext';
import { useGamification } from '../context/GamificationContext';

export default function SettingsView() {
  const { refreshProjects } = useProjects();
  const { userName, completeOnboarding } = useGamification();

  const [nameInput, setNameInput] = useState(userName || '');
  const [scanPaths, setScanPaths] = useState([]);
  const [newPath, setNewPath] = useState('');

  // AI Provider states
  const [aiProvider, setAiProvider] = useState('gemini');
  const [aiKey, setAiKey] = useState('');
  const [aiStatus, setAiStatus] = useState(null);
  const [testingAi, setTestingAi] = useState(false);

  const [githubToken, setGithubToken] = useState('');
  const [githubUser, setGithubUser] = useState(null);
  const [validatingGh, setValidatingGh] = useState(false);

  // Google OAuth Credentials
  const [googleClientId, setGoogleClientId] = useState('');
  const [googleClientSecret, setGoogleClientSecret] = useState('');
  const [googleStatus, setGoogleStatus] = useState({ status: 'disconnected', userEmail: '' });

  // Spotify Status
  const [spotifyStatus, setSpotifyStatus] = useState({ status: 'disconnected', userName: '' });

  const providerInfo = {
    gemini: { name: 'Google Gemini', link: 'https://aistudio.google.com/app/apikey', placeholder: 'AIzaSy...' },
    anthropic: { name: 'Anthropic (Claude)', link: 'https://console.anthropic.com/settings/keys', placeholder: 'sk-ant-api...' },
    deepseek: { name: 'DeepSeek', link: 'https://platform.deepseek.com/api_keys', placeholder: 'sk-...' },
    openai: { name: 'OpenAI', link: 'https://platform.openai.com/api-keys', placeholder: 'sk-proj-...' },
    ollama: { name: 'Ollama (Locale)', link: 'https://ollama.com', placeholder: 'http://localhost:11434' },
  };

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
        refreshProjects();
      } else {
        alert(res.error || 'Token non valido');
      }
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

  const handleDisconnectGoogle = async () => {
    if (window.electronAPI) {
      await window.electronAPI.disconnectGoogle();
      setGoogleStatus({ status: 'disconnected', userEmail: '' });
    }
  };

  const handleDisconnectSpotify = async () => {
    if (window.electronAPI) {
      await window.electronAPI.disconnectSpotify();
      setSpotifyStatus({ status: 'disconnected', userName: '' });
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
          <h1 className="font-heading font-black text-3xl text-white flex items-center gap-3">
            <Settings className="w-8 h-8 text-[#9D85C6]" />
            Impostazioni & Connessioni
          </h1>
          <p className="text-xs text-[#A5C4DC] mt-1 font-sans">
            Gestisci profilo, provider IA, token di autenticazione e percorsi di scansione locale
          </p>
        </div>
      </div>

      {/* BALANCED 2-COLUMN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start pb-16">
        
        {/* LEFT COLUMN: User & AI & GitHub */}
        <div className="flex flex-col gap-8">
          
          {/* User Profile Card */}
          <div className="dashboard-card bg-[#2b1c47] border border-[#7A3F67]/40 p-7 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-heading font-bold text-lg text-white flex items-center gap-2.5">
                <User className="w-5 h-5 text-[#E8D19E]" />
                Profilo Utente
              </h2>
              <span className="text-xs font-mono font-bold text-[#A5C4DC] bg-[#1e1333] px-3 py-1 rounded-full border border-white/10">
                Locale
              </span>
            </div>

            <form onSubmit={handleSaveName} className="flex gap-3 pt-1">
              <input
                type="text"
                placeholder="Inserisci il tuo nome..."
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="flex-1 bg-[#1e1333] border border-[#9D85C6]/30 text-white text-sm font-semibold rounded-2xl px-4 py-3 focus:outline-none focus:border-[#9D85C6]"
              />
              <button type="submit" className="action-pill bg-[#6B5887] hover:bg-[#7A3F67] text-white font-bold">
                Salva Nome
              </button>
            </form>
          </div>

          {/* Multi-Provider AI BYOK */}
          <div className="dashboard-card bg-[#2b1c47] border border-[#7A3F67]/40 p-7 flex flex-col gap-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-heading font-bold text-lg text-white flex items-center gap-2.5">
                <Bot className="w-5 h-5 text-[#E8D19E]" />
                Configurazione IA (Multi-Provider BYOK)
              </h2>
              <ShieldCheck className="w-5 h-5 text-[#98A78A]" />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono font-bold text-[#9D85C6] uppercase tracking-wider">
                  Provider Selezionato
                </label>
                <select
                  value={aiProvider}
                  onChange={handleProviderChange}
                  className="bg-[#1e1333] border border-[#9D85C6]/40 text-white rounded-2xl px-4 py-3 font-bold text-sm focus:outline-none focus:border-[#9D85C6] cursor-pointer"
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
                    <label className="text-xs font-mono font-bold text-[#9D85C6] uppercase tracking-wider">
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
                      className="flex-1 bg-[#1e1333] border border-[#9D85C6]/30 text-white font-mono text-xs rounded-2xl px-4 py-3 focus:outline-none focus:border-[#9D85C6]"
                    />
                    <button
                      onClick={handleSaveAiKey}
                      disabled={testingAi}
                      className="action-pill bg-[#6B5887] hover:bg-[#7A3F67] text-white font-bold disabled:opacity-50"
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

          {/* GitHub Integration */}
          <div className="dashboard-card bg-[#2b1c47] border border-[#7A3F67]/40 p-7 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-heading font-bold text-lg text-white flex items-center gap-2.5">
                <FolderGit2 className="w-5 h-5 text-[#E8D19E]" />
                GitHub Personal Access Token
              </h2>
              {githubUser && (
                <span className="text-xs font-mono font-bold text-[#98A78A] bg-[#98A78A]/20 px-3 py-1 rounded-full border border-[#98A78A]/40">
                  Connesso
                </span>
              )}
            </div>

            <div className="flex gap-3">
              <input
                type="password"
                placeholder="Token ghp_..."
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                className="flex-1 bg-[#1e1333] border border-[#9D85C6]/30 text-white font-mono text-xs rounded-2xl px-4 py-3 focus:outline-none focus:border-[#9D85C6]"
              />
              <button
                onClick={handleSaveGitHubToken}
                disabled={validatingGh}
                className="action-pill bg-[#7A3F67] hover:bg-[#6B5887] text-white font-bold disabled:opacity-50"
              >
                {validatingGh ? 'Verifica...' : 'Connetti'}
              </button>
            </div>

            {githubUser && (
              <div className="flex items-center gap-3 font-mono text-xs text-[#98A78A] bg-[#1e1333] p-3 rounded-2xl border border-white/10">
                <img src={githubUser.avatar_url} alt={githubUser.login} className="w-6 h-6 rounded-full" />
                <span>Account collegato: @{githubUser.login}</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Google & Spotify & Scan Paths */}
        <div className="flex flex-col gap-8">

          {/* Google Workspace Credentials */}
          <div className="dashboard-card bg-[#2b1c47] border border-[#7A3F67]/40 p-7 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-heading font-bold text-lg text-white flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-[#E8D19E]" />
                Google Workspace (OAuth 2.0 PKCE)
              </h2>
              {googleStatus.status === 'connected' && (
                <span className="text-xs font-mono font-bold text-[#98A78A] bg-[#98A78A]/20 px-3 py-1 rounded-full border border-[#98A78A]/40">
                  Attivo
                </span>
              )}
            </div>

            <p className="text-xs text-[#A5C4DC] font-sans leading-relaxed">
              Configura il tuo Google Client ID (dalla Google Cloud Console) per abilitare Calendar & Tasks.
            </p>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Google Client ID (.apps.googleusercontent.com)"
                value={googleClientId}
                onChange={(e) => setGoogleClientId(e.target.value)}
                className="bg-[#1e1333] border border-[#9D85C6]/30 text-white font-mono text-xs rounded-2xl px-4 py-3 focus:outline-none focus:border-[#9D85C6]"
              />
              <input
                type="password"
                placeholder="Google Client Secret (Opzionale PKCE)"
                value={googleClientSecret}
                onChange={(e) => setGoogleClientSecret(e.target.value)}
                className="bg-[#1e1333] border border-[#9D85C6]/30 text-white font-mono text-xs rounded-2xl px-4 py-3 focus:outline-none focus:border-[#9D85C6]"
              />

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={handleSaveGoogleCredentials}
                  className="action-pill bg-[#6B5887] hover:bg-[#7A3F67] text-white font-bold"
                >
                  Salva Credenziali
                </button>

                {googleStatus.status === 'connected' && (
                  <button
                    onClick={handleDisconnectGoogle}
                    className="action-pill bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs"
                  >
                    Disconnetti ({googleStatus.userEmail})
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Spotify Integration Status */}
          <div className="dashboard-card bg-[#2b1c47] border border-[#7A3F67]/40 p-7 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-heading font-bold text-lg text-white flex items-center gap-2.5">
                <Music className="w-5 h-5 text-[#E8D19E]" />
                Spotify Player Status
              </h2>
              <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                spotifyStatus.status === 'connected'
                  ? 'text-[#98A78A] bg-[#98A78A]/20 border-[#98A78A]/40'
                  : 'text-gray-400 bg-black/30 border-white/10'
              }`}>
                {spotifyStatus.status === 'connected' ? 'Connesso' : 'Disconnesso'}
              </span>
            </div>

            {spotifyStatus.status === 'connected' ? (
              <div className="flex justify-between items-center p-3.5 bg-[#1e1333] rounded-2xl border border-white/10">
                <span className="text-xs font-mono text-[#E8D19E]">Account: {spotifyStatus.userName}</span>
                <button
                  onClick={handleDisconnectSpotify}
                  className="action-pill bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs"
                >
                  Disconnetti
                </button>
              </div>
            ) : (
              <p className="text-xs text-[#A5C4DC] font-sans">
                Connettiti tramite la scheda Spotify nella Sidebar per controllare la riproduzione in background.
              </p>
            )}
          </div>

          {/* Local Disk Scan Paths */}
          <div className="dashboard-card bg-[#2b1c47] border border-[#7A3F67]/40 p-7 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-heading font-bold text-lg text-white flex items-center gap-2.5">
                <HardDrive className="w-5 h-5 text-[#E8D19E]" />
                Percorsi Scansione Disco
              </h2>
              <span className="text-xs font-mono font-bold text-[#A5C4DC] bg-[#1e1333] px-3 py-1 rounded-full border border-white/10">
                {scanPaths.length} percorsi
              </span>
            </div>

            <form onSubmit={handleAddPath} className="flex gap-3">
              <input
                type="text"
                placeholder="Aggiungi percorso locale..."
                value={newPath}
                onChange={(e) => setNewPath(e.target.value)}
                className="flex-1 bg-[#1e1333] border border-[#9D85C6]/30 text-white text-xs font-semibold rounded-2xl px-4 py-3 placeholder-white/40 focus:outline-none focus:border-[#9D85C6]"
              />
              <button type="submit" className="action-pill bg-[#98A78A] hover:bg-[#88977A] text-[#15260f] font-bold">
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
                    className="p-1.5 rounded-xl text-gray-400 hover:text-rose-400 transition-colors cursor-pointer"
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
