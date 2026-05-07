"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Hammer, MapPin } from "lucide-react";
import { cn } from "@/components/ui";

const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Sucursales", href: "/sucursales", icon: MapPin },
    { name: "Facturas", href: "/facturas", icon: FileText },
    { name: "Retrabajos", href: "/retrabajos", icon: Hammer },
];

import { useRefresh } from "@/context/RefreshContext";
import { RefreshCw } from "lucide-react";

export function Sidebar() {
    const pathname = usePathname();
    const { refreshData, isRefreshing } = useRefresh();

    return (
        <aside className="fixed left-0 top-10 bottom-0 w-70 overflow-y-auto hidden md:flex flex-col p-6 gap-2 transition-all duration-500">
            <div className="flex flex-col gap-2 p-2 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/20 dark:border-white/5 h-full premium-shadow">
                <div className="flex-1 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 font-bold text-sm group",
                                    isActive
                                        ? "text-primary bg-primary/10 shadow-[0_8px_16px_-6px_rgba(59,130,246,0.3)] ring-1 ring-primary/20"
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800/80"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-primary" : "text-slate-400 dark:text-slate-600")} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="p-2 border-t border-white/10 mt-auto">
                    <button
                        onClick={refreshData}
                        disabled={isRefreshing}
                        className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 font-black text-[10px] uppercase tracking-[0.2em] bg-primary/5 text-primary hover:bg-primary hover:text-white group relative overflow-hidden"
                    >
                        <RefreshCw className={cn("w-4 h-4 transition-transform duration-700", isRefreshing ? "animate-spin" : "group-hover:rotate-180")} />
                        <span>{isRefreshing ? 'Actualizando...' : 'Actualizar'}</span>
                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
