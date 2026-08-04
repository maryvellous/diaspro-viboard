const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const http = require('http');
const LocalStore = require('./storage');
const AuthVault = require('./authVault');
const GitHubTools = require('./githubTools');
const { scanDirectoryForGitRepos, getGitProjectDetails, executeGitAction } = require('./gitScanner');
const { openTerminal, openVSCode, openAndroidStudio, openAntigravityIDE, openInExplorer } = require('./systemOps');

const store = new LocalStore();
const authVault = new AuthVault();
const githubTools = new GitHubTools(authVault);
let mainWindow = null;

function checkDevServer(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      resolve(res.statusCode === 200);
    }).on('error', () => {
      resolve(false);
    });
  });
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1000,
    minHeight: 650,
    title: 'epicSnail',
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#160a2c',
      symbolColor: '#f3e8ff',
      height: 36,
    },
    backgroundColor: '#160a2c',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  const devServerActive = await checkDevServer('http://localhost:5173');
  if (devServerActive) {
    console.log('Loading live Vite dev server at http://localhost:5173');
    mainWindow.loadURL('http://localhost:5173');
  } else {
    console.log('Loading production dist build');
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers
ipcMain.handle('git:scan', async (event, rootPaths) => {
  const pathsToScan = rootPaths && rootPaths.length > 0 ? rootPaths : store.get('scanPaths');
  let allRepos = [];
  for (const rootPath of pathsToScan) {
    try {
      const repos = await scanDirectoryForGitRepos(rootPath, 3);
      allRepos.push(...repos);
    } catch (e) {
      console.error('Scan error on path:', rootPath, e);
    }
  }

  const currentWorkspace = path.resolve(__dirname, '..');
  const hasCurrent = allRepos.some(r => r.path === currentWorkspace);
  if (!hasCurrent) {
    const currentRepo = await getGitProjectDetails(currentWorkspace);
    if (currentRepo) allRepos.unshift(currentRepo);
  }

  return allRepos;
});

ipcMain.handle('git:details', async (event, folderPath) => {
  return await getGitProjectDetails(folderPath);
});

ipcMain.handle('git:action', async (event, { folderPath, action }) => {
  return await executeGitAction(folderPath, action);
});

ipcMain.handle('system:open-terminal', async (event, folderPath) => {
  return await openTerminal(folderPath);
});

ipcMain.handle('system:open-vscode', async (event, folderPath) => {
  return await openVSCode(folderPath);
});

ipcMain.handle('system:open-studio', async (event, folderPath) => {
  return await openAndroidStudio(folderPath);
});

ipcMain.handle('system:open-antigravity', async (event, folderPath) => {
  return await openAntigravityIDE(folderPath);
});

ipcMain.handle('system:open-explorer', async (event, folderPath) => {
  return await openInExplorer(folderPath);
});

ipcMain.handle('store:get-all', async () => {
  return store.data;
});

ipcMain.handle('store:set', async (event, { key, val }) => {
  return store.set(key, val);
});

// Auth & Vault IPC Handlers
ipcMain.handle('auth:save-token', async (event, { service, token }) => {
  return authVault.saveToken(service, token);
});

ipcMain.handle('auth:get-token', async (event, service) => {
  return authVault.getToken(service);
});

ipcMain.handle('auth:has-token', async (event, service) => {
  return authVault.hasToken(service);
});

ipcMain.handle('auth:remove-token', async (event, service) => {
  return authVault.removeToken(service);
});

// GitHub Integration IPC Handlers
ipcMain.handle('github:validate', async (event, token) => {
  return await githubTools.validateToken(token);
});

ipcMain.handle('github:get-repos', async () => {
  return await githubTools.getRepos();
});

ipcMain.handle('github:get-issues', async () => {
  return await githubTools.getIssues();
});

// AI API Key Test IPC Handler
ipcMain.handle('ai:test-key', async (event, apiKey) => {
  const keyToTest = apiKey || authVault.getToken('gemini_api_key');
  if (!keyToTest) return { success: false, error: 'Chiave API non fornita' };
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${keyToTest}`);
    if (res.ok) {
      return { success: true, message: 'Chiave Gemini API valida!' };
    } else {
      const err = await res.json();
      return { success: false, error: err.error?.message || 'Chiave non valida' };
    }
  } catch (e) {
    return { success: false, error: e.message };
  }
});

