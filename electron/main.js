const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const http = require('http');
const LocalStore = require('./storage');
const { scanDirectoryForGitRepos, getGitProjectDetails, executeGitAction } = require('./gitScanner');
const { openTerminal, openVSCode, openAndroidStudio, openAntigravityIDE, openInExplorer } = require('./systemOps');

const store = new LocalStore();
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
