using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TodoApp.Backend.Entities;

namespace TodoApp.Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TodoController : ControllerBase
    {
        private readonly AppDbContext _context;
        public TodoController(AppDbContext context) => _context = context;

        private int GetUserId() =>
            int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        // ── GET /api/Todo ──────────────────────────────────────────────
        [HttpGet]
        public async Task<IActionResult> GetTodos()
        {
            var userId = GetUserId();

            var todoEntities = await _context.Todos
                .Where(t => t.UserId == userId)
                .Include(t => t.SubTasks)
                    .ThenInclude(s => s.AssignedUser)
                .OrderBy(t => t.Order)
                .ToListAsync();

            var todos = todoEntities.Select(t => new
            {
                t.Id,
                t.Title,
                t.IsCompleted,
                t.Priority,
                t.Category,
                t.DueDate,
                t.Order,
                SubTasks = t.SubTasks.OrderBy(s => s.Id).Select(s => new
                {
                    s.Id,
                    s.Title,
                    s.IsCompleted,
                    s.AssignedUserId,
                    AssignedUser = s.AssignedUser != null
                        ? (object)new { s.AssignedUser.Id, s.AssignedUser.Username }
                        : null
                }).ToList()
            }).ToList();

            return Ok(todos);
        }

        // ── POST /api/Todo ─────────────────────────────────────────────
        [HttpPost]
        public async Task<IActionResult> CreateTodo([FromBody] TodoCreateDto dto)
        {
            var userId = GetUserId();
            var todo = new Todo
            {
                Title = dto.Title,
                UserId = userId,
                Priority = dto.Priority,
                Category = dto.Category,
                DueDate = dto.DueDate,
                IsCompleted = false,
                Order = _context.Todos.Count(t => t.UserId == userId) + 1
            };
            _context.Todos.Add(todo);
            await _context.SaveChangesAsync();
            return Ok(todo);
        }

        // ── DELETE /api/Todo/{id} ──────────────────────────────────────
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodo(int id)
        {
            var userId = GetUserId();
            var todo = await _context.Todos.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            if (todo == null) return NotFound();
            _context.Todos.Remove(todo);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // ── PUT /api/Todo/{id}/toggle ──────────────────────────────────
        [HttpPut("{id}/toggle")]
        public async Task<IActionResult> ToggleTodo(int id)
        {
            var userId = GetUserId();
            var todo = await _context.Todos
                .Include(t => t.SubTasks)
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            if (todo == null) return NotFound();

            if (!todo.IsCompleted && todo.SubTasks.Any(s => !s.IsCompleted))
                return BadRequest("Önce alt görevleri bitirin.");

            todo.IsCompleted = !todo.IsCompleted;
            await _context.SaveChangesAsync();
            return Ok();
        }

        // ── PUT /api/Todo/reorder ──────────────────────────────────────
        [HttpPut("reorder")]
        public async Task<IActionResult> Reorder([FromBody] List<int> ids)
        {
            var userId = GetUserId();
            for (int i = 0; i < ids.Count; i++)
            {
                var todo = await _context.Todos
                    .FirstOrDefaultAsync(t => t.Id == ids[i] && t.UserId == userId);
                if (todo != null) todo.Order = i;
            }
            await _context.SaveChangesAsync();
            return Ok();
        }

        // ── POST /api/Todo/{id}/subtask ────────────────────────────────
        [HttpPost("{todoId}/subtask")]
        public async Task<IActionResult> AddSubTask(int todoId, [FromQuery] string title, [FromQuery] int? assignedUserId)
        {
            var userId = GetUserId();
            var todo = await _context.Todos.FirstOrDefaultAsync(t => t.Id == todoId && t.UserId == userId);
            if (todo == null) return NotFound();

            var subTask = new SubTask
            {
                Title = title,
                TodoId = todoId,
                AssignedUserId = assignedUserId,
                IsCompleted = false
            };
            _context.SubTasks.Add(subTask);
            await _context.SaveChangesAsync();
            return Ok(subTask);
        }

        // ── PUT /api/Todo/subtask/{id}/toggle ─────────────────────────
        [HttpPut("subtask/{subTaskId}/toggle")]
        public async Task<IActionResult> ToggleSubTask(int subTaskId)
        {
            var subTask = await _context.SubTasks.FindAsync(subTaskId);
            if (subTask == null) return NotFound();
            subTask.IsCompleted = !subTask.IsCompleted;
            await _context.SaveChangesAsync();
            return Ok();
        }
    }

    public class TodoCreateDto
    {
        public string Title { get; set; } = string.Empty;
        public int Priority { get; set; } = 1;
        public string Category { get; set; } = "Genel";
        public DateTime? DueDate { get; set; }
    }
}
