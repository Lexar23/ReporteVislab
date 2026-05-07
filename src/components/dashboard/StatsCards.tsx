import { useState, useEffect } from "react";
import { Card, cn } from "@/components/ui";
import { TrendingUp, FileText, CheckCircle, AlertTriangle } from "lucide-react";

interface StatsProps {
    totalVentas: number;
    totalFacturas: number;
    retrabajos: number;
    sucursalMasActiva: string;
}

export function StatsCards({ totalVentas, totalFacturas, retrabajos, sucursalMasActiva }: StatsProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 h-24 animate-pulse bg-slate-100 rounded-2xl" />;
    const stats = [
        {
            label: "Ventas Totales",
            value: new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(totalVentas),
            icon: TrendingUp,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-400/5",
            border: "border-blue-100 dark:border-blue-400/20"
        },
        {
            label: "Facturas Emitidas",
            value: totalFacturas,
            icon: FileText,
            color: "text-purple-600 dark:text-purple-400",
            bg: "bg-purple-50 dark:bg-purple-400/5",
            border: "border-purple-100 dark:border-purple-400/20"
        },
        {
            label: "Retrabajos",
            value: retrabajos,
            icon: AlertTriangle,
            color: "text-rose-600 dark:text-rose-400",
            bg: "bg-rose-50 dark:bg-rose-400/5",
            border: "border-rose-100 dark:border-rose-400/20"
        },
        {
            label: "Sucursal Líder",
            value: sucursalMasActiva,
            icon: CheckCircle,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-400/5",
            border: "border-emerald-100 dark:border-emerald-400/20"
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
                <Card key={i} className={cn(
                    "luxury-card glass-panel premium-shadow border-none p-3 lg:p-4 hover:scale-[1.02] transition-transform group",
                    stat.border
                )}>
                    <div className="relative z-10 flex items-center gap-3">
                        <div className={cn("p-2.5 rounded-xl shadow-inner", stat.bg)}>
                            <stat.icon className={cn("w-4 h-4", stat.color)} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-0.5 truncate">{stat.label}</p>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tighter truncate">{stat.value}</h3>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
