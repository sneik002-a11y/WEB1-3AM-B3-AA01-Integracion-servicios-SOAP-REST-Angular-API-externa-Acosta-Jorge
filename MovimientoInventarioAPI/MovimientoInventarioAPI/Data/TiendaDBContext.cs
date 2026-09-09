using Microsoft.EntityFrameworkCore;
using MovimientoInventarioAPI.Models;

namespace MovimientoInventarioAPI.Data
{
    public class TiendaDBContext : DbContext
    {
        public TiendaDBContext(DbContextOptions<TiendaDBContext> options)
            : base(options)
        {
        }

        public DbSet<MovimientoInventario> MovimientosInventario { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MovimientoInventario>()
                .ToTable("Movimiento_Inventario");

            modelBuilder.Entity<MovimientoInventario>()
                .Property(m => m.IdMovimiento)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<MovimientoInventario>()
                .Property(m => m.FechaMovimiento)
                .HasDefaultValueSql("GETDATE()");
        }
    }
}
