using Microsoft.EntityFrameworkCore;

namespace back.Models
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options){}

        public DbSet<User> Users { get; set; }
        public DbSet<UserScore> Scores { get; set; }
    }
}