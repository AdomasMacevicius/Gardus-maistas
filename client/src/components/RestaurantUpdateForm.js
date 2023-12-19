import React, { useState } from 'react';
import '../App.css';

export default function RestaurantUpdateForm(props) {
    const initialFormData = Object.freeze({
        name: props.restaurant.name,
        description: props.restaurant.description,
        cuisineType: props.restaurant.cuisineType,
        city: props.restaurant.city,
        address: props.restaurant.address,
        phoneNumber: props.restaurant.phoneNumber,
        priceRating: props.restaurant.priceRating
    });

    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const restaurantToUpdate = {
            Name: formData.name,
            Description: formData.description,
            CuisineType: formData.cuisineType,
            City: formData.city,
            Address: formData.address,
            PhoneNumber: formData.phoneNumber,
            PriceRating: (typeof formData.priceRating === 'undefined') ? "€" : formData.priceRating
        };

        const url = 'http://localhost:5095/api/restaurants/' + props.restaurant.id;

        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(restaurantToUpdate)
        })
            .then(response => response.json())
            .then(responseFromSource => {
                if (responseFromSource.status === 422) {
                    const errors = {
                        Name: (typeof responseFromSource.errors.Name === 'undefined') ? "" : responseFromSource.errors.Name[0],
                        Description: (typeof responseFromSource.errors.Description === 'undefined') ? "" : responseFromSource.errors.Description[0],
                        CuisineType: (typeof responseFromSource.errors.CuisineType === 'undefined') ? "" : responseFromSource.errors.CuisineType[0],
                        City: (typeof responseFromSource.errors.City === 'undefined') ? "" : responseFromSource.errors.City[0],
                        Address: (typeof responseFromSource.errors.Address === 'undefined') ? "" : responseFromSource.errors.Address[0],
                        PhoneNumber: (typeof responseFromSource.errors.PhoneNumber === 'undefined') ? "" : responseFromSource.errors.PhoneNumber[0]
                    };
                    props.onRestaurantUpdated(422, errors);
                }
                else {
                    props.onRestaurantUpdated(200, restaurantToUpdate);
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <div>
            <div>
                <h1>Redaguoti kavinę: <b><i>{props.restaurant.name}</i></b></h1>
            </div>

            <div className="mt-4">
                <label className="h5 form-label">Pavadinimas</label>
                <input value={formData.name} name="name" type="text" className="form-control w-25" onChange={handleChange} />
            </div>

            <div className="mt-3">
                <label className="h5 form-label">Aprašymas</label>
                <textarea value={formData.description} name="description" className="form-control w-25" onChange={handleChange} />
            </div>

            <div className="mt-3">
                <label className="h5 form-label">Virtuvės tipas</label>
                <input value={formData.cuisineType} name="cuisineType" type="text" className="form-control w-25" onChange={handleChange} />
            </div>

            <div className="mt-3">
                <label className="h5 form-label">Miestas</label>
                <input value={formData.city} name="city" type="text" className="form-control w-25" onChange={handleChange} />
            </div>

            <div className="mt-3">
                <label className="h5 form-label">Adresas</label>
                <input value={formData.address} name="address" type="text" className="form-control w-25" onChange={handleChange} />
            </div>

            <div className="mt-3">
                <label className="h5 form-label">Telefono numeris</label>
                <input value={formData.phoneNumber} name="phoneNumber" type="text" className="form-control w-25" onChange={handleChange} />
            </div>

            <div className="mt-3">
                <label className="h5 form-label">Kainų įvertinimas</label>
                <select name="priceRating" className="form-control w-25" onChange={handleChange}>
                    <option value="" selected disabled hidden>{props.restaurant.priceRating}</option>
                    <option value={"€"}>€</option>
                    <option value={"€€"}>€€</option>
                    <option value={"€€€"}>€€€</option>
                    <option value={"€€€€"}>€€€€</option>
                </select>
            </div>

            <button onClick={handleSubmit} className="btn btn-dark btn-md mt-3">Atnaujinti kavinę</button>
        </div>
    );
}