import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { Categoria } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaSoapService {

  private url = 'http://localhost:5153/ProductoService.svc';

  constructor(private http: HttpClient) { }

  obtenerCategorias(): Observable<Categoria[]> {

    const soapRequest = `
      <soap:Envelope
          xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
          xmlns:tem="http://tempuri.org/">
        <soap:Header/>
        <soap:Body>
          <tem:ObtenerCategorias/>
        </soap:Body>
      </soap:Envelope>
    `.trim();

    return this.http.post(
      this.url,
      soapRequest,
      {
        headers: this.crearHeaders('ObtenerCategorias'),
        responseType: 'text'
      }
    ).pipe(
      map(response => this.convertirXMLACategorias(response))
    );
  }

  private crearHeaders(operacion: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': `"http://tempuri.org/IProductoService/${operacion}"`
    });
  }

  private convertirXMLACategorias(xml: string): Categoria[] {
    const parser = new DOMParser();
    const documento = parser.parseFromString(xml, 'text/xml');
    const nodos = documento.getElementsByTagNameNS('*', 'Categoria');

    const categorias: Categoria[] = [];
    for (let i = 0; i < nodos.length; i++) {
      categorias.push(this.convertirNodoACategoria(nodos[i]));
    }
    return categorias;
  }

  private convertirNodoACategoria(nodo: Element): Categoria {
    const valor = (nombre: string): string =>
      nodo.getElementsByTagNameNS('*', nombre)[0]?.textContent ?? '';

    return {
      idCategoria: Number(valor('IdCategoria')),
      nombre: valor('Nombre'),
      descripcion: valor('Descripcion'),
      estado: valor('Estado') === 'true'
    };
  }
}
