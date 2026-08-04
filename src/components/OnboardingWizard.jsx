import React, { useState } from 'react';
import { Sparkles, User, Key, Github, FolderPlus, CheckCircle2, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';

export default function OnboardingWizard() {
  const { completeOnboarding } = useGamification();
  const [step, setStep] = useState(1);

  // Form states
  const [name, setName] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [aiTesting, setAiTesting] = useState(false);
  const [aiStatus, setAiStatus] = useState(null); // { success: bool, message: string }

  const [githubToken, setGithubToken] = useState('');
  const [ghValidating, setGhValidating] = useState(false);
  const [ghUser, setGhUser] = useState(null); // { login, avatar_url, name }
  const [ghError, setGhError] = useState('');

  // Test AI Key
  const handleTestAiKey = async () => {
    if (!geminiKey.trim()) return;
    setAiTesting(true);
    setAiStatus(null);
    if (window.electronAPI) {
      const res = await window.electronAPI.testAiKey(geminiKey.trim());
      setAiTesting(false);
      setAiStatus(res);
      if (res.success) {
        await window.electronAPI.saveToken('gemini_api_key', geminiKey.trim());
      }
    } else {
      setAiTesting(false);
      setAiStatus({ success: true, message: 'Modalità web demo ok' });
    }
  };

  // Validate GitHub Token
  const handleValidateGitHub = async () => {
    if (!githubToken.trim()) return;
    setGhValidating(true);
    setGhError('');
    setGhUser(null);
    if (window.electronAPI) {
      const res = await window.electronAPI.validateGitHubToken(githubToken.trim());
      setGhValidating(false);
      if (res.valid) {
        setGhUser(res.user);
        await window.electronAPI.saveToken('github', githubToken.trim());
        // If user didn't specify a name, auto-fill from GitHub name
        if (!name.trim() && res.user.name) {
          setName(res.user.name);
        }
      } else {
        setGhError(res.error || 'Token non valido');
      }
    } else {
      setGhValidating(false);
      setGhUser({ login: 'demoUser', name: 'Demo Sviluppatore' });
    }
  };

  const handleFinish = () => {
    const finalName = name.trim() || (ghUser ? ghUser.name || ghUser.login : 'Avventuriero');
    completeOnboarding(finalName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-fadeIn select-none">
      <div className="w-full max-w-2xl dashboard-card bg-[#1a0f30] text-white flex flex-col overflow-hidden shadow-2xl border border-purple-500/30 rounded-3xl">
        
        {/* Header Wizard */}
        <div className="p-6 bg-gradient-to-r from-[#2a134a] to-[#16092b] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-heading font-black text-xl text-white">Benvenuto in epicSnail 🐌✨</h2>
              <p className="text-xs text-purple-200/70 font-mono">Configurazione Iniziale Rapida (Passo {step} di 3)</p>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step ? 'w-8 bg-purple-400' : s < step ? 'w-2 bg-emerald-400' : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 flex-1 flex flex-col gap-6">

          {/* STEP 1: PROFILO & NOME */}
          {step === 1 && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div>
                <h3 className="font-heading font-black text-2xl text-white mb-2 flex items-center gap-2">
                  <User className="w-6 h-6 text-purple-400" />
                  Come ti chiamiamo?
                </h3>
                <p className="text-xs text-purple-200/80 leading-relaxed">
                  Il tuo nome o nickname verrà mostrato nella mascotte e nei messaggi motivazionali del dashboard.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono font-bold text-purple-300 uppercase">Il tuo Nome / Nickname</label>
                <input
                  type="text"
                  placeholder="Es. Clark, Mary, Neo..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/10 border border-white/20 text-white rounded-2xl px-5 py-3.5 font-bold text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                />
              </div>

              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/20 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-purple-200/90 leading-relaxed font-mono">
                  Tutti i tuoi dati restano esclusivamente locali sul tuo PC. Nessuna informazione personale viene inviata a server esterni.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: INTELLIGENZA ARTIFICIALE (GEMINI API KEY) */}
          {step === 2 && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div>
                <h3 className="font-heading font-black text-2xl text-white mb-2 flex items-center gap-2">
                  <Key className="w-6 h-6 text-cyan-400" />
                  Intelligenza Artificiale (BYOK)
                </h3>
                <p className="text-xs text-purple-200/80 leading-relaxed">
                  Inserisci la tua <strong>Google Gemini API Key</strong> gratuita per abilitare l'Agente IA integrato.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono font-bold text-cyan-300 uppercase">Gemini API Key</label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-purple-300 hover:text-white flex items-center gap-1 font-mono underline"
                  >
                    Ottieni chiave gratis su Google AI Studio <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex gap-3">
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    className="flex-1 bg-white/10 border border-white/20 text-white rounded-2xl px-5 py-3.5 font-mono text-xs focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={handleTestAiKey}
                    disabled={aiTesting || !geminiKey.trim()}
                    className="action-pill bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black disabled:opacity-50"
                  >
                    {aiTesting ? 'Verifica...' : 'Test Chiave'}
                  </button>
                </div>

                {aiStatus && (
                  <div className={`p-3.5 rounded-2xl border text-xs font-mono font-bold flex items-center gap-2 ${
                    aiStatus.success ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                  }`}>
                    {aiStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : '❌'}
                    <span>{aiStatus.message || aiStatus.error}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: GITHUB INTEGRATION (PAT) */}
          {step === 3 && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div>
                <h3 className="font-heading font-black text-2xl text-white mb-2 flex items-center gap-2">
                  <Github className="w-6 h-6 text-purple-300" />
                  Connetti GitHub (Opzionale)
                </h3>
                <p className="text-xs text-purple-200/80 leading-relaxed">
                  Incolla un Personal Access Token (PAT) di GitHub per visualizzare le tue repository ed issue reali nell'app.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <input
                  type="password"
                  placeholder="ghp_..."
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  className="bg-white/10 border border-white/20 text-white rounded-2xl px-5 py-3.5 font-mono text-xs focus:outline-none focus:border-purple-400"
                />

                <div className="flex items-center justify-between">
                  <button
                    onClick={handleValidateGitHub}
                    disabled={ghValidating || !githubToken.trim()}
                    className="action-pill bg-purple-500 hover:bg-purple-400 text-white font-bold disabled:opacity-50"
                  >
                    {ghValidating ? 'Verifica...' : 'Valida Token GitHub'}
                  </button>

                  <a
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-purple-300 hover:text-white flex items-center gap-1 font-mono underline"
                  >
                    Genera Token GitHub <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {ghUser && (
                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-4">
                    <img src={ghUser.avatar_url} alt={ghUser.login} className="w-10 h-10 rounded-full border border-emerald-400/50" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{ghUser.name || ghUser.login}</h4>
                      <p className="text-xs text-emerald-300 font-mono">@{ghUser.login} — Connesso con successo!</p>
                    </div>
                  </div>
                )}

                {ghError && (
                  <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono">
                    ⚠️ {ghError}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div className="p-6 bg-black/40 border-t border-white/10 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold font-mono transition-all"
            >
              Indietro
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="action-pill bg-purple-500 hover:bg-purple-400 text-white font-black"
            >
              <span>Continua</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="action-pill bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-4.5 h-4.5" />
              <span>Inizia l'Avventura! 🐌</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
