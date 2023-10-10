using Microsoft.EntityFrameworkCore;
using FluentValidation;
using O9d.AspNet.FluentValidation;
using Data;
using Data.Entities;
using Microsoft.AspNetCore.Http.HttpResults;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<SiteDbContext>();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
var app = builder.Build();

// Restaurant Routes
var restaurantsGroup = app.MapGroup("/api").WithValidationFilter();

restaurantsGroup.MapGet("restaurants", async (SiteDbContext siteDbContext, CancellationToken cancellationToken) =>
{
    return (await siteDbContext.Restaurants.ToListAsync(cancellationToken))
        .Select(dto => new RestaurantDto(dto.Name, dto.CuisineType, dto.City, dto.PriceRating));
});

restaurantsGroup.MapGet("restaurants/{restaurantId}", async (SiteDbContext siteDbContext, int restaurantId) =>
{
    Restaurant? restaurant = await siteDbContext.Restaurants
        .FirstOrDefaultAsync(restaurant => restaurant.Id == restaurantId);

    if (restaurant == null)
    {
        return Results.NotFound();
    }

    return Results.Ok(new RestaurantDto(restaurant.Name, restaurant.CuisineType, restaurant.City,
        restaurant.PriceRating));
});

restaurantsGroup.MapPost("restaurants", async (SiteDbContext siteDbContext,
    [Validate] CreateRestaurantDto createRestaurantDto) =>
{
    Restaurant restaurant = new()
    {
        Name = createRestaurantDto.Name,
        Description = createRestaurantDto.Description,
        CuisineType = createRestaurantDto.CuisineType,
        City = createRestaurantDto.City,
        Address = createRestaurantDto.Address,
        PhoneNumber = createRestaurantDto.PhoneNumber,
        PriceRating = createRestaurantDto.PriceRating
    };

    siteDbContext.Restaurants.Add(restaurant);

    await siteDbContext.SaveChangesAsync();

    return Results.Created($"/api/restaurants/{restaurant.Id}", new CreateRestaurantDto(restaurant.Id, restaurant.Name,
        restaurant.Description, restaurant.CuisineType, restaurant.City, restaurant.Address, restaurant.PhoneNumber,
        restaurant.PriceRating));
});

restaurantsGroup.MapPut("restaurants/{restaurantId}", async (SiteDbContext siteDbContext, int restaurantId,
    [Validate] UpdateRestaurantDto updateRestaurantDto) =>
{
    Restaurant? restaurant = await siteDbContext.Restaurants
        .FirstOrDefaultAsync(restaurant => restaurant.Id == restaurantId);

    if (restaurant == null)
    {
        return Results.NotFound();
    }

    restaurant.Name = updateRestaurantDto.Name;
    restaurant.Description = updateRestaurantDto.Description;
    restaurant.CuisineType = updateRestaurantDto.CuisineType;
    restaurant.City = updateRestaurantDto.City;
    restaurant.Address = updateRestaurantDto.Address;
    restaurant.PhoneNumber = updateRestaurantDto.PhoneNumber;
    restaurant.PriceRating = updateRestaurantDto.PriceRating;

    siteDbContext.Update(restaurant);

    await siteDbContext.SaveChangesAsync();

    return Results.Ok(new UpdateRestaurantDto(restaurant.Name, restaurant.Description, restaurant.CuisineType,
        restaurant.City, restaurant.Address, restaurant.PhoneNumber, restaurant.PriceRating));
});

restaurantsGroup.MapDelete("restaurants/{restaurantId}", async (SiteDbContext siteDbContext, int restaurantId) =>
{
    Restaurant? restaurant = await siteDbContext.Restaurants
        .FirstOrDefaultAsync(restaurant => restaurant.Id == restaurantId);

    if (restaurant == null)
    {
        return Results.NotFound();
    }

    siteDbContext.Remove(restaurant);

    await siteDbContext.SaveChangesAsync();

    return Results.NoContent();
});

// Menu Routes
var menusGroup = app.MapGroup("/api/restaurants/{restaurantId}").WithValidationFilter();

menusGroup.MapGet("menus", async (SiteDbContext siteDbContext, CancellationToken cancellationToken, int restaurantId) =>
{
    Restaurant? restaurant = await siteDbContext.Restaurants
        .FirstOrDefaultAsync(restaurant => restaurant.Id == restaurantId);

    if (restaurant == null)
    {
        return Results.NotFound();
    }

    return Results.Ok((await siteDbContext.Menus.ToListAsync(cancellationToken))
    .Where(menu => menu.Restaurant != null && menu.Restaurant.Id == restaurantId)
        .Select(dto => new MenuDto(dto.Type)));
});

menusGroup.MapGet("menus/{menuId}", async (SiteDbContext siteDbContext, int restaurantId, int menuId) =>
{
    Restaurant? restaurant = await siteDbContext.Restaurants
        .FirstOrDefaultAsync(restaurant => restaurant.Id == restaurantId);
    Menu? menu = await siteDbContext.Menus
        .FirstOrDefaultAsync(menu => menu.Id == menuId && menu.Restaurant.Id == restaurantId);

    if (restaurant == null || menu == null)
    {
        return Results.NotFound();
    }

    return Results.Ok(new MenuDto(menu.Type));
});

menusGroup.MapPost("menus", async (SiteDbContext siteDbContext, [Validate] CreateMenuDto createMenuDto,
    int restaurantId) =>
{
    Restaurant? restaurant = await siteDbContext.Restaurants
        .FirstOrDefaultAsync(restaurant => restaurant.Id == restaurantId);

    if (restaurant == null)
    {
        return Results.NotFound();
    }

    Menu menu = new()
    {
        Type = createMenuDto.Type,
        Restaurant = restaurant
    };

    siteDbContext.Menus.Add(menu);

    await siteDbContext.SaveChangesAsync();

    return Results.Created($"/api/restaurants/{restaurant.Id}", new CreateMenuDto(menu.Id, menu.Type, menu.Restaurant));
});

menusGroup.MapPut("menus/{menuId}", async (SiteDbContext siteDbContext, int restaurantId, int menuId,
    [Validate] UpdateMenuDto updateMenuDto) =>
{
    Restaurant? restaurant = await siteDbContext.Restaurants
        .FirstOrDefaultAsync(restaurant => restaurant.Id == restaurantId);
    Menu? menu = await siteDbContext.Menus
        .FirstOrDefaultAsync(menu => menu.Id == menuId && menu.Restaurant.Id == restaurantId);

    if (restaurant == null || menu == null)
    {
        return Results.NotFound();
    }

    menu.Type = updateMenuDto.Type;

    siteDbContext.Update(menu);

    await siteDbContext.SaveChangesAsync();

    return Results.Ok(new UpdateMenuDto(menu.Type));
});

menusGroup.MapDelete("menus/{menuId}", async (SiteDbContext siteDbContext, int restaurantId, int menuId) =>
{
    Restaurant? restaurant = await siteDbContext.Restaurants
        .FirstOrDefaultAsync(restaurant => restaurant.Id == restaurantId);
    Menu? menu = await siteDbContext.Menus
        .FirstOrDefaultAsync(menu => menu.Id == menuId && menu.Restaurant.Id == restaurantId);

    if (restaurant == null || menu == null)
    {
        return Results.NotFound();
    }

    siteDbContext.Remove(menu);

    await siteDbContext.SaveChangesAsync();

    return Results.NoContent();
});

// Meal Routes

app.Run();