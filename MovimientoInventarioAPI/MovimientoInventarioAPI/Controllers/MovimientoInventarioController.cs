using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovimientoInventarioAPI.Data;
using MovimientoInventarioAPI.Models;

namespace MovimientoInventarioAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovimientoInventarioController : ControllerBase
    {
        private readonly TiendaDBContext _context;

        public MovimientoInventarioController(TiendaDBContext context)
        {
            _context = context;
        }

        // GET: api/MovimientoInventario
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MovimientoInventario>>> ObtenerMovimientos()
        {
            var movimientos = await _context.MovimientosInventario.ToListAsync();
            return Ok(movimientos);
        }

        // GET: api/MovimientoInventario/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MovimientoInventario>> ObtenerMovimiento(int id)
        {
            var movimiento = await _context.MovimientosInventario.FindAsync(id);

            if (movimiento == null)
            {
                return NotFound($"No se encontró el movimiento con Id {id}");
            }

            return Ok(movimiento);
        }

        // GET: api/MovimientoInventario/producto/2
        [HttpGet("producto/{idProducto}")]
        public async Task<ActionResult<IEnumerable<MovimientoInventario>>> ObtenerMovimientosPorProducto(int idProducto)
        {
            var movimientos = await _context.MovimientosInventario
                .Where(m => m.IdProducto == idProducto)
                .ToListAsync();

            return Ok(movimientos);
        }

        // POST: api/MovimientoInventario
        [HttpPost]
        public async Task<ActionResult<MovimientoInventario>> AgregarMovimiento(MovimientoInventario movimiento)
        {
            if (movimiento.TipoMovimiento != "ENTRADA" && movimiento.TipoMovimiento != "SALIDA")
            {
                return BadRequest("TipoMovimiento debe ser 'ENTRADA' o 'SALIDA'");
            }

            movimiento.FechaMovimiento = DateTime.Now;

            _context.MovimientosInventario.Add(movimiento);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(ObtenerMovimiento),
                new { id = movimiento.IdMovimiento },
                movimiento
            );
        }

        // PUT: api/MovimientoInventario/5
        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarMovimiento(int id, MovimientoInventario movimiento)
        {
            if (id != movimiento.IdMovimiento)
            {
                return BadRequest("El Id de la ruta no coincide con el Id del movimiento");
            }

            var existente = await _context.MovimientosInventario.FindAsync(id);

            if (existente == null)
            {
                return NotFound($"No se encontró el movimiento con Id {id}");
            }

            existente.IdProducto = movimiento.IdProducto;
            existente.TipoMovimiento = movimiento.TipoMovimiento;
            existente.Cantidad = movimiento.Cantidad;
            existente.Usuario = movimiento.Usuario;
            existente.Observacion = movimiento.Observacion;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/MovimientoInventario/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarMovimiento(int id)
        {
            var existente = await _context.MovimientosInventario.FindAsync(id);

            if (existente == null)
            {
                return NotFound($"No se encontró el movimiento con Id {id}");
            }

            _context.MovimientosInventario.Remove(existente);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
