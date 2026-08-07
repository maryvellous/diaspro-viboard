export const PROVIDER_INFO = {
  gemini: { name: 'Google Gemini', link: 'https://aistudio.google.com/app/apikey', placeholder: 'AIzaSy...' },
  anthropic: { name: 'Anthropic (Claude)', link: 'https://console.anthropic.com/settings/keys', placeholder: 'sk-ant-api...' },
  deepseek: { name: 'DeepSeek', link: 'https://platform.deepseek.com/api_keys', placeholder: 'sk-...' },
  openai: { name: 'OpenAI', link: 'https://platform.openai.com/api-keys', placeholder: 'sk-proj-...' },
  ollama: { name: 'Ollama (Locale)', link: 'https://ollama.com', placeholder: 'http://localhost:11434' },
};

export const PROVIDER_TIERS = {
  gemini: [
    { id: 'gemini-3.6-flash', name: 'Gemini 3.6 Flash (Fast & Code)' },
    { id: 'gemini-3.1-pro', name: 'Gemini 3.1 Pro (Deep Reasoning)' },
    { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash' },
    { id: 'gemini-3.5-flash-lite', name: 'Gemini 3.5 Flash-Lite' },
  ],
  deepseek: [
    { id: 'deepseek-v4-pro', name: 'DeepSeek V4 Pro (Reasoning & Code)' },
    { id: 'deepseek-v4-flash', name: 'DeepSeek V4 Flash (Fast & Efficient)' },
  ],
  anthropic: [
    { id: 'claude-sonnet-5', name: 'Sonnet 5 (Attività quotidiane)' },
    { id: 'claude-haiku-4.5', name: 'Haiku 4.5 (Risposte rapide)' },
    { id: 'claude-opus-5', name: 'Opus 5 (Attività complesse)' },
    { id: 'claude-fable-5', name: 'Fable 5 (Sfide avanzate)' },
  ],
  openai: [
    { id: 'gpt-5.6-sol', name: 'GPT-5.6 Sol (Flagship Reasoning)' },
    { id: 'gpt-5.6-terra', name: 'GPT-5.6 Terra (Balanced)' },
    { id: 'gpt-5.6-luna', name: 'GPT-5.6 Luna (Fast & Efficient)' },
    { id: 'gpt-5.5-pro', name: 'GPT-5.5 Pro' },
  ],
  ollama: [
    { id: 'llama3.3', name: 'Ollama Llama 3.3' },
    { id: 'qwen2.5-coder', name: 'Ollama Qwen 2.5 Coder' },
    { id: 'mistral-large', name: 'Ollama Mistral Large' },
    { id: 'llama3', name: 'Ollama Llama 3' },
  ]
};
