import React, { useState } from 'react';
import { Sidebar, PageType } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { RunInspector } from './pages/RunInspector';
import { ChatWorkspace } from './pages/ChatWorkspace';
import { CreateTaskModal } from './components/modals/CreateTaskModal';
import { AgentRegistry } from './pages/AgentRegistry';
import { UsageDashboard } from './pages/UsageDashboard';
import { Settings } from './pages/Settings';
export function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  return (
    <div className="flex w-full h-screen bg-background overflow-hidden text-foreground font-sans">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

      <main className="flex-1 h-full relative">
        {currentPage === 'dashboard' &&
        <Dashboard onCreateTask={() => setIsCreateModalOpen(true)} />
        }
        {currentPage === 'runs' && <RunInspector />}
        {currentPage === 'chats' && <ChatWorkspace />}
        {currentPage === 'agents' && <AgentRegistry />}
        {currentPage === 'usage' && <UsageDashboard />}
        {currentPage === 'settings' && <Settings />}
      </main>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)} />
      
    </div>);

}