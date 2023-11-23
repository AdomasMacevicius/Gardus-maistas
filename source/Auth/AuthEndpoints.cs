using Microsoft.AspNetCore.Identity;
using Auth.Entities;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace Auth;

public static class AuthEndpoints
{
    public static void AddAuthApi(WebApplication app)
    {
        // Registration
        app.MapPost("api/register", async (UserManager<User> userManager, RegisterUserDto registerUserDto) =>
        {
            var user = await userManager.FindByNameAsync(registerUserDto.Username);

            // Check if user exists
            if (user != null)
            {
                return Results.UnprocessableEntity("User already registered");
            }

            // Create new user
            User newUser = new()
            {
                UserName = registerUserDto.Username,
                Email = registerUserDto.Email
            };

            var createNewUserResult = await userManager.CreateAsync(newUser, registerUserDto.Password);

            // Check if user creation was successful
            if (!createNewUserResult.Succeeded)
            {
                return Results.UnprocessableEntity(createNewUserResult.Errors);
            }

            // Add to Roles table
            await userManager.AddToRoleAsync(newUser, Roles.User);

            return Results.Created("api/login", new UserDto(newUser.Id, newUser.UserName, newUser.Email));
        });

        // Login
        app.MapPost("api/login", async (UserManager<User> userManager, JwtTokenService jwtTokenService,
            RegisterUserDto registerUserDto) =>
        {
            var user = await userManager.FindByNameAsync(registerUserDto.Username);

            // Check if user exists
            if (user == null)
            {
                return Results.UnprocessableEntity("Username or password is incorrect");
            }

            var isPasswordValid = await userManager.CheckPasswordAsync(user, registerUserDto.Password);

            // Check if user's password is valid
            if (!isPasswordValid)
            {
                return Results.UnprocessableEntity("Username or password is incorrect");
            }

            // Reset ForceRelogin property and update user
            user.ForceRelogin = false;
            await userManager.UpdateAsync(user);

            // Gets user's role
            var roles = await userManager.GetRolesAsync(user);

            // Generate tokens
            var accessToken = jwtTokenService.CreateAccessToken(user.UserName, user.Id, roles);
            var refreshToken = jwtTokenService.CreateRefreshToken(user.Id);

            return Results.Ok(new SuccessfulLoginDto(accessToken, refreshToken));
        });

        // AccessToken
        app.MapPost("api/accessToken", async (UserManager<User> userManager, JwtTokenService jwtTokenService,
            RefreshAccessTokenDto refreshAccessTokenDto) =>
        {
            // Try to parse refresh token
            if (!jwtTokenService.TryParseRefreshToken(refreshAccessTokenDto.RefreshToken, out var claims))
            {
                return Results.UnprocessableEntity();
            }

            var userId = claims.FindFirstValue(JwtRegisteredClaimNames.Sub);
            var user = await userManager.FindByIdAsync(userId);

            // If user doesn't exist - invalid token
            if (user == null)
            {
                return Results.UnprocessableEntity("Invalid token");
            }

            // If user has ForceRelogin - can't get new token until user relogins
            if (user.ForceRelogin)
            {
                return Results.UnprocessableEntity();
            }

            // Gets user's role
            var roles = await userManager.GetRolesAsync(user);

            // Generate tokens
            var accessToken = jwtTokenService.CreateAccessToken(user.UserName, user.Id, roles);
            var refreshToken = jwtTokenService.CreateRefreshToken(user.Id);

            return Results.Ok(new SuccessfulLoginDto(accessToken, refreshToken));
        });

        // // Logout
        // app.MapPost("api/logout", async (UserManager<User> userManager, JwtTokenService jwtTokenService,
        //     RefreshAccessTokenDto refreshAccessTokenDto) =>
        // {
        //     // Try to parse refresh token
        //     if (!jwtTokenService.TryParseRefreshToken(refreshAccessTokenDto.RefreshToken, out var claims))
        //     {
        //         return Results.UnprocessableEntity();
        //     }

        //     var userId = claims.FindFirstValue(JwtRegisteredClaimNames.Sub);
        //     var user = await userManager.FindByIdAsync(userId);

        //     // If user doesn't exist - invalid token
        //     if (user == null)
        //     {
        //         return Results.UnprocessableEntity("Invalid token");
        //     }
        // });
    }
}