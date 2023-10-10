using Microsoft.EntityFrameworkCore;
using Data.Entities;

namespace Data;

public class SiteDbContext : DbContext
{
    IConfiguration configuration;
    public DbSet<Restaurant> Restaurants { get; set; }
    public DbSet<Menu> Menus { get; set; }
    public DbSet<Meal> Meals { get; set; }

    public SiteDbContext(IConfiguration configuration)
    {
        this.configuration = configuration;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder dbContextOptionsBuilder)
    {
        dbContextOptionsBuilder.UseNpgsql(this.configuration.GetConnectionString("PostgreSQL"));
    }
}