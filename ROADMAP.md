# Roadmap Progetto epicSnail: Integrazioni & Multi-Provider AI Engine

Questo documento stabilisce la roadmap incrementale aggiornata del progetto **epicSnail**.

---

## 🚦 Stato del Progetto

- [x] **Fase 0**: Pulizia Dati Hardcodati, Vault Cifrato (`authVault.js`) & Onboarding Wizard
- [x] **Fase 1**: GitHub Integration via Personal Access Token
- [x] **Fase 2**: Google Workspace OAuth 2.0 PKCE (Calendar & Tasks)
- [ ] **Fase 3**: **Spotify Web API & Audio Player**
- [ ] **Fase 4**: **Multi-Provider AI Engine (Claude, DeepSeek, Gemini, GPT, Ollama) & Function Calling Agent**

---

## 📌 DETTAGLIO FASI 3 & 4

### 🎵 FASE 3 — Spotify Web API & Audio Player
> **Obiettivo**: Permettere all'utente di connettere il proprio account Spotify tramite OAuth 2.0 PKCE, visualizzare il brano in riproduzione e controllare il player (Play, Pausa, Skip) direttamente dalla dashboard.

- [ ] **`electron/spotifyTools.js` & OAuth PKCE**:
  - Gestione autenticazione OAuth 2.0 PKCE per Spotify (`user-read-playback-state`, `user-modify-playback-state`).
  - Scambio token e refresh automatico via `authVault.js`.
  - API `getPlaybackState()`, `play()`, `pause()`, `next()`, `previous()`.
  - Gestione messaggi chiari per account Spotify Free o per assenza di dispositivi attivi.
- [ ] **`src/components/SpotifyWidget.jsx`**:
  - Componente player audio visivo con copertina album, titolo traccia, artista e controlli multimediali.
  - Rispetto rigoroso della palette dell'applicazione.

---

### 🤖 FASE 4 — Multi-Provider AI Engine & Agent Panel (Human-in-the-Loop)
> **Obiettivo**: Integrazione dell'Assistente IA centrale capace di ragionare sui dati dell'utente ed eseguire azioni automatizzate sui 3 servizi con approvazione preventiva (*Human-in-the-Loop*).

- [ ] **Unified Multi-Provider AI Engine (`electron/aiEngine.js`)**:
  - Engine di traduzione universale per modelli di frontiera (Aggiornato ad Agosto 2026):
    - **Anthropic Claude** (Claude Opus 5, Claude Sonnet 5 via Messages API)
    - **DeepSeek** (DeepSeek V4 / V4-Flash via DeepSeek API)
    - **Google Gemini** (Gemini 3.6 Flash / 3.5 Pro via Gemini REST API)
    - **OpenAI** (GPT-5.6 Sol / Terra / Luna via Chat Completions API)
    - **Ollama** (Modelli Open-Weight locali su `http://localhost:11434`)
  - Definizione ed esecuzione dei **Tools (Function Calling)** sui moduli GitHub, Google e Spotify.
- [ ] **Pannello Assistente IA (`src/components/AIAgentPanel.jsx`)**:
  - Interfaccia chat scorrevole integrata in epicSnail.
  - Modale di conferma visiva per le azioni di scrittura (*"L'IA desidera creare l'evento X su Google Calendar. Confermi?"*).
