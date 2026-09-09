import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import Swal from 'sweetalert2';

import { Categoria } from '../../models/categoria.model';
import { CategoriaSoapService } from '../../services/categoria-soap.service';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css'
})
export class CategoriaComponent implements OnInit {

  categorias: Categoria[] = [];
  categoriasFiltradas: Categoria[] = [];

  mostrarColumnas: string[] = ['idCategoria', 'nombre', 'descripcion', 'estado'];

  constructor(private categoriaService: CategoriaSoapService) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll(): void {
    this.categoriaService.obtenerCategorias().subscribe({
      next: data => {
        this.categorias = data;
        this.categoriasFiltradas = data;
      },
      error: error => {
        console.error('Error al obtener categorías:', error);
        Swal.fire('Error', 'No se pudo conectar con el servicio SOAP', 'error');
      }
    });
  }

  applyFilter(event: Event): void {
    const filtro = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.categoriasFiltradas = this.categorias.filter(c =>
      c.nombre.toLowerCase().includes(filtro) ||
      c.descripcion.toLowerCase().includes(filtro)
    );
  }
}
