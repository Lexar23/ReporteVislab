import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("bg-card text-card-foreground rounded-2xl border border-border p-6 shadow-sm overflow-hidden", className)}>
            {children}
        </div>
    );
}

export function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' }) {
    const variants = {
        default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
        success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        danger: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
    };
    return (
        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider", variants[variant])}>
            {children}
        </span>
    );
}
