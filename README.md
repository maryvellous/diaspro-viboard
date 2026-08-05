<p align="center">
  <img src="public/banner.svg" alt="epicSnail — Gamified Desktop Dashboard" width="900"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Electron-34.3-47848F?style=for-the-badge&logo=electron&logoColor=white" alt="Electron"/>
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License"/>
</p>

**EpicSnail** 🐌 è una dashboard desktop moderna, elegante e gamificata sviluppata in **Electron**, **React** e **Vite**. È progettata per gestire in modo fluido i propri progetti locali, integrando la lettura dello stato Git, la gestione rapida di task mediante Post-it fluttuanti ed un design system altamente rifinito con micro-animazioni.

---

## Caratteristiche Principali

- **Gestione Progetti & Canvas Grid** — Schede grafiche curate per ciascun progetto locale, con ampio respiro visivo e sfondo rilassante.
- **Post-it Fluttuanti** — Foglietti adesivi in overlay con ombre 3D, espandibili e chiudibili senza deformare la griglia.
- **Integrazione Git in Tempo Reale** — Rilevamento automatico del branch attivo, indicatore di modifiche locali e messaggio dell'ultimo commit.
- **Design System & Micro-Interazioni** — Palette cromatica scura, effetti confetti al completamento dei task e animazioni fluide ovunque.

---

## Download ⭐

Scarica l'ultima versione compilata direttamente dalla pagina **Releases** — nessuna dipendenza richiesta, basta eseguire il file.

**[→ Vai alla pagina Releases](https://github.com/maryvellous/epicsnail/releases/latest)**

> Sono disponibili installer per **Windows** (`.exe`). Versioni macOS e Linux in arrivo.

---

## Tech Stack

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

## Struttura del Progetto

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

## Licenza

Questo progetto è distribuito sotto licenza **MIT**. Consulta il file `LICENSE` per maggiori dettagli.
