const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Git Scanner
  scanRepos: (rootPaths) => ipcRenderer.invoke('git:scan', rootPaths),
  getGitDetails: (folderPath) => ipcRenderer.invoke('git:details', folderPath),
  executeGitAction: (folderPath, action) => ipcRenderer.invoke('git:action', { folderPath, action }),

  // System Editors / Launchers
  openTerminal: (folderPath) => ipcRenderer.invoke('system:open-terminal', folderPath),
  openVSCode: (folderPath) => ipcRenderer.invoke('system:open-vscode', folderPath),
  openAndroidStudio: (folderPath) => ipcRenderer.invoke('system:open-studio', folderPath),
  openAntigravityIDE: (folderPath) => ipcRenderer.invoke('system:open-antigravity', folderPath),
  openInExplorer: (folderPath) => ipcRenderer.invoke('system:open-explorer', folderPath),

  // Storage
  getStoreData: () => ipcRenderer.invoke('store:get-all'),
  setStoreData: (key, val) => ipcRenderer.invoke('store:set', { key, val }),

  // Vault & Auth
  saveToken: (service, token) => ipcRenderer.invoke('auth:save-token', { service, token }),
  getToken: (service) => ipcRenderer.invoke('auth:get-token', service),
  hasToken: (service) => ipcRenderer.invoke('auth:has-token', service),
  removeToken: (service) => ipcRenderer.invoke('auth:remove-token', service),

  // GitHub Integration
  validateGitHubToken: (token) => ipcRenderer.invoke('github:validate', token),
  getGitHubRepos: () => ipcRenderer.invoke('github:get-repos'),
  getGitHubIssues: () => ipcRenderer.invoke('github:get-issues'),

  // AI Key Test
  testAiKey: (provider, apiKey) => ipcRenderer.invoke('ai:test-key', { provider, apiKey }),


  // Google Integration
  startGoogleOAuth: () => ipcRenderer.invoke('google:start-oauth'),
  getGoogleStatus: () => ipcRenderer.invoke('google:get-status'),
  disconnectGoogle: () => ipcRenderer.invoke('google:disconnect'),
  getGoogleCalendarEvents: (maxResults) => ipcRenderer.invoke('google:get-events', maxResults),
  createGoogleCalendarEvent: (eventData) => ipcRenderer.invoke('google:create-event', eventData),
  getGoogleTasks: () => ipcRenderer.invoke('google:get-tasks'),

  // Spotify Integration
  startSpotifyOAuth: () => ipcRenderer.invoke('spotify:start-oauth'),
  getSpotifyStatus: () => ipcRenderer.invoke('spotify:get-status'),
  disconnectSpotify: () => ipcRenderer.invoke('spotify:disconnect'),
  getSpotifyPlayback: () => ipcRenderer.invoke('spotify:get-playback'),
  spotifyPlay: () => ipcRenderer.invoke('spotify:play'),
  spotifyPause: () => ipcRenderer.invoke('spotify:pause'),
  spotifyNext: () => ipcRenderer.invoke('spotify:next'),
  spotifyPrevious: () => ipcRenderer.invoke('spotify:previous'),
});



