import { NextResponse } from 'next/server';
import { getReportData } from '@/lib/excel';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q')?.toLowerCase() || '';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const reworkOnly = searchParams.get('rework') === 'true';

    try {
        const allData = await getReportData();
        
        // Filter on server
        let filtered = allData;
        
        if (reworkOnly) {
            filtered = filtered.filter(item => item.retrabajo);
        }
        
        if (search) {
            filtered = filtered.filter(item => 
                item.cliente.toLowerCase().includes(search) ||
                item.factura.toLowerCase().includes(search) ||
                item.sucursal.toLowerCase().includes(search) ||
                item.servicioArticulo.toLowerCase().includes(search) ||
                (item.ordenProduccion && item.ordenProduccion.toLowerCase().includes(search))
            );
        }

        const total = filtered.length;
        const paginated = filtered.slice(offset, offset + limit);

        return NextResponse.json({
            data: paginated,
            total,
            hasMore: offset + limit < total
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
