const { spawn, exec } = require('child_process');
const path = require('path');

function openTerminal(folderPath) {
  return new Promise((resolve, reject) => {
    // Open Windows PowerShell inside folderPath
    const cmd = `start powershell -NoExit -Command "cd '${folderPath}'"`;
    exec(cmd, { cwd: folderPath }, (error) => {
      if (error) reject(error);
      else resolve(true);
    });
  });
}

function openVSCode(folderPath) {
  return new Promise((resolve, reject) => {
    exec(`code "${folderPath}"`, { cwd: folderPath }, (error) => {
      if (error) {
        // Fallback spawn
        spawn('code', [folderPath], { cwd: folderPath, detached: true, shell: true });
      }
      resolve(true);
    });
  });
}

function openAndroidStudio(folderPath) {
  return new Promise((resolve, reject) => {
    // Try launching studio64 or studio command
    exec(`studio64 "${folderPath}"`, { cwd: folderPath }, (error) => {
      if (error) {
        // Fallback spawn
        exec(`studio "${folderPath}"`, { cwd: folderPath }, () => {});
      }
      resolve(true);
    });
  });
}

function openAntigravityIDE(folderPath) {
  return new Promise((resolve, reject) => {
    exec(`agy "${folderPath}"`, { cwd: folderPath }, (error) => {
      if (error) {
        exec(`antigravity "${folderPath}"`, { cwd: folderPath }, () => {});
      }
      resolve(true);
    });
  });
}

function openInExplorer(folderPath) {
  return new Promise((resolve, reject) => {
    exec(`explorer "${folderPath}"`, (error) => {
      resolve(true);
    });
  });
}

module.exports = {
  openTerminal,
  openVSCode,
  openAndroidStudio,
  openAntigravityIDE,
  openInExplorer,
};
