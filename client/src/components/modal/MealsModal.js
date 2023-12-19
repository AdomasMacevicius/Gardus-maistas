import { useState } from 'react';
import './Modal.css';
import '../../App.css'
import MealUpdateForm from '../MealUpdateForm';

export default function MealsModal(props) {
    const [modal, setModal] = useState(false);
    const [meals, setMeals] = useState([]);
    const [showMealUpdateForm, setShowMealUpdateForm] = useState(null);

    const ToggleModal = () => {
        setModal(!modal);
        GetMeals();
    }

    function GetMeals() {
        const url = 'http://localhost:5095/api/restaurants/' + props.restaurant.id + '/menus/' + props.menu.id + '/meals';

        fetch(url, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(mealsFromSource => {
                setMeals(mealsFromSource);
            })
            .catch(error => {
                console.log(error);
            });
    }

    function DeleteMeal(mealId) {
        const url = 'http://localhost:5095/api/restaurants/' + props.restaurant.id + '/menus/' + props.menu.id + '/meals/' + mealId;

        fetch(url, {
            method: 'DELETE'
        })
            .then(onMealDeleted())
            .catch(error => {
                console.log(error)
            });
    }

    return (
        <>
            <div className="pb-0">
                <button onClick={ToggleModal} className="CustomMenuButton"><h3>{props.menu.type}</h3></button>
            </div>
            {modal && (
                <div>
                    <div onClick={ToggleModal} className="Overlay"></div>
                    <div className="modal-content">
                        <div className="d-flex justify-content-end pb-3">
                            <button onClick={ToggleModal} className="btn btn-success w-25">Uždaryti</button>
                        </div>
                        <h3 className="d-flex justify-content-center">{props.menu.type}</h3>
                        {meals.length > 0 && RenderMealsTable()}
                    </div>
                </div>
            )}
            {showMealUpdateForm && (
                <div>
                    <div className="Overlay"></div>
                    <div className="modal-content">
                        <div className="d-flex justify-content-end pb-3">
                            {<MealUpdateForm restaurant={props.restaurant} menu={props.menu} meal={showMealUpdateForm} onMealUpdated={onMealUpdated} />}
                        </div>
                    </div>
                </div>
            )}
        </>
    );

    function RenderMealsTable() {
        return (
            <div className="table-responsive pt-3">
                <table className="CustomTable">
                    <thead className="CustomTable">
                        <tr className="text-center">
                            <th className="CustomTable"><h5><b>Pavadinimas</b></h5></th>
                            <th className="CustomTable"><h5><b>Aprašymas</b></h5></th>
                            <th className="CustomTable"><h5><b>Kaina, €</b></h5></th>
                        </tr>
                    </thead>
                    <tbody>
                        {meals.map(meal => (
                            <tr>
                                <td className="CustomTable CustomTableText">
                                    <h5>{meal.name}</h5>
                                </td>
                                <td className="CustomTable CustomTableText">
                                    <h5>{meal.description}</h5>
                                </td>
                                <td className="CustomTable CustomTableText">
                                    <h5>{meal.price}</h5>
                                </td>
                                <div className="py-5">
                                    <div className="pb-2">
                                        <button onClick={() => setShowMealUpdateForm(meal)} className="btn btn-success">Redaguoti patiekalą</button>
                                    </div>
                                    <button onClick={() => { if (window.confirm(`Ar tikrai norite pašalinti patiekalą "${meal.name}"?`)) DeleteMeal(meal.id) }} className="btn btn-danger">Pašalinti patiekalą</button>
                                </div>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div >
        );
    }

    function onMealUpdated(code, updatedMeal) {
        let errorsString = "";

        if (code === 422) {
            if (updatedMeal.Name !== "") {
                errorsString += updatedMeal.Name + "\n";
            }
            if (updatedMeal.Description !== "") {
                errorsString += updatedMeal.Description + "\n";
            }
            if (updatedMeal.Price !== "") {
                errorsString += updatedMeal.Price + "\n";
            }

            if (errorsString !== "") {
                alert(`${errorsString}`)
            }
        }
        else {
            setShowMealUpdateForm(null);

            alert(`Patiekalas buvo atnaujintas. Po patvirtinimo, "${updatedMeal.Name}" atnaujinta informacija bus patiekalų sąraše.`);

            GetMeals();
        }
    }

    function onMealDeleted() {
        alert(`Pašalinimas sėkmingas.`);

        GetMeals();
    }
}