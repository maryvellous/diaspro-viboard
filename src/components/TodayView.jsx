import React, { useState } from 'react';
import { useGamification } from '../context/GamificationContext';
import { useProjects } from '../context/ProjectsContext';
import { Sparkles, CheckCircle2, Circle, Plus, Trash2, Zap, ArrowUpRight } from 'lucide-react';

export default function TodayView() {
  const { userName, level, streak } = useGamification();
  const { tasks, addTask, toggleTask, deleteTask, projects, setActiveProject, projectNicknames } = useProjects();
  const [newTodayTask, setNewTodayTask] = useState('');

  const todayTasks = tasks.filter((t) => !t.projectId || t.projectId === 'today');
  const activeProjectsCount = projects.length;

  const handleAddTodayTask = (e) => {
    e.preventDefault();
    if (!newTodayTask.trim()) return;
    addTask('today', newTodayTask.trim(), 'high');
    setNewTodayTask('');
  };

  return (
    <div className="projects-canvas-container select-none">
      {/* Welcome Banner Card in Sidebar Purple #6B5887 */}
      <div className="dashboard-card bg-[#6B5887] text-white mb-10 relative overflow-hidden flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-6 z-10">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-white/20 p-1 border border-white/30 shadow-lg">
              <img
                src="/ntp_snail.png"
                alt="epicSnail"
                className="w-full h-full object-contain animate-snail filter drop-shadow-xl"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-amber-300 text-amber-950 font-black text-xs px-2.5 py-0.5 rounded-full border border-amber-950 shadow">
              {streak}d
            </div>
          </div>

          <div>
            <h1 className="font-heading font-black text-3xl text-white flex items-center gap-3">
              Bentornato, {userName || 'Avventuriero'}
            </h1>
            <p className="text-sm font-medium text-white/80 mt-1">
              epicSnail è pronta per la tua sessione di lavoro.
            </p>
          </div>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-4 z-10">
          <div className="bg-black/30 p-4 rounded-2xl border border-white/20 flex items-center gap-3 shadow-md">
            <Zap className="w-6 h-6 text-amber-300 fill-amber-300 animate-pulse" />
            <div>
              <span className="text-[11px] text-white/60 font-mono font-bold uppercase block">Livello</span>
              <span className="text-lg font-black text-white">{level}</span>
            </div>
          </div>

          <div className="bg-black/30 p-4 rounded-2xl border border-white/20 flex items-center gap-3 shadow-md">
            <Sparkles className="w-6 h-6 text-[#A5C4DC]" />
            <div>
              <span className="text-[11px] text-white/60 font-mono font-bold uppercase block">Progetti</span>
              <span className="text-lg font-black text-white">{activeProjectsCount}</span>
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
              <CheckCircle2 className="w-6 h-6 text-amber-800" />
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
                  Tutti i task di oggi sono stati completati! 🎉
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
        </div>
      </div>
    </div>
  );
}
