"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ReportData } from "@/types/report";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { DataDisplay } from "@/components/dashboard/DataDisplay";
import { ReworkManager } from "@/components/dashboard/ReworkManager";
import { Filter, Calendar, RefreshCw, LayoutDashboard, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRefresh } from "@/context/RefreshContext";

interface DashboardContentProps {
    initialData: ReportData[];
}

const MONTH_NAMES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sept", "Oct", "Nov", "Dic"];

export function DashboardContent({ initialData }: DashboardContentProps) {
    const router = useRouter();
    const { isRefreshing } = useRefresh();
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string>("all");

    const years = useMemo(() => {
        const yrs = Array.from(new Set(initialData.map(d => d.fecha.getFullYear().toString())));
        return yrs.sort((a, b) => b.localeCompare(a));
    }, [initialData]);

    // Initialize selectedYear to the most recent year on first render
    useEffect(() => {
        if (!selectedYear && years.length > 0) {
            setSelectedYear(years[0]);
        }
    }, [years, selectedYear]);

    const normalizeString = (str: string) => {
        return str
            .toUpperCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, " ")
            .trim();
    };

    const stats = useMemo(() => {
        const currentYear = selectedYear === "all" ? Array.from(years)[0] : (selectedYear || Array.from(years)[0]);
        const previousYear = (parseInt(currentYear) - 1).toString();

        const currentYearData = initialData.filter(d => d.fecha.getFullYear().toString() === currentYear);
        const previousYearData = initialData.filter(d => d.fecha.getFullYear().toString() === previousYear);

        const fData = initialData.filter(d => {
            const matchesYear = selectedYear === "all" || d.fecha.getFullYear().toString() === selectedYear;
            const matchesMonth = selectedMonth === "all" || d.fecha.getMonth().toString() === selectedMonth;
            return matchesYear && matchesMonth;
        });

        const comparison = MONTH_NAMES.map((month, idx) => {
            const curVal = currentYearData
                .filter(d => d.fecha.getMonth() === idx)
                .reduce((acc, d) => acc + d.total, 0);
            const prevVal = previousYearData
                .filter(d => d.fecha.getMonth() === idx)
                .reduce((acc, d) => acc + d.total, 0);

            const growth = prevVal > 0 ? ((curVal - prevVal) / prevVal) * 100 : 0;
            return { mes: month, current: curVal, previous: prevVal, growth };
        });

        const optoStats: Record<string, { total: number, qty: number }> = {};
        fData.forEach(d => {
            const rawName = d.optometra || 'Desconocido';
            const name = normalizeString(rawName);
            if (name === 'N/A' || name === 'UNDEFINED' || name === '') return;

            if (!optoStats[name]) optoStats[name] = { total: 0, qty: 0 };
            if (!d.retrabajo) optoStats[name].total += d.total;
            optoStats[name].qty += d.cantidad;
        });

        const sortedOptos = Object.entries(optoStats)
            .map(([name, stats]) => ({ name, ...stats }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 10);

        const designStats: Record<string, number> = {};
        fData.forEach(d => {
            const rawDesign = d.servicioArticulo || 'N/D';
            const design = normalizeString(rawDesign);
            if (design !== 'N/A' && design !== 'N/D' && design !== '') {
                designStats[design] = (designStats[design] || 0) + d.cantidad;
            }
        });
        const designDist = Object.entries(designStats)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 8);

        const branchSalesMap: Record<string, number> = {};
        fData.forEach(d => {
            const branch = d.sucursal || 'N/A';
            if (!d.retrabajo) {
                branchSalesMap[branch] = (branchSalesMap[branch] || 0) + d.total;
            }
        });

        const branchStatsArr = Object.entries(branchSalesMap)
            .map(([name, total]) => ({ sucursal: name, total }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 8);

        const totalRecords = fData.length;
        const reworksCount = fData.filter(d => d.retrabajo).length;
        const goodCount = totalRecords - reworksCount;

        const qualityRatios = [
            { name: 'Lentes Buenos', value: goodCount },
            { name: 'Retrabajos', value: reworksCount }
        ];

        const bestBranch = branchStatsArr[0]?.sucursal || 'N/A';

        return {
            filteredData: fData,
            salesByMonthComparison: comparison,
            topOptometrasTotal: sortedOptos,
            topOptometrasQty: [...sortedOptos].sort((a, b) => b.qty - a.qty),
            designDistribution: designDist,
            sucursalLider: bestBranch,
            salesByBranch: branchStatsArr,
            qualityRatios,
            currentYear,
            previousYear
        };
    }, [initialData, selectedYear, selectedMonth, years]);

    const {
        filteredData,
        salesByMonthComparison,
        topOptometrasTotal,
        topOptometrasQty,
        designDistribution,
        sucursalLider,
        salesByBranch,
        qualityRatios,
        currentYear,
        previousYear
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
                                {MONTH_NAMES.map((m, i) => (
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
                        totalVentas={filteredData.reduce((acc, d) => acc + d.total, 0)}
                        totalFacturas={filteredData.length}
                        retrabajos={filteredData.filter(d => d.retrabajo).length}
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
