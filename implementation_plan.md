# Implementation Plan - Fase 4: Modulo Chat Integrato (Scheda Dedicata & Client Esterno)

Questo piano definisce la progettazione e l'implementazione dettagliata del **Modulo Chat a Tutto Schermo** per **epicSnail**, basata sui requisiti definiti durante la sessione di alignment.

---

## User Review & Specifiche di Design

1. **Accesso & Navigazione**:
   - Scheda **"Interfaccia Chat"** a tutto schermo integrata direttamente nella **Sidebar** (icona Sparkles/Bot).

2. **Layout Chat a Colonna Singola**:
   - Interfaccia chat centrale focalizzata, priva di distrazioni.
   - **Carte d'Azione Interattive (*Human-in-the-Loop*)**: le richieste di scrittura (es. inserimento evento Google Calendar, creazione issue GitHub) appaiono come schede visive all'interno del flusso dei messaggi con pulsanti d'azione *"Approva ed Esegui"* e *"Annulla"*.

3. **Selettore Backend/Tier nell'Header Chat**:
   - Il **Provider API** (es. Google Gemini, Anthropic, DeepSeek, OpenAI, Ollama) viene definito nelle *Impostazioni*.
   - Nell'header della chat è presente un selettore per cambiare al volo l'**Endpoint/Tier** attivo per quel provider (es. *Gemini 3.6 Flash* vs *Gemini 3.1 Pro*; *Claude Sonnet 5* vs *Claude Opus 5*; *DeepSeek V4-Flash* vs *DeepSeek V4*; *GPT-5.6 Terra* vs *GPT-5.6 Sol*).

4. **Slash Commands (`/`) & Configurazioni di Contesto**:
   - Menu/Legenda dei **Comandi Slash (`/`)** digitando `/` nella casella di testo (es. `/calendar`, `/github`, `/spotify`, `/clear`).
   - **Pannello di Configurazione Contesto**: pannello configurabile per definire le stringhe di inizializzazione e i parametri base da allegare ai payload delle richieste.

---

## Proposed Changes

### Backend Engine & IPC

#### [NEW] `electron/aiEngine.js`
- Motore di esecuzione unificato per chiamate API esterne:
  - Mappatura unificata dei tool su `githubTools`, `googleTools` e `spotifyTools`.
  - Normalizzazione formati payload per Anthropic Messages API, DeepSeek/OpenAI Chat Completions, Gemini REST API ed Ollama API.
  - Inserimento delle **Stringhe di Inizializzazione (Context Header)** in testa all'array dei messaggi di ogni conversazione.

#### [MODIFY] `electron/main.js` & `electron/preload.js`
- IPC Handlers: `api:chat-message`, `api:execute-tool`, `api:get-context`, `api:save-context`.

---

### UI Frontend (React Renderer)

#### [NEW] `src/components/ChatPanel.jsx`
- Vista principale a tutto schermo del Modulo Chat:
  - Header con selettore del backend/tier attivo per il provider corrente.
  - Finestra chat centrale con messaggi utente, risposte del server e schede d'anteprima delle azioni.
  - Menu di autocompletamento Comandi Slash (`/`).
  - Pulsante per aprire il pannello **"Configurazione Contesto"**.

#### [MODIFY] `src/components/Sidebar.jsx` & `src/App.jsx`
- Aggiunta della voce di navigazione **Interfaccia Chat** nella Sidebar e rendering della vista `ChatPanel` quando selezionata.

---

## Verification Plan

### Automated Tests
```powershell
npm run build
```

### Manual Verification
1. **Test Navigazione**: Cliccare sulla voce "Interfaccia Chat" nella Sidebar e verificare l'apertura della vista a tutto schermo.
2. **Test Cambio Backend/Tier**: Selezionare endpoint diversi dal dropdown dell'header e verificare che le richieste di rete vengano indirizzate all'URL corretto.
3. **Test Slash Commands (`/`)**: Digitare `/` nella casella di testo e selezionare un comando dalla legenda.
4. **Test Human-in-the-Loop**: Inviare una richiesta di esecuzione tool ("Aggiungi un evento domani su Google Calendar") e verificare la comparsa della card visiva d'approvazione prima dell'esecuzione della chiamata HTTP.
