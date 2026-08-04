import React, { useState } from 'react';
import { Settings, FolderPlus, Trash2 } from 'lucide-react';
import { useProjects } from '../context/ProjectsContext';

export default function SettingsView() {
  const { refreshProjects } = useProjects();
  const [scanPaths, setScanPaths] = useState([
    'C:\\Users\\Clark\\Desktop',
    'C:\\Users\\Clark\\Desktop\\Cosciottina\\Nuova cartella'
  ]);
  const [newPath, setNewPath] = useState('');

  const handleAddPath = (e) => {
    e.preventDefault();
    if (!newPath.trim()) return;
    const updated = [...scanPaths, newPath.trim()];
    setScanPaths(updated);
    setNewPath('');
    if (window.electronAPI) {
      window.electronAPI.setStoreData('scanPaths', updated);
    }
    refreshProjects();
  };

  const handleRemovePath = (index) => {
    const updated = scanPaths.filter((_, i) => i !== index);
    setScanPaths(updated);
    if (window.electronAPI) {
      window.electronAPI.setStoreData('scanPaths', updated);
    }
    refreshProjects();
  };

  return (
    <div className="projects-canvas-container select-none">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-heading font-black text-3xl text-white flex items-center gap-3">
          <Settings className="w-7 h-7 text-[#9D85C6]" />
          Impostazioni epicSnail
        </h1>
      </div>

      <div className="max-w-2xl dashboard-card theme-sage p-7 flex flex-col gap-6">
        <div>
          <h2 className="font-heading font-black text-xl text-[#15260f] mb-2">
            Percorsi Scansione Disco
          </h2>
          <p className="text-xs text-[#15260f]/80 font-mono mb-6">
            Cartelle che epicSnail scansiona per trovare repository Git.
          </p>

          <form onSubmit={handleAddPath} className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="Aggiungi percorso (es. C:\Users\Mary\Projects)..."
              value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
              className="flex-1 bg-white/80 border-[#15260f]/30 text-[#15260f] text-xs font-bold rounded-2xl px-5 py-3 placeholder-[#15260f]/50"
            />
            <button
              type="submit"
              className="action-pill bg-[#15260f] text-white hover:bg-black"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Aggiungi</span>
            </button>
          </form>

          <div className="flex flex-col gap-3">
            {scanPaths.map((p, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white/50 border border-[#15260f]/20 flex items-center justify-between font-mono text-xs text-[#15260f] font-bold"
              >
                <span>{p}</span>
                <button
                  onClick={() => handleRemovePath(idx)}
                  className="p-2 rounded-xl text-[#15260f]/60 hover:text-rose-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
