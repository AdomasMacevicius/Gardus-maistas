using Microsoft.AspNetCore.Identity;

namespace Auth.Entities;

public class AuthDbSeeder
{
    private readonly UserManager<User> userManager;
    private readonly RoleManager<IdentityRole> roleManager;

    public AuthDbSeeder(UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
    {
        this.userManager = userManager;
        this.roleManager = roleManager;
    }

    public async Task SeedAsync()
    {
        await AddDefaultRoles();
        await AddAdminUser();
    }

    private async Task AddDefaultRoles()
    {
        foreach (string role in Roles.AllRoles)
        {
            var roleExists = await roleManager.RoleExistsAsync(role);

            if (!roleExists)
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }
    }

    private async Task AddAdminUser()
    {
        User newAdminUser = new()
        {
            UserName = "admin",
            Email = "admin@admin.com"
        };

        var existingAdminUser = await userManager.FindByNameAsync(newAdminUser.UserName);

        if (existingAdminUser == null)
        {
            var createNewAdminUser = await userManager.CreateAsync(newAdminUser, "Kebabas1-");

            if (createNewAdminUser.Succeeded)
            {
                await userManager.AddToRolesAsync(newAdminUser, Roles.AllRoles);
            }
        }
    }
}