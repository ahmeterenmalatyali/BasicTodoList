namespace TodoApp.Backend.Entities
{
    public class Todo
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }
        public int Priority { get; set; } = 1;
        public string Category { get; set; } = "Genel";
        public DateTime? DueDate { get; set; }
        public int Order { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public List<SubTask> SubTasks { get; set; } = new();
    }
}
