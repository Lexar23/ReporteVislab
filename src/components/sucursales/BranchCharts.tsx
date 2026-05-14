"use client";

import { useState, useEffect } from "react";
import { BranchData } from "@/types/sucursal";
import { Card } from "@/components/ui";
import { useTheme } from "next-themes";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from "recharts";
import { motion } from "framer-motion";

interface BranchChartsProps {
    data: BranchData;
}

export function BranchCharts({ data }: BranchChartsProps) {
    const [isMounted, setIsMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const isDark = resolvedTheme === "dark";
    const tooltipBg = isDark ? "#0f172a" : "#ffffff";
    const chartTextColor = isDark ? "#64748b" : "#475569";
    const chartGridColor = isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.05)";

    if (!isMounted) return <div className="h-[400px] w-full animate-pulse bg-slate-900/10 dark:bg-white/5 rounded-[2.5rem]" />;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pie Chart: Lens Distribution */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
            >
                <Card className="p-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/20 dark:border-white/5 premium-shadow">
                    <div className="flex flex-col mb-2">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Lentes por Tipo</h3>
                    </div>
                    
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.lensTypes}
                                    cx="50%" cy="45%" 
                                    innerRadius={55} 
                                    outerRadius={80}
                                    paddingAngle={5} 
                                    dataKey="count" 
                                    nameKey="type"
                                    stroke="none"
                                >
                                    {data.lensTypes.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} className="focus:outline-none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ 
                                        backgroundColor: tooltipBg, 
                                        border: 'none', 
                                        borderRadius: '20px', 
                                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' 
                                    }}
                                    itemStyle={{ color: isDark ? '#fff' : '#000', fontSize: '10px', fontWeight: '900' }}
                                />
                                <Legend 
                                    verticalAlign="bottom" 
                                    align="center" 
                                    iconType="circle"
                                    iconSize={8}
                                    formatter={(value) => <span className="text-[9px] font-black uppercase text-slate-500 dark:text-slate-400">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </motion.div>

            {/* Bar Chart: Lens Counts */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
            >
                <Card className="p-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/20 dark:border-white/5 premium-shadow">
                    <div className="flex flex-col mb-2">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Volumen por Categoría</h3>
                    </div>
                    
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.lensTypes} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                                <XAxis 
                                    dataKey="type" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: chartTextColor, fontSize: 9, fontWeight: 700 }}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: chartTextColor, fontSize: 9, fontWeight: 700 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ 
                                        backgroundColor: tooltipBg, 
                                        border: 'none', 
                                        borderRadius: '20px', 
                                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' 
                                    }}
                                />
                                <Bar dataKey="count" name="Unidades" radius={[10, 10, 0, 0]}>
                                    {data.lensTypes.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                                <Legend 
                                    verticalAlign="bottom" 
                                    align="center" 
                                    iconType="circle"
                                    iconSize={8}
                                    formatter={(value) => <span className="text-[9px] font-black uppercase text-slate-500 dark:text-slate-400">{value}</span>}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
