# Implementation Plan - Fase 4: Assistente IA Integrato (Scheda Dedicata & Custom Agent)

Questo piano definisce la progettazione e l'implementazione dettagliata dell'**Assistente IA a Tutto Schermo** per **epicSnail**, basata sui requisiti definiti durante la sessione di alignment.

---

## User Review & Specifiche di Design

1. **Accesso & Navigazione**:
   - Scheda **"Assistente IA"** a tutto schermo integrata direttamente nella **Sidebar** (icona Sparkles/Bot).

2. **Layout Chat a Colonna Singola**:
   - Interfaccia chat centrale focalizzata, priva di distrazioni.
   - **Carte d'Azione Interattive (*Human-in-the-Loop*)**: le richieste di scrittura (es. inserimento evento Google Calendar, creazione issue GitHub) appaiono come schede visive all'interno del flusso dei messaggi con pulsanti d'azione *"Approva ed Esegui"* e *"Annulla"*.

3. **Selettore Modello/Tier nell'Header Chat**:
   - Il **Provider** (es. Google Gemini, Anthropic, DeepSeek, OpenAI, Ollama) viene definito nelle *Impostazioni*.
   - Nell'header della chat è presente un selettore per cambiare al volo il **Modello/Tier** attivo per quel provider (es. *Gemini 3.6 Flash* vs *Gemini 3.1 Pro*; *Claude Sonnet 5* vs *Claude Opus 5*; *DeepSeek V4-Flash* vs *DeepSeek V4*; *GPT-5.6 Terra* vs *GPT-5.6 Sol*).

4. **Slash Commands (`/`) & Istruzioni Personalizzate**:
   - Menu/Legenda dei **Comandi Slash (`/`)** digitando `/` nella casella di testo (es. `/calendar`, `/github`, `/spotify`, `/clear`).
   - **Regole & System Prompt Personalizzati**: pannello configurabile per definire la personalità e le istruzioni di sistema per l'Agente IA.

---

## Proposed Changes

### Backend Engine & IPC

#### [NEW] [`electron/aiEngine.js`](file:///c:/Users/Clark/Desktop/Cosciottina/Nuova%20cartella/electron/aiEngine.js)
- Motore di esecuzione unificato per chiamate di Function Calling:
  - Mappatura unificata dei tool su `githubTools`, `googleTools` e `spotifyTools`.
  - Normalizzazione formati per Anthropic Messages API, DeepSeek/OpenAI Chat Completions, Gemini REST API ed Ollama API.
  - Inserimento delle **Regole Personalizzate Utente (System Prompt)** in testa ad ogni conversazione.

#### [MODIFY] [`electron/main.js`](file:///c:/Users/Clark/Desktop/Cosciottina/Nuova%20cartella/electron/main.js) & [`electron/preload.js`](file:///c:/Users/Clark/Desktop/Cosciottina/Nuova%20cartella/electron/preload.js)
- IPC Handlers: `ai:chat-message`, `ai:execute-tool`, `ai:get-rules`, `ai:save-rules`.

---

### UI Frontend (React Renderer)

#### [NEW] [`src/components/AIAgentPanel.jsx`](file:///c:/Users/Clark/Desktop/Cosciottina/Nuova%20cartella/src/components/AIAgentPanel.jsx)
- Vista principale a tutto schermo dell'Assistente IA:
  - Header con selettore del modello/tier attivo per il provider corrente.
  - Finestra chat centrale con messaggi utente, risposte dell'assistente e schede d'anteprima delle azioni.
  - Menu di autocompletamento Comandi Slash (`/`).
  - Pulsante per aprire il pannello **"Regole & System Prompt"**.

#### [MODIFY] [`src/components/Sidebar.jsx`](file:///c:/Users/Clark/Desktop/Cosciottina/Nuova%20cartella/src/components/Sidebar.jsx) & [`src/App.jsx`](file:///c:/Users/Clark/Desktop/Cosciottina/Nuova%20cartella/src/App.jsx)
- Aggiunta della voce di navigazione **Assistente IA** nella Sidebar e rendering della vista `AIAgentPanel` quando selezionata.

---

## Verification Plan

### Automated Tests
```powershell
npm run build
```

### Manual Verification
1. **Test Navigazione**: Cliccare sulla voce "Assistente IA" nella Sidebar e verificare l'apertura della vista a tutto schermo.
2. **Test Cambio Modello/Tier**: Selezionare modelli diversi dal dropdown dell'header e verificare che le richieste vengano indirizzate al tier corretto.
3. **Test Slash Commands (`/`)**: Digitare `/` nella casella di testo e selezionare un comando dalla legenda.
4. **Test Human-in-the-Loop**: Inviare una richiesta di scrittura (*"Aggiungi un evento domani su Google Calendar"*) e verificare la comparsa della card visiva d'approvazione prima dell'esecuzione della chiamata HTTP.
