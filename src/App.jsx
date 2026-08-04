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

import OnboardingWizard from './components/OnboardingWizard';
import { useGamification } from './context/GamificationContext';

import SpotifyWidget from './components/SpotifyWidget';
import ChatPanel from './components/ChatPanel';

function MainContent({ currentTab, onOpenSearch }) {
  if (currentTab === 'chat') {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <ChatPanel />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-gradient-to-b from-[#432A69] via-[#2f1d4b] to-[#1c0f32]">
      <Header onOpenSearch={onOpenSearch} />
      <div className="flex-1 flex overflow-hidden">
        {currentTab === 'today' && <TodayView />}
        {currentTab === 'projects' && <ProjectsView />}
        {currentTab === 'calendar' && <GoogleCalendarWidget />}
        {currentTab === 'spotify' && <SpotifyWidget />}
        {currentTab === 'settings' && <SettingsView />}
      </div>
    </div>
  );
}


function AppInner() {
  const { firstLaunchCompleted } = useGamification();
  const [currentTab, setCurrentTab] = useState('projects');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
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
      {!firstLaunchCompleted && <OnboardingWizard />}
    </div>
  );
}

export default function App() {
  return (
    <GamificationProvider>
      <ProjectsProvider>
        <AppInner />
      </ProjectsProvider>
    </GamificationProvider>
  );
}

