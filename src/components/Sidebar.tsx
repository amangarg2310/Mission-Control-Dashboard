import React from 'react';
import {
  LayoutDashboardIcon,
  ActivityIcon,
  MessageSquareIcon,
  BotIcon,
  BarChart3Icon,
  SettingsIcon,
  TerminalSquareIcon } from
'lucide-react';
export type PageType =
'dashboard' |
'runs' |
'chats' |
'agents' |
'usage' |
'settings';
interface SidebarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}
const navItems: {
  id: PageType;
  label: string;
  icon: React.ElementType;
}[] = [
{
  id: 'dashboard',
  label: 'Mission Control',
  icon: LayoutDashboardIcon
},
{
  id: 'runs',
  label: 'Run Inspector',
  icon: ActivityIcon
},
{
  id: 'chats',
  label: 'Chat Workspace',
  icon: MessageSquareIcon
},
{
  id: 'agents',
  label: 'Agent Registry',
  icon: BotIcon
},
{
  id: 'usage',
  label: 'Usage & Cost',
  icon: BarChart3Icon
},
{
  id: 'settings',
  label: 'Settings',
  icon: SettingsIcon
}];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 h-screen flex flex-col bg-[#050506] border-r border-border flex-shrink-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-border/50">
        <div className="flex items-center gap-3 text-foreground font-semibold tracking-wide">
          <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center border border-accent/20">
            <TerminalSquareIcon className="w-5 h-5 text-accent" />
          </div>
          OpenClaw
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#050506] ${isActive ? 'bg-accent/10 text-accent border-l-2 border-accent rounded-l-sm' : 'text-muted hover:bg-white/5 hover:text-foreground border-l-2 border-transparent rounded-l-sm'}`}>
              
              <Icon
                className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-muted'}`} />
              
              {item.label}
            </button>);

        })}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-border/50">
        <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-accent">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
            JD
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-foreground">
              John Doe
            </span>
            <span className="text-xs text-muted">Acme Corp</span>
          </div>
        </button>
      </div>
    </aside>);

}