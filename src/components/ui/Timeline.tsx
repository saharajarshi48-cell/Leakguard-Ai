import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface TimelineItem {
  id: string;
  title: string;
  date: string;
  amount: number;
  icon?: React.ReactNode;
  isActive?: boolean;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("relative space-y-6", className)}>
      {/* Vertical line */}
      <div className="absolute left-[20px] top-4 bottom-4 w-px bg-[var(--border)]" />
      
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative flex items-center gap-4 pl-12"
        >
          {/* Dot */}
          <div
            className={cn(
              "absolute left-3 w-4 h-4 rounded-full border-2 bg-[var(--background)] flex items-center justify-center",
              item.isActive ? "border-[var(--accent)]" : "border-[var(--muted)]"
            )}
          >
            {item.isActive && <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />}
          </div>
          
          <div className="flex-1 flex justify-between items-center bg-[var(--surface)] p-3 rounded-xl border border-[var(--border)]">
            <div className="flex items-center gap-3">
              {item.icon && (
                <div className="w-10 h-10 rounded-lg bg-[var(--surface-hover)] flex items-center justify-center text-[var(--muted)]">
                  {item.icon}
                </div>
              )}
              <div>
                <p className="font-semibold text-[var(--foreground)]">{item.title}</p>
                <p className="text-xs text-[var(--muted)]">{item.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-[var(--foreground)]">
                ₹{item.amount}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
