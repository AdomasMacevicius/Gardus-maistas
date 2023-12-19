import React, { useState } from 'react';
import '../App.css';

export default function MealCreateForm(props) {
    const [formData, setFormData] = useState([]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const mealToCreate = {
            Name: formData.name,
            Description: formData.description,
            Price: formData.price,
            Menu: props.menu
        };

        const url = 'http://localhost:5095/api/restaurants/' + props.restaurant.id + '/menus/' + props.menu.id + '/meals';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mealToCreate)
        })
            .then(response => response.json())
            .then(responseFromSource => {
                if (responseFromSource.status === 422) {
                    const errors = {
                        Name: (typeof responseFromSource.errors.Name === 'undefined') ? "" : responseFromSource.errors.Name[0],
                        Description: (typeof responseFromSource.errors.Description === 'undefined') ? "" : responseFromSource.errors.Description[0],
                        Price: (typeof responseFromSource.errors.Price === 'undefined') ? "" : responseFromSource.errors.Price[0]
                    };
                    props.onMealCreated(422, errors);
                }
                else {
                    props.onMealCreated(201, mealToCreate);
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <div>
            <div>
                <h1>Pridėti naują patiekalą</h1>
            </div>

            <div className="mt-4">
                <label className="h5 form-label">Pavadinimas</label>
                <input value={formData.type} name="name" type="text" className="form-control w-25" placeholder="Įveskite informaciją" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h5 form-label">Aprašymas</label>
                <input value={formData.description} name="description" type="text" className="form-control w-25" placeholder="Įveskite informaciją" onChange={handleChange} />
            </div>

            <div className="mt-4">
                <label className="h5 form-label">Kaina</label>
                <input value={formData.price} name="price" type="text" className="form-control w-25" placeholder="Įveskite informaciją" onChange={handleChange} />
            </div>

            <button onClick={handleSubmit} className="btn btn-dark btn-md mt-3">Pridėti patiekalą</button>
        </div>
    );
}