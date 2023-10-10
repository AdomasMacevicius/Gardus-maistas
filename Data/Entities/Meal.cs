namespace Data.Entities;

public class Meal
{
    public required int Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required string Type { get; set; }
    public required float Price { get; set; }

    public required Menu Menu { get; set; }
}