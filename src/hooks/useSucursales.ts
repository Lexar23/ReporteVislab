"use client";

import { useState, useMemo } from "react";
import { BranchData, BranchFilter } from "@/types/sucursal";
import { ReportData } from "@/types/report";

export function useSucursales(initialData: ReportData[]) {
    // Extract unique branches from real data
    const branches = useMemo(() => {
        const uniqueBranches = Array.from(new Set(initialData.map(d => d.sucursal)));
        return uniqueBranches.sort();
    }, [initialData]);

    const [filters, setFilters] = useState<BranchFilter>({
        branch: branches[0] || "N/A",
        year: new Date().getFullYear(),
        months: [new Date().getMonth() + 1],
    });

    const years = useMemo(() => {
        const yrs = Array.from(new Set(initialData.map(d => d.fecha.getFullYear())));
        return yrs.sort((a, b) => b - a);
    }, [initialData]);

    const months = [
        { value: 1, name: "Enero" },
        { value: 2, name: "Febrero" },
        { value: 3, name: "Marzo" },
        { value: 4, name: "Abril" },
        { value: 5, name: "Mayo" },
        { value: 6, name: "Junio" },
        { value: 7, name: "Julio" },
        { value: 8, name: "Agosto" },
        { value: 9, name: "Septiembre" },
        { value: 10, name: "Octubre" },
        { value: 11, name: "Noviembre" },
        { value: 12, name: "Diciembre" },
    ];

    const data = useMemo((): BranchData => {
        const filtered = initialData.filter(d => 
            d.sucursal === filters.branch && 
            d.fecha.getFullYear() === filters.year &&
            filters.months.includes(d.fecha.getMonth() + 1)
        );

        const sales = filtered.reduce((acc, curr) => acc + curr.total, 0);
        const ordersCount = filtered.length;

        // Group by lens type (servicioArticulo)
        const lensStats: Record<string, number> = {};
        filtered.forEach(d => {
            const type = d.servicioArticulo || "N/A";
            lensStats[type] = (lensStats[type] || 0) + d.cantidad;
        });

        const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899"];

        const lensTypes = Object.entries(lensStats).map(([type, count], idx) => ({
            type,
            count,
            color: COLORS[idx % COLORS.length]
        })).sort((a, b) => b.count - a.count);

        return {
            branchName: filters.branch,
            sales,
            ordersCount,
            lensTypes,
        };
    }, [initialData, filters]);

    return {
        filters,
        setFilters,
        data,
        branches,
        years,
        months
    };
}
