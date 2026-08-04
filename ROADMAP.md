# Roadmap Progetto epicSnail: Agente IA & OAuth Integration

Questo documento stabilisce la roadmap incrementale del progetto. Lo sviluppo è suddiviso in 5 tappe distinte per garantire test e verifiche end-to-end a ogni passo.

---

## 🚦 Stato Corrente dello Sviluppo

- [ ] **Sprint Corrente**: **Fase 0 + Fase 1 (Fondamenta, Onboarding & GitHub)**
- [ ] **Fase 2**: Google Workspace OAuth (Calendar & Tasks)
- [ ] **Fase 3**: Spotify Web API & Audio Player
- [ ] **Fase 4**: Agente IA & Function Calling (Human-in-the-loop)

---

## 📌 ROADMAP DETTAGLIATA

### 🔷 FASE 0 — Pulizia Hardcoded, Secure Vault & Onboarding Wizard (IN CORSO)
> **Obiettivo**: Rendere l'app totalmente dinamica al primo avvio, rimuovendo riferimenti hardcodati e creando il vault sicuro per le credenziali cifrate.

- [ ] **Pulizia Codice Existing**:
  - Sostituire i percorsi hardcodati `C:\Users\Clark` in `storage.js` e `SettingsView.jsx` con `os.homedir()`.
  - Sostituire il testo statico `Ciao Mary!` in `Sidebar.jsx` con `{userName}` preso dal contesto dinamico.
- [ ] **Secure Credential Vault (`electron/authVault.js`)**:
  - Implementare cifratura nativa via `electron.safeStorage` (Credential Locker / Keychain) con fallback AES se non disponibile.
  - Esporre metodi per il salvataggio cifrato di: `AI API Key` (Gemini), `GitHub PAT`, `OAuth Tokens`.
- [ ] **Onboarding Wizard (`src/components/OnboardingWizard.jsx`)**:
  - Creare la modale di benvenuto al primo avvio (`firstLaunchCompleted: false`).
  - Passi dell'Onboarding:
    1. *Profilo Utente*: Inserimento del Nome/Nickname.
    2. *AI Configuration*: Inserimento della **Google Gemini API Key** (con guida e pulsante di test connessione) o scelta di Ollama locale.
    3. *Connessioni Iniziali*: Opzione per inserire il Personal Access Token (PAT) di GitHub.
    4. *Cartelle Scansione*: Selezione percorsi di scansione Git predefiniti basati su `os.homedir()`.

---

### 🔷 FASE 1 — Integrazione GitHub Reale (IN CORSO)
> **Obiettivo**: Sostituire i dati fittizi con repository ed issue reali da GitHub usando il PAT salvato nel Vault.

- [ ] **GitHub API Manager (`electron/githubTools.js`)**:
  - Metodi per recuperare le repository dell'utente (`getRepos`).
  - Metodi per recuperare le issue aperte (`getIssues`).
  - Metodo per validare il token PAT inserito.
- [ ] **Aggiornamento UI React**:
  - Connettere `ProjectsView.jsx` ed `Header.jsx` ai dati reali restituiti dall'API di GitHub.
  - Indicatore visivo dello stato della connessione a GitHub.

---

### ⏸️ FASE 2 — Google Workspace OAuth 2.0 (PROSSIMA)
> **Obiettivo**: Autenticazione OAuth 2.0 + PKCE per Google Calendar e Tasks con refresh automatico.

- [ ] **OAuth 2.0 PKCE Listener (`electron/oauthManager.js`)**:
  - Server HTTP locale su porta dinamica per intercettare il callback OAuth.
  - Gestione token d'accesso e refresh token con rinnovo automatico al 401.
- [ ] **Google Tools & UI**:
  - Sostituzione dei dati mockati in `GoogleCalendarWidget.jsx` con eventi reali.
  - Gestione a 3 stati: `Connesso` / `Token scaduto - Riconnetti` / `Non connesso`.

---

### ⏸️ FASE 3 — Spotify Web API & Player (SUCCESSIVA)
> **Obiettivo**: Integrazione audio player Spotify e controllo riproduzione.

- [ ] **Spotify OAuth & API Tools**:
  - Flusso OAuth PKCE per Spotify.
  - `SpotifyWidget.jsx` con copertina album, Play/Pause/Skip e gestione errori per account senza Premium o senza dispositivi attivi.

---

### ⏸️ FASE 4 — Agente IA & Function Calling (FINALE)
> **Obiettivo**: Orchestratore IA capace di interagire con GitHub, Google e Spotify con approvazione utente.

- [ ] **AI Orchestrator Engine (`electron/aiEngine.js`)**:
  - Integrazione dell'Agente IA usando la Gemini API Key dell'utente.
  - Definizione delle funzioni (Function Calling) su GitHub, Google e Spotify.
- [ ] **AIAgentPanel & Human-In-The-Loop**:
  - Chat IA con anteprima delle azioni e modale di approvazione per le azioni di scrittura (es. creazione issue/eventi).

---

## 🧪 Piano di Verifica Sprint Corrente (Fase 0 + Fase 1)

1. **Test Reset Primo Avvio**:
   - Cancellare la configurazione e verificare l'apertura immediata di `OnboardingWizard.jsx`.
2. **Test Personalizzazione**:
   - Inserire il nome da mostrare (es. "Clark") e verificare che la mascotte e l'header usino il nome scelto.
3. **Test AI API Key Vault**:
   - Inserire la Gemini API Key nell'Onboarding/Settings e verificare che sia cifrata nel vault.
4. **Test GitHub PAT & Repo Reali**:
   - Inserire un GitHub PAT valido e verificare il caricamento delle vere repository Git nella scheda *Progetti*.
