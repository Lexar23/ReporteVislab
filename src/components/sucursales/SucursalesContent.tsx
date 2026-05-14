"use client";

import { useSucursales } from "@/hooks/useSucursales";
import { BranchFilters } from "./BranchFilters";
import { BranchStats } from "./BranchStats";
import { BranchCharts } from "./BranchCharts";
import { motion } from "framer-motion";
import { ReportData } from "@/types/report";

interface SucursalesContentProps {
    initialData: ReportData[];
}

export function SucursalesContent({ initialData }: SucursalesContentProps) {
    const { 
        filters, 
        setFilters, 
        data, 
        branches, 
        years, 
        months 
    } = useSucursales(initialData);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Reporte de <span className="text-primary italic">Sucursales</span>
                    </h1>
                </div>
            </div>

            {/* Filters Section */}
            <BranchFilters 
                filters={filters} 
                setFilters={setFilters} 
                branches={branches} 
                years={years} 
                months={months} 
            />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* Left Side: Numerical Stats */}
                <div className="xl:col-span-3">
                    <BranchStats data={data} />
                </div>

                {/* Right Side: Charts Section */}
                <div className="xl:col-span-9">
                    <BranchCharts data={data} />
                </div>
            </div>

            {/* Extra Info / Footer */}
            <div className="mt-4 p-4 bg-gradient-to-br from-primary/5 to-violet-500/5 rounded-2xl border border-white/20 dark:border-white/5 premium-shadow">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <span className="text-lg font-black">i</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-slate-500 dark:text-slate-400 text-[10px] leading-tight">
                            Datos de <span className="font-bold text-primary">{data.branchName}</span> ({months.find(m => m.value === filters.months[0])?.name} {filters.year}). 
                            Incluye ventas brutas, órdenes y desglose por cristal.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
