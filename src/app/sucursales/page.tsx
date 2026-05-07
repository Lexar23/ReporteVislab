import { getReportData } from "@/lib/excel";
import { SucursalesContent } from "@/components/sucursales/SucursalesContent";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
    title: "Sucursales | VisionLab Reporte",
    description: "Análisis de rendimiento por sucursal",
};

export default async function SucursalesPage() {
    const rawData = await getReportData();

    return (
        <main className="container mx-auto p-2">
            <SucursalesContent initialData={rawData} />
        </main>
    );
}
