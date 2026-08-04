import React, { useState, useEffect } from 'react';
import { Settings, FolderPlus, Trash2, Key, Github, User, Check, RefreshCw } from 'lucide-react';
import { useProjects } from '../context/ProjectsContext';
import { useGamification } from '../context/GamificationContext';

export default function SettingsView() {
  const { refreshProjects } = useProjects();
  const { userName, setUserName, completeOnboarding } = useGamification();

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
          Impostazioni epicSnail
        </h1>
      </div>

      <div className="max-w-3xl flex flex-col gap-8 pb-12">
        
        {/* User Profile */}
        <div className="dashboard-card bg-white/10 border border-white/15 p-7 flex flex-col gap-4">
          <h2 className="font-heading font-black text-xl text-white flex items-center gap-2">
            <User className="w-5 h-5 text-purple-300" />
            Profilo Utente
          </h2>
          <form onSubmit={handleSaveName} className="flex gap-3">
            <input
              type="text"
              placeholder="Nome da mostrare..."
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="flex-1 bg-black/40 border border-white/20 text-white text-sm font-bold rounded-2xl px-5 py-3"
            />
            <button type="submit" className="action-pill bg-purple-500 hover:bg-purple-400 text-white font-bold">
              Salva Nome
            </button>
          </form>
        </div>

        {/* AI Key */}
        <div className="dashboard-card bg-white/10 border border-white/15 p-7 flex flex-col gap-4">
          <h2 className="font-heading font-black text-xl text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-cyan-300" />
            Google Gemini API Key (IA Vault)
          </h2>
          <div className="flex gap-3">
            <input
              type="password"
              placeholder="Chiave Gemini (AIzaSy...)"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="flex-1 bg-black/40 border border-white/20 text-white font-mono text-xs rounded-2xl px-5 py-3"
            />
            <button
              onClick={handleSaveGeminiKey}
              disabled={testingGemini}
              className="action-pill bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black"
            >
              {testingGemini ? 'Test...' : 'Salva & Test'}
            </button>
          </div>
          {geminiStatus && (
            <p className={`text-xs font-mono font-bold ${geminiStatus.success ? 'text-emerald-300' : 'text-rose-300'}`}>
              {geminiStatus.success ? `✅ ${geminiStatus.message}` : `❌ ${geminiStatus.error}`}
            </p>
          )}
        </div>

        {/* GitHub PAT */}
        <div className="dashboard-card bg-white/10 border border-white/15 p-7 flex flex-col gap-4">
          <h2 className="font-heading font-black text-xl text-white flex items-center gap-2">
            <Github className="w-5 h-5 text-purple-300" />
            GitHub Personal Access Token
          </h2>
          <div className="flex gap-3">
            <input
              type="password"
              placeholder="ghp_..."
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              className="flex-1 bg-black/40 border border-white/20 text-white font-mono text-xs rounded-2xl px-5 py-3"
            />
            <button
              onClick={handleSaveGitHubToken}
              disabled={validatingGh}
              className="action-pill bg-purple-500 hover:bg-purple-400 text-white font-bold"
            >
              {validatingGh ? 'Verifica...' : 'Connetti GitHub'}
            </button>
          </div>
          {githubUser && (
            <div className="flex items-center gap-3 font-mono text-xs text-emerald-300 bg-emerald-950/40 p-3 rounded-2xl border border-emerald-500/30">
              <img src={githubUser.avatar_url} alt={githubUser.login} className="w-6 h-6 rounded-full" />
              <span>Connesso come @{githubUser.login}</span>
            </div>
          )}
        </div>

        {/* Scan Paths */}
        <div className="dashboard-card bg-white/10 border border-white/15 p-7 flex flex-col gap-4">
          <h2 className="font-heading font-black text-xl text-white flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-emerald-300" />
            Percorsi Scansione Disco
          </h2>
          <form onSubmit={handleAddPath} className="flex gap-3">
            <input
              type="text"
              placeholder="Aggiungi percorso (es. C:\Projects)..."
              value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
              className="flex-1 bg-black/40 border border-white/20 text-white text-xs font-bold rounded-2xl px-5 py-3 placeholder-white/40"
            />
            <button type="submit" className="action-pill bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold">
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
