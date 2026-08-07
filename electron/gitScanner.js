const fs = require('fs').promises;
const path = require('path');
const simpleGit = require('simple-git');

// Directors to always ignore during deep scan to preserve CPU/memory
const IGNORED_DIRS = new Set([
  'node_modules',
  '$RECYCLE.BIN',
  'System Volume Information',
  'AppData',
  'Application Data',
  'Local Settings',
  'Windows',
  'Program Files',
  'Program Files (x86)',
  'vendor',
  'dist',
  'build',
  '.cache',
  'temp',
  'tmp',
  'pkg',
]);

/**
 * Recursively find all git repositories starting from a root folder
 */
async function scanDirectoryForGitRepos(rootDir, maxDepth = 4, currentDepth = 0) {
  const gitRepos = [];
  if (currentDepth > maxDepth) return gitRepos;

  try {
    const entries = await fs.readdir(rootDir, { withFileTypes: true });
    let hasGitFolder = false;

    for (const entry of entries) {
      if (entry.isDirectory() && entry.name === '.git') {
        hasGitFolder = true;
        break;
      }
    }

    if (hasGitFolder) {
      // Root directory itself is a Git repository!
      const status = await getGitProjectDetails(rootDir);
      if (status) {
        gitRepos.push(status);
      }
      return gitRepos; // Don't recurse inside a Git repo
    }

    // Traverse subdirectories
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('.') && !IGNORED_DIRS.has(entry.name)) {
        const fullPath = path.join(rootDir, entry.name);
        try {
          const subRepos = await scanDirectoryForGitRepos(fullPath, maxDepth, currentDepth + 1);
          gitRepos.push(...subRepos);
        } catch (err) {
          console.debug(`[gitScanner] Skipping folder ${fullPath}:`, err.message);
        }
      }
    }
  } catch (err) {
    console.debug(`[gitScanner] Cannot access root directory ${rootDir}:`, err.message);
  }

  return gitRepos;
}

/**
 * Get detailed Git info for a specific folder
 */
async function getGitProjectDetails(folderPath) {
  try {
    const git = simpleGit(folderPath);
    const isRepo = await git.checkIsRepo();
    if (!isRepo) return null;

    const status = await git.status();
    const branch = status.current || 'detached';
    const log = await git.log({ maxCount: 5 }).catch(() => ({ all: [] }));
    const remotes = await git.getRemotes(true).catch(() => []);
    const originRemote = remotes.find(r => r.name === 'origin') || remotes[0];
    const remoteUrl = originRemote && originRemote.refs ? (originRemote.refs.fetch || originRemote.refs.push || null) : null;

    const projectName = path.basename(folderPath);

    let lastFileModified = null;
    try {
      const gitIndexPath = path.join(folderPath, '.git', 'index');
      const stat = await fs.stat(gitIndexPath);
      lastFileModified = stat.mtime.toISOString();
    } catch (e) {
      // ignore
    }

    return {
      id: Buffer.from(folderPath).toString('base64'),
      name: projectName,
      path: folderPath,
      branch: branch,
      remoteUrl: remoteUrl,
      behind: status.behind,
      ahead: status.ahead,
      clean: status.isClean(),
      modified: status.modified.length,
      staged: status.staged.length,
      not_added: status.not_added.length,
      lastFileModified: lastFileModified,
      lastCommit: log.all.length > 0 ? {
        hash: log.all[0].hash.substring(0, 7),
        message: log.all[0].message,
        date: log.all[0].date,
        author: log.all[0].author_name,
      } : null,
      recentCommits: log.all.map(c => ({
        hash: c.hash.substring(0, 7),
        message: c.message,
        date: c.date,
        author: c.author_name,
      })),
      lastUpdated: new Date().toISOString(),
    };
  } catch (err) {
    console.error(`Error reading git repo at ${folderPath}:`, err);
    return null;
  }
}

/**
 * Git actions
 */
async function executeGitAction(folderPath, action, options = {}) {
  try {
    const git = simpleGit(folderPath);
    if (action === 'fetch') {
      await git.fetch();
    } else if (action === 'pull') {
      await git.pull();
    } else if (action === 'push') {
      await git.push();
    } else if (action === 'commit') {
      await git.add('.');
      await git.commit(options.message || 'Update via Diaspro Viboard');
    } else if (action === 'checkout') {
      await git.checkout(options.branch);
    }
    return await getGitProjectDetails(folderPath);
  } catch (err) {
    return { error: err.message };
  }
}

module.exports = {
  scanDirectoryForGitRepos,
  getGitProjectDetails,
  executeGitAction,
};
