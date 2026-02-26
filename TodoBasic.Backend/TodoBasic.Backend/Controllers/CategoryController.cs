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
    public class CategoryController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CategoryController(AppDbContext context) => _context = context;

        private int GetUserId() =>
            int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var userId = GetUserId();
            var cats = await _context.Categories
                .Where(c => c.UserId == userId)
                .Select(c => new { c.Id, c.Name })
                .ToListAsync();
            return Ok(cats);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCategory([FromBody] CategoryDto dto)
        {
            var userId = GetUserId();
            if (await _context.Categories.AnyAsync(c => c.UserId == userId && c.Name == dto.Name))
                return BadRequest(new { message = "Bu kategori zaten mevcut." });

            var cat = new Category { Name = dto.Name, UserId = userId };
            _context.Categories.Add(cat);
            await _context.SaveChangesAsync();
            return Ok(new { cat.Id, cat.Name });
        }
    }

    public class CategoryDto { public string Name { get; set; } = string.Empty; }
}
