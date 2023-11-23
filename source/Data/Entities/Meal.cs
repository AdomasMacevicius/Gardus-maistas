using Auth.Entities;

namespace Data.Entities;

public class Meal
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required float Price { get; set; }

    public required Menu Menu { get; set; }
    public required string UserId { get; set; }
    public User? User { get; set; }
}

public record MealDto(string Name, string Description, float Price);
public record CreateMealDto(int Id, string Name, string Description, float Price);
public record UpdateMealDto(string Name, string Description, float Price);