using Microsoft.EntityFrameworkCore;
using O9d.AspNet.FluentValidation;
using Data;
using Data.Entities;

namespace Endpoints;

public static class MealEndpoints
{
    public static void AddMealApi(RouteGroupBuilder mealsGroup)
    {
        mealsGroup.MapGet("meals", async (SiteDbContext siteDbContext, CancellationToken cancellationToken,
            int restaurantId, int menuId) =>
        {
            Restaurant? restaurant = await siteDbContext.Restaurants
                .FirstOrDefaultAsync(restaurant => restaurant.Id == restaurantId);
            Menu? menu = await siteDbContext.Menus
                .FirstOrDefaultAsync(menu => menu.Id == menuId && menu.Restaurant.Id == restaurantId);

            if (restaurant == null || menu == null)
            {
                return Results.NotFound();
            }

            return Results.Ok((await siteDbContext.Meals.ToListAsync(cancellationToken))
                .Where(meal => meal.Menu != null && meal.Menu.Id == menuId)
                .Select(dto => new MealDto(dto.Name, dto.Description, dto.Price)));
        });

        mealsGroup.MapGet("meals/{mealId}", async (SiteDbContext siteDbContext, int restaurantId, int menuId,
            int mealId) =>
        {
            Restaurant? restaurant = await siteDbContext.Restaurants
                .FirstOrDefaultAsync(restaurant => restaurant.Id == restaurantId);
            Menu? menu = await siteDbContext.Menus
                .FirstOrDefaultAsync(menu => menu.Id == menuId && menu.Restaurant.Id == restaurantId);
            Meal? meal = await siteDbContext.Meals
                .FirstOrDefaultAsync(meal => meal.Id == mealId && meal.Menu.Id == menuId &&
                meal.Menu.Restaurant.Id == restaurantId);

            if (restaurant == null || menu == null || meal == null)
            {
                return Results.NotFound();
            }

            return Results.Ok(new MealDto(meal.Name, meal.Description, meal.Price));
        });

        mealsGroup.MapPost("meals", async (SiteDbContext siteDbContext, [Validate] CreateMealDto createMealDto,
            int restaurantId, int menuId) =>
        {
            Restaurant? restaurant = await siteDbContext.Restaurants
                .FirstOrDefaultAsync(restaurant => restaurant.Id == restaurantId);
            Menu? menu = await siteDbContext.Menus
                .FirstOrDefaultAsync(menu => menu.Id == menuId && menu.Restaurant.Id == restaurantId);

            if (restaurant == null || menu == null)
            {
                return Results.NotFound();
            }

            Meal meal = new()
            {
                Name = createMealDto.Name,
                Description = createMealDto.Description,
                Price = createMealDto.Price,
                Menu = menu
            };

            siteDbContext.Meals.Add(meal);

            await siteDbContext.SaveChangesAsync();

            return Results.Created($"/api/restaurants/{restaurant.Id}/menus/{menu.Id}", new CreateMealDto(meal.Id,
                meal.Name, meal.Description, meal.Price));
        });

        mealsGroup.MapPut("meals/{mealId}", async (SiteDbContext siteDbContext, int restaurantId, int menuId,
            int mealId, [Validate] UpdateMealDto updateMealDto) =>
        {
            Restaurant? restaurant = await siteDbContext.Restaurants
                .FirstOrDefaultAsync(restaurant => restaurant.Id == restaurantId);
            Menu? menu = await siteDbContext.Menus
                .FirstOrDefaultAsync(menu => menu.Id == menuId && menu.Restaurant.Id == restaurantId);
            Meal? meal = await siteDbContext.Meals
                .FirstOrDefaultAsync(meal => meal.Id == mealId && meal.Menu.Id == menuId &&
                meal.Menu.Restaurant.Id == restaurantId);

            if (restaurant == null || menu == null || meal == null)
            {
                return Results.NotFound();
            }

            meal.Name = updateMealDto.Name;
            meal.Description = updateMealDto.Description;
            meal.Price = updateMealDto.Price;

            siteDbContext.Update(meal);

            await siteDbContext.SaveChangesAsync();

            return Results.Ok(new UpdateMealDto(meal.Name, meal.Description, meal.Price));
        });

        mealsGroup.MapDelete("meals/{mealId}", async (SiteDbContext siteDbContext, int restaurantId, int menuId,
            int mealId) =>
        {
            Restaurant? restaurant = await siteDbContext.Restaurants
                .FirstOrDefaultAsync(restaurant => restaurant.Id == restaurantId);
            Menu? menu = await siteDbContext.Menus
                .FirstOrDefaultAsync(menu => menu.Id == menuId && menu.Restaurant.Id == restaurantId);
            Meal? meal = await siteDbContext.Meals
                .FirstOrDefaultAsync(meal => meal.Id == mealId && meal.Menu.Id == menuId &&
                meal.Menu.Restaurant.Id == restaurantId);

            if (restaurant == null || menu == null || meal == null)
            {
                return Results.NotFound();
            }

            siteDbContext.Remove(meal);

            await siteDbContext.SaveChangesAsync();

            return Results.NoContent();
        });
    }
}