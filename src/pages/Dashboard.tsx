import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ActivityIcon,
  CheckCircle2Icon,
  ClockIcon,
  AlertTriangleIcon,
  DollarSignIcon,
  ZapIcon,
  PlusIcon,
  XIcon,
  TerminalIcon,
  DatabaseIcon,
  SearchIcon,
  PenToolIcon,
  CheckIcon } from
'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer } from
'recharts';
import { MetricCard } from '../components/shared/MetricCard';
import { StatusBadge, StatusType } from '../components/shared/StatusBadge';
// --- Mock Data ---
const costData = [
{
  time: 'Mon',
  cost: 12.5
},
{
  time: 'Tue',
  cost: 18.2
},
{
  time: 'Wed',
  cost: 15.8
},
{
  time: 'Thu',
  cost: 24.4
},
{
  time: 'Fri',
  cost: 32.1
},
{
  time: 'Sat',
  cost: 28.5
},
{
  time: 'Sun',
  cost: 42.18
}];

const activeRuns = [
{
  id: 'run_8f92a',
  agent: 'ResearchBot',
  status: 'running' as StatusType,
  duration: '45s',
  progress: 65
},
{
  id: 'run_3b11c',
  agent: 'DataAnalyzer',
  status: 'approval' as StatusType,
  duration: '2m 12s',
  progress: 90
},
{
  id: 'run_9x44p',
  agent: 'Copywriter',
  status: 'running' as StatusType,
  duration: '12s',
  progress: 30
},
{
  id: 'run_1a88m',
  agent: 'CodeReviewer',
  status: 'failed' as StatusType,
  duration: '5s',
  progress: 10
},
{
  id: 'run_7c22z',
  agent: 'SupportAgent',
  status: 'success' as StatusType,
  duration: '1m 4s',
  progress: 100
}];

const activityFeed = [
{
  id: 1,
  type: 'model',
  text: 'ResearchBot called gpt-4-turbo (1.2k tokens)',
  time: '2m ago'
},
{
  id: 2,
  type: 'tool',
  text: 'DataAnalyzer executed search_web tool',
  time: '5m ago'
},
{
  id: 3,
  type: 'success',
  text: 'Copywriter completed task "Draft Q3 Blog Post"',
  time: '12m ago'
},
{
  id: 4,
  type: 'approval',
  text: 'CodeReviewer requires human approval for PR merge',
  time: '18m ago'
},
{
  id: 5,
  type: 'error',
  text: 'SupportAgent failed: Rate limit exceeded',
  time: '1h ago'
},
{
  id: 6,
  type: 'model',
  text: 'ResearchBot called claude-3-opus (4.5k tokens)',
  time: '2h ago'
}];

// --- Subcomponents ---
function PipelineNode({ name, icon: Icon, status, initials, color }: any) {
  return (
    <div className="flex flex-col items-center gap-3 z-10">
      <div className="w-14 h-14 rounded-2xl bg-card border border-border card-glow flex items-center justify-center relative group hover:border-accent/50 transition-colors duration-300">
        <div
          className={`absolute inset-0 rounded-2xl opacity-10`}
          style={{
            backgroundColor: color
          }} />
        
        <Icon
          className="w-6 h-6"
          style={{
            color
          }} />
        
        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
          <StatusBadge status={status} size="sm" />
        </div>
      </div>
      <span className="text-xs font-medium text-muted">{name}</span>
    </div>);

}
function PipelineEdge({ active = false }: {active?: boolean;}) {
  return (
    <div className="flex-1 h-14 flex items-center justify-center -mx-2 z-0 relative">
      <svg className="w-full h-8 overflow-visible" preserveAspectRatio="none">
        <path
          d="M 0,16 C 20,16 30,16 50,16"
          stroke={active ? '#3b82f6' : '#252528'}
          strokeWidth="2"
          fill="none"
          className={active ? 'animate-flow' : ''}
          strokeDasharray={active ? '4 4' : 'none'} />
        
        <circle cx="50" cy="16" r="3" fill={active ? '#3b82f6' : '#252528'} />
      </svg>
    </div>);

}
export function Dashboard({ onCreateTask }: {onCreateTask?: () => void;}) {
  const [showChecklist, setShowChecklist] = useState(true);
  return (
    <div className="flex-1 h-screen overflow-y-auto bg-background">
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Top Bar */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              Mission Control
            </h1>
            <p className="text-sm text-muted mt-1">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <button
            onClick={onCreateTask}
            className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 shadow-[0_0_15px_rgba(59,130,246,0.3)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-accent">
            
            <PlusIcon className="w-4 h-4" />
            Create Task
          </button>
        </header>

        {/* Approval Banner */}
        <motion.div
          initial={{
            opacity: 0,
            y: -10
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="bg-status-approval/10 border border-status-approval/20 border-l-4 border-l-status-approval rounded-lg p-4 flex items-center justify-between card-glow">
          
          <div className="flex items-center gap-3">
            <AlertTriangleIcon className="w-5 h-5 text-status-approval" />
            <span className="text-sm font-medium text-foreground">
              3 tasks awaiting your approval
            </span>
          </div>
          <button className="text-sm font-medium text-status-approval hover:text-status-approval/80 transition-colors">
            Review Tasks &rarr;
          </button>
        </motion.div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <MetricCard
            title="Active Runs"
            value="12"
            change="+2"
            changeType="up"
            icon={<ActivityIcon className="w-5 h-5" />}
            accentColor="#3b82f6"
            sparkData={[2, 4, 3, 5, 8, 10, 12]}
            delay={0.1} />
          
          <MetricCard
            title="Tasks Completed"
            value="847"
            change="+12%"
            changeType="up"
            icon={<CheckCircle2Icon className="w-5 h-5" />}
            accentColor="#10b981"
            sparkData={[40, 50, 45, 60, 70, 85, 90]}
            delay={0.15} />
          
          <MetricCard
            title="Pending Approval"
            value="3"
            change="-1"
            changeType="down"
            icon={<ClockIcon className="w-5 h-5" />}
            accentColor="#f59e0b"
            sparkData={[5, 4, 4, 6, 5, 4, 3]}
            delay={0.2} />
          
          <MetricCard
            title="Failed"
            value="2"
            change="0"
            changeType="neutral"
            icon={<AlertTriangleIcon className="w-5 h-5" />}
            accentColor="#ef4444"
            sparkData={[1, 0, 2, 1, 3, 2, 2]}
            delay={0.25} />
          
          <MetricCard
            title="Cost Today"
            value="$42.18"
            change="+$5.20"
            changeType="up"
            icon={<DollarSignIcon className="w-5 h-5" />}
            accentColor="#a855f7"
            sparkData={[10, 15, 12, 20, 25, 30, 42]}
            delay={0.3} />
          
          <MetricCard
            title="Avg Latency"
            value="1.2s"
            change="-0.3s"
            changeType="down"
            icon={<ZapIcon className="w-5 h-5" />}
            accentColor="#06b6d4"
            sparkData={[1.8, 1.7, 1.5, 1.6, 1.4, 1.3, 1.2]}
            delay={0.35} />
          
        </div>

        {/* Getting Started Checklist */}
        <AnimatePresence>
          {showChecklist &&
          <motion.div
            initial={{
              opacity: 0,
              height: 0
            }}
            animate={{
              opacity: 1,
              height: 'auto'
            }}
            exit={{
              opacity: 0,
              height: 0,
              marginTop: 0
            }}
            className="bg-card border border-border rounded-xl overflow-hidden card-glow">
            
              <div className="p-4 border-b border-border/50 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold text-sm">
                    2/5
                  </div>
                  <h2 className="text-sm font-medium text-foreground">
                    Getting Started
                  </h2>
                </div>
                <button
                onClick={() => setShowChecklist(false)}
                className="text-muted hover:text-foreground transition-colors">
                
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4 bg-card">
                {[
              {
                label: 'Connect Provider',
                done: true
              },
              {
                label: 'Create Agent',
                done: true
              },
              {
                label: 'Define Tools',
                done: false
              },
              {
                label: 'Run Task',
                done: false
              },
              {
                label: 'Review Logs',
                done: false
              }].
              map((item, i) =>
              <div key={i} className="flex items-center gap-2">
                    <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center border ${item.done ? 'bg-status-success border-status-success' : 'border-muted/50'}`}>
                  
                      {item.done &&
                  <CheckIcon className="w-3 h-3 text-background" />
                  }
                    </div>
                    <span
                  className={`text-sm ${item.done ? 'text-muted line-through' : 'text-foreground'}`}>
                  
                      {item.label}
                    </span>
                  </div>
              )}
              </div>
            </motion.div>
          }
        </AnimatePresence>

        {/* Active Agent Teams - Pipeline View */}
        <motion.section
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          transition={{
            delay: 0.4
          }}
          className="space-y-4">
          
          <h2 className="text-sm font-medium text-muted uppercase tracking-wider section-header-fade">
            Active Agent Teams
          </h2>
          <div className="bg-card border border-border rounded-xl p-8 card-glow overflow-x-auto">
            <div className="flex items-center justify-between min-w-[600px] max-w-4xl mx-auto">
              <PipelineNode
                name="Researcher"
                icon={SearchIcon}
                status="success"
                color="#10b981" />
              
              <PipelineEdge active={true} />
              <PipelineNode
                name="Data Analyst"
                icon={DatabaseIcon}
                status="running"
                color="#3b82f6" />
              
              <PipelineEdge active={false} />
              <PipelineNode
                name="Writer"
                icon={PenToolIcon}
                status="approval"
                color="#f59e0b" />
              
              <PipelineEdge active={false} />
              <PipelineNode
                name="Reviewer"
                icon={TerminalIcon}
                status="success"
                color="#a855f7" />
              
            </div>
          </div>
        </motion.section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Runs Board */}
          <motion.section
            initial={{
              opacity: 0,
              x: -20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            transition={{
              delay: 0.5
            }}
            className="lg:col-span-1 space-y-4">
            
            <h2 className="text-sm font-medium text-muted uppercase tracking-wider section-header-fade">
              Active Runs
            </h2>
            <div className="bg-card border border-border rounded-xl flex flex-col overflow-hidden card-glow h-[340px]">
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {activeRuns.map((run) =>
                <div
                  key={run.id}
                  className="group flex flex-col p-3 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer border border-transparent hover:border-white/5">
                  
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <StatusBadge status={run.status} size="sm" />
                        <span className="text-sm font-medium text-foreground">
                          {run.agent}
                        </span>
                      </div>
                      <span className="text-xs text-muted font-mono tabular-nums">
                        {run.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted font-mono">
                        {run.id}
                      </span>
                      <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden">
                        <div
                        className={`h-full rounded-full ${run.status === 'failed' ? 'bg-status-failed' : run.status === 'approval' ? 'bg-status-approval' : 'bg-accent'}`}
                        style={{
                          width: `${run.progress}%`
                        }} />
                      
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.section>

          {/* Model Usage Chart */}
          <motion.section
            initial={{
              opacity: 0,
              x: 20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            transition={{
              delay: 0.6
            }}
            className="lg:col-span-2 space-y-4">
            
            <h2 className="text-sm font-medium text-muted uppercase tracking-wider section-header-fade">
              Cost & Usage (7d)
            </h2>
            <div className="bg-card border border-border rounded-xl p-6 card-glow h-[340px] flex flex-col">
              <div className="flex-1 w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={costData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -20,
                      bottom: 0
                    }}>
                    
                    <defs>
                      <linearGradient
                        id="colorCost"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1">
                        
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.3} />
                        
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0} />
                        
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#252528"
                      vertical={false} />
                    
                    <XAxis
                      dataKey="time"
                      stroke="#a0a0a8"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      dy={10} />
                    
                    <YAxis
                      stroke="#a0a0a8"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `$${val}`} />
                    
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#161618',
                        borderColor: '#252528',
                        borderRadius: '8px',
                        color: '#f5f5f4'
                      }}
                      itemStyle={{
                        color: '#3b82f6'
                      }} />
                    
                    <Area
                      type="monotone"
                      dataKey="cost"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorCost)" />
                    
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Activity Feed */}
        <motion.section
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.7
          }}
          className="space-y-4 pb-12">
          
          <h2 className="text-sm font-medium text-muted uppercase tracking-wider section-header-fade">
            Activity Feed
          </h2>
          <div className="bg-card border border-border rounded-xl overflow-hidden card-glow">
            <div className="divide-y divide-border/50">
              {activityFeed.map((item) => {
                const isModel = item.type === 'model';
                const isTool = item.type === 'tool';
                const isSuccess = item.type === 'success';
                const isError = item.type === 'error';
                const isApproval = item.type === 'approval';
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
                    
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border ${isModel ? 'bg-status-model/10 border-status-model/20 text-status-model' : isTool ? 'bg-status-tool/10 border-status-tool/20 text-status-tool' : isSuccess ? 'bg-status-success/10 border-status-success/20 text-status-success' : isError ? 'bg-status-failed/10 border-status-failed/20 text-status-failed' : 'bg-status-approval/10 border-status-approval/20 text-status-approval'}`}>
                        
                        {isModel && <ZapIcon className="w-4 h-4" />}
                        {isTool && <TerminalIcon className="w-4 h-4" />}
                        {isSuccess && <CheckCircle2Icon className="w-4 h-4" />}
                        {isError && <AlertTriangleIcon className="w-4 h-4" />}
                        {isApproval && <ClockIcon className="w-4 h-4" />}
                      </div>
                      <span className="text-sm text-foreground font-medium">
                        {item.text}
                      </span>
                    </div>
                    <span className="text-xs text-muted font-mono tabular-nums">
                      {item.time}
                    </span>
                  </div>);

              })}
            </div>
          </div>
        </motion.section>
      </div>
    </div>);

}