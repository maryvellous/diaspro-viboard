import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGamification } from './GamificationContext';
import { soundFX } from '../utils/audio';

const ProjectsContext = createContext();

export function ProjectsProvider({ children }) {
  const { addXp } = useGamification();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeProject, setActiveProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  // Nicknames & Colors & Pins & Visibility per project
  const [projectNicknames, setProjectNicknames] = useState({});
  const [projectColors, setProjectColors] = useState({});
  const [postItVisibility, setPostItVisibility] = useState({});

  const [pinnedProjectIds, setPinnedProjectIds] = useState([]);
  const [hiddenProjectIds, setHiddenProjectIds] = useState([]);
  const [showHiddenProjects, setShowHiddenProjects] = useState(false);
  const [sortBy, setSortBy] = useState('modified_desc'); // 'modified_desc' | 'modified_asc' | 'created_desc' | 'created_asc'
  const [projectFilter, setProjectFilter] = useState('all'); // 'all' | 'local_only' | 'github_only'

  // Helper per estrarre la chiave univoca del repo
  const normalizeRepoKey = (str) => {
    if (!str) return '';
    let s = str.trim().toLowerCase();
    if (s.endsWith('.git')) s = s.slice(0, -4);
    const sshMatch = s.match(/github\.com[:/]([^/]+\/[^/]+)/);
    if (sshMatch) return sshMatch[1];
    const httpMatch = s.match(/github\.com\/([^/]+\/[^/]+)/);
    if (httpMatch) return httpMatch[1];
    return s.split('\\').pop().split('/').pop();
  };

  // Initial load & scan
  const refreshProjects = async () => {
    setLoading(true);
    if (window.electronAPI) {
      try {
        const rawLocalRepos = await window.electronAPI.scanRepos();
        const localRepos = Array.isArray(rawLocalRepos) ? rawLocalRepos.map(l => ({ ...l, isLocal: true })) : [];
        let mergedProjects = [...localRepos];

        // Fetch remote GitHub repos safely
        try {
          const ghResult = await window.electronAPI.getGitHubRepos();
          if (ghResult && ghResult.success && Array.isArray(ghResult.repos)) {
            const usedRemoteIds = new Set();

            // Match local repos with remote GitHub repos
            mergedProjects = mergedProjects.map(local => {
              const localKey = normalizeRepoKey(local.remoteUrl) || normalizeRepoKey(local.name);
              
              const matchedRemote = ghResult.repos.find(r => {
                const rFullNameKey = normalizeRepoKey(r.full_name);
                const rNameKey = normalizeRepoKey(r.name);
                return (localKey && (localKey === rFullNameKey || localKey === rNameKey)) ||
                       (local.name && local.name.toLowerCase() === r.name.toLowerCase());
              });

              if (matchedRemote) {
                usedRemoteIds.add(matchedRemote.id);
                return {
                  ...local,
                  isGitHubRemote: true,
                  githubUrl: matchedRemote.html_url,
                  githubFullName: matchedRemote.full_name,
                  stargazers_count: matchedRemote.stargazers_count,
                  open_issues_count: matchedRemote.open_issues_count,
                  language: matchedRemote.language,
                };
              }
              return {
                ...local,
                isGitHubRemote: false,
              };
            });

            // Add non-matched remote repos as standalone GitHub projects
            ghResult.repos.forEach(r => {
              if (!usedRemoteIds.has(r.id)) {
                mergedProjects.push({
                  id: `gh_${r.id}`,
                  name: r.name,
                  path: r.html_url,
                  branch: 'github',
                  clean: true,
                  isLocal: false,
                  isGitHubRemote: true,
                  githubUrl: r.html_url,
                  githubFullName: r.full_name,
                  stargazers_count: r.stargazers_count,
                  open_issues_count: r.open_issues_count,
                  language: r.language,
                  createdAt: r.created_at || new Date().toISOString(),
                  lastModified: r.updated_at || new Date().toISOString(),
                  recentCommits: [{ hash: 'remote', message: r.description || 'Repository GitHub remota', date: (r.updated_at || '').split('T')[0] }]
                });
              }
            });
          }
        } catch (ghErr) {
          console.warn('GitHub repos fetch error ignored:', ghErr);
        }

        setProjects(mergedProjects);

        const storeData = await window.electronAPI.getStoreData();
        if (storeData) {
          if (storeData.tasks) setTasks(storeData.tasks);
          if (storeData.notes) setNotes(storeData.notes);
          if (storeData.projectNicknames) setProjectNicknames(storeData.projectNicknames);
          if (storeData.projectColors) setProjectColors(storeData.projectColors);
          if (storeData.postItVisibility) setPostItVisibility(storeData.postItVisibility);
          if (storeData.pinnedProjectIds) setPinnedProjectIds(storeData.pinnedProjectIds);
          if (storeData.hiddenProjectIds) setHiddenProjectIds(storeData.hiddenProjectIds);
          if (storeData.sortBy) setSortBy(storeData.sortBy);
          if (storeData.projectFilter) setProjectFilter(storeData.projectFilter);
        }
      } catch (err) {
        console.error('Error scanning repos:', err);
      }
    } else {
      // Browser fallback
      setProjects([
        {
          id: 'p1',
          name: 'sito',
          path: 'C:\\Progetti\\sito',
          branch: 'main',
          clean: true,
          isLocal: true,
          isGitHubRemote: true,
          githubUrl: 'https://github.com/user/sito',
          stargazers_count: 5,
          open_issues_count: 2,
          modified: 0,
          staged: 0,
          recentCommits: [{ hash: 'a7923d5', message: 'Home: link PayPal donazioni reale (hosted_button_id)', date: 'Oggi' }]
        },
        {
          id: 'p2',
          name: 'AvventurieriApp',
          path: 'C:\\Progetti\\AvventurieriApp',
          branch: 'main',
          clean: false,
          isLocal: true,
          isGitHubRemote: false,
          modified: 1,
          staged: 0,
          recentCommits: [{ hash: '4786031', message: 'chore: bump version to 1.1.0+2', date: 'Ieri' }]
        }
      ]);
      setTasks([
        { id: 't1', projectId: 'p1', title: 'Verifica link PayPal su mobile', completed: false },
        { id: 't2', projectId: 'p1', title: 'Aggiorna footer e contatti', completed: true }
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshProjects();
  }, []);

  const saveStoreKey = (key, val) => {
    if (window.electronAPI) {
      window.electronAPI.setStoreData(key, val);
    }
  };

  const setProjectNickname = (projectId, nickname) => {
    const updated = { ...projectNicknames, [projectId]: nickname };
    setProjectNicknames(updated);
    saveStoreKey('projectNicknames', updated);
  };

  const setProjectColor = (projectId, color) => {
    const updated = { ...projectColors, [projectId]: color };
    setProjectColors(updated);
    saveStoreKey('projectColors', updated);
  };

  const togglePostItVisibility = (projectId) => {
    const current = postItVisibility[projectId] !== false; // default visible
    const updated = { ...postItVisibility, [projectId]: !current };
    setPostItVisibility(updated);
    saveStoreKey('postItVisibility', updated);
  };

  const saveTasks = (newTasks) => {
    setTasks(newTasks);
    saveStoreKey('tasks', newTasks);
  };

  const saveNotes = (projectId, content) => {
    const updated = { ...notes, [projectId]: content };
    setNotes(updated);
    saveStoreKey('notes', updated);
  };

  const addTask = (projectId, title, priority = 'medium') => {
    const newTask = {
      id: `task_${Date.now()}`,
      projectId,
      title,
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
    };
    saveTasks([...tasks, newTask]);
    addXp(10, 'Task creata');
  };

  const toggleTask = (taskId) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const nextState = !t.completed;
        if (nextState) {
          addXp(25, 'Task completata');
        }
        return { ...t, completed: nextState };
      }
      return t;
    });
    saveTasks(updated);
  };

  const deleteTask = (taskId) => {
    saveTasks(tasks.filter((t) => t.id !== taskId));
  };

  // Launchers
  const launchTerminal = (path) => {
    if (window.electronAPI) window.electronAPI.openTerminal(path);
  };
  const launchVSCode = (path) => {
    if (window.electronAPI) window.electronAPI.openVSCode(path);
  };
  const launchAndroidStudio = (path) => {
    if (window.electronAPI) window.electronAPI.openAndroidStudio(path);
  };
  const launchAntigravityIDE = (path) => {
    if (window.electronAPI) window.electronAPI.openAntigravityIDE(path);
  };
  const launchExplorer = (path) => {
    if (window.electronAPI) window.electronAPI.openInExplorer(path);
  };

  const togglePinProject = (projectId) => {
    const isPinned = pinnedProjectIds.includes(projectId);
    const updated = isPinned
      ? pinnedProjectIds.filter(id => id !== projectId)
      : [...pinnedProjectIds, projectId];
    setPinnedProjectIds(updated);
    saveStoreKey('pinnedProjectIds', updated);
  };

  const toggleHideProject = (projectId) => {
    const isHidden = hiddenProjectIds.includes(projectId);
    const updated = isHidden
      ? hiddenProjectIds.filter(id => id !== projectId)
      : [...hiddenProjectIds, projectId];
    setHiddenProjectIds(updated);
    saveStoreKey('hiddenProjectIds', updated);
  };

  const changeSortBy = (option) => {
    setSortBy(option);
    saveStoreKey('sortBy', option);
  };

  const changeProjectFilter = (filter) => {
    setProjectFilter(filter);
    saveStoreKey('projectFilter', filter);
  };

  const openExternal = (url) => {
    if (window.electronAPI && window.electronAPI.openExternal) {
      window.electronAPI.openExternal(url);
    } else {
      window.open(url, '_blank');
    }
  };

  const syncProject = async (folderPath) => {
    if (window.electronAPI && window.electronAPI.executeGitAction && folderPath) {
      const updatedDetails = await window.electronAPI.executeGitAction(folderPath, 'fetch');
      await refreshProjects();
      return updatedDetails;
    }
  };

  const processedProjects = projects
    .filter((p) => {
      const isHidden = hiddenProjectIds.includes(p.id);
      if (isHidden && !showHiddenProjects) return false;

      if (projectFilter === 'local_only' && !p.isLocal) return false;
      if (projectFilter === 'github_only' && !p.isGitHubRemote) return false;

      const customName = projectNicknames[p.id] || p.name;
      return (
        customName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.path && p.path.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.branch && p.branch.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    })
    .sort((a, b) => {
      // Pinned projects ALWAYS stay on top
      const isAPinned = pinnedProjectIds.includes(a.id);
      const isBPinned = pinnedProjectIds.includes(b.id);
      if (isAPinned && !isBPinned) return -1;
      if (!isAPinned && isBPinned) return 1;

      // Unpinned sorting based on selected sortBy
      if (sortBy === 'modified_desc') {
        const timeA = new Date(a.lastModified || 0).getTime();
        const timeB = new Date(b.lastModified || 0).getTime();
        return timeB - timeA;
      }
      if (sortBy === 'modified_asc') {
        const timeA = new Date(a.lastModified || 0).getTime();
        const timeB = new Date(b.lastModified || 0).getTime();
        return timeA - timeB;
      }
      if (sortBy === 'created_desc') {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      }
      if (sortBy === 'created_asc') {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return timeA - timeB;
      }
      return 0;
    });

  return (
    <ProjectsContext.Provider
      value={{
        projects: processedProjects,
        allProjects: projects,
        loading,
        activeProject,
        setActiveProject,
        tasks,
        notes,
        projectNicknames,
        setProjectNickname,
        projectColors,
        setProjectColor,
        postItVisibility,
        togglePostItVisibility,
        pinnedProjectIds,
        togglePinProject,
        hiddenProjectIds,
        toggleHideProject,
        showHiddenProjects,
        setShowHiddenProjects,
        sortBy,
        changeSortBy,
        projectFilter,
        changeProjectFilter,
        searchQuery,
        setSearchQuery,
        refreshProjects,
        addTask,
        toggleTask,
        deleteTask,
        saveNotes,
        launchTerminal,
        launchVSCode,
        launchAndroidStudio,
        launchAntigravityIDE,
        launchExplorer,
        openExternal,
        syncProject,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  return useContext(ProjectsContext);
}
