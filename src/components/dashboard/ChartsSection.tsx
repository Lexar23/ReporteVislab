"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, cn } from "@/components/ui";
import { useTheme } from "next-themes";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from "recharts";
import { motion } from "framer-motion";

interface ChartsProps {
    salesByBranch: { sucursal: string; total: number }[];
    qualityRatios: { name: string; value: number }[];
    salesByMonth: { mes: string; current: number; previous: number; growth: number }[];
    statusDistribution: { name: string; value: number }[];
    topOptometrasTotal: { name: string; total: number }[];
    topOptometrasQty: { name: string; qty: number }[];
    designDistribution: { name: string; value: number }[];
    currentYear: string;
    previousYear: string;
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#475569'];
const QUALITY_COLORS = ['#10b981', '#ef4444']; // Emerald for Good, Rose for Reworks

export function ChartsSection({
    salesByBranch,
    qualityRatios,
    salesByMonth,
    topOptometrasTotal,
    topOptometrasQty,
    designDistribution,
    currentYear,
    previousYear
}: ChartsProps) {
    const [isMounted, setIsMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const isDark = resolvedTheme === "dark";
    const chartTextColor = isDark ? "#64748b" : "#475569";
    const chartGridColor = isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.05)";
    const tooltipBg = isDark ? "#0f172a" : "#ffffff";
    const tooltipBorder = isDark ? "rgba(255,255,255,0.05)" : "#e2e8f0";
    const cardBg = "bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200 dark:border-white/5";
    const textLabel = "text-slate-500 dark:text-slate-400";
    const textMain = "text-slate-900 dark:text-white";

    const shortenName = (name: string) => {
        const parts = name.trim().split(/\s+/);
        if (parts.length <= 2) return name;
        return `${parts[0]} ${parts[1]}`;
    };

    const sortedDesigns = useMemo(() => [...designDistribution]
        .sort((a, b) => b.value - a.value), [designDistribution]);

    const sortedOptos = useMemo(() => [...topOptometrasTotal]
        .sort((a, b) => b.total - a.total)
        .slice(0, 8)
        .map(item => ({ ...item, name: shortenName(item.name) })), [topOptometrasTotal]);

    const sortedBranches = useMemo(() => [...salesByBranch]
        .sort((a, b) => b.total - a.total)
        .slice(0, 8), [salesByBranch]);

    const totalOptos = useMemo(() => sortedOptos.reduce((acc: number, curr: any) => acc + curr.total, 0), [sortedOptos]);

    if (!isMounted) return <div className="grid grid-cols-12 gap-6 mt-8 h-[500px] animate-pulse bg-slate-900/10 dark:bg-white/5 rounded-[2.5rem]" />;

    return (
        <div className="flex flex-col xl:flex-row gap-4 h-full">

            {/* LEFT COLUMN: Comparison Table */}
            <div className="w-full xl:w-[55%] flex flex-col h-max">
                <Card className="luxury-card glass-panel premium-shadow p-0 border-none flex-1 flex flex-col overflow-hidden">
                    <div className="p-3 border-b border-white/10 flex items-center justify-between bg-white/5">
                        <div className="flex flex-col">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Comparativa Mensual</h3>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="px-4 py-2 bg-slate-50/30 dark:bg-black/20 grid grid-cols-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 items-center shrink-0">
                            <span className="text-left">Mes</span>
                            <span className="text-center">{previousYear}</span>
                            <span className="text-center">{currentYear}</span>
                            <span className="text-right">Var %</span>
                        </div>
                        <div className="flex-1 overflow-y-auto scrollbar-hide px-1 pb-2">
                            {salesByMonth.map((row, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="grid grid-cols-4 text-center p-2 rounded-xl group hover:bg-white/50 dark:hover:bg-white/5 transition-all duration-300 items-center"
                                >
                                    <span className="text-left font-black text-[11px] text-slate-900 dark:text-white group-hover:text-primary transition-colors">{row.mes}</span>
                                    <span className="text-[10px] font-bold text-slate-400 italic">¢{row.previous.toLocaleString()}</span>
                                    <div className="flex justify-center">
                                        <span className="font-black text-[10px] text-slate-900 dark:text-white bg-white dark:bg-slate-800 py-1 px-2 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm">
                                            ¢{row.current.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-end">
                                        <span className={`font-black flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] ${row.growth >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                            {row.growth >= 0 ? '↑' : '↓'} {Math.abs(row.growth).toFixed(0)}%
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* RIGHT COLUMN: Charts and Footer */}
            <div className="w-full xl:w-[55%] flex flex-col gap-3 overflow-hidden">
                <div className="flex-1 flex flex-col gap-3 min-h-0">
                    <Card className="luxury-card glass-panel premium-shadow border-none p-2 flex-1 flex flex-row items-center overflow-hidden">
                        <div className="w-[45%] h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={sortedDesigns}
                                        cx="50%" cy="50%" innerRadius={35} outerRadius={50}
                                        paddingAngle={5} dataKey="value" stroke="none"
                                        label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
                                    >
                                        {sortedDesigns.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: 'none', borderRadius: '12px', fontSize: '10px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-[55%] flex flex-col justify-center gap-1 pr-2">
                            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Cantidad por Diseño</h3>
                            <div className="grid grid-cols-1 gap-1">
                                {sortedDesigns.slice(0, 5).map((item: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between p-1.5 rounded-lg bg-white/5 border border-white/5">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                            <span className="text-[9px] font-black text-slate-500 uppercase truncate">{item.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-[10px] font-black text-slate-900 dark:text-white">{item.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card className="luxury-card glass-panel premium-shadow border-none p-2 flex-1 flex flex-row items-center overflow-hidden">
                        <div className="w-[45%] h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={sortedOptos}
                                        cx="50%" cy="50%" innerRadius={35} outerRadius={50}
                                        paddingAngle={5} dataKey="total" stroke="none"
                                        label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
                                    >
                                        {sortedOptos.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: any) => `¢${(value || 0).toLocaleString()}`}
                                        contentStyle={{ backgroundColor: tooltipBg, border: 'none', borderRadius: '12px', fontSize: '10px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-[55%] flex flex-col justify-center gap-1 pr-2">
                            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Rendimiento Comercial</h3>
                            <div className="grid grid-cols-1 gap-1">
                                {sortedOptos.slice(0, 5).map((item: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between p-1.5 rounded-lg bg-white/5 border border-white/5">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                            <span className="text-[9px] font-black text-slate-500 uppercase truncate">{item.name}</span>
                                        </div>
                                        <div className="flex flex-col items-end shrink-0">
                                            <span className="text-[9px] font-black text-primary leading-none">¢{(item.total / 1000).toFixed(0)}k</span>
                                            <span className="text-[7px] font-bold text-slate-400 mt-0.5">{((item.total / totalOptos) * 100).toFixed(1)}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Footer small cards */}
                <div className="grid grid-cols-2 gap-3 shrink-0">
                    <div className="luxury-card glass-panel p-3 flex flex-col bg-primary/5 border-none">
                        <p className="text-slate-400 text-[8px] font-black uppercase tracking-widest">Ingreso Total</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">¢{salesByMonth.reduce((acc, curr) => acc + curr.current, 0).toLocaleString()}</span>
                            <span className="text-[9px] text-primary font-black italic">CRC</span>
                        </div>
                    </div>
                    <div className="luxury-card glass-panel p-3 flex flex-col bg-emerald-500/5 border-none">
                        <p className="text-slate-400 text-[8px] font-black uppercase tracking-widest">Producción</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{topOptometrasQty.reduce((acc, curr) => acc + curr.qty, 0).toLocaleString()}</span>
                            <span className="text-[9px] text-emerald-500 font-black italic">UNITS</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
