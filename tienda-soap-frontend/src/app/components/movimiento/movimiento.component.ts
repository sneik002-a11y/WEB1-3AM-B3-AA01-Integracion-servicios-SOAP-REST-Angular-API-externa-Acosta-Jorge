import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';

import Swal from 'sweetalert2';

import { MovimientoInventario } from '../../models/movimiento-inventario.model';
import { Producto } from '../../models/producto.model';
import { MovimientoRestService } from '../../services/movimiento-rest.service';
import { ProductoSoapService } from '../../services/producto-soap.service';


@Component({
  selector: 'app-movimiento',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule
  ],

  templateUrl: './movimiento.component.html',
  styleUrl: './movimiento.component.css'
})

export class MovimientoComponent implements OnInit {

  movimientos: MovimientoInventario[] = [];
  movimientosFiltrados: MovimientoInventario[] = [];
  movimientosPagina: MovimientoInventario[] = [];

  productos: Producto[] = [];

  movimiento: MovimientoInventario = this.crearMovimientoVacio();
  editar = false;

  productoFiltro: number | null = null;

  cargando = true;
  error = false;

  pageSize = 5;
  pageIndex = 0;

  mostrarColumnas: string[] = [
    'idMovimiento',
    'producto',
    'tipoMovimiento',
    'cantidad',
    'fechaMovimiento',
    'usuario',
    'observacion',
    'acciones'
  ];


  constructor(
    private movimientoService: MovimientoRestService,
    private productoService: ProductoSoapService
  ) { }


  ngOnInit(): void {
    this.cargarProductos();
    this.findAll();
  }


  cargarProductos(): void {
    this.productoService.obtenerProductos().subscribe({
      next: data => this.productos = data,
      error: error => console.error('Error al obtener productos (SOAP):', error)
    });
  }


  nombreProducto(idProducto: number): string {
    return this.productos.find(p => p.idProducto === idProducto)?.nombre ?? `Producto #${idProducto}`;
  }


  findAll(): void {

    this.cargando = true;
    this.error = false;

    this.movimientoService.obtenerMovimientos().subscribe({
      next: data => {
        this.movimientos = data;
        this.movimientosFiltrados = data;
        this.pageIndex = 0;
        this.actualizarPagina();
        this.cargando = false;
      },
      error: error => {
        console.error('Error al obtener movimientos (REST):', error);
        this.error = true;
        this.cargando = false;

        Swal.fire(
          'Error de conexión',
          'No se pudo conectar con el servicio REST de inventario. Verifica que la API esté corriendo.',
          'error'
        );
      }
    });
  }


  filtrarPorProducto(): void {

    if (this.productoFiltro === null) {
      this.movimientosFiltrados = this.movimientos;
      this.pageIndex = 0;
      this.actualizarPagina();
      return;
    }

    this.movimientoService.obtenerMovimientosPorProducto(this.productoFiltro).subscribe({
      next: data => {
        this.movimientosFiltrados = data;
        this.pageIndex = 0;
        this.actualizarPagina();
      },
      error: error => {
        console.error('Error al filtrar por producto:', error);
        Swal.fire('Error', 'No se pudo filtrar por producto', 'error');
      }
    });
  }


  limpiarFiltro(): void {
    this.productoFiltro = null;
    this.movimientosFiltrados = this.movimientos;
    this.pageIndex = 0;
    this.actualizarPagina();
  }


  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.actualizarPagina();
  }


  private actualizarPagina(): void {
    const inicio = this.pageIndex * this.pageSize;
    this.movimientosPagina = this.movimientosFiltrados.slice(inicio, inicio + this.pageSize);
  }


  guardar(form: NgForm): void {

    if (form.invalid) {
      form.control.markAllAsTouched();

      Swal.fire(
        'Formulario incompleto',
        'Revisa los campos marcados en rojo antes de continuar',
        'warning'
      );

      return;
    }

    if (this.editar) {
      this.update(form);
    } else {
      this.save(form);
    }
  }


  save(form: NgForm): void {

    this.movimientoService.agregarMovimiento(this.movimiento).subscribe({
      next: () => {
        Swal.fire(
          'Movimiento registrado',
          'El movimiento de inventario fue registrado correctamente',
          'success'
        );

        this.limpiarFormulario(form);
        this.findAll();
      },
      error: error => {
        console.error('Error al registrar movimiento:', error);

        Swal.fire(
          'Error',
          'No se pudo registrar el movimiento. Verifica los datos e intenta de nuevo.',
          'error'
        );
      }
    });
  }


  update(form: NgForm): void {

    this.movimientoService.actualizarMovimiento(this.movimiento.idMovimiento, this.movimiento).subscribe({
      next: () => {
        Swal.fire(
          'Movimiento actualizado',
          'Los cambios se guardaron correctamente',
          'success'
        );

        this.limpiarFormulario(form);
        this.findAll();
      },
      error: error => {
        console.error('Error al actualizar movimiento:', error);

        Swal.fire(
          'Error',
          'No se pudo actualizar el movimiento',
          'error'
        );
      }
    });
  }


  editarMovimiento(movimiento: MovimientoInventario): void {
    this.movimiento = { ...movimiento };
    this.editar = true;
  }


  cancelarEdicion(form: NgForm): void {
    this.limpiarFormulario(form);
  }


  eliminar(movimiento: MovimientoInventario): void {

    Swal.fire({
      title: '¿Eliminar este movimiento?',
      text: `${movimiento.tipoMovimiento} de ${movimiento.cantidad} unidades — esta acción no se puede deshacer`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then(result => {

      if (result.isConfirmed) {

        this.movimientoService.eliminarMovimiento(movimiento.idMovimiento).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El movimiento fue eliminado', 'success');
            this.findAll();
          },
          error: error => {
            console.error('Error al eliminar movimiento:', error);
            Swal.fire('Error', 'No se pudo eliminar el movimiento', 'error');
          }
        });
      }
    });
  }


  private limpiarFormulario(form: NgForm): void {
    this.movimiento = this.crearMovimientoVacio();
    this.editar = false;
    form.resetForm(this.crearMovimientoVacio());
  }


  private crearMovimientoVacio(): MovimientoInventario {
    return {
      idMovimiento: 0,
      idProducto: 0,
      tipoMovimiento: '',
      cantidad: 0,
      usuario: '',
      observacion: ''
    };
  }

}
