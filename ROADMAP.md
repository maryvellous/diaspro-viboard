# 🐌 epicSnail — Roadmap v2.0 (Bug Fix & Migliorie Secondarie)

Questa è la nuova roadmap ufficiale per lo sviluppo di **epicSnail**. È suddivisa in fasi progressive per migliorare la stabilità delle connessioni, estendere le funzionalità di produttività e perfezionare l'esperienza visiva e la gamification.

---

## 📌 Fase 1: Fix Critici & Autenticazione Semplificata ✅

- [x] **Fix Loop Connessione Spotify**
  - Risoluzione dell'errore di reindirizzamento circolare tra la schermata *Musica* e le *Impostazioni*.
  - Gestione diretta e trasparente del pulsante "Connetti Spotify" e dello stato di connessione in entrambe le schermate.

- [x] **Google Login 1-Click via Browser**
  - Eliminazione dell'obbligo di configurare Client ID / Client Secret manualmente da Google Cloud Console per gli utenti standard.
  - Implementazione del login istantaneo con 1-click via browser e gestione trasparente dei token OAuth.
  - Mantenimento di un pannello *"Configurazione Avanzata"* opzionale per chi vuole usare le proprie credenziali sviluppatore.

---

## 📌 Fase 2: Produttività & Interfaccia Utente ✅

- [x] **Calendario: Vista Compatta a 10 Giorni**
  - Striscia orizzontale espandibile a tutta larghezza con 10 schede giornaliere (da oggi `D+0` a `D+9`), badge per conteggio eventi e lista dettagliata.

- [x] **Chatbot: Saluto Orario Dinamico**
  - Sostituzione del messaggio statico con un saluto contestuale all'ora corrente:
    > `[Buongiorno / Buon pomeriggio / Buonasera / Buonanotte] [Username], cosa posso fare per te?`

- [x] **Shortcut da Tastiera (Scorrimento Menu Sidebar)**
  - Supporto per il tasto `Tab` e `Shift+Tab` per scorrere ciclicamente le pagine nel menù di sinistra.

---

## 📌 Fase 3: Integrazioni & Gestione Avanzata Progetti ✅

- [x] **Tasto Destro Progetti: "Apri come contesto nel Chatbot"**
- [x] **Pillola Contesto Attivo & Cronologia Chat Collapsabile**
- [x] **Ordinamento Avanzato Progetti (Toolbar)**
- [x] **Pinning Progetti (Fissa in alto)**
- [x] **Gestione Visibilità Progetti (Nascondi / Mostra & Trasparenza)**

---

## 📌 Fase 4: Gamification Rework & Progression System ✅

- [x] **Modale Celebrativa di Level-Up (`LevelUpModal`)**
  - Finestra modale con confetti, audio celebrativo, tracciamento livelli e Titoli di Rango.
- [x] **Personalizzazione Regole XP & Difficoltà nelle Impostazioni**
  - Card "Gamification & Regole XP" con sliders, selettore difficoltà (Facile/Normale/Difficile) e tasto Reset Default.

---

## 📌 Fase 5: Restyling Visivo Profondo ✅

- [x] **Sidebar Lava Lamp** — Animazione CSS con bolle che salgono, cambiano forma e si fondono.
- [x] **Calendario: Overlay Click-Only** — Card espansa come overlay assoluto, nessuna scrollbar.
- [x] **Spotify: Player Premium** — Copertina blur dominante, progress bar, visualizzatore barre pulsanti.
- [x] **Chat rinominata "🐌 SnailBot"** — Rimossa icona robot, bubble cromaticamente distinte (AI vs utente).
- [x] **Hub Connessioni (visivo)** — Card di stato con badge Google / Spotify / GitHub nelle Impostazioni.

---

## 📌 Fase 6a: Hub Connessioni Premium & Sidebar Dinamica

> **Obiettivo**: trasformare l'Hub Connessioni in un pannello di controllo interattivo. Le sezioni della sidebar diventano **opt-in** tramite switch toggle animati.

- [ ] **Redesign card "Hub Connessioni"** nelle Impostazioni
  - Switch toggle animati (stile iOS, palette epicSnail) per **Spotify** e **Pinterest**.
  - Attivare uno switch connette il servizio (se non già connesso) e abilita la voce in sidebar.
  - Disattivare uno switch nasconde la voce dalla sidebar **e rende inaccessibile la schermata** del servizio (nessun routing verso di essa).
  - Sezione **Google espandibile**: singola riga con badge di stato → quando aperta mostra chiclet per:
    - Google Calendar ✅ (attivo)
    - Google Tasks ✅ (attivo, da esporre nell'UI)
    - Google Drive 🔒 / Google Docs 🔒 / Google Keep 🔒 (disponibili con re-consent)
  - Sezione **GitHub**: riga semplice con badge stato (nessuno switch — sempre visibile).

- [ ] **Sidebar dinamica** (`Sidebar.jsx`, `App.jsx`)
  - 5 voci sempre fisse: *Oggi*, *Progetti*, *Calendario*, *SnailBot*, *Impostazioni*.
  - Voce **Spotify** appare/scompare in base allo switch Hub — se la tab attiva è `spotify` e lo switch viene disattivato, l'app reindirizza automaticamente a *Oggi*.
  - Voce **Pinterest** (nuova) appare/scompare in base allo switch Hub — stesso comportamento di Spotify.
  - Le **schermate** `SpotifyWidget` e `PinterestView` sono montate nel router **solo se** il rispettivo switch è `true`. Non sono raggiungibili in nessun altro modo (né da URL, né da Tab, né da shortcut `Tab`).
  - Stato `enabledSections: { spotify, pinterest }` persistito su `electron-store`.
  - Shortcut `Tab` / `Shift+Tab` aggiornato dinamicamente in base alle voci attive.

---

## 📌 Fase 6b: Moodboard Pinterest

> **Obiettivo**: introdurre un flusso OAuth Pinterest completo e una nuova schermata Moodboard immersiva.

- [ ] **Backend Pinterest** (`pinterestTools.js` [NEW], `main.js`, `preload.js`)
  - Flusso OAuth PKCE via browser con callback su porta locale (stesso pattern di Google/Spotify).
  - Client ID di default per test + supporto credenziali custom nelle Impostazioni.
  - API: `GET /v5/boards` (lista bacheche), `GET /v5/boards/{id}/pins` (pin di una bacheca).
  - Persistenza token cifrata su `authVault`.

- [ ] **Schermata Moodboard** (`PinterestView.jsx` [NEW])
  - Header con dropdown multi-select per scegliere le bacheche da visualizzare.
  - **Griglia masonry** CSS (`columns: 3`, `break-inside: avoid`) con immagini dei Pin.
  - Overlay hover su ogni Pin: titolo + link al Pin originale su Pinterest.
  - Stato vuoto e stato non connesso con CTA inline.
  - Palette rigorosa: `#1e1333` sfondo, `#2b1c47` overlay, accenti `#E8D19E` / `#9D85C6`.

---

## 📌 Fase 6c: Google Workspace Espanso

> **Obiettivo**: esporre nell'UI i servizi Google già parzialmente implementati nel backend e aggiungere Drive/Docs/Keep con scope OAuth aggiuntivi.

- [ ] **Google Tasks nel Calendario** — Widget o sezione dedicata nella schermata Calendario per visualizzare e completare task di Google Tasks.
- [ ] **Google Drive** — Accesso ai file recenti/condivisi, visualizzazione miniature e link di apertura.
- [ ] **Google Docs** — Lettura documenti recenti, possibilità di aprirli direttamente nel browser.
- [ ] **Google Keep** — Visualizzazione note e memo recenti come card nel pannello *Oggi*.
- [ ] **Re-consent OAuth** — Gestione automatica della richiesta di scope aggiuntivi con messaggio informativo all'utente.

---

## Note Tecniche Trasversali

- Tutti i flussi OAuth seguono lo stesso pattern: `pinterestTools.js` sarà modellato su `googleTools.js`.
- Nessuna credenziale è mai esposta nel renderer; tutto passa per `authVault` e IPC handlers.
- I servizi senza OAuth attivo mostrano uno stato "disconnesso" nell'Hub, non un errore.

---

## 📌 Fase 7: Gestione Progetti Duplicati (Deduplicazione Locale / GitHub) ✅

> **Obiettivo**: unificare e deduplicare i progetti visibili che sono presenti sia in locale (scansione cartella) che su GitHub (remote).

- [x] **Deduplicazione automatica e unificazione card**
  - Match intelligente basato su URL remote Git (`git remote get-url origin`) e nome repository.
  - Sostituzione dei duplicati con un'unica **card unificata** recante i doppi badge (`💻 Locale` + `🐙 GitHub`).
  - Azioni contestuali sulla card unificata: apri cartella locale / apri repo su browser / apri in editor / sincronizza.
- [x] **Filtri & Selettore di vista**
  - Filtri in toolbar per mostrare: *Tutti* (unificati), *Solo Locali*, *Solo Remote GitHub*.

---

## 📌 Fase 8: Pulizia, Debug & Stabilizzazione Finale

> **Obiettivo**: portare l'app a uno stato di produzione stabile, privo di regressioni e con una codebase leggibile e manutenibile.

- [ ] **Audit visivo completo**
  - Verifica che la palette ufficiale sia applicata in modo consistente su tutte le schermate.
  - Rimozione di qualsiasi colore hardcoded fuori dalla palette (`indigo`, nero puro, grigi generici, ecc.).
  - Controllo responsive su diverse dimensioni di finestra (800×600 → 1920×1080).

- [ ] **Debug & fix regressioni**
  - Test manuale di tutti i flussi OAuth (Google, Spotify, Pinterest) con token validi e scaduti.
  - Verifica comportamento della sidebar dinamica in tutti gli scenari (switch on/off, tab attiva, shortcut `Tab`).
  - Controllo che il `LevelUpModal` e le notifiche XP non si sovrappongano a elementi critici dell'UI.
  - Test del calendario: overlay click-only, chiusura, nessuna scrollbar orizzontale.

- [ ] **Pulizia codebase**
  - Rimozione di `console.log` di debug lasciati durante lo sviluppo.
  - Unificazione di pattern duplicati (es. card dashboard ripetute con stili identici → componente condiviso).
  - Verifica che tutti i componenti abbiano i `key` corretti nelle liste React.
  - Controllo degli `import` inutilizzati (es. `Bot` in `ChatPanel.jsx` dopo la rimozione dell'icona).

- [ ] **Performance**
  - Verifica che le animazioni lava lamp e il visualizzatore Spotify usino `will-change` e non causino jank.
  - Lazy loading delle immagini dei Pin Pinterest (`loading="lazy"`).
  - Verifica che il build bundle non superi soglie ragionevoli (attualmente ~347 kB gzip ~97 kB).

- [ ] **Build finale verificata**
  - `npm run build` con exit code 0 e nessun warning critico.
  - Test in modalità Electron produzione (`npm run electron:preview` o equivalente).


