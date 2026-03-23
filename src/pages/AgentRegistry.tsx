import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BotIcon,
  SearchIcon,
  PlusIcon,
  MoreVerticalIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  WrenchIcon,
  ActivityIcon,
  DollarSignIcon,
  ArrowRightIcon,
  CpuIcon,
  AlertTriangleIcon } from
'lucide-react';
import { StatusBadge, StatusType } from '../components/shared/StatusBadge';
interface Agent {
  id: string;
  name: string;
  description: string;
  status: StatusType;
  color: string;
  initials: string;
  routing: {
    default: string;
    escalation: string;
  };
  stats: {
    runs: number;
    runsTarget: number;
    avgCost: number;
    costTarget: number;
    budgetUsed: number; // percentage
  };
  systemPrompt: string;
  tools: string[];
}
const mockAgents: Agent[] = [
{
  id: 'a1',
  name: 'ResearchBot',
  description: 'Autonomous web researcher and data aggregator',
  status: 'running',
  color: '#a855f7',
  initials: 'RB',
  routing: {
    default: 'gpt-4o-mini',
    escalation: 'gpt-4-turbo'
  },
  stats: {
    runs: 1240,
    runsTarget: 2000,
    avgCost: 0.04,
    costTarget: 0.1,
    budgetUsed: 65
  },
  systemPrompt:
  'You are an expert research assistant. Your goal is to find accurate, up-to-date information across the web and synthesize it into clear, objective reports. Always cite your sources.',
  tools: ['search_web', 'read_url', 'extract_data']
},
{
  id: 'a2',
  name: 'DataAnalyzer',
  description: 'Quantitative analysis and visualization specialist',
  status: 'success',
  color: '#3b82f6',
  initials: 'DA',
  routing: {
    default: 'claude-3-haiku',
    escalation: 'claude-3-opus'
  },
  stats: {
    runs: 856,
    runsTarget: 1000,
    avgCost: 0.12,
    costTarget: 0.2,
    budgetUsed: 82
  },
  systemPrompt:
  'You are a senior data scientist. Analyze the provided datasets, identify trends, and generate insights. Use Python for complex calculations when necessary.',
  tools: ['python_repl', 'query_sql', 'generate_chart']
},
{
  id: 'a3',
  name: 'Copywriter',
  description: 'Creative content generation and editing',
  status: 'success',
  color: '#10b981',
  initials: 'CW',
  routing: {
    default: 'gpt-3.5-turbo',
    escalation: 'gpt-4o'
  },
  stats: {
    runs: 342,
    runsTarget: 500,
    avgCost: 0.01,
    costTarget: 0.05,
    budgetUsed: 24
  },
  systemPrompt:
  'You are an expert copywriter. Create engaging, brand-aligned content based on the provided briefs. Maintain a professional yet approachable tone.',
  tools: ['check_grammar', 'seo_analyzer']
},
{
  id: 'a4',
  name: 'CodeReviewer',
  description: 'Automated PR review and security scanning',
  status: 'failed',
  color: '#ef4444',
  initials: 'CR',
  routing: {
    default: 'gpt-4-turbo',
    escalation: 'gpt-4-turbo'
  },
  stats: {
    runs: 2105,
    runsTarget: 3000,
    avgCost: 0.08,
    costTarget: 0.1,
    budgetUsed: 95
  },
  systemPrompt:
  'You are a strict senior software engineer. Review code for bugs, security vulnerabilities, and style violations. Be concise and actionable in your feedback.',
  tools: ['github_api', 'run_linter', 'sast_scanner']
}];

// Mini circular progress component
function MiniProgressRing({
  progress,
  color



}: {progress: number;color: string;}) {
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress / 100 * circumference;
  return (
    <div className="relative w-6 h-6 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="12"
          cy="12"
          r={radius}
          stroke="currentColor"
          strokeWidth="2"
          fill="transparent"
          className="text-border" />
        
        <circle
          cx="12"
          cy="12"
          r={radius}
          stroke={color}
          strokeWidth="2"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out" />
        
      </svg>
    </div>);

}
// Mini bar chart component
function MiniBar({
  value,
  max,
  color




}: {value: number;max: number;color: string;}) {
  const percentage = Math.min(100, value / max * 100);
  return (
    <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${percentage}%`,
          backgroundColor: color
        }} />
      
    </div>);

}
function AgentCard({ agent }: {agent: Agent;}) {
  const [expanded, setExpanded] = useState(false);
  const isBusy = agent.status === 'running';
  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 10
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      className="bg-card rounded-xl border border-border/50 card-glow overflow-hidden flex flex-col relative">
      
      {/* Top border identity color */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          backgroundColor: agent.color
        }} />
      

      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              {isBusy &&
              <div
                className="absolute -inset-1 rounded-full border border-dashed busy-ring opacity-50"
                style={{
                  borderColor: agent.color
                }} />

              }
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border border-white/10"
                style={{
                  backgroundColor: `${agent.color}20`,
                  color: agent.color
                }}>
                
                {agent.initials}
              </div>
            </div>
            <div>
              <h3 className="text-foreground font-medium flex items-center gap-2">
                {agent.name}
                <StatusBadge status={agent.status} size="sm" />
              </h3>
              <p className="text-muted text-xs mt-0.5 line-clamp-1">
                {agent.description}
              </p>
            </div>
          </div>
          <button className="text-muted hover:text-foreground p-1 rounded transition-colors">
            <MoreVerticalIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Routing Pipeline */}
        <div className="mb-5 bg-background/50 rounded-lg p-3 border border-border/30">
          <div className="text-[10px] uppercase tracking-wider text-muted mb-2 font-medium">
            Model Routing
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-status-success/10 border border-status-success/20 rounded px-2 py-1.5 flex items-center gap-1.5">
              <CpuIcon className="w-3 h-3 text-status-success" />
              <span className="text-xs text-status-success font-mono truncate">
                {agent.routing.default}
              </span>
            </div>
            <ArrowRightIcon className="w-3 h-3 text-muted flex-shrink-0" />
            <div className="flex-1 bg-status-approval/10 border border-status-approval/20 rounded px-2 py-1.5 flex items-center gap-1.5">
              <AlertTriangleIcon className="w-3 h-3 text-status-approval" />
              <span className="text-xs text-status-approval font-mono truncate">
                {agent.routing.escalation}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-muted font-medium flex items-center gap-1">
              <ActivityIcon className="w-3 h-3" /> Runs
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono tabular-nums text-foreground">
                {agent.stats.runs}
              </span>
              <MiniBar
                value={agent.stats.runs}
                max={agent.stats.runsTarget}
                color={agent.color} />
              
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-muted font-medium flex items-center gap-1">
              <DollarSignIcon className="w-3 h-3" /> Avg Cost
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono tabular-nums text-foreground">
                ${agent.stats.avgCost.toFixed(2)}
              </span>
              <MiniBar
                value={agent.stats.avgCost}
                max={agent.stats.costTarget}
                color={agent.color} />
              
            </div>
          </div>
          <div className="flex flex-col gap-1.5 items-end">
            <span className="text-[10px] uppercase tracking-wider text-muted font-medium">
              Budget
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono tabular-nums text-foreground">
                {agent.stats.budgetUsed}%
              </span>
              <MiniProgressRing
                progress={agent.stats.budgetUsed}
                color={agent.stats.budgetUsed > 90 ? '#ef4444' : agent.color} />
              
            </div>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-muted hover:text-foreground transition-colors border-t border-border/50 mt-2">
          
          {expanded ? 'Hide Details' : 'Show Details'}
          {expanded ?
          <ChevronUpIcon className="w-3 h-3" /> :

          <ChevronDownIcon className="w-3 h-3" />
          }
        </button>
      </div>

      <AnimatePresence>
        {expanded &&
        <motion.div
          initial={{
            height: 0,
            opacity: 0
          }}
          animate={{
            height: 'auto',
            opacity: 1
          }}
          exit={{
            height: 0,
            opacity: 0
          }}
          className="overflow-hidden border-t border-border/50 bg-background/30">
          
            <div className="p-5 space-y-4">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted mb-1.5 font-medium">
                  System Prompt
                </div>
                <div className="bg-[#0d0d0f] border border-border/50 rounded p-2.5 text-xs text-muted font-mono leading-relaxed max-h-24 overflow-y-auto">
                  {agent.systemPrompt}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted mb-1.5 font-medium flex items-center gap-1">
                  <WrenchIcon className="w-3 h-3" /> Tools ({agent.tools.length}
                  )
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {agent.tools.map((tool) =>
                <span
                  key={tool}
                  className="px-2 py-0.5 rounded bg-status-tool/10 border border-status-tool/20 text-status-tool text-[10px] font-mono">
                  
                      {tool}
                    </span>
                )}
                </div>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </motion.div>);

}
export function AgentRegistry() {
  return (
    <div className="flex-1 h-screen overflow-y-auto bg-background">
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Header */}
        <header className="flex items-center justify-between section-header-fade pb-2">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight flex items-center gap-2">
              <BotIcon className="w-6 h-6 text-accent" />
              Agent Registry
            </h1>
            <p className="text-sm text-muted mt-1">
              Manage and configure your autonomous workforce.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search agents..."
                className="bg-card border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-accent w-64 transition-colors" />
              
            </div>
            <button className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <PlusIcon className="w-4 h-4" />
              New Agent
            </button>
          </div>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          {mockAgents.map((agent) =>
          <AgentCard key={agent.id} agent={agent} />
          )}
        </div>
      </div>
    </div>);

}