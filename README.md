# Sistema de Gestión de Inventario para Tienda (SOAP + REST + Angular)

**Estudiante:** Jorge Acosta
**Paralelo:** A
**Materia:** Programación Web 1 — Instituto Superior Universitario Cordillera
**Tema asignado:** Sistema de gestión de inventario para tienda — integración de un servicio SOAP, un servicio REST y una API externa, consumidos desde una aplicación Angular.

\---

## 1\. Descripción del proyecto y entidades

El sistema administra el catálogo de productos de una tienda y controla sus movimientos de inventario (entradas y salidas de stock). Está compuesto por **tres proyectos independientes** que se ejecutan por separado y se comunican entre sí:

|Proyecto|Tipo|Función|
|-|-|-|
|`TiendaSOAP`|Servicio SOAP (.NET + CoreWCF)|CRUD de Categorías y Productos|
|`MovimientoInventarioAPI`|Servicio REST (.NET Web API)|CRUD de Movimientos de Inventario|
|`tienda-soap-frontend`|Cliente Angular|Interfaz que consume ambos servicios + una API externa|

### Entidades y relación entre ellas

```
Categoria (1) ──────< (N) Producto (1) ──────< (N) Movimiento\\\\\\\_Inventario
```

* **Categoria**: clasifica los productos (ej. Bebidas, Snacks, Aseo).
* **Producto**: pertenece a una Categoria (`IdCategoria` como FK). Tiene nombre, descripción, precio, stock y estado.
* **Movimiento\_Inventario**: registra cada entrada o salida de stock de un Producto (`IdProducto` como FK), con tipo de movimiento, cantidad, fecha, usuario responsable y observación.

Las tres tablas viven en la misma base de datos: **`TiendaSOAPDB`**.

\---

## 2\. Tecnologías utilizadas

|Capa|Tecnología|
|-|-|
|Backend SOAP|ASP.NET Core (.NET 10) + **CoreWCF.Http**|
|Backend REST|ASP.NET Core Web API (.NET 10)|
|Acceso a datos|Entity Framework Core + **Microsoft.EntityFrameworkCore.SqlServer**|
|Base de datos|**SQL Server** (`TiendaSOAPDB`)|
|Frontend|**Angular 19** (standalone components) + Angular Material + Bootstrap + SweetAlert2|
|API externa|**DummyJSON** (`https://dummyjson.com/products`) — catálogo público de productos|

\---

## 3\. Organización del repositorio

```
📁 raíz del repositorio
│
├── 📁 TiendaSOAP/                    → Backend SOAP
│   ├── Models/                       (Categoria.cs, Producto.cs)
│   ├── Data/                         (TiendaDBContext.cs)
│   ├── Services/                     (IProductoService.cs, ProductoService.cs)
│   ├── Program.cs
│   ├── appsettings.json
│   ├── script-tiendasoap.sql         → Crea la BD + tablas Categoria/Producto
│   ├── alter-movimiento-inventario.sql → Agrega la tabla Movimiento\\\\\\\_Inventario
│   └── README.md                     (README específico de este backend)
│
├── 📁 MovimientoInventarioAPI/       → Backend REST
│   ├── Models/                       (MovimientoInventario.cs)
│   ├── Data/                         (TiendaDBContext.cs)
│   ├── Controllers/                  (MovimientoInventarioController.cs)
│   ├── Program.cs
│   └── appsettings.json
│
├── 📁 tienda-soap-frontend/          → Cliente Angular
│   └── src/app/
│       ├── components/               (producto, categoria, movimiento, catalogo)
│       ├── services/                 (producto-soap, categoria-soap, movimiento-rest, catalogo-externo)
│       └── models/
│
└── README.md                         → Este archivo (visión general del repositorio)
```

\---

## 4\. Base de datos: creación y restauración

1. Abre SQL Server Management Studio (o el cliente que uses).
2. Ejecuta **en este orden**:

   1. `TiendaSOAP/script-tiendasoap.sql` → crea la base `TiendaSOAPDB`, las tablas `Categoria` y `Producto` (con su relación FK), e inserta datos de prueba.
   2. `TiendaSOAP/alter-movimiento-inventario.sql` → agrega la tabla `Movimiento\\\\\\\_Inventario` (con FK hacia `Producto`) e inserta movimientos de prueba.
3. Verifica la conexión: ambos backends usan la cadena de conexión `TiendaConnection` en su `appsettings.json` respectivo:

```json
   "ConnectionStrings": {
     "TiendaConnection": "Server=.\\\\\\\\\\\\\\\\SQLEXPRESS;Database=TiendaSOAPDB;Trusted\\\\\\\_Connection=True;TrustServerCertificate=True;"
   }
   ```

Ajusta el nombre de instancia de SQL Server (`.\\\\\\\\SQLEXPRESS`) según tu entorno local.

\---

## 5\. Ejecutar el servicio SOAP (`TiendaSOAP`)

1. Abre la carpeta `TiendaSOAP` como proyecto en Visual Studio.
2. Restaura los paquetes NuGet: `CoreWCF.Http` y `Microsoft.EntityFrameworkCore.SqlServer`.
3. Presiona **F5**. La consola debe mostrar `Now listening on: http://localhost:<puerto>`.
4. El servicio queda expuesto en: `http://localhost:<puerto>/ProductoService.svc`
5. Puedes verificar el WSDL/metadatos abriendo esa URL directamente en el navegador.

\---

## 6\. Ejecutar el servicio REST (`MovimientoInventarioAPI`)

1. Abre la carpeta `MovimientoInventarioAPI` como proyecto en Visual Studio (en una ventana distinta, ya que corre en paralelo al SOAP).
2. Restaura el paquete NuGet: `Microsoft.EntityFrameworkCore.SqlServer` (Swashbuckle/Swagger ya viene incluido si el proyecto se creó con soporte OpenAPI).
3. Presiona **F5**. La consola debe mostrar `Now listening on: http://localhost:<puerto>`.
4. Abre `http://localhost:<puerto>/swagger` para ver y probar los 6 endpoints desde la interfaz de Swagger.

\---

## 7\. Ejecutar el frontend Angular (`tienda-soap-frontend`)

1. Abre la carpeta `tienda-soap-frontend` en VS Code.
2. En la terminal integrada: `npm install`
3. **Antes de iniciar Angular**, asegúrate de tener los dos backends (SOAP y REST) corriendo, y confirma que las URLs configuradas coincidan con sus puertos reales:

   * `src/app/services/producto-soap.service.ts` y `categoria-soap.service.ts` → URL del backend SOAP
   * `src/app/services/movimiento-rest.service.ts` → URL del backend REST
4. Levanta el servidor de desarrollo: `npx ng serve`
5. Abre el navegador en `http://localhost:4200`

\---

## 8\. Endpoints y acciones principales

### Servicio SOAP — `IProductoService` (`/ProductoService.svc`)

|Operación|Descripción|
|-|-|
|`ObtenerCategorias()`|Lista todas las categorías|
|`ObtenerProductos()`|Lista todos los productos|
|`ObtenerProducto(int id)`|Obtiene un producto por Id|
|`AgregarProducto(Producto p)`|Crea un producto|
|`ActualizarProducto(Producto p)`|Actualiza un producto|
|`EliminarProducto(int id)`|Elimina un producto|
|`ObtenerProductosPorPrecio(decimal min, decimal max)`|Filtra por rango de precio|
|`ObtenerProductosPorCategoria(int idCategoria)`|Filtra por categoría|

### Servicio REST — `/api/MovimientoInventario`

|Método|Ruta|Descripción|
|-|-|-|
|GET|`/api/MovimientoInventario`|Lista todos los movimientos|
|GET|`/api/MovimientoInventario/{id}`|Obtiene un movimiento por Id|
|GET|`/api/MovimientoInventario/producto/{idProducto}`|Filtra movimientos por producto|
|POST|`/api/MovimientoInventario`|Crea un movimiento|
|PUT|`/api/MovimientoInventario/{id}`|Actualiza un movimiento|
|DELETE|`/api/MovimientoInventario/{id}`|Elimina un movimiento|

### Pantallas Angular

|Pantalla|Ruta|Servicio consumido|
|-|-|-|
|Productos|`/productos`|SOAP|
|Categorías|`/categorias`|SOAP|
|Movimientos|`/movimientos`|REST|
|Catálogo Externo|`/catalogo`|API externa (DummyJSON) + datos propios (SOAP)|

\---

## 9\. API externa

* **API utilizada:** [DummyJSON](https://dummyjson.com/products) — API pública gratuita, sin necesidad de API key.
* **Qué información retorna:** catálogo de productos con nombre, descripción, precio, categoría, stock, calificación (`rating`) e imágenes.
* **Endpoints consumidos:**

  * `GET https://dummyjson.com/products?limit=20` → catálogo general
  * `GET https://dummyjson.com/products?limit=100` → base para calcular el Top 5 más vendidos (ordenado por `rating`, ya que la API no expone unidades vendidas)
  * `GET https://dummyjson.com/products/search?q=<término>` → búsqueda por nombre
* **Dónde se integra:** pantalla **"Catálogo Externo"** (`/catalogo`) del frontend Angular. Ahí se muestran, en una sola pantalla:

  1. Un comparativo de **precio promedio propio (SOAP) vs. precio promedio del catálogo externo** — dato calculado combinando ambas fuentes.
  2. Tabla de productos propios (datos locales, vía SOAP).
  3. Ranking Top 5 más vendidos del catálogo externo.
  4. Catálogo externo completo, con buscador.
* **Manejo de errores:** si la API externa no responde, la pantalla muestra un mensaje de error con un botón "Reintentar", sin romper el resto de la aplicación.

\---

## Notas para quien revisa el proyecto

* Los tres proyectos deben ejecutarse **simultáneamente** (SOAP, REST y Angular) para que la aplicación funcione de punta a punta.
* CORS está habilitado en ambos backends para aceptar peticiones desde `http://localhost:4200`.
* Los puertos exactos de cada backend los asigna Visual Studio automáticamente al ejecutar (F5); si difieren de los configurados en los servicios Angular, deben actualizarse ahí antes de correr el frontend.

