import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Send, Sparkles, Sliders, CheckCircle, XCircle, 
  Trash2, Calendar, FolderGit2, Music, ChevronDown,
  CornerDownLeft, ShieldCheck
} from 'lucide-react';

const PROVIDER_TIERS = {
  gemini: [
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
  ],
  anthropic: [
    { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
    { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku' },
    { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
  ],
  openai: [
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
    { id: 'gpt-4o', name: 'GPT-4o' },
    { id: 'o3-mini', name: 'o3-Mini' },
  ],
  deepseek: [
    { id: 'deepseek-chat', name: 'DeepSeek V4-Flash' },
    { id: 'deepseek-reasoner', name: 'DeepSeek V4 Reasoner' },
  ],
  ollama: [
    { id: 'llama3', name: 'Ollama Llama 3' },
    { id: 'mistral', name: 'Ollama Mistral' },
    { id: 'qwen', name: 'Ollama Qwen' },
  ]
};

const SLASH_COMMANDS = [
  { command: '/calendar', label: 'Mostra eventi Google Calendar', icon: Calendar, prompt: 'Mostrami i miei prossimi eventi su Google Calendar.' },
  { command: '/github', label: 'Mostra repository e issue aperte', icon: FolderGit2, prompt: 'Elenca le mie issue aperte ed i repository GitHub.' },
  { command: '/spotify', label: 'Stato riproduzione musica', icon: Music, prompt: 'Qual è il brano attualmente in riproduzione su Spotify?' },
  { command: '/clear', label: 'Cancella la cronologia della chat', icon: Trash2, action: 'clear' },
];

export default function ChatPanel() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Ciao! Sono **epicSnail Chat Assistant**. Come posso aiutarti oggi con la tua produttività, i tuoi progetti o la tua musica?'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Settings & Tiers
  const [activeProvider, setActiveProvider] = useState('gemini');
  const [activeTier, setActiveTier] = useState('gemini-2.5-flash');
  
  // Context Modal
  const [isContextModalOpen, setIsContextModalOpen] = useState(false);
  const [contextHeader, setContextHeader] = useState('');
  const [contextSavedMessage, setContextSavedMessage] = useState(false);

  // Slash menu UI
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashFilter, setSlashFilter] = useState('');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getStoreData().then(store => {
        if (store?.selectedProvider) {
          setActiveProvider(store.selectedProvider);
          const defaultTier = PROVIDER_TIERS[store.selectedProvider]?.[0]?.id;
          if (defaultTier) setActiveTier(defaultTier);
        }
      });

      window.electronAPI.getContextHeader().then(header => {
        if (header) setContextHeader(header);
      });
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleProviderChange = (prov) => {
    setActiveProvider(prov);
    const tiers = PROVIDER_TIERS[prov] || [];
    if (tiers.length > 0) setActiveTier(tiers[0].id);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputText(val);

    if (val.startsWith('/')) {
      setShowSlashMenu(true);
      setSlashFilter(val.toLowerCase());
    } else {
      setShowSlashMenu(false);
    }
  };

  const executeSlashCommand = (cmd) => {
    setShowSlashMenu(false);
    if (cmd.action === 'clear') {
      setMessages([
        {
          id: `msg_${Date.now()}`,
          role: 'assistant',
          content: 'Cronologia chat cancellata.'
        }
      ]);
      setInputText('');
      return;
    }

    if (cmd.prompt) {
      sendMessage(cmd.prompt);
    }
  };

  const sendMessage = async (overrideText = null) => {
    const textToSend = overrideText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: textToSend.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setShowSlashMenu(false);
    setIsLoading(true);

    try {
      const history = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await window.electronAPI.sendChatMessage({
        provider: activeProvider,
        modelTier: activeTier,
        messages: history
      });

      if (res.success) {
        const assistantMsg = {
          id: `asst_${Date.now()}`,
          role: 'assistant',
          content: res.text,
          pendingAction: res.pendingAction ? { ...res.pendingAction, status: 'pending' } : null
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: `err_${Date.now()}`,
            role: 'assistant',
            content: `⚠️ **Errore:** ${res.error || 'Impossibile completare la richiesta.'}`
          }
        ]);
      }
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: `⚠️ **Errore di connessione:** ${e.message}`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveAction = async (msgId, action) => {
    setMessages(prev => prev.map(m => {
      if (m.id === msgId && m.pendingAction) {
        return {
          ...m,
          pendingAction: { ...m.pendingAction, status: 'executing' }
        };
      }
      return m;
    }));

    try {
      const res = await window.electronAPI.executeTool(action.toolName, action.params);
      
      setMessages(prev => prev.map(m => {
        if (m.id === msgId && m.pendingAction) {
          return {
            ...m,
            pendingAction: {
              ...m.pendingAction,
              status: res.success ? 'completed' : 'error',
              result: res
            }
          };
        }
        return m;
      }));

      if (res.success) {
        setMessages(prev => [
          ...prev,
          {
            id: `sys_${Date.now()}`,
            role: 'assistant',
            content: `✅ **Azione eseguita con successo!**\n\`\`\`json\n${JSON.stringify(res, null, 2)}\n\`\`\``
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: `sys_${Date.now()}`,
            role: 'assistant',
            content: `❌ **Errore durante l'esecuzione dell'azione:** ${res.error}`
          }
        ]);
      }
    } catch (err) {
      setMessages(prev => prev.map(m => {
        if (m.id === msgId && m.pendingAction) {
          return {
            ...m,
            pendingAction: { ...m.pendingAction, status: 'error', result: { error: err.message } }
          };
        }
        return m;
      }));
    }
  };

  const handleCancelAction = (msgId) => {
    setMessages(prev => prev.map(m => {
      if (m.id === msgId && m.pendingAction) {
        return {
          ...m,
          pendingAction: { ...m.pendingAction, status: 'cancelled' }
        };
      }
      return m;
    }));
  };

  const handleSaveContext = async () => {
    if (window.electronAPI) {
      await window.electronAPI.saveContextHeader(contextHeader);
      setContextSavedMessage(true);
      setTimeout(() => setContextSavedMessage(false), 2000);
    }
  };

  const filteredSlashCommands = SLASH_COMMANDS.filter(cmd => 
    cmd.command.toLowerCase().includes(slashFilter) || cmd.label.toLowerCase().includes(slashFilter)
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1e1333] text-white relative overflow-hidden select-none">
      {/* HEADER CHAT - Uses #2b1c47 & #6B5887 */}
      <header className="h-16 px-6 bg-[#2b1c47] border-b border-[#7A3F67]/50 flex items-center justify-between z-20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#7A3F67] flex items-center justify-center shadow-md border border-[#9D85C6]/30">
            <Sparkles className="w-5 h-5 text-[#E8D19E] animate-pulse" />
          </div>
          <div>
            <h1 className="font-heading font-black text-lg text-white leading-tight flex items-center gap-2">
              Interfaccia Chat
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#7A3F67] border border-[#9D85C6]/40 text-[#E8D19E]">
                Fase 4
              </span>
            </h1>
            <p className="text-xs text-[#9D85C6]">Client dedicato & Assistente integrato epicSnail</p>
          </div>
        </div>

        {/* CONTROLS HEADER */}
        <div className="flex items-center gap-3">
          {/* Provider Selector */}
          <div className="relative">
            <select
              value={activeProvider}
              onChange={(e) => handleProviderChange(e.target.value)}
              className="appearance-none bg-[#1e1333] text-[#A5C4DC] border border-[#9D85C6]/40 hover:border-[#9D85C6] rounded-2xl px-3.5 py-1.5 pr-8 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#9D85C6] cursor-pointer shadow-inner"
            >
              <option value="gemini">Google Gemini</option>
              <option value="anthropic">Anthropic Claude</option>
              <option value="openai">OpenAI GPT</option>
              <option value="deepseek">DeepSeek</option>
              <option value="ollama">Ollama (Locale)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#A5C4DC] absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Active Tier Selector */}
          <div className="relative">
            <select
              value={activeTier}
              onChange={(e) => setActiveTier(e.target.value)}
              className="appearance-none bg-[#7A3F67] text-[#E8D19E] border border-[#E8D19E]/40 hover:border-[#E8D19E] rounded-2xl px-3.5 py-1.5 pr-8 text-xs font-black focus:outline-none focus:ring-2 focus:ring-[#E8D19E] cursor-pointer shadow-md"
            >
              {(PROVIDER_TIERS[activeProvider] || []).map(t => (
                <option key={t.id} value={t.id} className="bg-[#2b1c47] text-white font-normal">
                  {t.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#E8D19E] absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Context Config Button */}
          <button
            onClick={() => setIsContextModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-[#6B5887] hover:bg-[#7A3F67] border border-white/20 text-xs font-bold text-white transition-all cursor-pointer shadow-md active:scale-95"
            title="Configurazione Contesto & System Prompt"
          >
            <Sliders className="w-4 h-4 text-[#E8D19E]" />
            <span className="hidden sm:inline">Contesto</span>
          </button>
        </div>
      </header>

      {/* CHAT MESSAGES STREAM */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 flex flex-col items-center">
        <div className="w-full max-w-3xl space-y-6">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 animate-fadeIn ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-10 h-10 rounded-2xl bg-[#6B5887] border border-[#9D85C6]/40 flex items-center justify-center shadow-lg shrink-0 mt-1">
                    <Bot className="w-5 h-5 text-[#E8D19E]" />
                  </div>
                )}

                <div className="max-w-[85%] sm:max-w-[78%] space-y-3">
                  {/* Message Bubble */}
                  <div
                    className={`p-4 rounded-3xl text-sm leading-relaxed shadow-xl border ${
                      isUser
                        ? 'bg-[#7A3F67] text-white border-[#9D85C6]/40 rounded-tr-sm'
                        : 'bg-[#2b1c47] text-[#E8D19E]/95 border-white/10 rounded-tl-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans break-words">
                      {msg.content}
                    </div>
                  </div>

                  {/* HUMAN-IN-THE-LOOP ACTION CARD */}
                  {msg.pendingAction && (
                    <div className="p-4 rounded-2xl bg-[#2b1c47] border-2 border-[#E8D19E]/60 shadow-2xl space-y-3">
                      <div className="flex items-center gap-2 text-[#E8D19E] font-bold text-xs">
                        <ShieldCheck className="w-4 h-4 text-[#E8D19E]" />
                        Richiesta di Approvazione Esecuzione (Human-in-the-Loop)
                      </div>

                      <div className="text-xs text-white bg-[#1e1333] p-3 rounded-xl border border-white/10 font-mono">
                        <p className="font-semibold text-[#E8D19E] mb-1">{msg.pendingAction.description}</p>
                        <span className="text-[11px] text-[#A5C4DC]">Tool: {msg.pendingAction.toolName}</span>
                      </div>

                      {/* ACTION BUTTONS & STATUS */}
                      {msg.pendingAction.status === 'pending' && (
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => handleApproveAction(msg.id, msg.pendingAction)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-[#98A78A] hover:bg-[#88977A] text-[#15260f] font-black text-xs shadow-lg transition-all cursor-pointer active:scale-95"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approva ed Esegui
                          </button>
                          <button
                            onClick={() => handleCancelAction(msg.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-gray-300 font-bold text-xs shadow-sm transition-all cursor-pointer active:scale-95"
                          >
                            <XCircle className="w-4 h-4 text-red-300" />
                            Annulla
                          </button>
                        </div>
                      )}

                      {msg.pendingAction.status === 'executing' && (
                        <div className="text-xs text-[#E8D19E] font-medium flex items-center gap-2 py-1">
                          <span className="w-3 h-3 border-2 border-[#E8D19E] border-t-transparent rounded-full animate-spin"></span>
                          Esecuzione in corso...
                        </div>
                      )}

                      {msg.pendingAction.status === 'completed' && (
                        <div className="text-xs text-[#98A78A] font-bold flex items-center gap-1.5 py-1">
                          <CheckCircle className="w-4 h-4" />
                          Azione eseguita con successo!
                        </div>
                      )}

                      {msg.pendingAction.status === 'cancelled' && (
                        <div className="text-xs text-gray-400 font-medium flex items-center gap-1.5 py-1">
                          <XCircle className="w-4 h-4 text-gray-500" />
                          Azione annullata dall'utente.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center animate-pulse">
              <div className="w-10 h-10 rounded-2xl bg-[#6B5887]/60 flex items-center justify-center">
                <Bot className="w-5 h-5 text-[#E8D19E]/70" />
              </div>
              <div className="p-3 rounded-2xl bg-[#2b1c47] border border-[#9D85C6]/30 text-xs text-[#9D85C6] flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#9D85C6] rounded-full animate-ping"></span>
                Elaborazione risposta in corso...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* INPUT AREA & SLASH MENU */}
      <div className="p-4 sm:p-6 bg-[#2b1c47] border-t border-[#7A3F67]/40 z-20 flex justify-center shadow-2xl">
        <div className="w-full max-w-3xl relative">
          
          {/* SLASH COMMANDS MENU POPUP */}
          {showSlashMenu && filteredSlashCommands.length > 0 && (
            <div className="absolute bottom-full mb-3 left-0 w-full bg-[#2b1c47] border-2 border-[#9D85C6]/50 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-white/10 animate-fadeIn">
              <div className="px-4 py-2 bg-[#1e1333] text-[11px] font-bold text-[#E8D19E] uppercase tracking-wider flex items-center justify-between">
                <span>Comandi Rapidi (Slash Commands)</span>
                <span className="text-[#9D85C6] font-normal">Premi invio o seleziona</span>
              </div>
              {filteredSlashCommands.map((cmd) => {
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.command}
                    onClick={() => executeSlashCommand(cmd)}
                    className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-[#6B5887]/40 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#7A3F67] border border-[#9D85C6]/40 flex items-center justify-center text-[#E8D19E] group-hover:scale-110 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-mono font-bold text-sm text-[#E8D19E] group-hover:text-white mr-2">{cmd.command}</span>
                        <span className="text-xs text-[#A5C4DC]">{cmd.label}</span>
                      </div>
                    </div>
                    <CornerDownLeft className="w-4 h-4 text-[#9D85C6] group-hover:text-white" />
                  </button>
                );
              })}
            </div>
          )}

          {/* INPUT BAR */}
          <div className="flex items-center gap-2 bg-[#1e1333] border border-[#9D85C6]/40 focus-within:border-[#9D85C6] rounded-full p-2 shadow-2xl transition-all">
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Scrivi un messaggio o digita / per i comandi rapidi..."
              className="flex-1 bg-transparent border-none text-white text-sm px-4 focus:outline-none placeholder-[#9D85C6]/50 font-sans"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!inputText.trim() || isLoading}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
                inputText.trim() && !isLoading
                  ? 'bg-[#6B5887] hover:bg-[#7A3F67] text-white hover:scale-105 active:scale-95 border border-white/20'
                  : 'bg-white/10 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* CONTEXT CONFIGURATION MODAL */}
      {isContextModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#2b1c47] border border-[#9D85C6]/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#E8D19E]" />
                <h3 className="font-heading font-black text-lg text-white">Configurazione Contesto AI</h3>
              </div>
              <button
                onClick={() => setIsContextModalOpen(false)}
                className="text-gray-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#A5C4DC] leading-relaxed">
              Definisci le **Stringhe di Inizializzazione (Context Header / System Instructions)** da allegare a ogni richiesta inviata al provider attivo.
            </p>

            <textarea
              rows={6}
              value={contextHeader}
              onChange={(e) => setContextHeader(e.target.value)}
              placeholder="Inserisci qui le istruzioni di contesto predefinite..."
              className="w-full bg-[#1e1333] border border-[#9D85C6]/40 focus:border-[#9D85C6] rounded-2xl p-4 text-xs text-white focus:outline-none resize-none font-mono"
            />

            {contextSavedMessage && (
              <div className="text-xs text-[#98A78A] font-bold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                Configurazione contesto salvata!
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsContextModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-gray-300 cursor-pointer"
              >
                Chiudi
              </button>
              <button
                onClick={handleSaveContext}
                className="px-5 py-2 rounded-xl bg-[#6B5887] hover:bg-[#7A3F67] text-xs font-bold text-white shadow-lg cursor-pointer border border-white/20"
              >
                Salva Contesto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
