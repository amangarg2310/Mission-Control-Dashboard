import React, { useState, createElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchIcon,
  TerminalIcon,
  CpuIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  ClockIcon,
  DatabaseIcon,
  ZapIcon,
  ChevronRightIcon } from
'lucide-react';
type EventType = 'model' | 'tool' | 'success' | 'error' | 'system';
interface RunEvent {
  id: string;
  type: EventType;
  name: string;
  startMs: number;
  durationMs: number;
  details: {
    model?: string;
    tokens?: number;
    cost?: number;
    toolName?: string;
    query?: string;
    error?: string;
  };
}
const TOTAL_DURATION = 3200;
const mockEvents: RunEvent[] = [
{
  id: 'e1',
  type: 'system',
  name: 'Task Initialized',
  startMs: 0,
  durationMs: 50,
  details: {}
},
{
  id: 'e2',
  type: 'model',
  name: 'Router (gpt-4o-mini)',
  startMs: 50,
  durationMs: 450,
  details: {
    model: 'gpt-4o-mini',
    tokens: 120,
    cost: 0.0002
  }
},
{
  id: 'e3',
  type: 'system',
  name: 'Agent Assigned: Researcher',
  startMs: 500,
  durationMs: 20,
  details: {}
},
{
  id: 'e4',
  type: 'model',
  name: 'Plan Execution (claude-3-haiku)',
  startMs: 520,
  durationMs: 800,
  details: {
    model: 'claude-3-haiku',
    tokens: 450,
    cost: 0.0015
  }
},
{
  id: 'e5',
  type: 'tool',
  name: 'search_web',
  startMs: 1320,
  durationMs: 950,
  details: {
    toolName: 'search_web',
    query: 'Q3 tech earnings reports 2023'
  }
},
{
  id: 'e6',
  type: 'model',
  name: 'Synthesize Results (gpt-4o)',
  startMs: 2270,
  durationMs: 850,
  details: {
    model: 'gpt-4o',
    tokens: 1850,
    cost: 0.0185
  }
},
{
  id: 'e7',
  type: 'success',
  name: 'Task Completed',
  startMs: 3120,
  durationMs: 80,
  details: {}
}];

const typeColors: Record<EventType, string> = {
  model: 'bg-status-model',
  tool: 'bg-status-tool',
  success: 'bg-status-success',
  error: 'bg-status-failed',
  system: 'bg-muted'
};
const typeIcons: Record<EventType, React.ElementType> = {
  model: CpuIcon,
  tool: TerminalIcon,
  success: CheckCircle2Icon,
  error: AlertCircleIcon,
  system: ZapIcon
};
export function RunInspector() {
  const [selectedEventId, setSelectedEventId] = useState<string>(
    mockEvents[3].id
  );
  const selectedEvent = mockEvents.find((e) => e.id === selectedEventId);
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header & Minimap */}
      <header className="flex-shrink-0 border-b border-border p-6 bg-card/30">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-semibold text-foreground tracking-tight">
                Run: run_8f92a
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-status-success/10 text-status-success text-xs font-medium border border-status-success/20">
                Completed
              </span>
            </div>
            <p className="text-sm text-muted flex items-center gap-2">
              <ClockIcon className="w-4 h-4" /> Total Duration:{' '}
              {(TOTAL_DURATION / 1000).toFixed(2)}s
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">
                Total Cost
              </div>
              <div className="text-xs text-muted font-mono tabular-nums">
                $0.0202
              </div>
            </div>
            <div className="w-px h-8 bg-border mx-2" />
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">Tokens</div>
              <div className="text-xs text-muted font-mono tabular-nums">
                2,420
              </div>
            </div>
          </div>
        </div>

        {/* Minimap Overview */}
        <div className="h-8 w-full bg-[#050506] rounded-md border border-border relative overflow-hidden">
          {mockEvents.map((event) => {
            const left = event.startMs / TOTAL_DURATION * 100;
            const width = Math.max(
              event.durationMs / TOTAL_DURATION * 100,
              0.5
            );
            return (
              <div
                key={`mini-${event.id}`}
                className={`absolute top-0 bottom-0 opacity-70 ${typeColors[event.type]}`}
                style={{
                  left: `${left}%`,
                  width: `${width}%`
                }} />);


          })}
        </div>
      </header>

      {/* Main Two-Pane Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane: Waterfall Gantt */}
        <div className="w-2/3 border-r border-border overflow-y-auto relative gantt-grid bg-[#0a0a0c]">
          <div className="min-w-[600px] py-4">
            {mockEvents.map((event, i) => {
              const isSelected = selectedEventId === event.id;
              const left = event.startMs / TOTAL_DURATION * 100;
              const width = Math.max(
                event.durationMs / TOTAL_DURATION * 100,
                0.5
              );
              const Icon = typeIcons[event.type];
              return (
                <div
                  key={event.id}
                  onClick={() => setSelectedEventId(event.id)}
                  className={`relative flex items-center h-12 px-4 cursor-pointer transition-colors group ${isSelected ? 'bg-accent/5 border-l-2 border-l-accent' : 'border-l-2 border-l-transparent hover:bg-white/5'}`}>
                  
                  {/* Event Label */}
                  <div className="w-48 flex-shrink-0 flex items-center gap-2 z-10">
                    <Icon
                      className={`w-4 h-4 ${isSelected ? 'text-accent' : 'text-muted group-hover:text-foreground'}`} />
                    
                    <span
                      className={`text-sm truncate ${isSelected ? 'text-foreground font-medium' : 'text-muted group-hover:text-foreground'}`}>
                      
                      {event.name}
                    </span>
                  </div>

                  {/* Gantt Area */}
                  <div className="flex-1 relative h-full flex items-center">
                    <motion.div
                      layoutId={`bar-${event.id}`}
                      className={`absolute h-[10px] rounded-full ${typeColors[event.type]} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
                      style={{
                        left: `${left}%`,
                        width: `${width}%`
                      }}
                      initial={false}
                      animate={{
                        boxShadow: isSelected ?
                        `0 0 15px var(--${event.type === 'system' ? 'muted' : `status-${event.type}`})` :
                        'none'
                      }} />
                    
                    <span
                      className="absolute text-[10px] text-muted font-mono tabular-nums ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        left: `${left + width}%`
                      }}>
                      
                      {event.durationMs}ms
                    </span>
                  </div>
                </div>);

            })}
          </div>
        </div>

        {/* Right Pane: Event Details */}
        <div className="w-1/3 bg-card/30 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {selectedEvent ?
            <motion.div
              key={selectedEvent.id}
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                y: -10
              }}
              transition={{
                duration: 0.2
              }}
              className="space-y-6">
              
                <div className="flex items-center gap-3 pb-4 border-b border-border/50 section-header-fade">
                  <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center bg-card border border-border ${typeColors[selectedEvent.type].replace('bg-', 'text-')}`}>
                  
                    {createElement(typeIcons[selectedEvent.type], {
                    className: 'w-5 h-5'
                  })}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {selectedEvent.name}
                    </h2>
                    <p className="text-xs text-muted uppercase tracking-wider">
                      {selectedEvent.type} EVENT
                    </p>
                  </div>
                </div>

                {/* Timing Card */}
                <div className="bg-card rounded-xl p-4 border border-border card-glow">
                  <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-3">
                    Timing
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-muted mb-1">Start Time</div>
                      <div className="text-sm font-mono text-foreground tabular-nums">
                        {selectedEvent.startMs}ms
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted mb-1">Duration</div>
                      <div className="text-sm font-mono text-foreground tabular-nums">
                        {selectedEvent.durationMs}ms
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metadata Cards */}
                {selectedEvent.details.model &&
              <div className="bg-card rounded-xl p-4 border border-border card-glow">
                    <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                      <CpuIcon className="w-4 h-4" /> Model Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted">Model</span>
                        <span className="text-sm font-medium text-foreground bg-white/5 px-2 py-1 rounded">
                          {selectedEvent.details.model}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted">Tokens</span>
                        <span className="text-sm font-mono text-foreground tabular-nums">
                          {selectedEvent.details.tokens}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted">Cost</span>
                        <span className="text-sm font-mono text-status-model tabular-nums">
                          ${selectedEvent.details.cost?.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>
              }

                {selectedEvent.details.toolName &&
              <div className="bg-card rounded-xl p-4 border border-border card-glow">
                    <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                      <TerminalIcon className="w-4 h-4" /> Tool Execution
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted">Tool</span>
                        <span className="text-sm font-mono text-status-tool bg-status-tool/10 px-2 py-1 rounded">
                          {selectedEvent.details.toolName}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-muted block mb-2">
                          Query Payload
                        </span>
                        <div className="bg-[#050506] border border-border rounded-md p-3 text-xs font-mono text-status-tool/80 overflow-x-auto">
                          {selectedEvent.details.query}
                        </div>
                      </div>
                    </div>
                  </div>
              }
              </motion.div> :

            <div className="flex flex-col items-center justify-center h-full text-muted">
                <SearchIcon className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm">Select an event to view details</p>
              </div>
            }
          </AnimatePresence>
        </div>
      </div>
    </div>);

}