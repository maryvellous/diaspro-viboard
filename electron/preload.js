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
});
