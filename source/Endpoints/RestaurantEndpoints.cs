using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using O9d.AspNet.FluentValidation;
using Data;
using Data.Entities;
using Auth.Entities;

namespace Endpoints;

public static class RestaurantEndpoints
{
    public static void AddRestaurantApi(RouteGroupBuilder restaurantsGroup)
    {
        restaurantsGroup.MapGet("restaurants", async (SiteDbContext siteDbContext,
            CancellationToken cancellationToken) =>
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

        restaurantsGroup.MapPost("restaurants", [Authorize(Roles = Roles.Admin)] async (SiteDbContext siteDbContext,
            HttpContext httpContext, [Validate] CreateRestaurantDto createRestaurantDto) =>
        {
            var restaurants = siteDbContext.Restaurants.ToList()
                .Where(restaurant => restaurant.Name == createRestaurantDto.Name && restaurant.Address == createRestaurantDto.Address);

            if (restaurants.Any())
            {
                return Results.Conflict();
            }

            if (!httpContext.User.IsInRole(Roles.Admin))
            {
                return Results.Forbid();
            }

            Restaurant restaurant = new()
            {
                Name = createRestaurantDto.Name,
                Description = createRestaurantDto.Description,
                CuisineType = createRestaurantDto.CuisineType,
                City = createRestaurantDto.City,
                Address = createRestaurantDto.Address,
                PhoneNumber = createRestaurantDto.PhoneNumber,
                PriceRating = createRestaurantDto.PriceRating,
                UserId = httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub)
            };

            siteDbContext.Restaurants.Add(restaurant);

            await siteDbContext.SaveChangesAsync();

            return Results.Created($"/api/restaurants/{restaurant.Id}", new CreateRestaurantDto(restaurant.Id,
                restaurant.Name, restaurant.Description, restaurant.CuisineType, restaurant.City, restaurant.Address,
                restaurant.PhoneNumber, restaurant.PriceRating));
        });

        restaurantsGroup.MapPut("restaurants/{restaurantId}", [Authorize(Roles = Roles.Admin)] async
            (SiteDbContext siteDbContext, HttpContext httpContext, int restaurantId,
            [Validate] UpdateRestaurantDto updateRestaurantDto) =>
        {
            Restaurant? restaurant = await siteDbContext.Restaurants
                .FirstOrDefaultAsync(restaurant => restaurant.Id == restaurantId);

            if (restaurant == null)
            {
                return Results.NotFound();
            }

            if (!httpContext.User.IsInRole(Roles.Admin))
            {
                return Results.Forbid();
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

        restaurantsGroup.MapDelete("restaurants/{restaurantId}", [Authorize(Roles = Roles.Admin)] async
            (SiteDbContext siteDbContext, HttpContext httpContext, int restaurantId) =>
        {
            Restaurant? restaurant = await siteDbContext.Restaurants
                .FirstOrDefaultAsync(restaurant => restaurant.Id == restaurantId);

            if (restaurant == null)
            {
                return Results.NotFound();
            }

            if (!httpContext.User.IsInRole(Roles.Admin))
            {
                return Results.Forbid();
            }

            siteDbContext.Remove(restaurant);

            await siteDbContext.SaveChangesAsync();

            return Results.NoContent();
        });
    }
}