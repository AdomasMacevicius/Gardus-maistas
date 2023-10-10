using FluentValidation;
using Data.Entities;

namespace Data.Validators;

public class CreateRestaurantDtoValidator : AbstractValidator<CreateRestaurantDto>
{
    public CreateRestaurantDtoValidator()
    {
        RuleFor(dto => dto.Name).NotNull().NotEmpty().Length(min: 2, max: 25);
        RuleFor(dto => dto.Description).NotNull().NotEmpty().Length(min: 10, max: 200);
        // CuisineType - Dropdown list
        RuleFor(dto => dto.City).NotNull().NotEmpty().Length(min: 3, max: 25);
        RuleFor(dto => dto.Address).NotNull().NotEmpty().Length(min: 6, max: 35);
        RuleFor(dto => dto.PhoneNumber).NotNull().NotEmpty().Length(min: 12, max: 12);
        // PriceRating - Dropdown list
    }
}

public class UpdateRestaurantDtoValidator : AbstractValidator<UpdateRestaurantDto>
{
    public UpdateRestaurantDtoValidator()
    {
        RuleFor(dto => dto.Name).NotNull().NotEmpty().Length(min: 2, max: 25);
        RuleFor(dto => dto.Description).NotNull().NotEmpty().Length(min: 10, max: 200);
        // CuisineType - Dropdown list
        RuleFor(dto => dto.City).NotNull().NotEmpty().Length(min: 3, max: 25);
        RuleFor(dto => dto.Address).NotNull().NotEmpty().Length(min: 6, max: 35);
        RuleFor(dto => dto.PhoneNumber).NotNull().NotEmpty().Length(min: 12, max: 12);
        // PriceRating - Dropdown list
    }
}

public class CreateMenuDtoValidator : AbstractValidator<CreateMenuDto>
{
    public CreateMenuDtoValidator()
    {
        RuleFor(dto => dto.Type).NotNull().NotEmpty().Length(min: 2, max: 25);
    }
}

public class UpdateMenuDtoValidator : AbstractValidator<UpdateMenuDto>
{
    public UpdateMenuDtoValidator()
    {
        RuleFor(dto => dto.Type).NotNull().NotEmpty().Length(min: 2, max: 25);
    }
}