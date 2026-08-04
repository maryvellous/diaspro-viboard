import React, { useState, useEffect } from 'react';
import { useGamification } from '../context/GamificationContext';
import { useProjects } from '../context/ProjectsContext';
import { Sparkles, CheckCircle2, Circle, Plus, Trash2, Zap, ArrowUpRight, HardDrive, ExternalLink, MessageSquare } from 'lucide-react';
import { AestheticSunIcon, AestheticCloudIcon, AestheticStarIcon, AestheticBriefcaseIcon } from './AestheticIcons';

export default function TodayView() {
  const { userName, level, streak } = useGamification();
  const { tasks, addTask, toggleTask, deleteTask, projects, setActiveProject, projectNicknames } = useProjects();
  const [newTodayTask, setNewTodayTask] = useState('');
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [driveFiles, setDriveFiles] = useState([]);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getGoogleDriveFiles(6).then((res) => {
        if (res && res.success) {
          setDriveFiles(res.files || []);
        }
      });
    }
  }, []);

  const dialogues = [
    `Ciao ${userName || 'Avventuriero'}! Pronti a fare grandi cose oggi?`,
    `Ogni piccolo passo ti porta lontano! Continua così!`,
    `Focalizzati sui tuoi obiettivi. Io sono con te!`,
    `Ricordati di fare qualche pausa tra una sessione e l'altra!`,
    `Stai facendo un ottimo lavoro! Continua a guadagnare XP!`
  ];


  const todayTasks = tasks.filter((t) => !t.projectId || t.projectId === 'today');
  const activeProjectsCount = projects.length;

  const handleAddTodayTask = (e) => {
    e.preventDefault();
    if (!newTodayTask.trim()) return;
    addTask('today', newTodayTask.trim(), 'high');
    setNewTodayTask('');
  };

  const handleSnailClick = () => {
    setDialogueIndex((prev) => (prev + 1) % dialogues.length);
  };

  return (
    <div className="projects-canvas-container select-none">
      {/* CUTE WELCOME BANNER WITH PROMINENT MASCOT */}
      <div className="dashboard-card bg-[#6B5887] text-white mb-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between p-8 shadow-2xl gap-6 border border-white/20">
        <div className="flex items-center gap-6 z-10">
          {/* Cute Floating Snail Mascot */}
          <div
            onClick={handleSnailClick}
            className="relative cursor-pointer group shrink-0"
            title="Clicca sulla lumaca per farla parlare!"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-white/30 to-white/10 p-2 border-2 border-white/40 shadow-2xl backdrop-blur-md flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <img
                src="/ntp_snail.png"
                alt="epicSnail Mascot"
                className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] animate-bounce"
                style={{ animationDuration: '3s' }}
              />
            </div>
            
            <div className="absolute -bottom-2 -right-2 bg-[#E8D19E] text-[#3b2c0f] font-black text-xs px-3 py-1 rounded-full border-2 border-[#3b2c0f] shadow-md flex items-center gap-1">
              <span>Streak:</span> {streak}d
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-wide flex items-center gap-3">
              Bentornato, {userName || 'Avventuriero'}!
            </h1>

            {/* Interactive Speech Bubble */}
            <div
              onClick={handleSnailClick}
              className="mt-1 px-4 py-2.5 rounded-2xl bg-[#2b1c47]/90 border border-[#9D85C6]/50 shadow-lg text-xs font-bold text-[#E8D19E] flex items-center gap-2 cursor-pointer hover:bg-[#2b1c47] transition-all max-w-md"
            >
              <MessageSquare className="w-4 h-4 text-[#9D85C6] shrink-0" />
              <span>{dialogues[dialogueIndex]}</span>
            </div>
          </div>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-4 z-10">
          <div className="bg-[#1e1333]/80 p-4 rounded-2xl border border-white/20 flex items-center gap-3.5 shadow-md">
            <AestheticStarIcon className="w-8 h-8 shrink-0 filter drop-shadow-md" />
            <div>
              <span className="text-[10px] text-white/70 font-mono font-bold uppercase tracking-wider block">Livello</span>
              <span className="text-lg font-black text-[#E8D19E]">Livello {level}</span>
            </div>
          </div>

          <div className="bg-[#1e1333]/80 p-4 rounded-2xl border border-white/20 flex items-center gap-3.5 shadow-md">
            <AestheticBriefcaseIcon className="w-8 h-8 shrink-0 filter drop-shadow-md" />
            <div>
              <span className="text-[10px] text-white/70 font-mono font-bold uppercase tracking-wider block">Progetti</span>
              <span className="text-lg font-black text-white">{activeProjectsCount} Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Today Tasks (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="dashboard-card theme-sand p-7">
            <h2 className="font-heading font-black text-2xl text-[#3b2c0f] mb-6 flex items-center gap-3">
              <AestheticSunIcon className="w-8 h-8 shrink-0 filter drop-shadow-md" />
              Focus di Oggi
            </h2>

            {/* Quick Add Form */}
            <form onSubmit={handleAddTodayTask} className="flex gap-3 mb-6">
              <input
                type="text"
                placeholder="Aggiungi una priorità per oggi..."
                value={newTodayTask}
                onChange={(e) => setNewTodayTask(e.target.value)}
                className="flex-1 bg-white/80 border-amber-900/30 text-amber-950 text-sm font-semibold rounded-2xl px-5 py-3 placeholder-amber-900/50"
              />
              <button
                type="submit"
                className="action-pill bg-[#3b2c0f] text-white hover:bg-black"
              >
                <Plus className="w-4 h-4" />
                <span>Aggiungi</span>
              </button>
            </form>

            {/* Task list */}
            <div className="flex flex-col gap-3">
              {todayTasks.length === 0 ? (
                <p className="text-xs text-amber-900/70 font-bold text-center py-8">
                  Tutti i task di oggi sono stati completati!
                </p>
              ) : (
                todayTasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/60 border border-amber-900/15 group transition-all"
                  >
                    <div
                      onClick={() => toggleTask(t.id)}
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      {t.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-amber-900/40 shrink-0" />
                      )}
                      <span
                        className={`text-sm font-bold ${
                          t.completed ? 'line-through text-amber-900/40' : 'text-amber-950'
                        }`}
                      >
                        {t.title}
                      </span>
                    </div>

                    <button
                      onClick={() => deleteTask(t.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 rounded-xl text-amber-900/50 hover:text-rose-700 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Projects Shortcut */}
        <div className="flex flex-col gap-6">
          <div className="dashboard-card theme-blue p-7">
            <h2 className="font-heading font-black text-xl text-[#0f273b] mb-6">
              Progetti Recenti
            </h2>

            <div className="flex flex-col gap-3">
              {projects.slice(0, 5).map((p) => {
                const displayName = projectNicknames[p.id] || p.name;
                return (
                  <div
                    key={p.id}
                    onClick={() => setActiveProject(p)}
                    className="p-4 rounded-2xl bg-white/50 hover:bg-white/80 border border-black/10 cursor-pointer flex items-center justify-between group transition-all shadow-sm"
                  >
                    <div className="truncate max-w-[160px]">
                      <span className="text-xs font-black text-[#0f273b] block truncate">
                        {displayName}
                      </span>
                      <span className="text-[11px] text-[#0f273b]/70 font-mono block">
                        {p.branch}
                      </span>
                    </div>

                    <ArrowUpRight className="w-4 h-4 text-[#0f273b]/60 group-hover:text-black transition-colors" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Google Drive Recent Files Card */}
          {driveFiles.length > 0 && (
            <div className="dashboard-card bg-[#2b1c47] border border-[#A5C4DC]/40 p-6 flex flex-col gap-4 shadow-xl">
              <h2 className="font-heading font-black text-lg text-white flex items-center gap-3">
                <AestheticCloudIcon className="w-8 h-8 shrink-0 filter drop-shadow-md" />
                Google Drive Recenti
              </h2>

              <div className="flex flex-col gap-2.5">
                {driveFiles.map((f) => (
                  <a
                    key={f.id}
                    href={f.webViewLink}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-[#1e1333] hover:bg-[#6B5887]/40 border border-white/10 flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      {f.iconLink ? (
                        <img src={f.iconLink} alt="" className="w-4 h-4 shrink-0" />
                      ) : (
                        <HardDrive className="w-4 h-4 text-[#A5C4DC] shrink-0" />
                      )}
                      <span className="text-xs font-bold text-white truncate">{f.name}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#A5C4DC] opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
