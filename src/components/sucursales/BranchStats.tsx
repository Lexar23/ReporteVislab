"use client";

import { Card } from "@/components/ui";
import { DollarSign, ShoppingBag, Eye, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface BranchStatsProps {
    data: BranchData;
}

export function BranchStats({ data }: BranchStatsProps) {
    const stats = [
        {
            label: "Ventas Totales",
            value: new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(data.sales),
            icon: DollarSign,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            trend: "+12.5%",
        },
        {
            label: "Cantidad de Órdenes",
            value: data.ordersCount.toString(),
            icon: ShoppingBag,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            trend: "+5.2%",
        },
        {
            label: "Lentes Vendidos",
            value: data.lensTypes.reduce((acc, curr) => acc + curr.count, 0).toString(),
            icon: Eye,
            color: "text-violet-500",
            bg: "bg-violet-500/10",
            trend: "+8.1%",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {stats.map((stat, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                >
                    <Card className="p-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/20 dark:border-white/5 premium-shadow group hover:translate-y-[-4px] transition-all duration-300">
                        <div className="flex items-start justify-between mb-2">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 duration-500`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                <TrendingUp className="w-3 h-3" />
                                {stat.trend}
                            </div>
                        </div>
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 text-[10px] font-medium mb-0.5">{stat.label}</p>
                            <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
                                {stat.value}
                            </h3>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
