import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { ProductoExterno, RespuestaProductosExternos } from '../models/producto-externo.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogoExternoService {

  // API pública externa (sin API key) - DummyJSON
  private url = 'https://dummyjson.com/products';


  constructor(private http: HttpClient) { }


  obtenerCatalogo(limite: number = 20): Observable<ProductoExterno[]> {
    return this.http
      .get<RespuestaProductosExternos>(`${this.url}?limit=${limite}`)
      .pipe(
        map(respuesta => respuesta.products)
      );
  }


  obtenerTopVendidos(cantidad: number = 5): Observable<ProductoExterno[]> {
    // DummyJSON no tiene un campo "ventas", así que usamos el rating
    // (calificación de los compradores) como indicador de popularidad / más vendidos.
    return this.http
      .get<RespuestaProductosExternos>(`${this.url}?limit=100`)
      .pipe(
        map(respuesta =>
          [...respuesta.products]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, cantidad)
        )
      );
  }


  buscarPorNombre(termino: string): Observable<ProductoExterno[]> {
    return this.http
      .get<RespuestaProductosExternos>(`${this.url}/search?q=${encodeURIComponent(termino)}`)
      .pipe(
        map(respuesta => respuesta.products)
      );
  }

}
