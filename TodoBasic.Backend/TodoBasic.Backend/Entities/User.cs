namespace TodoApp.Backend.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public bool IsEmailConfirmed { get; set; }
        public string? EmailConfirmationToken { get; set; }

        public List<Todo> Todos { get; set; } = new();
        public List<Category> Categories { get; set; } = new();
    }
}
