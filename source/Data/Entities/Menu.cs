using Auth.Entities;

namespace Data.Entities;

public class Menu
{
    public int Id { get; set; }
    public required string Type { get; set; }

    public required Restaurant Restaurant { get; set; }
    public required string UserId { get; set; }
    public User? User { get; set; }
}

public record MenuDto(string Type);
public record CreateMenuDto(int Id, string Type, Restaurant Restaurant);
public record UpdateMenuDto(string Type);