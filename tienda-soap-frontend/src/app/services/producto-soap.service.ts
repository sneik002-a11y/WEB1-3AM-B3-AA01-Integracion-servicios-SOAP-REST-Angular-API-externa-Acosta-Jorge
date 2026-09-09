import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoSoapService {

  private url = 'http://localhost:5153/ProductoService.svc';

  constructor(private http: HttpClient) { }

  obtenerProductos(): Observable<Producto[]> {
    const soapRequest = `
      <soap:Envelope
          xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
          xmlns:tem="http://tempuri.org/">
        <soap:Header/>
        <soap:Body>
          <tem:ObtenerProductos/>
        </soap:Body>
      </soap:Envelope>
    `.trim();

    return this.http.post(
      this.url, soapRequest,
      { headers: this.crearHeaders('ObtenerProductos'), responseType: 'text' }
    ).pipe(map(response => this.convertirXMLAProductos(response)));
  }

  obtenerProducto(id: number): Observable<Producto | null> {
    const soapRequest = `
      <soap:Envelope
          xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
          xmlns:tem="http://tempuri.org/">
        <soap:Header/>
        <soap:Body>
          <tem:ObtenerProducto>
            <tem:id>${id}</tem:id>
          </tem:ObtenerProducto>
        </soap:Body>
      </soap:Envelope>
    `.trim();

    return this.http.post(
      this.url, soapRequest,
      { headers: this.crearHeaders('ObtenerProducto'), responseType: 'text' }
    ).pipe(map(response => this.convertirXMLAProducto(response)));
  }

  agregarProducto(producto: Producto): Observable<boolean> {
    const soapRequest = `
      <soap:Envelope
          xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
          xmlns:tem="http://tempuri.org/"
          xmlns:pro="http://schemas.datacontract.org/2004/07/TiendaSOAP.Models">
        <soap:Header/>
        <soap:Body>
          <tem:AgregarProducto>
            <tem:producto>
              <pro:IdProducto>0</pro:IdProducto>
              <pro:Nombre>${this.escaparXml(producto.nombre)}</pro:Nombre>
              <pro:Descripcion>${this.escaparXml(producto.descripcion)}</pro:Descripcion>
              <pro:Precio>${producto.precio}</pro:Precio>
              <pro:Stock>${producto.stock}</pro:Stock>
              <pro:Estado>${producto.estado}</pro:Estado>
              <pro:IdCategoria>${producto.idCategoria}</pro:IdCategoria>
            </tem:producto>
          </tem:AgregarProducto>
        </soap:Body>
      </soap:Envelope>
    `.trim();

    return this.http.post(
      this.url, soapRequest,
      { headers: this.crearHeaders('AgregarProducto'), responseType: 'text' }
    ).pipe(map(response => this.convertirXMLABooleano(response, 'AgregarProductoResult')));
  }

  actualizarProducto(producto: Producto): Observable<boolean> {
    const soapRequest = `
      <soap:Envelope
          xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
          xmlns:tem="http://tempuri.org/"
          xmlns:pro="http://schemas.datacontract.org/2004/07/TiendaSOAP.Models">
        <soap:Header/>
        <soap:Body>
          <tem:ActualizarProducto>
            <tem:producto>
              <pro:IdProducto>${producto.idProducto}</pro:IdProducto>
              <pro:Nombre>${this.escaparXml(producto.nombre)}</pro:Nombre>
              <pro:Descripcion>${this.escaparXml(producto.descripcion)}</pro:Descripcion>
              <pro:Precio>${producto.precio}</pro:Precio>
              <pro:Stock>${producto.stock}</pro:Stock>
              <pro:Estado>${producto.estado}</pro:Estado>
              <pro:IdCategoria>${producto.idCategoria}</pro:IdCategoria>
            </tem:producto>
          </tem:ActualizarProducto>
        </soap:Body>
      </soap:Envelope>
    `.trim();

    return this.http.post(
      this.url, soapRequest,
      { headers: this.crearHeaders('ActualizarProducto'), responseType: 'text' }
    ).pipe(map(response => this.convertirXMLABooleano(response, 'ActualizarProductoResult')));
  }

  eliminarProducto(id: number): Observable<boolean> {
    const soapRequest = `
      <soap:Envelope
          xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
          xmlns:tem="http://tempuri.org/">
        <soap:Header/>
        <soap:Body>
          <tem:EliminarProducto>
            <tem:id>${id}</tem:id>
          </tem:EliminarProducto>
        </soap:Body>
      </soap:Envelope>
    `.trim();

    return this.http.post(
      this.url, soapRequest,
      { headers: this.crearHeaders('EliminarProducto'), responseType: 'text' }
    ).pipe(map(response => this.convertirXMLABooleano(response, 'EliminarProductoResult')));
  }

  obtenerProductosPorPrecio(precioMin: number, precioMax: number): Observable<Producto[]> {
    const soapRequest = `
      <soap:Envelope
          xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
          xmlns:tem="http://tempuri.org/">
        <soap:Header/>
        <soap:Body>
          <tem:ObtenerProductosPorPrecio>
            <tem:precioMin>${precioMin}</tem:precioMin>
            <tem:precioMax>${precioMax}</tem:precioMax>
          </tem:ObtenerProductosPorPrecio>
        </soap:Body>
      </soap:Envelope>
    `.trim();

    return this.http.post(
      this.url, soapRequest,
      { headers: this.crearHeaders('ObtenerProductosPorPrecio'), responseType: 'text' }
    ).pipe(map(response => this.convertirXMLAProductos(response)));
  }

  obtenerProductosPorCategoria(idCategoria: number): Observable<Producto[]> {
    const soapRequest = `
      <soap:Envelope
          xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
          xmlns:tem="http://tempuri.org/">
        <soap:Header/>
        <soap:Body>
          <tem:ObtenerProductosPorCategoria>
            <tem:idCategoria>${idCategoria}</tem:idCategoria>
          </tem:ObtenerProductosPorCategoria>
        </soap:Body>
      </soap:Envelope>
    `.trim();

    return this.http.post(
      this.url, soapRequest,
      { headers: this.crearHeaders('ObtenerProductosPorCategoria'), responseType: 'text' }
    ).pipe(map(response => this.convertirXMLAProductos(response)));
  }

  private crearHeaders(operacion: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': `"http://tempuri.org/IProductoService/${operacion}"`
    });
  }

  private convertirXMLAProductos(xml: string): Producto[] {
    const parser = new DOMParser();
    const documento = parser.parseFromString(xml, 'text/xml');
    const nodos = documento.getElementsByTagNameNS('*', 'Producto');

    const productos: Producto[] = [];
    for (let i = 0; i < nodos.length; i++) {
      productos.push(this.convertirNodoAProducto(nodos[i]));
    }
    return productos;
  }

  private convertirXMLAProducto(xml: string): Producto | null {
    const parser = new DOMParser();
    const documento = parser.parseFromString(xml, 'text/xml');

    let nodo = documento.getElementsByTagNameNS('*', 'Producto')[0];
    if (!nodo) {
      nodo = documento.getElementsByTagNameNS('*', 'ObtenerProductoResult')[0];
    }
    if (!nodo) {
      return null;
    }
    return this.convertirNodoAProducto(nodo);
  }

  private convertirXMLABooleano(xml: string, tagResultado: string): boolean {
    const parser = new DOMParser();
    const documento = parser.parseFromString(xml, 'text/xml');
    const resultado = documento.getElementsByTagNameNS('*', tagResultado)[0];
    return resultado?.textContent === 'true';
  }

  private convertirNodoAProducto(nodo: Element): Producto {
    const valor = (nombre: string): string =>
      nodo.getElementsByTagNameNS('*', nombre)[0]?.textContent ?? '';

    return {
      idProducto: Number(valor('IdProducto')),
      nombre: valor('Nombre'),
      descripcion: valor('Descripcion'),
      precio: Number(valor('Precio')),
      stock: Number(valor('Stock')),
      estado: valor('Estado') === 'true',
      idCategoria: Number(valor('IdCategoria'))
    };
  }

  private escaparXml(valor: string): string {
    return valor
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
