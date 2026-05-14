"use client";

import { BranchFilter } from "@/types/sucursal";
import { MapPin, Calendar, Clock } from "lucide-react";

import { SearchableSelect } from "../ui/SearchableSelect";

interface BranchFiltersProps {
    filters: BranchFilter;
    setFilters: (filters: BranchFilter) => void;
    branches: string[];
    years: number[];
    months: { value: number; name: string }[];
}

export function BranchFilters({ filters, setFilters, branches, years, months }: BranchFiltersProps) {
    const toggleMonth = (monthValue: number) => {
        let newMonths;
        if (filters.months.includes(monthValue)) {
            // Don't allow removing if it's the last one
            if (filters.months.length === 1) return;
            newMonths = filters.months.filter(m => m !== monthValue);
        } else {
            newMonths = [...filters.months, monthValue].sort((a, b) => a - b);
        }
        setFilters({ ...filters, months: newMonths });
    };

    const selectAllMonths = () => {
        if (filters.months.length === 12) {
            // If all selected, just keep current month
            setFilters({ ...filters, months: [new Date().getMonth() + 1] });
        } else {
            setFilters({ ...filters, months: months.map(m => m.value) });
        }
    };

    return (
        <div className="flex flex-col gap-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sucursal Select */}
                <SearchableSelect 
                    value={filters.branch}
                    onChange={(val) => setFilters({ ...filters, branch: val })}
                    options={branches}
                    placeholder="Buscar sucursal..."
                    icon={<MapPin className="w-4 h-4" />}
                />

                {/* Year Select */}
                <SearchableSelect 
                    value={filters.year.toString()}
                    onChange={(val) => setFilters({ ...filters, year: parseInt(val) })}
                    options={years.map(y => y.toString())}
                    placeholder="Buscar año..."
                    icon={<Calendar className="w-4 h-4" />}
                />
            </div>


            {/* Months Multi-select */}
            <div className="p-4 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md border border-white/10 rounded-2xl">
                <div className="flex items-center justify-between mb-3 px-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.3em] flex items-center gap-2">
                        <Clock className="w-3 h-3" /> Seleccionar Meses
                    </label>
                    <button 
                        onClick={selectAllMonths}
                        className="text-[9px] font-black uppercase text-primary hover:text-primary/70 transition-colors tracking-widest bg-primary/5 px-3 py-1 rounded-full border border-primary/10"
                    >
                        {filters.months.length === 12 ? 'Deseleccionar' : 'Seleccionar Todos'}
                    </button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2">
                    {months.map((m) => {
                        const isSelected = filters.months.includes(m.value);
                        return (
                            <button
                                key={m.value}
                                onClick={() => toggleMonth(m.value)}
                                className={`py-2 px-1 rounded-lg text-[9px] font-black uppercase transition-all border ${
                                    isSelected
                                        ? 'bg-primary border-primary/20 text-white shadow-md'
                                        : 'bg-white/50 dark:bg-slate-800/20 border-white/10 dark:border-white/5 text-slate-400 hover:text-primary'
                                }`}
                            >
                                {m.name.substring(0, 3)}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
