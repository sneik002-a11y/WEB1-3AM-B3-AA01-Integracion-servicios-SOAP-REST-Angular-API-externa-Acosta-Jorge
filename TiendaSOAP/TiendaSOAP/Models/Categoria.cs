using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace TiendaSOAP.Models
{
    [DataContract]
    public class Categoria
    {
        [Key]
        [DataMember(Order = 1)]
        public int IdCategoria { get; set; }

        [DataMember(Order = 2)]
        public string Nombre { get; set; } = string.Empty;

        [DataMember(Order = 3)]
        public string Descripcion { get; set; } = string.Empty;

        [DataMember(Order = 4)]
        public bool Estado { get; set; }
    }
}