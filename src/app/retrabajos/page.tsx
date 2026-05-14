import { getReportData } from "@/lib/excel";
import { ReworkManager } from "@/components/dashboard/ReworkManager";
import { DataDisplay } from "@/components/dashboard/DataDisplay";
import { Hammer } from "lucide-react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RetrabajosPage() {
    return (
        <main className="pb-20">
            <section className="relative pt-12 pb-12 px-6 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-amber-500/5 to-transparent -z-10" />
                <div className="max-w-7xl mx-auto space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600">
                        <Hammer className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Control de Calidad</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight">
                        Gestión de <span className="text-amber-500 italic">Retrabajos</span>
                    </h1>
                    <p className="text-slate-500 max-w-2xl">
                        Registra nuevas incidencias y monitorea el historial de piezas que requieren intervención adicional.
                    </p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 space-y-12">
                <ReworkManager />

                <div>
                    <div className="mb-4">
                        <h2 className="text-xl font-bold">Historial Registrado</h2>
                        <p className="text-sm text-slate-400">Listado de facturas marcadas como retrabajo en el sistema.</p>
                    </div>
                    <DataDisplay initialReworkOnly={true} />
                </div>
            </section>
        </main>
    );
}
