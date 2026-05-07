export interface ReportData {
    sucursal: string;
    cliente: string;
    factura: string;
    estado: string;
    fecha: Date;
    total: number;
    cantidad: number;
    servicioArticulo: string;
    ordenProduccion?: string;
    retrabajo: boolean;
    cantidadRetrabajo: number;
    comentariosRetrabajo?: string;
    optometra: string;
}

export interface DashboardStats {
    totalVentas: number;
    totalFacturas: number;
    sucursalMasActiva: string;
    porcentajeRetrabajo: number;
    crecimientoMensual?: number;
}
