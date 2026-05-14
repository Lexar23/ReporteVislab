import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';
import { ReportData } from '@/types/report';

function parseNumber(value: any): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const parsed = parseFloat(value.replace(/[^\d.-]/g, ''));
        return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
}

function normalizeBranchName(name: string): string {
    if (!name) return 'N/A';
    
    let normalized = name.toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/\s+/g, " ")
        .trim();

    return normalized;
}
 
export async function getReportData(): Promise<ReportData[]> {
    const filePath = path.join(process.cwd(), 'public', 'assets', 'reporte.xlsx');

    if (!fs.existsSync(filePath)) {
        console.error('File not found:', filePath);
        return [];
    }

    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer', cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
    const dataRows = rows.slice(1);

    return dataRows
        .filter(row => row[0])
        .map((row) => ({
            sucursal: normalizeBranchName(String(row[0] || 'N/A')),
            cliente: String(row[1] || 'N/A').trim(),
            factura: String(row[3] || 'N/A').trim(),
            estado: String(row[5] || 'N/A'),
            fecha: row[6] instanceof Date ? row[6] : new Date(),
            total: parseNumber(row[14]),
            cantidad: parseNumber(row[10]),
            servicioArticulo: String(row[9] || 'N/A'),
            ordenProduccion: String(row[8] || ''),
            retrabajo: !!row[16] && String(row[16]).trim() !== '' && String(row[16]) !== 'N/A',
            cantidadRetrabajo: parseNumber(row[17]),
            optometra: String(row[20] || 'Desconocido').trim(),
        }));
}
