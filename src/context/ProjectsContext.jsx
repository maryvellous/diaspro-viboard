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

  // Nicknames & Colors per project
  const [projectNicknames, setProjectNicknames] = useState({});
  const [projectColors, setProjectColors] = useState({});
  const [postItVisibility, setPostItVisibility] = useState({});

  // Initial load & scan
  const refreshProjects = async () => {
    setLoading(true);
    if (window.electronAPI) {
      try {
        const repos = await window.electronAPI.scanRepos();
        setProjects(repos);

        const storeData = await window.electronAPI.getStoreData();
        if (storeData) {
          if (storeData.tasks) setTasks(storeData.tasks);
          if (storeData.notes) setNotes(storeData.notes);
          if (storeData.projectNicknames) setProjectNicknames(storeData.projectNicknames);
          if (storeData.projectColors) setProjectColors(storeData.projectColors);
          if (storeData.postItVisibility) setPostItVisibility(storeData.postItVisibility);
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
          path: 'C:\\Users\\Mary\\Desktop\\Cosciottina\\Avventurieri APS\\sito',
          branch: 'main',
          clean: true,
          modified: 0,
          staged: 0,
          recentCommits: [{ hash: 'a7923d5', message: 'Home: link PayPal donazioni reale (hosted_button_id)', date: 'Oggi' }]
        },
        {
          id: 'p2',
          name: 'AvventurieriApp',
          path: 'C:\\Users\\Mary\\Desktop\\Cosciottina\\AvventurieriApp',
          branch: 'main',
          clean: false,
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

  const filteredProjects = projects.filter((p) => {
    const customName = projectNicknames[p.id] || p.name;
    return (
      customName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.branch.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <ProjectsContext.Provider
      value={{
        projects: filteredProjects,
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
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  return useContext(ProjectsContext);
}
