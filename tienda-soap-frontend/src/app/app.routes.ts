import { Routes } from '@angular/router';

import { ProductoComponent } from './components/producto/producto.component';
import { CategoriaComponent } from './components/categoria/categoria.component';
import { MovimientoComponent } from './components/movimiento/movimiento.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';

export const routes: Routes = [
  { path: '', redirectTo: 'productos', pathMatch: 'full' },
  { path: 'productos', component: ProductoComponent },
  { path: 'categorias', component: CategoriaComponent },
  { path: 'movimientos', component: MovimientoComponent },
  { path: 'catalogo', component: CatalogoComponent }
];
