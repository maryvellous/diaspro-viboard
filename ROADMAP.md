# Roadmap Progetto epicSnail: Multi-Provider AI & Integrations

Questo documento stabilisce la roadmap incrementale del progetto. Lo sviluppo è suddiviso in 5 tappe distinte per garantire test e verifiche end-to-end a ogni passo.

---

## 🚦 Stato Corrente dello Sviluppo

- [x] **Fase 0**: Fondamenta, Onboarding & Secure Vault (`authVault.js`)
- [x] **Fase 1**: GitHub Integration via Personal Access Token
- [x] **Fase 2**: Google Workspace OAuth 2.0 PKCE (Calendar & Tasks)
- [ ] **Sprint Corrente**: **Fase 3 (Spotify Web API & Audio Player)**
- [ ] **Fase 4**: **Multi-Provider AI Engine (Gemini, Anthropic Claude, DeepSeek, OpenAI, Ollama)**

---

## 📌 ROADMAP DETTAGLIATA

### ✅ FASE 0 & 1 — Onboarding, Vault & GitHub (COMPLETATE)
- Vault cifrato nativo via `electron.safeStorage`.
- Onboarding Wizard dinamico.
- Integrazione repository ed issue reali da GitHub API.

---

### ✅ FASE 2 — Google Workspace OAuth 2.0 (COMPLETATA)
- Flusso OAuth 2.0 + PKCE su porta loopback locale.
- Sincronizzazione ed inserimento eventi reali su Google Calendar.
- Recupero liste ed attività da Google Tasks API.

---

### 🔷 FASE 3 — Spotify Web API & Player (IN CORSO)
> **Obiettivo**: Integrazione audio player Spotify e controllo riproduzione.

- [ ] **Spotify OAuth & API Tools**:
  - Flusso OAuth PKCE per Spotify.
  - `SpotifyWidget.jsx` con copertina album, Play/Pause/Skip e gestione errori per account senza Premium o senza dispositivi attivi.

---

### ⏸️ FASE 4 — Multi-Provider AI Engine & Function Calling (FINALE)
> **Obiettivo**: Orchestratore IA universale a scelta dell'utente (Gemini, Anthropic Claude, DeepSeek, OpenAI, Ollama) capace di interagire con i 3 servizi con approvazione utente.

- [ ] **Multi-Provider AI Engine (`electron/aiEngine.js`)**:
  - Supporto per **Google Gemini**, **Anthropic Claude**, **DeepSeek**, **OpenAI** e **Ollama Locale**.
  - Router universale per Function Calling (trasformazione delle definizioni dei tool per ciascuna API).
  - Inserimento e test delle chiavi API dedicate nel Vault cifrato.
- [ ] **AIAgentPanel & Human-In-The-Loop**:
  - Interfaccia Chat universale.
  - Modale di approvazione visiva prima di ogni azione di scrittura (es. creazione eventi/issue).
