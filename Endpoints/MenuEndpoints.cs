using Microsoft.EntityFrameworkCore;
using O9d.AspNet.FluentValidation;
using Data;
using Data.Entities;

namespace Endpoints;

public static class MenuEndpoints
{
    public static void AddMenuApi(RouteGroupBuilder menusGroup)
    {
        menusGroup.MapGet("menus", async (SiteDbContext siteDbContext, CancellationToken cancellationToken,
            int restaurantId) =>
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

            return Results.Created($"/api/restaurants/{restaurant.Id}", new CreateMenuDto(menu.Id, menu.Type,
                menu.Restaurant));
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
    }
}