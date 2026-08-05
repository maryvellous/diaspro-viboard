# 🐌 epicSnail — Roadmap v3.0 (Google-First Integration & AI Hub)

Questa è la roadmap ufficiale v3.0 per **epicSnail**. L'applicazione evolve verso un **Hub di Produttività guidato da Google Workspace, SnailBot IA e Integrazioni Cloud**, con autenticazione Google obbligatoria al setup e restyling visivo rigorosamente privo di emoji e conforme al Design System ufficiale.

---

## 📌 Fase 1: Onboarding Google Master & Flow Vivace (Completato) ✅

> **Obiettivo**: Riprogettare il wizard di prima installazione rendendo l'autenticazione Google il requisito fondamentale di accesso, eliminando ogni form manuale superfluo e migliorando la vivacità visiva.

- [x] **Step 1: Login Obbligatorio Google Workspace**
  - Card di benvenuto in accento Warm Sand (`#E8D19E`) a contrasto elevato.
  - Pulsante 1-Click *"Accedi con Google"* via browser.
  - Avanzamento automatico allo Step 2 non appena il callback IPC restituisce il token di successo.
  - Recupero automatico di nome utente, email e avatar dal profilo Google per inizializzare il contesto locale.
  - Zero possibilità di skip: l'app richiede l'account Google per sbloccare l'Hub Workspace e SnailBot.

- [x] **Step 2: Configurazione SnailBot IA (Multi-Provider)**
  - Card con accento Lavender (`#9D85C6`).
  - Selezione del provider (Google Gemini, Anthropic Claude, OpenAI, DeepSeek, Ollama).
  - Test istantaneo della chiave API e salvataggio sicuro su `authVault`.

- [x] **Step 3: Integrazioni Opzionali (GitHub, Spotify, Pinterest)**
  - Card con accento Sage (`#98A78A`).
  - Validazione rapida dei token ed abilitazione immediata delle sezioni in sidebar.
  - Pulsante finale *"Completa Setup ed Entra nell'Hub"*.

- [x] **Sanificazione Visiva Onboarding**
  - Rimozione totale di qualsiasi emoji dal wizard.
  - Utilizzo esclusivo delle icone SVG ufficiali da `AestheticIcons.jsx` e `BrandIcons.jsx`.

---

## 📌 Fase 2: Redesign Impostazioni (Account Master & Workspace Hub) (Completato) ✅

> **Obiettivo**: Portare l'Account Google in primo piano nelle Impostazioni come Identità Master dell'applicazione e rifinire le schede delle connessioni.

- [x] **Card "Account Google Master" in Cima alle Impostazioni**
  - Visualizzazione in risalto del profilo Google connesso (Avatar, Nome, Email).
  - Lista status permessi attivi: Google Calendar, Google Tasks, Google Drive, Google Docs, Google Keep.
  - Pulsante *"Aggiorna Permessi Workspace"* per re-consent OAuth.
  - Avviso di sicurezza: la disconnessione resetta il contesto Workspace e limita le funzionalità di SnailBot.

- [x] **Hub Connessioni Riprogettato**
  - Card secondarie per Spotify, Pinterest e GitHub con switch toggle animati.
  - Stati delle connessioni visivamente chiari con icone `AestheticIcons` / `BrandIcons`.
  - Rimozione completa delle emoji da tutte le tab delle Impostazioni.

---

## 📌 Fase 3: Google Workspace Deep Integration (Completato) ✅

> **Obiettivo**: Sfruttare l'Account Google Master per arricchire la vista *Oggi*, il *Calendario* e *SnailBot*.

- [x] **Google Tasks integrato nella Vista Oggi e Calendario**
  - Visualizzazione dei compiti di Google Tasks direttamente nella dashboard quotidiana con possibilità di spunta in tempo reale.
- [x] **Google Drive & Docs Preview**
  - Accesso rapido ai documenti recenti e risorse di lavoro nei dettagli progetto.
- [x] **Iniezione del Contesto Workspace in SnailBot**
  - SnailBot legge in automatico i prossimi eventi a calendario e i task Google del giorno per rispondere a domande del tipo: *"Quali sono le mie priorità di oggi?"*.

---

## 📌 Fase 4: Estensione Integrazioni Media & Dev (Completato) ✅

- [x] **Pinterest Moodboard View**
  - Bacheche Pinterest visualizzate tramite griglia masonry nei dettagli del progetto.
- [x] **Spotify Smart Player**
  - Riproduzione e sync playlist di sottofondo per le sessioni di lavoro.
- [x] **GitHub Smart Deduplication**
  - Match automatico delle repository locali con quelle remote GitHub per card unificate.

---

## 📌 Fase 5: Audit Visivo, Zero-Emoji & Performance (Completato) ✅

- [x] Audit visivo di tutte le schermate: verifica conformità palette ufficiale (`#1e1333`, `#2b1c47`, `#9D85C6`, `#E8D19E`, `#98A78A`, `#A5C4DC`).
- [x] Controllo 100% Zero-Emoji nell'intero codebase (validazione tramite linter/audit visivo).
- [x] Ottimizzazione performance animazioni (`will-change`, CSS transitions senza reflow pesante).
- [x] Test di build Electron finale (`npm run build` ed exit code 0).

---

## 📌 Fase 6: Ricontrollo & Eliminazione Codice Morto (Dead Code Cleanup) (Completato) ✅

> **Obiettivo**: Garantire una codebase snella, pulita, priva di file o funzioni deprecate a seguito dell'introduzione del login obbligatorio Google e del restyling delle impostazioni.

- [x] **Eliminazione Componenti & Handler Deprecati**
  - Rimozione di form ed input di inserimento nome manuale resi obsoleti dal recupero automatico del profilo Google.
  - Rimozione di vecchi handler fallback per l'autenticazione offline non usata.
  - Eliminazione di funzioni helper inutilizzate per la gestione delle credenziali sviluppatore manuali (se dismesse).
- [x] **Audit degli Import e Dipendenze Non Utilizzate**
  - Scansione e pulizia di `import` React, icone Lucide inutilizzate ed eventuali pacchetti npm rimasti inutilizzati in `package.json`.
- [x] **Bonifica Log e Mock Data**
  - Eliminazione di tutti i `console.log` di debug temporanei disseminati nel main process Electron e nei componenti React.
  - Rimozione di strutture dati mock non più necessarie dopo l'integrazione reale delle API Google/GitHub/Spotify.
