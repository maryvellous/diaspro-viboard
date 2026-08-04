# Piano di Implementazione: Refactoring Pillole, Margini Tela & Riprogettazione Post-it 🐌⚡🌸

A seguito delle tue precise indicazioni tecniche e di design, ecco il piano dettagliato per perfezionare le proporzioni delle pillole, la spaziatura esterna della griglia ed il funzionamento del Post-it.

---

## 📏 1. Refactoring Rigoroso di Badge & Pillole

Applicheremo la regola proporzionale da te definita per tutti i badge, pulsanti e pillole dell'interfaccia:

- **Badge di Stato (`main`, `Clean`, `1 modificato`)**:
  - `padding: 6px 14px` (orizzontale generoso, mai risicato).
  - `min-height: 28px` ed altezza proporzionata.
  - `gap: 7px` tra l'icona ed il testo per evitare l'effetto incollato.
  - `font-size: 11px` con `font-weight: 700` e `letter-spacing: 0.03em`.
  - `border-radius: 9999px` (pillola perfetta pari a metà altezza).
- **Pulsanti d'Azione (`🚀 Apri in...`, `📋 Dettagli`, `Ctrl K`)**:
  - `padding: 8px 18px` per i pulsanti principali.
  - `min-height: 36px` con respiro verticale e spaziatura generosa attorno al testo.
  - Gerarchia tipografica marcata per distinguere i badge dal testo dei commit (`13px`).

---

## 🖼️ 2. Respiro Tela & Spaziatura Schermo (Canvas Outer Margins)

- **Aumento dei Margini Esterni**:
  - Il contenitore principale della griglia passa da `p-10` a `px-14 py-12 max-w-[1600px] mx-auto`.
  - Questo staccherà nettamente le tessere dei progetti dai bordi della finestra, dalla sidebar e dall'header, lasciando un'ampia fascia di sfondo rilassante attorno alla griglia.

---

## 📌 3. Riprogettazione del Post-it ("Sticky Overlay & Sticker Badge")

- **Problema Risolto**: Il Post-it giallo fisso al centro attualmente spezza la struttura della scheda e copre le informazioni Git sottostanti.
- **Nuovo Design**:
  - Quando ci sono task, la card mostra un **badge sticker elegante 📌 `1 Task`** nell'angolo in alto.
  - Cliccando sul badge (o dal tasto destro), il Post-it appare come un **foglietto adesivo fluttuante (Overlay Sticker)** sovrapposto alla card con ombra tridimensionale, senza alterare o spezzare la forma della scheda sottostante!
  - Pulsante di chiusura rapida `✕` per ripiegare il Post-it al volo.

---

## 🧪 Piano di Verifica

1. **Verifica Proporzioni Pillole**: Ispezione visiva per garantire che nessuna lettera sfiori mai i bordi ricurvi e che ci siano 7px di gap tra icona e testo.
2. **Verifica Spaziatura Schermo**: Conferma che le card abbiano ampi margini rilassanti rispetto alla sidebar e ai bordi della finestra.
3. **Verifica Post-it Fluttuante**: Test di apertura del Post-it sticker sopra la card senza alcuna deformazione della scheda sottostante.
