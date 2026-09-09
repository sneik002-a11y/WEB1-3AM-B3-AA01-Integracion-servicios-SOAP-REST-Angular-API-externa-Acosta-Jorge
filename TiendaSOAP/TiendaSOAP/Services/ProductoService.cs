using TiendaSOAP.Data;
using TiendaSOAP.Models;
using System.Collections.Generic;
using System.Linq;

namespace TiendaSOAP.Services
{
    public class ProductoService : IProductoService
    {
        private readonly TiendaDBContext _context;

        public ProductoService(TiendaDBContext context)
        {
            _context = context;
        }

        public List<Categoria> ObtenerCategorias()
        {
            return _context.Categorias.ToList();
        }

        public List<Producto> ObtenerProductos()
        {
            return _context.Productos.ToList();
        }

        public Producto ObtenerProducto(int id)
        {
            return _context.Productos.FirstOrDefault(p => p.IdProducto == id);
        }

        public bool AgregarProducto(Producto producto)
        {
            _context.Productos.Add(producto);
            return _context.SaveChanges() > 0;
        }

        public bool ActualizarProducto(Producto producto)
        {
            var existente = _context.Productos.FirstOrDefault(p => p.IdProducto == producto.IdProducto);

            if (existente == null)
            {
                return false;
            }

            existente.Nombre = producto.Nombre;
            existente.Descripcion = producto.Descripcion;
            existente.Precio = producto.Precio;
            existente.Stock = producto.Stock;
            existente.Estado = producto.Estado;
            existente.IdCategoria = producto.IdCategoria;

            return _context.SaveChanges() > 0;
        }

        public bool EliminarProducto(int id)
        {
            var existente = _context.Productos.FirstOrDefault(p => p.IdProducto == id);

            if (existente == null)
            {
                return false;
            }

            _context.Productos.Remove(existente);
            return _context.SaveChanges() > 0;
        }

        public List<Producto> ObtenerProductosPorPrecio(decimal precioMin, decimal precioMax)
        {
            return _context.Productos
                .Where(p => p.Precio >= precioMin && p.Precio <= precioMax)
                .ToList();
        }

        public List<Producto> ObtenerProductosPorCategoria(int idCategoria)
        {
            return _context.Productos
                .Where(p => p.IdCategoria == idCategoria)
                .ToList();
        }
    }
}