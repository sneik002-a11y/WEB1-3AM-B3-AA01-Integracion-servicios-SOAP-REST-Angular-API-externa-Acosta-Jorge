import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

import { ProductoExterno } from '../../models/producto-externo.model';
import { Producto } from '../../models/producto.model';
import { CatalogoExternoService } from '../../services/catalogo-externo.service';
import { ProductoSoapService } from '../../services/producto-soap.service';


@Component({
  selector: 'app-catalogo',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule
  ],

  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})

export class CatalogoComponent implements OnInit {

  // API externa
  productos: ProductoExterno[] = [];
  topVendidos: ProductoExterno[] = [];

  terminoBusqueda = '';

  cargandoCatalogo = true;
  cargandoTop = true;

  errorCatalogo = false;
  errorTop = false;

  // Datos locales (SOAP)
  productosLocales: Producto[] = [];
  cargandoLocales = true;
  errorLocales = false;

  mostrarColumnasLocales: string[] = ['nombre', 'precio', 'stock', 'estado'];

  // Comparación integrada (local vs. externo)
  promedioPrecioLocal = 0;
  promedioPrecioExterno = 0;


  constructor(
    private catalogoService: CatalogoExternoService,
    private productoService: ProductoSoapService
  ) { }


  ngOnInit(): void {
    this.cargarCatalogo();
    this.cargarTopVendidos();
    this.cargarProductosLocales();
  }


  cargarProductosLocales(): void {

    this.cargandoLocales = true;
    this.errorLocales = false;

    this.productoService.obtenerProductos().subscribe({
      next: data => {
        this.productosLocales = data;
        this.cargandoLocales = false;
        this.calcularComparacion();
      },
      error: error => {
        console.error('Error al obtener productos locales (SOAP):', error);
        this.errorLocales = true;
        this.cargandoLocales = false;
      }
    });
  }


  cargarCatalogo(): void {

    this.cargandoCatalogo = true;
    this.errorCatalogo = false;

    this.catalogoService.obtenerCatalogo(20).subscribe({
      next: data => {
        this.productos = data;
        this.cargandoCatalogo = false;
        this.calcularComparacion();
      },
      error: error => {
        console.error('Error al consumir la API externa (catálogo):', error);
        this.errorCatalogo = true;
        this.cargandoCatalogo = false;
      }
    });
  }


  cargarTopVendidos(): void {

    this.cargandoTop = true;
    this.errorTop = false;

    this.catalogoService.obtenerTopVendidos(5).subscribe({
      next: data => {
        this.topVendidos = data;
        this.cargandoTop = false;
      },
      error: error => {
        console.error('Error al consumir la API externa (top vendidos):', error);
        this.errorTop = true;
        this.cargandoTop = false;
      }
    });
  }


  // Combina datos locales (SOAP) + externos (API pública) en un solo indicador
  private calcularComparacion(): void {

    if (this.productosLocales.length > 0) {
      const sumaLocal = this.productosLocales.reduce((acc, p) => acc + p.precio, 0);
      this.promedioPrecioLocal = sumaLocal / this.productosLocales.length;
    }

    if (this.productos.length > 0) {
      const sumaExterna = this.productos.reduce((acc, p) => acc + p.price, 0);
      this.promedioPrecioExterno = sumaExterna / this.productos.length;
    }
  }


  buscar(): void {

    const termino = this.terminoBusqueda.trim();

    if (!termino) {
      this.cargarCatalogo();
      return;
    }

    this.cargandoCatalogo = true;
    this.errorCatalogo = false;

    this.catalogoService.buscarPorNombre(termino).subscribe({
      next: data => {
        this.productos = data;
        this.cargandoCatalogo = false;
        this.calcularComparacion();
      },
      error: error => {
        console.error('Error al buscar en la API externa:', error);
        this.errorCatalogo = true;
        this.cargandoCatalogo = false;
      }
    });
  }


  reintentar(): void {
    this.cargarCatalogo();
    this.cargarTopVendidos();
    this.cargarProductosLocales();
  }

}
