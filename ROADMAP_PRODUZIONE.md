# epicSnail — Roadmap di Produzione e Rilascio Pubblico (Portfolio Ready)

Questo documento definisce la roadmap strategica e operativa per preparare la codebase di **epicSnail** al rilascio pubblico gratuito (Open Source / Freeware) e per trasformare il progetto in un pezzo forte del portfolio sviluppatore.

---

## Executive Summary & Obiettivi Portfolio

L'obiettivo di questa roadmap è convertire l'applicazione desktop da dashboard di sviluppo locale ad **un prodotto software maturo, sicuro, distribuibile e pronto per la produzione**. 

### Competenze Dimostrate per il Portfolio:
1. **Architecture & Engineering Desktop**: Architettura moderna basata su Electron, React 19, Vite e Tailwind CSS v4.
2. **Security & Data Isolation**: Comunicazione IPC sicura, isolamento del contesto, gestione cifrata dei token OAuth ed eliminazione dei dati sensibili.
3. **UX/UI & Design System**: Interfaccia ad alto impatto visivo con palette personalizzata, zero-emoji, componenti SVG dedicati e micro-animazioni fluide.
4. **Release Engineering & CI/CD**: Packaging automatizzato per Windows (NSIS Installer & Portable), gestione versionamento semantico (SemVer) e pipeline GitHub Actions.
5. **Open Source & Documentation Standards**: Documentazione aziendale/enterprise con contratti di licenza, guide di contribuzione, diagrammi architetturali e issue templates.

---

## 📌 Fase 1: Sanitizzazione, Audit di Sicurezza e Privacy

> **Obiettivo**: Rimuovere ogni traccia di dati personali, hardcoded path e credenziali temporanee, garantendo l'isolamento completo dell'ambiente Electron.

- [ ] **1.1 Sweep Credenziali e Hardcoded Paths**
  - Scansione completa della codebase per rimuovere percorsi assoluti locali (es. `C:\Users\Clark\...`).
  - Sostituzione dinamica di tutti i percorsi di sistema tramite API Electron native (`app.getPath('userData')`, `app.getPath('documents')`).
  - Rimozione di token API dev, Client Secret o chiavi di test lasciate nel codice sorgente.
  - Creazione del file `.env.example` con la lista di tutte le variabili d'ambiente necessarie (Google OAuth Client ID, AI API Keys placeholders).

- [ ] **1.2 Security Audit Processi Electron & IPC**
  - Verifica della configurazione di sicurezza della finestra principale (`electron/main.js`):
    - `contextIsolation: true`
    - `nodeIntegration: false`
    - `webSecurity: true`
  - Validazione dei canali di comunicazione IPC (`ipcMain.handle` / `ipcRenderer.invoke`): sanitizzazione di tutti gli argomenti in ingresso per prevenire attacchi di Injection o esecuzione di comandi non autorizzati.
  - Implementazione ed applicazione della **Content Security Policy (CSP)** rigorosa nel file `index.html` e negli header HTTP/Electron.

- [ ] **1.3 Sanificazione Repository Git e `.gitignore`**
  - Pulizia della cronologia Git o verifica che file sensibili, directory `dist`, `dist-exe`, `node_modules` e file `.env` siano totalmente esclusi dal tracciamento.
  - Audit di `.gitignore` per includere log di sistema, database locali di test e asset temporanei di build.

---

## 📌 Fase 2: Robustezza del Codice, Logging e Performance

> **Obiettivo**: Eliminare crash non gestiti, introdurre un sistema di logging di produzione e garantire stabilità anche in scenari di errore o assenza di connessione.

- [ ] **2.1 Gestione Centralizzata Errori (React & Electron)**
  - Implementazione di **Error Boundaries** trasparenti in React per catturare eventuali eccezioni di rendering senza provocare schermate bianche.
  - Schermata di errore amichevole con pulsante di ripristino/ricaricamento applicazione (`window.location.reload()`).
  - Gestione globale delle eccezioni non catturate nel Main Process di Electron (`process.on('uncaughtException')`, `process.on('unhandledRejection')`).

- [ ] **2.2 Sistema di Logging di Produzione**
  - Integrazione di una libreria di logging strutturato (es. `electron-log`).
  - Disattivazione o filtraggio dei `console.log` di debug verbose durante le build di produzione (`NODE_ENV === 'production'`).
  - Salvataggio dei log di errore in locale all'interno della cartella dati utente per semplificare il supporto e il debug di segnalazioni esterne.

- [ ] **2.3 Network Resiliency & Offline Fallback**
  - Gestione aggraziata dello stato offline o di timeout delle API esterne (Google Workspace, GitHub, Spotify, Provider IA).
  - Meccanismo di retry con backoff esponenziale per le chiamate API non critiche.
  - Notifica discreta all'utente quando una connessione viene persa o un token OAuth deve essere rinnovato.

- [ ] **2.4 Graceful Shutdown e Persistenza Dati**
  - Salvataggio atomico dello stato applicativo e delle impostazioni utente prima dell'evento di chiusura della finestra (`before-quit` / `window-all-closed`).
  - Pulizia dei listener IPC per evitare memory leak durante il ciclo di vita dell'applicazione.

---

## 📌 Fase 3: User Experience (UX/UI), Demo Mode e Onboarding

> **Obiettivo**: Offrire un'esperienza di primo utilizzo impeccabile per chiunque scarichi l'applicazione, inclusa la possibilità di provarla immediatamente senza configurazioni complesse.

- [ ] **3.1 Modalità "Demo / Playground Mode"**
  - Introduzione di un pulsante *"Esplora la Demo"* nella schermata di setup iniziale.
  - Popolamento automatico dell'app con dati di prova sintetici (task quotidiani, eventi a calendario fittizi, riproduttore musicale simulato, risposta SnailBot di test).
  - Consente ai recensori del portfolio o ai selezionatori HR di testare la UI e la reattività dell'app in 5 secondi senza dover configurare account personalizzati.

- [ ] **3.2 First-Time User Experience (FTUE) & Quick Tour**
  - Guida introduttiva (Interactive Onboarding Modal) che illustra i punti di forza dell'app: Google Workspace Hub, SnailBot IA, Gestione Progetti e Dashboard Gamificata.
  - Suggerimenti contestuali (Tooltips) per spiegare le funzionalità avanzate al primo utilizzo.

- [ ] **3.3 Audit UI & Responsive Desktop Layout**
  - Rispetto rigoroso delle linee guida del Design System (`GEMINI.md`):
    - Canvas Background: `#1e1333`
    - Card Background: `#2b1c47`
    - Palette di accento: Lavender (`#9D85C6`), Warm Sand (`#E8D19E`), Sage (`#98A78A`), Blue (`#A5C4DC`), Plum (`#7A3F67`), Terracotta (`#8F5A5A`).
    - Utilizzo esclusivo di icone SVG trasparenti da `AestheticIcons.jsx` e `BrandIcons.jsx` (Zero Emoji).
  - Impostazione dei vincoli minimi di dimensione finestra (`minWidth: 1024`, `minHeight: 700`) per prevenire la rottura del layout su schermi ridotti.

---

## 📌 Fase 4: Build, Packaging, Iconografia e Auto-Updater

> **Obiettivo**: Configurare la build multipiattaforma professionale e predisporre il sistema di aggiornamento automatico.

- [ ] **4.1 Iconografia e Identità Visiva Ufficiale**
  - Creazione delle icone dell'applicazione in tutti i formati standard per i vari sistemi operativi:
    - Windows: `public/icon.ico` (multi-risoluzione 16x16 a 256x256)
    - macOS: `public/icon.icns`
    - Linux: `public/icon.png` (512x512)

- [ ] **4.2 Ottimizzazione `electron-builder` (`package.json`)**
  - Configurazione avanzata dell'installer NSIS per Windows:
    - Personalizzazione della schermata di installazione con logo e opzioni di destinazione.
    - Creazione automatica di scorciatoie su Desktop e Menu Start.
    - Script di disinstallazione pulito che rimuove gli asset temporanei senza cancellare i dati dell'utente a meno che non confermato.
  - Definizione del target **Portable Executable** (eseguibile singolo `.exe` senza installazione).

- [ ] **4.3 Configurazione Auto-Updater**
  - Integrazione di `electron-updater` per il controllo automatico delle nuove release tramite **GitHub Releases**.
  - Notifica non invasiva in-app quando è disponibile una nuova versione con pulsante *"Aggiorna e Riavvia"*.

- [ ] **4.4 Firma del Codice (Code Signing & Security Advisory)**
  - Documentazione delle istruzioni per la firma digitale del software (Microsoft SignTool / Certificato Sviluppatore).
  - Nota per gli utenti sulla gestione dell'avviso di Windows SmartScreen per le release open-source prive di certificato EV costoso.

---

## 📌 Fase 5: Documentazione di Livello Enterprise per GitHub & Portfolio

> **Obiettivo**: Rendere la repository GitHub di epicSnail una vetrina tecnica impeccabile, chiara e accattivante per recruiter, sviluppatori e utenti finali.

- [ ] **5.1 Redazione di un `README.md` d'Impatto**
  - **Header & Badge**: Status Build, Release Version, License (MIT), Electron Version, React Version, Platform Compatibility.
  - **Hero Banner / Showcase**: GIF animate ad alta risoluzione e screenshot curati della dashboard e delle funzionalità chiave.
  - **Problem Statement & Solution**: Spiegazione di come epicSnail risolve il sovraccarico cognitivo unificando produttività, IA e gamification.
  - **Architecture Overview**: Schema dell'architettura software (Diagramma Mermaid della comunicazione Main Process, Renderer, IPC, OAuth Handlers e Provider IA).
  - **Feature Highlights**: Elenco dettagliato delle funzionalità tecniche implementate.
  - **Quick Start Guide**:
    - Per Utenti: Link diretto al download dell'installer `.exe` o della versione Portable.
    - Per Sviluppatori: Istruzioni per clonare, installare le dipendenze (`npm install`) ed avviare in modalità sviluppo (`npm run dev`).

- [ ] **5.2 Standard Open Source & Documenti Legali**
  - `LICENSE`: Aggiunta della licenza MIT (o Apache 2.0) per permettere l'uso libero e trasparente.
  - `CONTRIBUTING.md`: Guida dettagliata su come aprire una Issue, proporre Pull Request e rispettare le convenzioni di codice del progetto.
  - `CODE_OF_CONDUCT.md`: Standard di condotta della community.
  - `SECURITY.md`: Policy per la segnalazione responsabile di vulnerabilità di sicurezza.
  - `CHANGELOG.md`: Registro tracciabile delle versioni secondo le convenzioni Keep a Changelog.
  - `.github/ISSUE_TEMPLATE/`: Template strutturati per Bug Report e Feature Request.

---

## 📌 Fase 6: Continuous Integration & Automated Release (CI/CD)

> **Obiettivo**: Automatizzare la verifica della qualità del codice e la generazione dei binari di installazione tramite GitHub Actions.

- [ ] **6.1 Workflow di Integrazione Continua (`.github/workflows/ci.yml`)**
  - Esecuzione automatica ad ogni `push` e `pull_request`:
    - Scansione e linting del codice.
    - Compilazione frontend Vite (`npm run build`).
    - Validazione sintattica degli script Electron.

- [ ] **6.2 Workflow di Rilascio Automatico (`.github/workflows/release.yml`)**
  - Triggering su creazione di un nuovo tag Git (es. `v1.0.0`).
  - Compilazione automatica degli eseguibili Windows (NSIS `.exe` e Portable `.exe`) su runner Windows di GitHub Actions.
  - Creazione automatica della Bozza di Release su GitHub Releases con allegati i file binari e le note di rilascio generate.

---

## 📌 Fase 7: Strategia di Lancio & Vetrina Portfolio

> **Obiettivo**: Massimizzare la visibilità del progetto sui canali professionali per valorizzare il portfolio personale.

- [ ] **7.1 Indicizzazione e Topic Repository GitHub**
  - Configurazione di tag/topics descrittivi nella repository: `electron`, `react19`, `vite`, `tailwindcss`, `google-workspace`, `ai-dashboard`, `desktop-app`, `portfolio-showcase`.
  - Compilazione della sezione "About" con link alla landing page o alla pagina di download.

- [ ] **7.2 Presentazione LinkedIn & Post Tecnico**
  - Redazione di un post di presentazione professionale accompagnato da un video demo di 60-90 secondi.
  - Evidenziazione delle sfide ingegneristiche affrontate (es. gestione token OAuth sicura in Electron, sincronizzazione IPC reattiva in React 19, architettura modulare AI, Design System personalizzato).

- [ ] **7.3 Pubblicazione su Community Tech**
  - Condivisione su piattaforme quali Reddit (`r/electronjs`, `r/reactjs`), Dev.to, ProductHunt o Hacker News.
  - Inserimento del progetto in primo piano nel sito web portfolio personale o nel profilo GitHub.

---

## 📋 Checklist di Controllo Pre-Rilascio v1.0.0 Public

| Area | Requisito | Stato |
| :--- | :--- | :---: |
| **Sicurezza** | Zero credenziali hardcoded e variabili d'ambiente isolate | 🔴 Da completare |
| **Sicurezza** | IPC Sandbox e Context Isolation verificati in Electron | 🔴 Da completare |
| **Stabilità** | Error Boundaries e Logging di produzione configurati | 🔴 Da completare |
| **UX/UI** | Modalità Demo e Onboarding iniziale attivi | 🔴 Da completare |
| **UX/UI** | Design System 100% Zero-Emoji e componenti SVG dedicati | 💚 Completato |
| **Packaging** | Installer NSIS e versione Portable Windows generati e testati | 🔴 Da completare |
| **Docs** | `README.md` professionale con diagramma Mermaid e screenshot | 🔴 Da completare |
| **Docs** | Licenza MIT, `CONTRIBUTING.md` e `SECURITY.md` creati | 🔴 Da completare |
| **CI/CD** | GitHub Actions per build e release automatiche attive | 🔴 Da completare |
