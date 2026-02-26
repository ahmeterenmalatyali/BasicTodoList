using Microsoft.EntityFrameworkCore;
using TodoApp.Backend.Entities;

namespace TodoApp.Backend
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Todo> Todos { get; set; } = null!;
        public DbSet<SubTask> SubTasks { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // User -> Todos
            modelBuilder.Entity<Todo>()
                .HasOne(t => t.User)
                .WithMany(u => u.Todos)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // SubTask -> Todo
            modelBuilder.Entity<SubTask>()
                .HasOne<Todo>()
                .WithMany(t => t.SubTasks)
                .HasForeignKey(st => st.TodoId)
                .OnDelete(DeleteBehavior.Cascade);

            // SubTask -> AssignedUser (opsiyonel)
            modelBuilder.Entity<SubTask>()
                .HasOne(s => s.AssignedUser)
                .WithMany()
                .HasForeignKey(s => s.AssignedUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull);

            // Category -> User
            modelBuilder.Entity<Category>()
                .HasOne(c => c.User)
                .WithMany(u => u.Categories)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            base.OnModelCreating(modelBuilder);
        }
    }
}
