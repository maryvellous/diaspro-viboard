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
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
  ],
  deepseek: [
    { id: 'deepseek-v4-flash', name: 'DeepSeek V4-Flash' },
    { id: 'deepseek-v4-pro', name: 'DeepSeek V4 Pro' },
    { id: 'deepseek-chat', name: 'DeepSeek Chat' },
  ],
  anthropic: [
    { id: 'claude-sonnet-5', name: 'Claude Sonnet 5 (Agentic & Code)' },
    { id: 'claude-opus-5', name: 'Claude Opus 5 (Flagship)' },
    { id: 'claude-fable-5', name: 'Claude Fable 5 (Engineering)' },
    { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
  ],
  openai: [
    { id: 'gpt-5.6-sol', name: 'GPT-5.6 Sol (Flagship Reasoning)' },
    { id: 'gpt-5.6-terra', name: 'GPT-5.6 Terra (Balanced)' },
    { id: 'gpt-5.6-luna', name: 'GPT-5.6 Luna (Fast & Efficient)' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
  ],
  ollama: [
    { id: 'llama3.3', name: 'Ollama Llama 3.3' },
    { id: 'qwen2.5-coder', name: 'Ollama Qwen 2.5 Coder' },
    { id: 'mistral-large', name: 'Ollama Mistral Large' },
    { id: 'llama3', name: 'Ollama Llama 3' },
  ]
};
