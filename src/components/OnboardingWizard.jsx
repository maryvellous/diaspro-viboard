import React, { useState } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
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
      setAiStatus({ success: true, message: 'Modalità demo web attiva' });
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
    const finalName = name.trim() || (ghUser ? ghUser.name || ghUser.login : 'Utente');
    completeOnboarding(finalName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#1e1333]/90 backdrop-blur-md select-none">
      <div className="w-full max-w-xl bg-[#2b1c47] text-white flex flex-col overflow-hidden shadow-2xl border border-[#9D85C6]/30 rounded-[28px]">
        
        {/* Header Wizard */}
        <div className="p-7 bg-[#1e1333] border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="font-heading font-black text-2xl text-white">Configurazione Iniziale</h2>
            <p className="text-xs text-[#9D85C6] font-mono mt-1">Passo {step} di 3</p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  s === step ? 'w-8 bg-[#9D85C6]' : s < step ? 'w-2.5 bg-[#98A78A]' : 'w-2.5 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 flex-1 flex flex-col gap-6">

          {/* STEP 1: PROFILO */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="font-heading font-bold text-xl text-white mb-2">
                  Profilo Utente
                </h3>
                <p className="text-xs text-white/70 leading-relaxed font-body">
                  Inserisci il nome da visualizzare all'interno dell'applicazione.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono font-semibold text-[#9D85C6] uppercase tracking-wider">
                  Nome Utente
                </label>
                <input
                  type="text"
                  placeholder="Inserisci il tuo nome..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-black/30 border border-white/20 text-white rounded-2xl px-5 py-3.5 text-sm font-semibold focus:outline-none focus:border-[#9D85C6]"
                />
              </div>

              <div className="p-4 rounded-2xl bg-black/20 border border-white/10 font-mono text-xs text-white/70 leading-relaxed">
                Tutti i dati e le configurazioni rimangono memorizzati esclusivamente in locale sul tuo computer.
              </div>
            </div>
          )}

          {/* STEP 2: INTELLIGENZA ARTIFICIALE (BYOK) */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="font-heading font-bold text-xl text-white mb-2">
                  Configurazione API IA
                </h3>
                <p className="text-xs text-white/70 leading-relaxed font-body">
                  Inserisci la tua Google Gemini API Key per consentire all'agente di elaborare le tue richieste.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono font-semibold text-[#9D85C6] uppercase tracking-wider">
                    Gemini API Key
                  </label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#A5C4DC] hover:underline flex items-center gap-1 font-mono"
                  >
                    Ottieni chiave API <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex gap-3">
                  <input
                    type="password"
                    placeholder="Incolla qui la chiave API..."
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    className="flex-1 bg-black/30 border border-white/20 text-white rounded-2xl px-5 py-3.5 font-mono text-xs focus:outline-none focus:border-[#9D85C6]"
                  />
                  <button
                    onClick={handleTestAiKey}
                    disabled={aiTesting || !geminiKey.trim()}
                    className="action-pill bg-[#9D85C6] hover:bg-[#6B5887] text-white disabled:opacity-50"
                  >
                    {aiTesting ? 'Verifica...' : 'Test Chiave'}
                  </button>
                </div>

                {aiStatus && (
                  <div className={`p-3.5 rounded-2xl border text-xs font-mono font-semibold ${
                    aiStatus.success ? 'bg-[#98A78A]/20 border-[#98A78A] text-[#98A78A]' : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                  }`}>
                    {aiStatus.message || aiStatus.error}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: GITHUB INTEGRATION */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="font-heading font-bold text-xl text-white mb-2">
                  Integrazione GitHub (Opzionale)
                </h3>
                <p className="text-xs text-white/70 leading-relaxed font-body">
                  Inserisci un Personal Access Token per sincronizzare i tuoi repository ed issue.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono font-semibold text-[#9D85C6] uppercase tracking-wider">
                    GitHub Access Token
                  </label>
                  <a
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#A5C4DC] hover:underline flex items-center gap-1 font-mono"
                  >
                    Genera Token <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex gap-3">
                  <input
                    type="password"
                    placeholder="Incolla token ghp_..."
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    className="flex-1 bg-black/30 border border-white/20 text-white rounded-2xl px-5 py-3.5 font-mono text-xs focus:outline-none focus:border-[#9D85C6]"
                  />
                  <button
                    onClick={handleValidateGitHub}
                    disabled={ghValidating || !githubToken.trim()}
                    className="action-pill bg-[#7A3F67] hover:bg-[#6B5887] text-white disabled:opacity-50"
                  >
                    {ghValidating ? 'Verifica...' : 'Valida Token'}
                  </button>
                </div>

                {ghUser && (
                  <div className="p-4 rounded-2xl bg-[#98A78A]/20 border border-[#98A78A]/40 flex items-center gap-3.5">
                    <img src={ghUser.avatar_url} alt={ghUser.login} className="w-9 h-9 rounded-full" />
                    <div className="font-mono text-xs text-white">
                      <p className="font-bold">{ghUser.name || ghUser.login}</p>
                      <p className="text-white/60">@{ghUser.login} (Connesso)</p>
                    </div>
                  </div>
                )}

                {ghError && (
                  <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs font-mono">
                    {ghError}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div className="p-6 bg-[#1e1333] border-t border-white/10 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-all"
            >
              Indietro
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="action-pill bg-[#9D85C6] hover:bg-[#6B5887] text-white"
            >
              <span>Continua</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="action-pill bg-[#7A3F67] hover:bg-[#6B5887] text-white font-bold"
            >
              <span>Completa Setup</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
