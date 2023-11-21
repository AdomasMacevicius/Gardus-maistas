using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;
using FluentValidation;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Data;
using Endpoints;
using Auth;
using Auth.Entities;

JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<SiteDbContext>();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddTransient<JwtTokenService>();
builder.Services.AddScoped<AuthDbSeeder>();
builder.Services.AddIdentity<User, IdentityRole>().AddEntityFrameworkStores<SiteDbContext>().AddDefaultTokenProviders();
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters.ValidAudience = builder.Configuration["Jwt:ValidAudience"];
    options.TokenValidationParameters.ValidIssuer = builder.Configuration["Jwt:ValidIssuer"];
    options.TokenValidationParameters.IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]));
});
builder.Services.AddAuthorization();
var app = builder.Build();
app.UseAuthentication();
app.UseAuthorization();

var restaurantsGroup = app.MapGroup("/api").WithValidationFilter();
RestaurantEndpoints.AddRestaurantApi(restaurantsGroup);

var menusGroup = app.MapGroup("/api/restaurants/{restaurantId}").WithValidationFilter();
MenuEndpoints.AddMenuApi(menusGroup);

var mealsGroup = app.MapGroup("/api/restaurants/{restaurantId}/menus/{menuId}").WithValidationFilter();
MealEndpoints.AddMealApi(mealsGroup);

AuthEndpoints.AddAuthApi(app);

using var scope = app.Services.CreateScope();
var dbSeeder = scope.ServiceProvider.GetRequiredService<AuthDbSeeder>();

await dbSeeder.SeedAsync();

app.Run();