using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace Auth;

public class JwtTokenService
{
    private SymmetricSecurityKey? securityKey;
    private string? issuer;
    private string? audience;

    public JwtTokenService(IConfiguration configuration)
    {
        securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Secret"]));
        issuer = configuration["Jwt:ValidIssuer"];
        audience = configuration["Jwt:ValidAudience"];
    }

    public string CreateAccessToken(string username, string userId, IEnumerable<string> roles)
    {
        List<Claim> authClaims = new()
        {
            new(ClaimTypes.Name, username),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.Sub, userId)
        };
        authClaims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        JwtSecurityToken token = new
        (
            issuer: issuer,
            audience: audience,
            expires: DateTime.UtcNow.AddMinutes(10),
            claims: authClaims,
            signingCredentials: new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string CreateRefreshToken(string userId)
    {
        List<Claim> authClaims = new()
        {
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.Sub, userId)
        };

        JwtSecurityToken token = new
        (
            issuer: issuer,
            audience: audience,
            expires: DateTime.UtcNow.AddHours(24),
            claims: authClaims,
            signingCredentials: new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public bool TryParseRefreshToken(string refreshToken, out ClaimsPrincipal? claims)
    {
        claims = null;

        try
        {
            JwtSecurityTokenHandler tokenHandler = new();

            TokenValidationParameters validationParameters = new()
            {
                ValidIssuer = issuer,
                ValidAudience = audience,
                IssuerSigningKey = securityKey,
                ValidateLifetime = true
            };

            claims = tokenHandler.ValidateToken(refreshToken, validationParameters, out _);

            return true;
        }
        catch
        {
            return false;
        }
    }
}