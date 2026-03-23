import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3Icon,
  DollarSignIcon,
  ActivityIcon,
  CpuIcon,
  TrendingUpIcon } from
'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell } from
'recharts';
import { MetricCard } from '../components/shared/MetricCard';
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

const modelCostData = [
{
  name: 'gpt-4-turbo',
  cost: 145.2,
  tier: 'standard',
  color: '#3b82f6'
},
{
  name: 'claude-3-opus',
  cost: 82.5,
  tier: 'premium',
  color: '#f59e0b'
},
{
  name: 'gpt-3.5-turbo',
  cost: 12.4,
  tier: 'economy',
  color: '#10b981'
},
{
  name: 'claude-3-haiku',
  cost: 8.1,
  tier: 'economy',
  color: '#10b981'
}];

const agentSpendData = [
{
  name: 'ResearchBot',
  cost: 85.4,
  percentage: 45,
  color: '#a855f7'
},
{
  name: 'DataAnalyzer',
  cost: 62.1,
  percentage: 32,
  color: '#3b82f6'
},
{
  name: 'CodeReviewer',
  cost: 35.8,
  percentage: 18,
  color: '#ef4444'
},
{
  name: 'Copywriter',
  cost: 9.2,
  percentage: 5,
  color: '#10b981'
}];

export function UsageDashboard() {
  return (
    <div className="flex-1 h-screen overflow-y-auto bg-background">
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Header */}
        <header className="flex items-center justify-between section-header-fade pb-2">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight flex items-center gap-2">
              <BarChart3Icon className="w-6 h-6 text-accent" />
              Usage & Cost
            </h1>
            <p className="text-sm text-muted mt-1">
              Monitor API spend and performance metrics.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-1">
            <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-accent/10 text-accent">
              7 Days
            </button>
            <button className="px-3 py-1.5 text-sm font-medium rounded-md text-muted hover:text-foreground">
              30 Days
            </button>
            <button className="px-3 py-1.5 text-sm font-medium rounded-md text-muted hover:text-foreground">
              All Time
            </button>
          </div>
        </header>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Spend (7d)"
            value="$173.68"
            change="+$24.10"
            changeType="up"
            icon={<DollarSignIcon className="w-5 h-5" />}
            accentColor="#a855f7"
            sparkData={[12, 18, 15, 24, 32, 28, 42]}
            delay={0.1} />
          
          <MetricCard
            title="Total Runs"
            value="4,281"
            change="+12%"
            changeType="up"
            icon={<ActivityIcon className="w-5 h-5" />}
            accentColor="#3b82f6"
            sparkData={[400, 500, 450, 600, 700, 850, 900]}
            delay={0.2} />
          
          <MetricCard
            title="Avg Cost / Run"
            value="$0.04"
            change="-$0.01"
            changeType="down"
            icon={<TrendingUpIcon className="w-5 h-5" />}
            accentColor="#10b981"
            sparkData={[0.05, 0.05, 0.04, 0.04, 0.05, 0.04, 0.04]}
            delay={0.3} />
          
          <MetricCard
            title="Total Tokens"
            value="12.4M"
            change="+2.1M"
            changeType="up"
            icon={<CpuIcon className="w-5 h-5" />}
            accentColor="#f59e0b"
            sparkData={[1.2, 1.5, 1.4, 1.8, 2.1, 2.0, 2.4]}
            delay={0.4} />
          
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Area Chart */}
          <motion.div
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.5
            }}
            className="lg:col-span-2 bg-card border border-border rounded-xl p-5 card-glow">
            
            <h3 className="text-sm font-medium text-foreground mb-6">
              Spend over time
            </h3>
            <div className="h-72 w-full">
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
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
                    axisLine={false} />
                  
                  <YAxis
                    stroke="#a0a0a8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`} />
                  
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#161618',
                      borderColor: '#252528',
                      borderRadius: '8px',
                      color: '#f5f5f4'
                    }}
                    itemStyle={{
                      color: '#3b82f6'
                    }}
                    formatter={(value: number) => [
                    `$${value.toFixed(2)}`,
                    'Cost']
                    } />
                  
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
          </motion.div>

          {/* Model Breakdown Bar Chart */}
          <motion.div
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.6
            }}
            className="bg-card border border-border rounded-xl p-5 card-glow flex flex-col">
            
            <h3 className="text-sm font-medium text-foreground mb-6">
              Spend by Model
            </h3>
            <div className="flex-1 w-full min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={modelCostData}
                  layout="vertical"
                  margin={{
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0
                  }}>
                  
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#252528"
                    horizontal={false} />
                  
                  <XAxis
                    type="number"
                    stroke="#a0a0a8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`} />
                  
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#a0a0a8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={100} />
                  
                  <Tooltip
                    cursor={{
                      fill: '#252528',
                      opacity: 0.4
                    }}
                    contentStyle={{
                      backgroundColor: '#161618',
                      borderColor: '#252528',
                      borderRadius: '8px',
                      color: '#f5f5f4'
                    }}
                    formatter={(value: number) => [
                    `$${value.toFixed(2)}`,
                    'Cost']
                    } />
                  
                  <Bar dataKey="cost" radius={[0, 4, 4, 0]} barSize={20}>
                    {modelCostData.map((entry, index) =>
                    <Cell key={`cell-${index}`} fill={entry.color} />
                    )}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spend by Agent List */}
          <motion.div
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.7
            }}
            className="bg-card border border-border rounded-xl p-5 card-glow">
            
            <h3 className="text-sm font-medium text-foreground mb-4">
              Spend by Agent
            </h3>
            <div className="space-y-4">
              {agentSpendData.map((agent) =>
              <div key={agent.name} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-foreground truncate">
                    {agent.name}
                  </div>
                  <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                    <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${agent.percentage}%`,
                      backgroundColor: agent.color
                    }} />
                  
                  </div>
                  <div className="w-16 text-right text-sm font-mono tabular-nums text-muted">
                    ${agent.cost.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Model Breakdown Table */}
          <motion.div
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.8
            }}
            className="bg-card border border-border rounded-xl p-5 card-glow">
            
            <h3 className="text-sm font-medium text-foreground mb-4">
              Model Breakdown
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted uppercase bg-background/50 border-b border-border">
                  <tr>
                    <th className="px-4 py-2 font-medium">Model</th>
                    <th className="px-4 py-2 font-medium text-right">Calls</th>
                    <th className="px-4 py-2 font-medium text-right">Tokens</th>
                    <th className="px-4 py-2 font-medium text-right">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-mono text-status-running flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-status-running" />{' '}
                      gpt-4-turbo
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted">
                      1,240
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted">
                      4.2M
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-foreground">
                      $145.20
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-mono text-status-approval flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-status-approval" />{' '}
                      claude-3-opus
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted">
                      412
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted">
                      1.8M
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-foreground">
                      $82.50
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-mono text-status-success flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-status-success" />{' '}
                      gpt-3.5-turbo
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted">
                      3,850
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted">
                      6.1M
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-foreground">
                      $12.40
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>);

}