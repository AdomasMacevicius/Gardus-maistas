using Microsoft.AspNetCore.Identity;

namespace Auth.Entities;

public class User : IdentityUser
{
    public bool ForceRelogin { get; set; }
}

public record UserDto(string UserId, string Username, string Email);
public record RegisterUserDto(string Username, string Email, string Password);
public record SuccessfulLoginDto(string AccessToken, string RefreshToken);
public record RefreshAccessTokenDto(string RefreshToken);