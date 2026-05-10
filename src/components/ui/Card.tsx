import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export function Card({ className, glass = true, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--border)] p-6",
        glass ? "glass-card" : "bg-[var(--surface)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
