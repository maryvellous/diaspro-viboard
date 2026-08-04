# Implementation Plan - Multi-Provider AI Engine (Gemini, Anthropic, DeepSeek, OpenAI, Ollama)

Questo aggiornamento estende il motore dell'Agente IA per supportare multipli provider di intelligenza artificiale con il modello **BYOK (Bring Your Own Key)**.

L'utente potrà scegliere liberamente quale provider e modello utilizzare per guidare l'assistente desktop:
- **Google Gemini** (Gemini 2.0 Flash / Pro)
- **Anthropic Claude** (Claude 3.5 Sonnet / Haiku)
- **DeepSeek** (DeepSeek-V3 / DeepSeek-R1 via endpoint compatibile OpenAI)
- **OpenAI** (GPT-4o / GPT-4o-mini)
- **Ollama / Local LLM** (100% offline su `http://localhost:11434`)

---

## Architecture: Multi-Provider AI Engine ([`electron/aiEngine.js`](file:///c:/Users/Clark/Desktop/Cosciottina/Nuova%20cartella/electron/aiEngine.js))

```
                               +-----------------------------+
                               |     React UI (Chat Panel)   |
                               +-----------------------------+
                                              |
                                              v
                               +-----------------------------+
                               |  Unified AI Engine Router   |
                               |    (electron/aiEngine.js)   |
                               +-----------------------------+
                                              |
      +-------------------+-------------------+-------------------+-------------------+
      |                   |                   |                   |                   |
      v                   v                   v                   v                   v
[Google Gemini]   [Anthropic Claude]     [DeepSeek API]        [OpenAI]         [Ollama Local]
 (Gemini API)       (v1/messages)    (api.deepseek.com)  (v1/chat/completions) (localhost:11434)
```

---

## Vault & Storage Changes

### [`electron/authVault.js`](file:///c:/Users/Clark/Desktop/Cosciottina/Nuova%20cartella/electron/authVault.js)
Salvataggio cifrato nel Vault per ciascuna chiave API:
- `gemini_api_key`
- `anthropic_api_key`
- `deepseek_api_key`
- `openai_api_key`
- `selected_ai_provider`: `'gemini' | 'anthropic' | 'deepseek' | 'openai' | 'ollama'`

---

## Configuration & Settings UI

### [`src/components/OnboardingWizard.jsx`](file:///c:/Users/Clark/Desktop/Cosciottina/Nuova%20cartella/src/components/OnboardingWizard.jsx) & [`src/components/SettingsView.jsx`](file:///c:/Users/Clark/Desktop/Cosciottina/Nuova%20cartella/src/components/SettingsView.jsx)
- Menu a tendina per la selezione del **Provider IA**:
  - `Google Gemini`
  - `Anthropic (Claude)`
  - `DeepSeek`
  - `OpenAI`
  - `Ollama (Locale)`
- Campo di inserimento dinamico con link diretto per ottenere la chiave del provider selezionato:
  - Anthropic: `console.anthropic.com`
  - DeepSeek: `platform.deepseek.com`
  - Google Gemini: `aistudio.google.com`
- Pulsante **"Test Connessione Provider"** universale per verificare la validità di ciascuna chiave API in tempo reale.
