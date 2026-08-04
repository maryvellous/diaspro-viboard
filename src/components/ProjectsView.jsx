import React, { useState, useEffect } from 'react';
import { useProjects } from '../context/ProjectsContext';
import {
  Terminal,
  Code2,
  Smartphone,
  Sparkles,
  GitBranch,
  GitCommit,
  CheckCircle2,
  AlertCircle,
  Pencil,
  Check,
  ChevronDown,
  FolderOpen,
  Plus,
  Trash2,
  Circle,
  FileText,
  X,
  StickyNote
} from 'lucide-react';

export default function ProjectsView() {
  const {
    projects,
    loading,
    setActiveProject,
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    projectNicknames,
    setProjectNickname,
    projectColors,
    setProjectColor,
    launchTerminal,
    launchVSCode,
    launchAndroidStudio,
    launchAntigravityIDE,
    launchExplorer
  } = useProjects();

  const [editingId, setEditingId] = useState(null);
  const [tempNickname, setTempNickname] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [newTaskInput, setNewTaskInput] = useState({});

  const [activePostItId, setActivePostItId] = useState(null);

  const COLOR_OPTIONS = [
    { id: 'blue', name: 'Azzurro Cielo', bg: '#A5C4DC' },
    { id: 'sage', name: 'Verde Salvia', bg: '#98A78A' },
    { id: 'sand', name: 'Sabbia Dorata', bg: '#E8D19E' },
    { id: 'lavender', name: 'Lavanda Soft', bg: '#9D85C6' },
    { id: 'plum', name: 'Prugna Intenso', bg: '#7A3F67' },
    { id: 'terracotta', name: 'Terracotta Caldo', bg: '#8F5A5A' },
    { id: 'warm-sand', name: 'Sabbia Calda', bg: '#BC957D' },
    { id: 'default', name: 'Scuro Cozy', bg: '#2b1c47' },
  ];

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleContextMenu = (e, project) => {
    e.preventDefault();
    setContextMenu({
      x: Math.min(e.clientX, window.innerWidth - 220),
      y: Math.min(e.clientY, window.innerHeight - 300),
      project
    });
  };

  const handleStartRename = (project) => {
    setEditingId(project.id);
    setTempNickname(projectNicknames[project.id] || project.name);
    setContextMenu(null);
  };

  const handleSaveRename = (projectId) => {
    if (tempNickname.trim()) {
      setProjectNickname(projectId, tempNickname.trim());
    }
    setEditingId(null);
  };

  const handleAddTaskToCard = (projectId, e) => {
    e.preventDefault();
    const title = newTaskInput[projectId];
    if (!title || !title.trim()) return;
    addTask(projectId, title.trim());
    setNewTaskInput({ ...newTaskInput, [projectId]: '' });
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 select-none">
        <Sparkles className="w-12 h-12 text-[#9D85C6] animate-spin" />
        <span className="text-base font-bold text-white/80">Scansione dei tuoi progetti in corso...</span>
      </div>
    );
  }

  return (
    <div className="projects-canvas-container select-none">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-heading font-black text-3xl text-white tracking-wide flex items-center gap-4">
            I Miei Progetti
            <span className="badge-pill bg-[#6B5887] text-white border border-white/20 shadow-md">
              {projects.length} repository
            </span>
          </h1>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 items-start">
        {projects.map((project, idx) => {
          const projectTasks = tasks.filter((t) => t.projectId === project.id);
          const customName = projectNicknames[project.id] || project.name;

          const defaultPaletteColor = COLOR_OPTIONS[idx % (COLOR_OPTIONS.length - 1)].id;
          const themeColor = projectColors[project.id] || defaultPaletteColor;
          const hasTasks = projectTasks.length > 0;
          const isDarkTheme = themeColor === 'plum' || themeColor === 'terracotta' || themeColor === 'default';

          const isOverlayOpen = activePostItId === project.id;

          return (
            <div
              key={project.id}
              onContextMenu={(e) => handleContextMenu(e, project)}
              className={`dashboard-card theme-${themeColor} relative group cursor-default`}
            >
              {/* FLOATING POST-IT OVERLAY STICKER */}
              {isOverlayOpen && (
                <div className="postit-floating-overlay animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-amber-900/20 pb-2.5 mb-4">
                    <span className="font-heading font-black text-xs text-amber-950 uppercase tracking-wider flex items-center gap-2">
                      <StickyNote className="w-4 h-4" /> Tasks Post-it
                    </span>
                    <button
                      onClick={() => setActivePostItId(null)}
                      className="p-1 rounded-lg hover:bg-amber-900/10 text-amber-900/70 hover:text-amber-950"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto mb-4 pr-1">
                    {projectTasks.map((t) => (
                      <div key={t.id} className="flex items-center justify-between gap-2 group/task">
                        <div
                          onClick={() => toggleTask(t.id)}
                          className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                        >
                          {t.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-amber-900/40 shrink-0" />
                          )}
                          <span
                            className={`text-xs font-semibold truncate ${
                              t.completed ? 'line-through text-amber-900/40' : 'text-amber-950'
                            }`}
                          >
                            {t.title}
                          </span>
                        </div>

                        <button
                          onClick={() => deleteTask(t.id)}
                          className="opacity-0 group-hover/task:opacity-100 p-1 text-amber-900/40 hover:text-rose-700 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Task on Floating Post-it */}
                  <form onSubmit={(e) => handleAddTaskToCard(project.id, e)} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Aggiungi nota..."
                      value={newTaskInput[project.id] || ''}
                      onChange={(e) => setNewTaskInput({ ...newTaskInput, [project.id]: e.target.value })}
                      className="flex-1 bg-amber-100/90 border-amber-900/30 text-amber-950 text-xs rounded-xl px-3 py-2 placeholder-amber-900/50"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 rounded-xl bg-amber-900 text-amber-100 hover:bg-amber-950 text-xs font-bold shadow"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}

              <div>
                {/* 1. Title Block (Explicit Card Section 1) */}
                <div className="card-title-block">
                  {editingId === project.id ? (
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        autoFocus
                        value={tempNickname}
                        onChange={(e) => setTempNickname(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(project.id)}
                        className="bg-black/80 border-white text-white text-base font-bold rounded-2xl px-4 py-2 flex-1"
                      />
                      <button
                        onClick={() => handleSaveRename(project.id)}
                        className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-md"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3 group/title">
                      <h2
                        onClick={() => setActiveProject(project)}
                        className={`font-heading font-black text-2xl leading-snug cursor-pointer transition-opacity hover:opacity-80 ${
                          isDarkTheme ? 'text-white' : 'text-[#1e1333]'
                        }`}
                      >
                        {customName}
                      </h2>
                      <button
                        onClick={() => handleStartRename(project)}
                        title="Modifica nome personalizzato"
                        className={`opacity-0 group-hover/title:opacity-100 p-2 rounded-xl transition-all ${
                          isDarkTheme ? 'hover:bg-white/10 text-white/80' : 'hover:bg-black/10 text-black/80'
                        }`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Subtitle Path with Explicit Class */}
                  <p className={`card-path-subtitle ${
                    isDarkTheme ? 'text-white/70' : 'text-black/70'
                  }`}>
                    {project.path}
                  </p>
                </div>

                {/* 2. Badges Block (Explicit Card Section 2) */}
                <div className="card-badges-block">
                  <span className={`badge-pill ${
                    isDarkTheme ? 'bg-white/15 text-white border border-white/20' : 'bg-black/15 text-black border border-black/15'
                  }`}>
                    <GitBranch className="w-3.5 h-3.5 shrink-0" />
                    <span>{project.branch}</span>
                  </span>

                  {project.clean ? (
                    <span className="badge-pill text-emerald-950 bg-emerald-400/90 border border-emerald-500/40">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Clean</span>
                    </span>
                  ) : (
                    <span className="badge-pill text-amber-950 bg-amber-300/90 border border-amber-500/40">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{project.modified} modificati</span>
                    </span>
                  )}

                  {hasTasks && (
                    <button
                      onClick={() => setActivePostItId(isOverlayOpen ? null : project.id)}
                      className="task-sticker-badge"
                      title="Apri Post-it Task"
                    >
                      <StickyNote className="w-3.5 h-3.5 shrink-0" />
                      <span>{projectTasks.length} task</span>
                    </button>
                  )}
                </div>

                {/* 3. Commit Block (Explicit Card Section 3) */}
                {project.lastCommit && (
                  <div className={`card-commit-block ${
                    isDarkTheme ? 'bg-black/40 border border-white/10 text-white' : 'bg-black/10 border border-black/10 text-[#1e1333]'
                  }`}>
                    <div className={`flex items-center gap-2 text-xs font-mono font-bold mb-2 ${
                      isDarkTheme ? 'text-purple-300' : 'text-purple-900'
                    }`}>
                      <GitCommit className="w-3.5 h-3.5" />
                      <span>{project.lastCommit.hash}</span>
                    </div>
                    <p className="text-xs font-medium leading-relaxed line-clamp-2">
                      {project.lastCommit.message}
                    </p>
                  </div>
                )}
              </div>

              {/* 4. Actions Block (Explicit Card Section 4) */}
              <div className={`card-bottom-actions ${
                isDarkTheme ? 'border-white/15' : 'border-black/15'
              }`}>
                <div className="relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === project.id ? null : project.id)}
                    className={`action-pill ${
                      isDarkTheme ? 'bg-white text-purple-950 hover:bg-purple-100' : 'bg-[#1e1333] text-white hover:bg-purple-950'
                    }`}
                  >
                    <span>🚀 Apri in...</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openMenuId === project.id ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Popover Dropdown Menu */}
                  {openMenuId === project.id && (
                    <div className="absolute left-0 bottom-14 z-50 w-56 dashboard-card p-2 shadow-2xl bg-[#1e1333] text-white border-white/20 flex flex-col gap-1 animate-fadeIn">
                      <button
                        onClick={() => {
                          launchTerminal(project.path);
                          setOpenMenuId(null);
                        }}
                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/15 text-xs font-bold text-left transition-colors"
                      >
                        <Terminal className="w-4 h-4 text-purple-300" />
                        <span>PowerShell Terminale</span>
                      </button>

                      <button
                        onClick={() => {
                          launchAndroidStudio(project.path);
                          setOpenMenuId(null);
                        }}
                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/15 text-xs font-bold text-emerald-300 text-left transition-colors"
                      >
                        <Smartphone className="w-4 h-4 text-emerald-400" />
                        <span>Android Studio</span>
                      </button>

                      <button
                        onClick={() => {
                          launchAntigravityIDE(project.path);
                          setOpenMenuId(null);
                        }}
                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/15 text-xs font-bold text-cyan-300 text-left transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-cyan-300" />
                        <span>Antigravity IDE</span>
                      </button>

                      <button
                        onClick={() => {
                          launchVSCode(project.path);
                          setOpenMenuId(null);
                        }}
                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/15 text-xs font-bold text-blue-300 text-left transition-colors"
                      >
                        <Code2 className="w-4 h-4 text-blue-400" />
                        <span>VS Code</span>
                      </button>

                      <button
                        onClick={() => {
                          launchExplorer(project.path);
                          setOpenMenuId(null);
                        }}
                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/15 text-xs font-bold text-amber-300 text-left transition-colors border-t border-white/10 mt-1 pt-3"
                      >
                        <FolderOpen className="w-4 h-4 text-amber-400" />
                        <span>Esplora Risorse</span>
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setActiveProject(project)}
                  className={`action-pill ${
                    isDarkTheme
                      ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                      : 'bg-black/10 hover:bg-black/20 text-[#1e1333] border border-black/20'
                  }`}
                >
                  <span>📋 Dettagli</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* RIGHT-CLICK CONTEXT MENU */}
      {contextMenu && (
        <div
          className="fixed z-50 w-56 dashboard-card p-2 shadow-2xl bg-[#1e1333] text-white border-white/30 flex flex-col gap-1 animate-fadeIn"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-2 border-b border-white/10 mb-1">
            <span className="text-xs font-bold text-purple-200 block truncate">
              {projectNicknames[contextMenu.project.id] || contextMenu.project.name}
            </span>
          </div>

          <button
            onClick={() => handleStartRename(contextMenu.project)}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/15 text-xs font-bold text-white text-left"
          >
            <Pencil className="w-4 h-4 text-fuchsia-300" />
            <span>Rinomina Progetto</span>
          </button>

          {/* Color Picker Sub-options */}
          <div className="p-2 bg-black/40 rounded-xl my-1 flex items-center justify-around">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setProjectColor(contextMenu.project.id, c.id);
                  setContextMenu(null);
                }}
                title={c.name}
                className="w-4 h-4 rounded-full transition-transform hover:scale-125 border border-white/20"
                style={{ backgroundColor: c.bg }}
              />
            ))}
          </div>

          <button
            onClick={() => {
              const title = prompt('Inserisci titolo nuova task per Post-it:');
              if (title && title.trim()) {
                addTask(contextMenu.project.id, title.trim());
                setActivePostItId(contextMenu.project.id);
              }
              setContextMenu(null);
            }}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/15 text-xs font-bold text-amber-300 text-left"
          >
            <Plus className="w-4 h-4" />
            <span>Aggiungi Task Post-it</span>
          </button>

          <button
            onClick={() => {
              setActiveProject(contextMenu.project);
              setContextMenu(null);
            }}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/15 text-xs font-bold text-cyan-300 text-left border-t border-white/10 mt-1 pt-2"
          >
            <FileText className="w-4 h-4" />
            <span>Apri Dettagli & Note</span>
          </button>
        </div>
      )}
    </div>
  );
}
