namespace Data.Entities;

public class Menu
{
    public required int Id { get; set; }
    public required string Type { get; set; }

    public required Restaurant Restaurant { get; set; }
}