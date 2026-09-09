import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import Swal from 'sweetalert2';

import { Producto } from '../../models/producto.model';
import { Categoria } from '../../models/categoria.model';
import { ProductoSoapService } from '../../services/producto-soap.service';
import { CategoriaSoapService } from '../../services/categoria-soap.service';


@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatInputModule, MatFormFieldModule, MatIconModule,
    MatButtonModule, MatSelectModule
  ],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent implements OnInit, AfterViewInit {

  @ViewChild('formularioProducto') formularioProducto!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  producto: Producto = this.crearProductoVacio();
  editar: boolean = false;
  idEditar: number | null = null;

  categorias: Categoria[] = [];

  categoriaFiltro: number | null = null;
  precioMin: number | null = null;
  precioMax: number | null = null;

  dataSource = new MatTableDataSource<Producto>([]);

  mostrarColumnas: string[] = [
    'idProducto', 'nombre', 'descripcion', 'precio',
    'stock', 'categoria', 'estado', 'acciones'
  ];

  constructor(
    private productoService: ProductoSoapService,
    private categoriaService: CategoriaSoapService
  ) { }

  ngOnInit(): void {
    this.cargarCategorias();
    this.findAll();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarCategorias(): void {
    this.categoriaService.obtenerCategorias().subscribe({
      next: data => { this.categorias = data; },
      error: error => {
        console.error('Error al obtener categorías:', error);
        Swal.fire('Error', 'No se pudo conectar con el servicio SOAP de categorías', 'error');
      }
    });
  }

  nombreCategoria(idCategoria: number): string {
    return this.categorias.find(c => c.idCategoria === idCategoria)?.nombre ?? '—';
  }

  findAll(): void {
    this.productoService.obtenerProductos().subscribe({
      next: data => { this.dataSource.data = [...data]; },
      error: error => {
        console.error('Error al obtener productos:', error);
        Swal.fire('Error', 'No se pudo conectar con el servicio SOAP de productos', 'error');
      }
    });
  }

  filtrarPorCategoria(): void {
    if (this.categoriaFiltro === null) {
      this.findAll();
      return;
    }
    this.productoService.obtenerProductosPorCategoria(this.categoriaFiltro).subscribe({
      next: data => { this.dataSource.data = [...data]; },
      error: error => console.error('Error al filtrar por categoría:', error)
    });
  }

  filtrarPorPrecio(): void {
    if (this.precioMin === null || this.precioMax === null) {
      Swal.fire('Atención', 'Ingresa el precio mínimo y máximo', 'warning');
      return;
    }
    this.productoService.obtenerProductosPorPrecio(this.precioMin, this.precioMax).subscribe({
      next: data => { this.dataSource.data = [...data]; },
      error: error => console.error('Error al filtrar por precio:', error)
    });
  }

  limpiarFiltros(): void {
    this.categoriaFiltro = null;
    this.precioMin = null;
    this.precioMax = null;
    this.findAll();
  }

  save(form: NgForm): void {
    this.productoService.agregarProducto(this.producto).subscribe({
      next: exito => {
        if (!exito) {
          Swal.fire('Error', 'No se pudo registrar el producto', 'error');
          return;
        }
        Swal.fire('Guardado', 'El producto fue registrado correctamente', 'success');
        this.limpiarFormulario(form);
        this.findAll();
      },
      error: error => {
        console.error('Error al guardar producto:', error);
        Swal.fire('Error', 'No se pudo registrar el producto', 'error');
      }
    });
  }

  update(form: NgForm): void {
    if (this.idEditar === null) { return; }

    this.productoService.actualizarProducto(this.producto).subscribe({
      next: exito => {
        if (!exito) {
          Swal.fire('Error', 'No se pudo actualizar el producto', 'error');
          return;
        }
        Swal.fire('Actualizado', 'El producto fue actualizado correctamente', 'success');
        this.limpiarFormulario(form);
        this.findAll();
      },
      error: error => {
        console.error('Error al actualizar producto:', error);
        Swal.fire('Error', 'No se pudo actualizar el producto', 'error');
      }
    });
  }

  delete(producto: Producto): void {
    Swal.fire({
      title: '¿Desea eliminar el producto?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then(result => {
      if (result.isConfirmed) {
        this.productoService.eliminarProducto(producto.idProducto).subscribe({
          next: eliminado => {
            if (eliminado) {
              this.findAll();
              Swal.fire('Eliminado', 'El producto ha sido eliminado', 'success');
            } else {
              Swal.fire('Error', 'No se encontró el producto', 'error');
            }
          },
          error: error => console.error('Error al eliminar:', error)
        });
      }
    });
  }

  editarProducto(producto: Producto): void {
    this.producto = { ...producto };
    this.idEditar = producto.idProducto;
    this.editar = true;

    setTimeout(() => {
      this.formularioProducto.nativeElement
        .scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  editarProductoCancelar(form: NgForm): void {
    this.limpiarFormulario(form);
  }

  guardar(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      Swal.fire('Formulario incompleto', 'Revisa los campos marcados', 'warning');
      return;
    }
    if (this.editar && this.idEditar !== null) {
      this.update(form);
    } else {
      this.save(form);
    }
  }

  applyFilter(event: Event): void {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }

  private limpiarFormulario(form: NgForm): void {
    this.producto = this.crearProductoVacio();
    this.idEditar = null;
    this.editar = false;
    form.resetForm(this.crearProductoVacio());
  }

  private crearProductoVacio(): Producto {
    return {
      idProducto: 0, nombre: '', descripcion: '',
      precio: 0, stock: 0, estado: true, idCategoria: 0
    };
  }
}
