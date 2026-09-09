using CoreWCF;
using TiendaSOAP.Models;
using System.Collections.Generic;

namespace TiendaSOAP.Services
{
    [ServiceContract]
    public interface IProductoService
    {
        [OperationContract]
        List<Categoria> ObtenerCategorias();

        [OperationContract]
        List<Producto> ObtenerProductos();

        [OperationContract]
        Producto ObtenerProducto(int id);

        [OperationContract]
        bool AgregarProducto(Producto producto);

        [OperationContract]
        bool ActualizarProducto(Producto producto);

        [OperationContract]
        bool EliminarProducto(int id);

        [OperationContract]
        List<Producto> ObtenerProductosPorPrecio(decimal precioMin, decimal precioMax);

        [OperationContract]
        List<Producto> ObtenerProductosPorCategoria(int idCategoria);
    }
}
