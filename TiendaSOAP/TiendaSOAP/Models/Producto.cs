using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace TiendaSOAP.Models
{
    [DataContract]
    public class Producto
    {
        [Key]
        [DataMember(Order = 1)]
        public int IdProducto { get; set; }

        [DataMember(Order = 2)]
        public string Nombre { get; set; } = string.Empty;

        [DataMember(Order = 3)]
        public string Descripcion { get; set; } = string.Empty;

        [DataMember(Order = 4)]
        public decimal Precio { get; set; }

        [DataMember(Order = 5)]
        public int Stock { get; set; }

        [DataMember(Order = 6)]
        public bool Estado { get; set; }

        // FK hacia Categoria
        [DataMember(Order = 7)]
        public int IdCategoria { get; set; }
    }
}