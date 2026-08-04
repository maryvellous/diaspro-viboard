import React, { useState } from 'react';
import { GamificationProvider } from './context/GamificationContext';
import { ProjectsProvider } from './context/ProjectsContext';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TodayView from './components/TodayView';
import ProjectsView from './components/ProjectsView';
import GoogleCalendarWidget from './components/GoogleCalendarWidget';
import SettingsView from './components/SettingsView';
import ProjectDetailModal from './components/ProjectDetailModal';
import QuickSearchModal from './components/QuickSearchModal';
import XpPopNotification from './components/XpPopNotification';

function MainContent({ currentTab, onOpenSearch }) {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-gradient-to-b from-[#432A69] via-[#2f1d4b] to-[#1c0f32]">
      <Header onOpenSearch={onOpenSearch} />
      <div className="flex-1 flex overflow-hidden">
        {currentTab === 'today' && <TodayView />}
        {currentTab === 'projects' && <ProjectsView />}
        {currentTab === 'calendar' && <GoogleCalendarWidget />}
        {currentTab === 'settings' && <SettingsView />}
      </div>
    </div>
  );
}

export default function App() {
  const [currentTab, setCurrentTab] = useState('projects');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <GamificationProvider>
      <ProjectsProvider>
        <div className="flex h-screen w-screen overflow-hidden select-none">
          <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
          <MainContent
            currentTab={currentTab}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
          <ProjectDetailModal />
          <QuickSearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
          />
          <XpPopNotification />
        </div>
      </ProjectsProvider>
    </GamificationProvider>
  );
}
