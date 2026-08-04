# Piano di Implementazione Dettagliato: FASI 3 & 4 (Spotify & Multi-Provider AI Agent)

Questo piano definisce l'architettura tecnica per il completamento della **Fase 3 (Spotify Integration)** e della **Fase 4 (Multi-Provider AI Engine & Agent Panel)** per l'applicazione **epicSnail**.

---

## User Review & System Architecture

> [!IMPORTANT]
> **Modello BYOK & Multi-Provider AI (Frontiera 2026)**
> L'Agente IA supporterà nativamente tutti i principali provider di modelli aggiornati ad Agosto 2026:
> 1. **Anthropic Claude**: Claude Opus 5 & Claude Sonnet 5
> 2. **DeepSeek**: DeepSeek V4 & DeepSeek V4-Flash
> 3. **Google Gemini**: Gemini 3.6 Flash & 3.5 Pro
> 4. **OpenAI**: GPT-5.6 (Sol / Terra / Luna)
> 5. **Ollama**: Modelli Open-Weight locali 100% offline
>
> Tutte le chiavi API vengono salvate in modo cifrato su disco tramite `authVault.js` (`electron.safeStorage`).

---

## Proposed Changes

### FASE 3: Spotify Web API & Player Component

#### [NEW] [`electron/spotifyTools.js`](file:///c:/Users/Clark/Desktop/Cosciottina/Nuova%20cartella/electron/spotifyTools.js)
- Gestione autenticazione OAuth 2.0 PKCE per Spotify (`user-read-playback-state`, `user-modify-playback-state`).
- Scambio autorizzazione -> `access_token`, `refresh_token`.
- Metodi API:
  - `getPlaybackState()`: Stato traccia in riproduzione, copertina album, artista, durata.
  - `play()`, `pause()`, `next()`, `previous()`: Controlli multimediali.
- Gestione errori ed eccezioni: gestione esplicita per assenza di dispositivi attivi o account senza abbonamento Premium.

#### [NEW] [`src/components/SpotifyWidget.jsx`](file:///c:/Users/Clark/Desktop/Cosciottina/Nuova%20cartella/src/components/SpotifyWidget.jsx)
- Widget audio player integrato nel cruscotto.
- Design perfettamente allineato con i token della palette (`#2b1c47`, `#9D85C6`, `#7A3F67`).
- Stato di fallback per account disconnessi o senza riproduzione attiva.

#### [MODIFY] [`electron/main.js`](file:///c:/Users/Clark/Desktop/Cosciottina/Nuova%20cartella/electron/main.js) & [`electron/preload.js`](file:///c:/Users/Clark/Desktop/Cosciottina/Nuova%20cartella/electron/preload.js)
- IPC Handlers: `spotify:start-oauth`, `spotify:get-status`, `spotify:get-playback`, `spotify:play`, `spotify:pause`, `spotify:next`, `spotify:previous`.

---

### FASE 4: Multi-Provider AI Engine & Agent Panel (Human-in-the-Loop)

#### [NEW] [`electron/aiEngine.js`](file:///c:/Users/Clark/Desktop/Cosciottina/Nuova%20cartella/electron/aiEngine.js)
- Orchestratore IA centrale e router di Function Calling.
- Mappatura unificata dei Tool disponibili:
  - **Google Workspace**: `get_calendar_events`, `create_calendar_event`, `get_google_tasks`.
  - **GitHub**: `get_github_repos`, `get_github_issues`.
  - **Spotify**: `get_spotify_playback`, `spotify_play`, `spotify_pause`, `spotify_next`.
- Normalizzazione dei formati di chiamate per i vari provider:
  - Anthropic Messages API (formato `tools` e `tool_choice`).
  - DeepSeek & OpenAI Chat Completions (formato `tools` e `function`).
  - Google Gemini REST API (formato `functionDeclarations`).
  - Ollama API locale (formato OpenAI-compatible).

#### [NEW] [`src/components/AIAgentPanel.jsx`](file:///c:/Users/Clark/Desktop/Cosciottina/Nuova%20cartella/src/components/AIAgentPanel.jsx)
- Interfaccia chat dell'Assistente IA accessibile dall'Header o da un bottone dedicato in Sidebar.
- Cronologia conversazione e stato d'esecuzione dei tool.
- **Modale di Approvazione Visiva (*Human-in-the-Loop*)**:
  - Quando l'IA richiede di inserire un evento su Google Calendar o creare una issue su GitHub, la chiamata viene sospesa e presentata all'utente per l'approvazione manuale (`Approva` / `Rifiuta`).

---

## Verification Plan

### Automated Tests
```powershell
npm run build
```

### Manual Verification
1. **Test Fase 3 (Spotify)**:
   - Login OAuth PKCE con Spotify.
   - Riproduzione brano e verifica aggiornamento copertina/titolo nel widget.
   - Test pulsanti Play/Pause/Next.
2. **Test Fase 4 (Agente Multi-Provider)**:
   - Configurazione chiave Anthropic / DeepSeek / Gemini / OpenAI / Ollama nelle Impostazioni.
   - Invio prompt di lettura (*"Quali impegni ho oggi su Google Calendar e che brano sto ascoltando su Spotify?"*).
   - Invio prompt di scrittura (*"Aggiungi un evento domani alle 10 su Google Calendar"*), verificando la comparsa della modale di conferma prima che la chiamata API venga inviata.
