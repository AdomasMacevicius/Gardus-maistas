import React, { useState } from 'react';
import '../App.css';

export default function MealUpdateForm(props) {
    const initialFormData = Object.freeze({
        name: props.meal.name,
        description: props.meal.description,
        price: props.meal.price
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

        const mealToUpdate = {
            Name: formData.name,
            Description: formData.description,
            Price: formData.price
        };

        const url = 'http://localhost:5095/api/restaurants/' + props.restaurant.id + '/menus/' + props.menu.id + '/meals/' + props.meal.id;

        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mealToUpdate)
        })
            .then(response => response.json())
            .then(responseFromSource => {
                if (responseFromSource.status === 422) {
                    const errors = {
                        Name: (typeof responseFromSource.errors.Name === 'undefined') ? "" : responseFromSource.errors.Name[0],
                        Description: (typeof responseFromSource.errors.Description === 'undefined') ? "" : responseFromSource.errors.Description[0],
                        Price: (typeof responseFromSource.errors.Price === 'undefined') ? "" : responseFromSource.errors.Price[0]
                    };
                    props.onMealUpdated(422, errors);
                }
                else {
                    props.onMealUpdated(201, mealToUpdate);
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <div>
            <div>
            <h1>Redaguoti patiekalą: <b><i>{props.meal.name}</i></b></h1>
            </div>

            <div className="mt-4">
                <label className="h5 form-label">Pavadinimas</label>
                <input value={formData.name} name="name" type="text" className="form-control w-25" placeholder="Įveskite informaciją" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h5 form-label">Aprašymas</label>
                <input value={formData.description} name="description" type="text" className="form-control w-25" placeholder="Įveskite informaciją" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h5 form-label">Kaina</label>
                <input value={formData.price} name="price" type="text" className="form-control w-25" placeholder="Įveskite informaciją" onChange={handleChange} />
            </div>

            <button onClick={handleSubmit} className="btn btn-dark btn-md mt-3">Atnaujinti patiekalą</button>
        </div>
    );
}