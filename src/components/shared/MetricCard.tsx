import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRightIcon, ArrowDownRightIcon, MinusIcon } from 'lucide-react';
import { SparkLine } from './SparkLine';
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  icon: ReactNode;
  sparkData?: number[];
  accentColor: string;
  delay?: number;
}
export function MetricCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  sparkData,
  accentColor,
  delay = 0
}: MetricCardProps) {
  const ChangeIcon =
  changeType === 'up' ?
  ArrowUpRightIcon :
  changeType === 'down' ?
  ArrowDownRightIcon :
  MinusIcon;
  const changeColor =
  changeType === 'up' ?
  'text-status-success' :
  changeType === 'down' ?
  'text-status-failed' :
  'text-muted';
  return (
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
        duration: 0.4,
        delay,
        ease: 'easeOut'
      }}
      className="bg-card rounded-xl p-5 card-glow hover:card-hover transition-all duration-300 relative overflow-hidden group border border-border/50">
      
      {/* Subtle background gradient glow on hover */}
      <div
        className="absolute -top-24 -right-24 w-48 h-48 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-3xl pointer-events-none"
        style={{
          backgroundColor: accentColor
        }} />
      

      <div className="flex justify-between items-start mb-4">
        <div
          className="p-2.5 rounded-lg border border-white/5 relative"
          style={{
            backgroundColor: `${accentColor}15`,
            color: accentColor
          }}>
          
          {icon}
        </div>

        {sparkData &&
        <div className="opacity-70 group-hover:opacity-100 transition-opacity duration-300">
            <SparkLine
            data={sparkData}
            color={accentColor}
            width={64}
            height={24} />
          
          </div>
        }
      </div>

      <div>
        <h3 className="text-muted text-sm font-medium mb-1">{title}</h3>
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-semibold text-foreground font-mono tabular-nums tracking-tight">
            {value}
          </span>
          {change &&
          <div
            className={`flex items-center text-xs font-medium ${changeColor}`}>
            
              <ChangeIcon className="w-3 h-3 mr-0.5" />
              {change}
            </div>
          }
        </div>
      </div>
    </motion.div>);

}