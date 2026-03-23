import React from 'react';
export type StatusType =
'success' |
'running' |
'approval' |
'failed' |
'model' |
'tool';
interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}
const statusConfig: Record<
  StatusType,
  {
    color: string;
    bgClass: string;
  }> =
{
  success: {
    color: '#10b981',
    bgClass: 'bg-status-success'
  },
  running: {
    color: '#3b82f6',
    bgClass: 'bg-status-running'
  },
  approval: {
    color: '#f59e0b',
    bgClass: 'bg-status-approval'
  },
  failed: {
    color: '#ef4444',
    bgClass: 'bg-status-failed'
  },
  model: {
    color: '#a855f7',
    bgClass: 'bg-status-model'
  },
  tool: {
    color: '#06b6d4',
    bgClass: 'bg-status-tool'
  }
};
export function StatusBadge({
  status,
  label,
  size = 'md',
  className = ''
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const isRunning = status === 'running';
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs';
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex items-center justify-center">
        {isRunning &&
        <div
          className={`absolute ${dotSize} rounded-full ${config.bgClass} led-pulse`} />

        }
        <div
          className={`${dotSize} rounded-full ${config.bgClass} relative z-10`}
          style={{
            boxShadow: `0 0 8px ${config.color}80`
          }} />
        
      </div>
      {label &&
      <span
        className={`${textSize} font-medium text-muted uppercase tracking-wider`}>
        
          {label}
        </span>
      }
    </div>);

}