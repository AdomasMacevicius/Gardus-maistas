namespace Data.Entities;

public class Restaurant
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required string CuisineType { get; set; }
    public required string City { get; set; }
    public required string Address { get; set; }
    public required string PhoneNumber { get; set; }
    public required string PriceRating { get; set; }
}

public record RestaurantDto(string Name, string CuisineType, string City, string PriceRating);
public record CreateRestaurantDto(int Id, string Name, string Description, string CuisineType, string City,
string Address, string PhoneNumber, string PriceRating);
public record UpdateRestaurantDto(string Name, string Description, string CuisineType, string City,
string Address, string PhoneNumber, string PriceRating);