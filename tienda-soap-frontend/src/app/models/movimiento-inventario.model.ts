export interface MovimientoInventario {
  idMovimiento: number;
  idProducto: number;
  tipoMovimiento: string; // 'ENTRADA' | 'SALIDA'
  cantidad: number;
  fechaMovimiento?: string;
  usuario: string;
  observacion?: string;
}
