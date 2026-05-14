import { NextResponse } from 'next/server';
import { getReportData } from '@/lib/excel';
import { calculateDashboardStats } from '@/lib/stats';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') || undefined;
    const month = searchParams.get('month') || undefined;

    try {
        const rawData = await getReportData();
        const stats = calculateDashboardStats(rawData, year, month);
        return NextResponse.json(stats);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to calculate stats' }, { status: 500 });
    }
}
