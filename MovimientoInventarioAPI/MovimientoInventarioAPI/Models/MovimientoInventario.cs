using System.ComponentModel.DataAnnotations;

namespace MovimientoInventarioAPI.Models
{
    public class MovimientoInventario
    {
        [Key]
        public int IdMovimiento { get; set; }

        public int IdProducto { get; set; }

        public string TipoMovimiento { get; set; } = string.Empty; // "ENTRADA" o "SALIDA"

        public int Cantidad { get; set; }

        public DateTime FechaMovimiento { get; set; }

        public string Usuario { get; set; } = string.Empty;

        public string? Observacion { get; set; }
    }
}
