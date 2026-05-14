"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { Filter, Calendar, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import { useRefresh } from "@/context/RefreshContext";

const MONTH_NAMES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

interface DashboardContentProps {
    initialStats: {
        years: string[];
        currentYear: string;
        previousYear: string;
        salesByMonthComparison: any[];
        topOptometrasTotal: any[];
        topOptometrasQty: any[];
        designDistribution: any[];
        sucursalLider: string;
        salesByBranch: any[];
        qualityRatios: any[];
        totalVentas: number;
        totalFacturas: number;
        retrabajosCount: number;
    };
}

export function DashboardContent({ initialStats }: DashboardContentProps) {
    const router = useRouter();
    const { isRefreshing } = useRefresh();
    const [selectedYear, setSelectedYear] = useState<string>(initialStats.currentYear);
    const [selectedMonth, setSelectedMonth] = useState<string>("all");
    const [stats, setStats] = useState(initialStats);
    const [isLoading, setIsLoading] = useState(false);

    const years = initialStats.years;

    // Function to fetch stats from API when filters change
    const updateStats = async (year: string, month: string) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/stats?year=${year}&month=${month}`);
            const newStats = await res.json();
            setStats(newStats);
        } catch (error) {
            console.error("Failed to update stats", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedYear !== initialStats.currentYear || selectedMonth !== "all") {
            updateStats(selectedYear, selectedMonth);
        }
    }, [selectedYear, selectedMonth]);

    const {
        salesByMonthComparison,
        topOptometrasTotal,
        topOptometrasQty,
        designDistribution,
        sucursalLider,
        salesByBranch,
        qualityRatios,
        currentYear,
        previousYear,
        totalVentas,
        totalFacturas,
        retrabajosCount
    } = stats;

    return (
        <div className="flex flex-col lg:flex-row gap-4 w-full p-2 h-[calc(100vh-5rem)] transition-all duration-500 overflow-hidden">

            {/* Sidebar-style Filters */}
            <motion.aside
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-full lg:w-64 shrink-0 overflow-y-auto scrollbar-hide"
            >
                <div className="glass-panel premium-shadow p-4 rounded-[1rem] sticky top-0 overflow-hidden group">
                    {/* Abstract background elements */}
                    <div className="absolute -top-5 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 rounded-lg glow-primary">
                                <LayoutDashboard className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-black uppercase tracking-[0.2em] text-[9px] text-slate-400">Dashboard Control</span>
                        </div>
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="space-y-3">
                            <label className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.3em] flex items-center gap-2 px-1">
                                <Calendar className="w-3 h-3" /> Temporalidad
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {years.map(y => (
                                    <button
                                        key={y}
                                        onClick={() => setSelectedYear(y)}
                                        className={`group flex items-center justify-center px-3 py-2 rounded-xl text-[10px] font-black transition-all border ${selectedYear === y
                                            ? 'bg-primary border-primary/20 text-white shadow-md'
                                            : 'bg-white/50 dark:bg-slate-800/30 border-white/20 dark:border-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                            }`}
                                    >
                                        {y}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.3em] flex items-center gap-2 px-1">
                                <Filter className="w-3 h-3" /> Filtros Rápidos
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setSelectedMonth("all")}
                                    className={`col-span-2 px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border ${selectedMonth === "all"
                                        ? 'bg-emerald-500 border-emerald-500/20 text-white shadow-[0_10px_20px_-5px_rgba(16,185,129,0.4)]'
                                        : 'bg-white/50 dark:bg-slate-800/30 border-white/20 dark:border-white/5 text-slate-500 hover:text-emerald-500 hover:border-emerald-500/30'
                                        }`}
                                >
                                    Vista Consolidada
                                </button>
                                {MONTH_NAMES.map((m: string, i: number) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedMonth(i.toString())}
                                        className={`px-3 py-3 rounded-xl text-[10px] font-black uppercase transition-all border ${selectedMonth === i.toString()
                                            ? 'bg-primary border-primary/20 text-white shadow-lg'
                                            : 'bg-white/30 dark:bg-slate-800/20 border-white/10 dark:border-white/5 text-slate-400 hover:text-primary hover:border-primary/20'
                                            }`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
                        <div className="rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 p-3 border border-white/20 dark:border-white/5">
                            <p className="text-[9px] text-primary font-black uppercase tracking-widest mb-2">Estado del Nodo</p>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping absolute" />
                                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full relative" />
                                </div>
                                <span className="text-slate-900 dark:text-white text-[11px] font-black italic tracking-tight">DATASTREAM ACTIVE</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col gap-4 overflow-hidden pr-2">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="shrink-0"
                >
                    <StatsCards
                        totalVentas={totalVentas}
                        totalFacturas={totalFacturas}
                        retrabajos={retrabajosCount}
                        sucursalMasActiva={sucursalLider}
                    />
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex-1 min-h-0"
                >
                    <ChartsSection
                        salesByBranch={salesByBranch}
                        qualityRatios={qualityRatios}
                        salesByMonth={salesByMonthComparison}
                        statusDistribution={[]}
                        topOptometrasTotal={topOptometrasTotal}
                        topOptometrasQty={topOptometrasQty}
                        designDistribution={designDistribution}
                        currentYear={currentYear}
                        previousYear={previousYear}
                    />
                </motion.div>
            </main >
        </div >
    );
}
