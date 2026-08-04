import React, { useState, useEffect } from 'react';
import { Settings, FolderPlus, Trash2 } from 'lucide-react';
import { useProjects } from '../context/ProjectsContext';
import { useGamification } from '../context/GamificationContext';

export default function SettingsView() {
  const { refreshProjects } = useProjects();
  const { userName, completeOnboarding } = useGamification();

  const [nameInput, setNameInput] = useState(userName || '');
  const [scanPaths, setScanPaths] = useState([]);
  const [newPath, setNewPath] = useState('');

  // Key states
  const [geminiKey, setGeminiKey] = useState('');
  const [geminiStatus, setGeminiStatus] = useState(null);
  const [testingGemini, setTestingGemini] = useState(false);

  const [githubToken, setGithubToken] = useState('');
  const [githubUser, setGithubUser] = useState(null);
  const [validatingGh, setValidatingGh] = useState(false);

  // Google OAuth Credentials
  const [googleClientId, setGoogleClientId] = useState('');
  const [googleClientSecret, setGoogleClientSecret] = useState('');
  const [googleStatus, setGoogleStatus] = useState({ status: 'disconnected', userEmail: '' });

  useEffect(() => {
    setNameInput(userName);

    if (window.electronAPI) {
      window.electronAPI.getStoreData().then((data) => {
        if (data && data.scanPaths) {
          setScanPaths(data.scanPaths);
        }
      });

      // Load keys from Vault
      window.electronAPI.getToken('gemini_api_key').then((k) => {
        if (k) setGeminiKey(k);
      });
      window.electronAPI.getToken('github').then((t) => {
        if (t) {
          setGithubToken(t);
          window.electronAPI.validateGitHubToken(t).then((res) => {
            if (res.valid) setGithubUser(res.user);
          });
        }
      });

      // Load Google Client ID & Status
      window.electronAPI.getToken('google_client_id').then((cid) => {
        if (cid) setGoogleClientId(cid);
      });
      window.electronAPI.getToken('google_client_secret').then((cs) => {
        if (cs) setGoogleClientSecret(cs);
      });
      window.electronAPI.getGoogleStatus().then((st) => {
        if (st) setGoogleStatus(st);
      });
    }
  }, [userName]);

  const handleSaveName = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    completeOnboarding(nameInput.trim());
  };

  const handleSaveGeminiKey = async () => {
    if (!geminiKey.trim()) return;
    setTestingGemini(true);
    setGeminiStatus(null);
    if (window.electronAPI) {
      const res = await window.electronAPI.testAiKey(geminiKey.trim());
      setTestingGemini(false);
      setGeminiStatus(res);
      if (res.success) {
        await window.electronAPI.saveToken('gemini_api_key', geminiKey.trim());
      }
    } else {
      setTestingGemini(false);
      setGeminiStatus({ success: true, message: 'Demo Web OK' });
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading font-black text-3xl text-white flex items-center gap-3">
          <Settings className="w-7 h-7 text-[#9D85C6]" />
          Impostazioni
        </h1>
      </div>

      <div className="max-w-3xl flex flex-col gap-6 pb-12">
        
        {/* User Profile */}
        <div className="dashboard-card bg-[#2b1c47] border border-white/10 p-7 flex flex-col gap-4">
          <h2 className="font-heading font-bold text-lg text-white">
            Profilo Utente
          </h2>
          <form onSubmit={handleSaveName} className="flex gap-3">
            <input
              type="text"
              placeholder="Inserisci il tuo nome..."
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="flex-1 bg-black/30 border border-white/20 text-white text-sm font-semibold rounded-2xl px-5 py-3 focus:outline-none focus:border-[#9D85C6]"
            />
            <button type="submit" className="action-pill bg-[#9D85C6] hover:bg-[#6B5887] text-white">
              Salva
            </button>
          </form>
        </div>

        {/* AI Key */}
        <div className="dashboard-card bg-[#2b1c47] border border-white/10 p-7 flex flex-col gap-4">
          <h2 className="font-heading font-bold text-lg text-white">
            Google Gemini API Key
          </h2>
          <div className="flex gap-3">
            <input
              type="password"
              placeholder="Chiave API..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="flex-1 bg-black/30 border border-white/20 text-white font-mono text-xs rounded-2xl px-5 py-3 focus:outline-none focus:border-[#9D85C6]"
            />
            <button
              onClick={handleSaveGeminiKey}
              disabled={testingGemini}
              className="action-pill bg-[#9D85C6] hover:bg-[#6B5887] text-white disabled:opacity-50"
            >
              {testingGemini ? 'Verifica...' : 'Salva & Test'}
            </button>
          </div>
          {geminiStatus && (
            <p className={`text-xs font-mono font-semibold ${geminiStatus.success ? 'text-[#98A78A]' : 'text-rose-300'}`}>
              {geminiStatus.message || geminiStatus.error}
            </p>
          )}
        </div>

        {/* GitHub PAT */}
        <div className="dashboard-card bg-[#2b1c47] border border-white/10 p-7 flex flex-col gap-4">
          <h2 className="font-heading font-bold text-lg text-white">
            GitHub Personal Access Token
          </h2>
          <div className="flex gap-3">
            <input
              type="password"
              placeholder="Token ghp_..."
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              className="flex-1 bg-black/30 border border-white/20 text-white font-mono text-xs rounded-2xl px-5 py-3 focus:outline-none focus:border-[#9D85C6]"
            />
            <button
              onClick={handleSaveGitHubToken}
              disabled={validatingGh}
              className="action-pill bg-[#7A3F67] hover:bg-[#6B5887] text-white disabled:opacity-50"
            >
              {validatingGh ? 'Verifica...' : 'Connetti'}
            </button>
          </div>
          {githubUser && (
            <div className="flex items-center gap-3 font-mono text-xs text-[#98A78A] bg-black/20 p-3 rounded-2xl border border-white/10">
              <img src={githubUser.avatar_url} alt={githubUser.login} className="w-6 h-6 rounded-full" />
              <span>Connesso come @{githubUser.login}</span>
            </div>
          )}
        </div>

        {/* Google Workspace Config */}
        <div className="dashboard-card bg-[#2b1c47] border border-white/10 p-7 flex flex-col gap-4">
          <h2 className="font-heading font-bold text-lg text-white">
            Google Workspace Credentials (OAuth 2.0 PKCE)
          </h2>
          <p className="text-xs text-white/70 font-mono">
            Inserisci il tuo Google Client ID (dalla Google Cloud Console) per autorizzare l'accesso a Calendar & Tasks.
          </p>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Google Client ID (.apps.googleusercontent.com)"
              value={googleClientId}
              onChange={(e) => setGoogleClientId(e.target.value)}
              className="bg-black/30 border border-white/20 text-white font-mono text-xs rounded-2xl px-5 py-3 focus:outline-none focus:border-[#9D85C6]"
            />
            <input
              type="password"
              placeholder="Google Client Secret (Opzionale per PKCE)"
              value={googleClientSecret}
              onChange={(e) => setGoogleClientSecret(e.target.value)}
              className="bg-black/30 border border-white/20 text-white font-mono text-xs rounded-2xl px-5 py-3 focus:outline-none focus:border-[#9D85C6]"
            />
            <div className="flex justify-between items-center mt-1">
              <button
                onClick={handleSaveGoogleCredentials}
                className="action-pill bg-[#9D85C6] hover:bg-[#6B5887] text-white"
              >
                Salva Credenziali Google
              </button>

              {googleStatus.status === 'connected' && (
                <button
                  onClick={handleDisconnectGoogle}
                  className="action-pill bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs"
                >
                  Disconnetti Google ({googleStatus.userEmail})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Scan Paths */}
        <div className="dashboard-card bg-[#2b1c47] border border-white/10 p-7 flex flex-col gap-4">
          <h2 className="font-heading font-bold text-lg text-white">
            Percorsi Scansione Disco
          </h2>
          <form onSubmit={handleAddPath} className="flex gap-3">
            <input
              type="text"
              placeholder="Aggiungi percorso..."
              value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
              className="flex-1 bg-black/30 border border-white/20 text-white text-xs font-semibold rounded-2xl px-5 py-3 placeholder-white/40 focus:outline-none focus:border-[#9D85C6]"
            />
            <button type="submit" className="action-pill bg-[#98A78A] hover:bg-[#6B5887] text-white">
              <FolderPlus className="w-4 h-4" />
              <span>Aggiungi</span>
            </button>
          </form>

          <div className="flex flex-col gap-2.5">
            {scanPaths.map((p, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-between font-mono text-xs text-white"
              >
                <span>{p}</span>
                <button
                  onClick={() => handleRemovePath(idx)}
                  className="p-2 rounded-xl text-white/50 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
