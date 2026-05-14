import { ReportData } from "@/types/report";

const MONTH_NAMES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sept", "Oct", "Nov", "Dic"];

const normalizeString = (str: string) => {
    return str
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim();
};

export function calculateDashboardStats(data: ReportData[], selectedYear?: string, selectedMonth?: string) {
    const years = Array.from(new Set(data.map(d => d.fecha.getFullYear().toString()))).sort((a, b) => b.localeCompare(a));
    
    const currentYear = selectedYear || years[0] || new Date().getFullYear().toString();
    const previousYear = (parseInt(currentYear) - 1).toString();

    const currentYearByMonth = new Array(12).fill(0);
    const previousYearByMonth = new Array(12).fill(0);
    const optoStats: Record<string, { total: number, qty: number }> = {};
    const designStats: Record<string, number> = {};
    const branchSalesMap: Record<string, number> = {};
    let reworksCount = 0;
    let filteredCount = 0;

    for (const d of data) {
        const dYear = d.fecha.getFullYear().toString();
        const dMonth = d.fecha.getMonth();

        if (dYear === currentYear) {
            currentYearByMonth[dMonth] += d.total;
        } else if (dYear === previousYear) {
            previousYearByMonth[dMonth] += d.total;
        }

        const matchesYear = !selectedYear || selectedYear === "all" || dYear === selectedYear;
        const matchesMonth = !selectedMonth || selectedMonth === "all" || dMonth.toString() === selectedMonth;

        if (matchesYear && matchesMonth) {
            filteredCount++;
            if (d.retrabajo) reworksCount++;

            const rawName = d.optometra || 'Desconocido';
            const name = normalizeString(rawName);
            if (name && name !== 'N/A' && name !== 'UNDEFINED') {
                if (!optoStats[name]) optoStats[name] = { total: 0, qty: 0 };
                if (!d.retrabajo) optoStats[name].total += d.total;
                optoStats[name].qty += d.cantidad;
            }

            const design = normalizeString(d.servicioArticulo || 'N/D');
            if (design && design !== 'N/A' && design !== 'N/D') {
                designStats[design] = (designStats[design] || 0) + d.cantidad;
            }

            if (!d.retrabajo) {
                const branch = d.sucursal || 'N/A';
                branchSalesMap[branch] = (branchSalesMap[branch] || 0) + d.total;
            }
        }
    }

    const comparison = MONTH_NAMES.map((month, idx) => ({
        mes: month,
        current: currentYearByMonth[idx],
        previous: previousYearByMonth[idx],
        growth: previousYearByMonth[idx] > 0 ? ((currentYearByMonth[idx] - previousYearByMonth[idx]) / previousYearByMonth[idx]) * 100 : 0
    }));

    const topOptometrasTotal = Object.entries(optoStats)
        .map(([name, stats]) => ({ name, ...stats }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);

    const designDistribution = Object.entries(designStats)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);

    const salesByBranch = Object.entries(branchSalesMap)
        .map(([name, total]) => ({ sucursal: name, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 8);

    return {
        years,
        currentYear,
        previousYear,
        salesByMonthComparison: comparison,
        topOptometrasTotal,
        topOptometrasQty: [...topOptometrasTotal].sort((a, b) => b.qty - a.qty),
        designDistribution,
        sucursalLider: salesByBranch[0]?.sucursal || 'N/A',
        salesByBranch,
        qualityRatios: [
            { name: 'Lentes Buenos', value: filteredCount - reworksCount },
            { name: 'Retrabajos', value: reworksCount }
        ],
        totalVentas: salesByBranch.reduce((acc, b) => acc + b.total, 0), // Note: This is simplified
        totalFacturas: filteredCount,
        retrabajosCount: reworksCount
    };
}
