using FluentValidation;
using Data;
using Endpoints;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<SiteDbContext>();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
var app = builder.Build();

var restaurantsGroup = app.MapGroup("/api").WithValidationFilter();
RestaurantEndpoints.AddRestaurantApi(restaurantsGroup);

var menusGroup = app.MapGroup("/api/restaurants/{restaurantId}").WithValidationFilter();
MenuEndpoints.AddMenuApi(menusGroup);

var mealsGroup = app.MapGroup("/api/restaurants/{restaurantId}/menus/{menuId}").WithValidationFilter();
MealEndpoints.AddMealApi(mealsGroup);

app.Run();