import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

const MotionLink = motion.create(Link);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', href, children, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)] disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-[var(--primary)] text-white hover:bg-opacity-90 shadow-[0_0_20px_rgba(45,104,255,0.4)]",
      secondary: "bg-[var(--surface-hover)] text-white hover:bg-[var(--border)] border border-[var(--border)]",
      outline: "border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white",
      ghost: "text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
    };

    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-6 text-base",
      lg: "h-14 px-8 text-lg"
    };

    const combinedClasses = cn(baseClasses, variants[variant], sizes[size], className);

    if (href) {
      return (
        <MotionLink
          href={href}
          className={combinedClasses}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          {...(props as any)}
        >
          {children}
        </MotionLink>
      );
    }

    return (
      <motion.button
        ref={ref}
        className={combinedClasses}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...(props as HTMLMotionProps<"button">)}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
