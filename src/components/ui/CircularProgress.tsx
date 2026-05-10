'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CircularProgressProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string;
}

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 10,
  className,
  label
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  // Color logic based on leak score (higher is better? Or lower is better? Let's say higher score = healthier spending)
  const isHealthy = value >= 70;
  const isWarning = value >= 40 && value < 70;
  const strokeColor = isHealthy ? 'var(--accent)' : isWarning ? '#f5a623' : '#ff4b4b';

  return (
    <div className={cn("relative flex flex-col items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--surface-hover)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold tracking-tighter" style={{ color: strokeColor }}>
          {value}
        </span>
        {label && <span className="text-xs text-[var(--muted)] mt-1 font-medium uppercase tracking-wider">{label}</span>}
      </div>
    </div>
  );
}
