import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MovimientoInventario } from '../models/movimiento-inventario.model';

@Injectable({
  providedIn: 'root'
})
export class MovimientoRestService {

  // URL del servicio REST (MovimientoInventarioAPI)
  private url = 'http://localhost:5222/api/MovimientoInventario';

  constructor(private http: HttpClient) { }


  obtenerMovimientos(): Observable<MovimientoInventario[]> {
    return this.http.get<MovimientoInventario[]>(this.url);
  }


  obtenerMovimiento(id: number): Observable<MovimientoInventario> {
    return this.http.get<MovimientoInventario>(`${this.url}/${id}`);
  }


  obtenerMovimientosPorProducto(idProducto: number): Observable<MovimientoInventario[]> {
    return this.http.get<MovimientoInventario[]>(`${this.url}/producto/${idProducto}`);
  }


  agregarMovimiento(movimiento: MovimientoInventario): Observable<MovimientoInventario> {
    return this.http.post<MovimientoInventario>(this.url, movimiento);
  }


  actualizarMovimiento(id: number, movimiento: MovimientoInventario): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, movimiento);
  }


  eliminarMovimiento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

}
