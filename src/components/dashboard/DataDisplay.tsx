"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui";
import { Search, Hammer, ChevronDown } from "lucide-react";
import { ReportData } from "@/types/report";
import { useDebounce } from "@/hooks/useDebounce";

interface TableProps {
    initialReworkOnly?: boolean;
}

const ITEMS_PER_PAGE = 50;

export function DataDisplay({ initialReworkOnly = false }: TableProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showOnlyRework, setShowOnlyRework] = useState(initialReworkOnly);
    
    const [data, setData] = useState<ReportData[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    
    const debouncedSearch = useDebounce(searchTerm, 400);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Fetch data from API
    const fetchData = async (reset = false) => {
        setIsLoading(true);
        const currentOffset = reset ? 0 : offset;
        try {
            const res = await fetch(`/api/data?q=${debouncedSearch}&rework=${showOnlyRework}&limit=${ITEMS_PER_PAGE}&offset=${currentOffset}`);
            const result = await res.json();
            
            if (reset) {
                setData(result.data);
            } else {
                setData(prev => [...prev, ...result.data]);
            }
            
            setTotal(result.total);
            setHasMore(result.hasMore);
            setOffset(currentOffset + ITEMS_PER_PAGE);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Reset and fetch when search or filter changes
    useEffect(() => {
        if (isMounted) {
            fetchData(true);
        }
    }, [debouncedSearch, showOnlyRework, isMounted]);

    if (!isMounted) return <div className="mt-8 h-96 animate-pulse bg-slate-900/50 rounded-3xl" />;

    return (
        <div className="mt-8 space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-end">
                <div className="flex flex-col gap-1">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tight">Detalle de Operaciones</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        {total} registros encontrados
                    </p>
                </div>
                <div className="flex w-full md:w-auto gap-2">
                    <div className="relative flex-1 md:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        <input
                            type="text"
                            placeholder="Buscar cliente, factura, orden..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowOnlyRework(!showOnlyRework)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all border ${showOnlyRework
                            ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20'
                            : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-rose-500/50 hover:text-rose-600 dark:hover:text-rose-400'
                            }`}
                    >
                        <Hammer className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Retrabajos</span>
                    </button>
                </div>
            </div>

            <Card className="luxury-card glass-panel premium-shadow p-0 border-none overflow-hidden relative">
                {isLoading && data.length === 0 && (
                    <div className="absolute inset-0 z-50 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
                
                <div className="w-full overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left border-collapse min-w-[600px] md:min-w-full">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-black/30 border-b border-white/10">
                                <th className="px-4 md:px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 w-[100px]">Factura</th>
                                <th className="hidden xl:table-cell px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Orden</th>
                                <th className="px-4 md:px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Cliente</th>
                                <th className="hidden lg:table-cell px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Servicio</th>
                                <th className="hidden md:table-cell px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">Cant</th>
                                <th className="hidden lg:table-cell px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">Calidad</th>
                                <th className="px-4 md:px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {data.length > 0 ? data.map((item, i) => (
                                <tr key={`${item.factura}-${i}`} className="hover:bg-white/40 dark:hover:bg-white/5 transition-all duration-300 group">
                                    <td className="px-4 md:px-6 py-4 font-black text-slate-900 dark:text-white text-xs">
                                        <span className="opacity-50 text-[10px]">#</span>{item.factura}
                                    </td>
                                    <td className="hidden xl:table-cell px-6 py-4">
                                        <span className="text-[10px] font-black text-primary bg-primary/10 py-1 px-3 rounded-lg border border-primary/20">
                                            {item.ordenProduccion || '—'}
                                        </span>
                                    </td>
                                    <td className="px-4 md:px-6 py-4">
                                        <div className="flex flex-col max-w-[150px] md:max-w-none">
                                            <p className="text-xs md:text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">{item.cliente}</p>
                                            <p className="text-[9px] text-slate-400 font-black uppercase lg:hidden truncate">{item.sucursal}</p>
                                        </div>
                                    </td>
                                    <td className="hidden lg:table-cell px-6 py-4">
                                        <span className="text-[10px] font-black py-1 px-3 bg-slate-100/50 dark:bg-white/5 rounded-lg border border-white/10 text-slate-500 dark:text-slate-400 uppercase truncate">
                                            {item.servicioArticulo}
                                        </span>
                                    </td>
                                    <td className="hidden md:table-cell px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-white dark:bg-slate-800 text-[11px] font-black text-slate-900 dark:text-white border border-white/20 shadow-sm">
                                            {item.cantidad}
                                        </span>
                                    </td>
                                    <td className="hidden lg:table-cell px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                                                item.retrabajo 
                                                ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
                                                : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                            }`}>
                                                {item.retrabajo ? 'Retrabajo' : 'OK'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm font-black text-slate-900 dark:text-white italic text-right">
                                        ¢{item.total.toLocaleString()}
                                    </td>
                                </tr>
                            )) : !isLoading && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-40">
                                            <Search className="w-10 h-10" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Sin resultados</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {hasMore && (
                    <div className="p-4 border-t border-white/5 bg-slate-50/30 dark:bg-black/20 flex justify-center">
                        <button
                            onClick={() => fetchData()}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary hover:border-primary/30 transition-all shadow-sm disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <ChevronDown className="w-3 h-3" />
                            )}
                            {isLoading ? "Cargando..." : "Cargar más registros"}
                        </button>
                    </div>
                )}
            </Card>
        </div>
    );
}
