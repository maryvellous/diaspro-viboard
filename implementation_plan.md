# Implementation Plan - Fase 2: Google Workspace OAuth 2.0 (Calendar & Tasks)

Integrazione dell'autenticazione OAuth 2.0 + PKCE per consentire a **epicSnail** di connettersi in modo sicuro a Google Workspace, recuperare e creare eventi in Google Calendar e gestire le liste di attività di Google Tasks, salvando i token cifrati nel Vault nativo dell'app (`authVault.js`).

---

## User Review & Configuration

- **Flusso OAuth**: OAuth 2.0 + PKCE per applicazioni desktop native.
- **Client ID**: Inserimento opzionale del `Google Client ID` (e facoltativamente `Client Secret`) nelle Impostazioni / Onboarding (modello BYOK), con supporto a credenziali desktop standard.
- **Scope Autorizzati**:
  - `https://www.googleapis.com/auth/calendar.events` (lettura/scrittura eventi Google Calendar)
  - `https://www.googleapis.com/auth/tasks` (lettura/scrittura attività Google Tasks)

---

## Proposed Changes

### Backend Process (Electron Main & Auth)

#### [NEW] [`electron/oauthManager.js`](file:///c:/Users/Clark/Desktop/Cosciottina/Nuova%20cartella/electron/oauthManager.js)
- Gestione flusso PKCE (generation `code_verifier` & `code_challenge` S256).
- Listener HTTP su porta dinamica loopback (`http://127.0.0.1:0/callback`) per intercettare il callback authorization code.
- Scambio codice -> token (`access_token`, `refresh_token`, `expires_at`).
- Pagina di successo HTML per l'utente al termine dell'autenticazione.

#### [NEW] [`electron/googleTools.js`](file:///c:/Users/Clark/Desktop/Cosciottina/Nuova%20cartella/electron/googleTools.js)
- Client API Google Workspace nativo via `fetch`.
- Refresh automatico del token d'accesso (`refresh_token`) al 401.
- `getCalendarEvents()`: recupero eventi imminenti.
- `createCalendarEvent(eventData)`: aggiunta evento su Google Calendar.
- `getGoogleTasks()`: recupero attività da Google Tasks.
- `getConnectionStatus()`: stato connessione (`connected`, `expired`, `disconnected`).

#### [MODIFY] [`electron/authVault.js`](file:///c:/Users/Clark/Desktop/Cosciottina/Nuova%20cartella/electron/authVault.js)
- Supporto al salvataggio cifrato di `google_tokens` e credenziali `google_client_id`.

#### [MODIFY] [`electron/main.js`](file:///c:/Users/Clark/Desktop/Cosciottina/Nuova%20cartella/electron/main.js)
- Registrazione IPC Handlers: `google:start-oauth`, `google:get-status`, `google:disconnect`, `google:get-events`, `google:create-event`, `google:get-tasks`.

#### [MODIFY] [`electron/preload.js`](file:///c:/Users/Clark/Desktop/Cosciottina/Nuova%20cartella/electron/preload.js)
- Esposizione di `window.electronAPI.google.*`.

---

### UI Frontend (React Renderer)

#### [MODIFY] [`src/components/GoogleCalendarWidget.jsx`](file:///c:/Users/Clark/Desktop/Cosciottina/Nuova%20cartella/src/components/GoogleCalendarWidget.jsx)
- Gestione dei 3 stati: Non connesso, Connesso (eventi reali & creazione), Token Scaduto.

#### [MODIFY] [`src/components/SettingsView.jsx`](file:///c:/Users/Clark/Desktop/Cosciottina/Nuova%20cartella/src/components/SettingsView.jsx)
- Sezione Google Workspace Configuration (Client ID, Stato connessione, Disconnetti).

#### [MODIFY] [`src/components/TodayView.jsx`](file:///c:/Users/Clark/Desktop/Cosciottina/Nuova%20cartella/src/components/TodayView.jsx)
- Integrazione eventi del giorno reali nel widget riepilogativo.

---

## Verification Plan

### Automated Tests
```powershell
npm run build
```

### Manual Verification
1. Test flusso OAuth 2.0 PKCE con apertura browser di sistema.
2. Test caricamento ed inserimento eventi reali su Google Calendar.
3. Test refresh token automatico e disconnessione.
