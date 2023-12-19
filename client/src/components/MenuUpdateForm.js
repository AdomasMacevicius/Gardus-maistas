import React, { useState } from 'react';
import '../App.css';

export default function MenuUpdateForm(props) {
    const initialFormData = Object.freeze({
        type: props.menu.type
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

        const menuToUpdate = {
            Type: formData.type
        };

        const url = 'http://localhost:5095/api/restaurants/' + props.restaurant.id + '/menus/' + props.menu.id;

        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(menuToUpdate)
        })
            .then(response => response.json())
            .then(responseFromSource => {
                if (responseFromSource.status === 422) {
                    const errors = {
                        Type: (typeof responseFromSource.errors.Type === 'undefined') ? "" : responseFromSource.errors.Type[0]
                    };
                    props.onMenuUpdated(422, errors);
                }
                else {
                    props.onMenuUpdated(200, menuToUpdate);
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <div>
            <div>
                <h1>Redaguoti meniu: <b><i>{props.menu.type}</i></b></h1>
            </div>

            <div className="mt-4">
                <label className="h5 form-label">Meniu pavadinimas</label>
                <input value={formData.type} name="type" type="text" className="form-control w-25" placeholder="Įveskite informaciją" onChange={handleChange} />
            </div>

            <button onClick={handleSubmit} className="btn btn-dark btn-md mt-3">Atnaujinti meniu</button>
        </div>
    );
}