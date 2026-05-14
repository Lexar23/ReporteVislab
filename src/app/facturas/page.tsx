import { getReportData } from "@/lib/excel";
import { DataDisplay } from "@/components/dashboard/DataDisplay";
import { FileText } from "lucide-react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function FacturasPage() {
    return (
        <main className="pb-20">
            <section className="relative pt-12 pb-12 px-6 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent -z-10" />
                <div className="max-w-7xl mx-auto space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
                        <FileText className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Gestión de Datos</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight">
                        Listado de <span className="text-primary italic">Facturas</span>
                    </h1>
                    <p className="text-slate-500 max-w-2xl">
                        Explora, busca y filtra el detalle completo de todas las transacciones registradas.
                    </p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-6">
                <DataDisplay />
            </section>
        </main>
    );
}
