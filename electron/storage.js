const { app } = require('electron');
const fs = require('fs');
const path = require('path');

const os = require('os');

class LocalStore {
  constructor(filename = 'epicSnail_store.json') {
    const userDataPath = app ? app.getPath('userData') : process.cwd();
    this.path = path.join(userDataPath, filename);
    this.data = this.parseDataFile(this.path);
  }

  parseDataFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
    } catch (error) {
      console.error('Error reading store file, creating fresh store:', error);
    }
    return {
      user: {
        name: '',
        firstLaunchCompleted: false,
        xp: 150,
        level: 1,
        streak: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
        unlockedBadges: ['b1'], // 'b1': Welcome to epicSnail!
        aiProvider: 'gemini',
      },
      scanPaths: [
        path.join(os.homedir(), 'Desktop'),
      ],
      tasks: [], // { id, projectId, title, completed: bool, dueDate, priority, xpReward: 25 }
      notes: {}, // { [projectId]: "markdown string" }
      googleToken: null,
    };
  }

  get(key) {
    return this.data[key];
  }

  set(key, val) {
    this.data[key] = val;
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error writing store file:', error);
    }
    return this.data[key];
  }
}

module.exports = LocalStore;
