using TiendaSOAP.Models;
using Microsoft.EntityFrameworkCore;

namespace TiendaSOAP.Data
{
    public class TiendaDBContext : DbContext
    {
        public TiendaDBContext(DbContextOptions<TiendaDBContext> options)
            : base(options)
        {
        }

        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Producto> Productos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Categoria>().ToTable("Categoria");
            modelBuilder.Entity<Producto>().ToTable("Producto");
        }
    }
}
