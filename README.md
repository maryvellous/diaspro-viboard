<p align="center">
  <img src="public/banner.svg" alt="epicSnail — Gamified Desktop Dashboard" width="900"/>
</p>

![Electron](https://img.shields.io/badge/Electron-34.3-47848F?style=for-the-badge&logo=electron&logoColor=white)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**EpicSnail** è una dashboard desktop moderna, elegante e gamificata sviluppata in **Electron**, **React** e **Vite**. È progettata per gestire in modo fluido i propri progetti locali, integrando la lettura dello stato Git, la gestione rapida di task mediante Post-it fluttuanti ed un design system altamente rifinito con micro-animazioni.

---

## ✨ Caratteristiche Principali

- 🚀 **Gestione Progetti & Canvas Grid**:
  - Schede grafiche curate per ciascun progetto locale.
  - Ampio respiro visivo (*canvas outer margins*) per uno sfondo rilassante ed un'interfaccia priva di disordine.
- 📌 **Post-it Fluttuanti (Sticky Overlay)**:
  - Badge sticker `📌 1 Task` elegante sulle card dei progetti.
  - Foglietti adesivi fluttuanti sovrapposti in modal/overlay con ombre 3D, espandibili e chiudibili senza deformare la griglia.
- 🌿 **Integrazione Git in Tempo Reale**:
  - Rilevamento automatico del branch attivo (`main`, `dev`, ecc.).
  - Indicatore di modifiche locali (`Clean`, `x modificati`) e del messaggio dell'ultimo commit.
- 🎨 **Design System & Micro-Interazioni**:
  - Badge e pillole dinamicamente proporzionati (`font-size`, `padding`, `border-radius`).
  - Effetti celebrativi con confetti ed animazioni fluide al completamento dei task.
  - Palette cromatica scura ad alto contrasto con vetrofrassino e sfumature moderne.

---

## 🛠️ Tech Stack

| Tecnologia | Ruolo |
| :--- | :--- |
| **Electron** (`^34.3.0`) | Framework per applicazione desktop cross-platform |
| **React** (`^19.0.0`) | UI Library per la costruzione di componenti reattivi |
| **Vite** (`^6.2.0`) | Bundler rapido e dev server HMR |
| **Tailwind CSS** (`^4.3.3`) | Styling utility-first moderno |
| **Lucide React** (`^0.479.0`) | Set di icone vettoriali |
| **Simple Git** (`^3.27.0`) | Client Git per la lettura dello stato delle repository |
| **Canvas Confetti** (`^1.9.4`) | Effetti grafici e festeggiamenti |

---

## 🚀 Guida all'Installazione ed Avvio

### Requisiti Prerequisiti

- [Node.js](https://nodejs.org/) (versione `18.x` o superiore consigliata)
- [npm](https://www.npmjs.com/) o `pnpm` / `yarn`
- [Git](https://git-scm.com/) installato nel sistema

### 1. Clonare il Repository

```bash
git clone https://github.com/TUO-USERNAME/epicsnail.git
cd epicsnail
```

### 2. Installare le Dipendenze

```bash
npm install
```

### 3. Avviare in Ambiente di Sviluppo

Il comando avvia sia il dev server Vite sia la finestra dell'applicazione Electron con Hot Reload (HMR):

```bash
npm run dev
```

### 4. Compilazione per la Produzione

Per compilare gli asset della UI per la produzione:

```bash
npm run build
```

---

## 📁 Struttura del Progetto

```text
.
├── electron/          # Main process di Electron (main.js, preload, IPC)
├── src/               # Renderer process React
│   ├── components/    # Componenti UI (ProjectCard, StickyNote, Header, Badge, ecc.)
│   ├── index.css      # Stili globali e configurazione Tailwind CSS
│   └── App.jsx        # Componente principale
├── public/            # Asset statici ed icone
├── index.html         # Template HTML entry point
├── package.json       # Configurazione dipendenze e script
├── vite.config.mjs    # Configurazione Vite
└── README.md          # Documentazione del progetto
```

---

## 📄 Licenza

Questo progetto è distribuito sotto licenza **MIT**. Consulta il file `LICENSE` per maggiori dettagli.
