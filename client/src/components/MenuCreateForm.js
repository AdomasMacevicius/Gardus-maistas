import React, { useState } from 'react';
import '../App.css';

export default function MenuCreateForm(props) {
    const [formData, setFormData] = useState([]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const menuToCreate = {
            Type: formData.type,
            Restaurant: props.restaurant
        };

        const url = 'http://localhost:5095/api/restaurants/' + props.restaurant.id + "/menus";

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(menuToCreate)
        })
            .then(response => response.json())
            .then(responseFromSource => {
                if (responseFromSource.status === 422) {
                    const errors = {
                        Type: (typeof responseFromSource.errors.Type === 'undefined') ? "" : responseFromSource.errors.Type[0]
                    };
                    props.onMenuCreated(422, errors);
                }
                else {
                    props.onMenuCreated(201, menuToCreate);
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <div>
            <div>
                <h1>Pridėti naują meniu</h1>
            </div>

            <div className="mt-4">
                <label className="h5 form-label">Meniu pavadinimas</label>
                <input value={formData.type} name="type" type="text" className="form-control w-25" placeholder="Įveskite informaciją" onChange={handleChange} />
            </div>

            <button onClick={handleSubmit} className="btn btn-dark btn-md mt-3">Pridėti meniu</button>
        </div>
    );
}