import { useState, useEffect } from 'react';
import '../App.css';
import Modal from './modal/Modal';
import MealsModal from './modal/MealsModal';
import RestaurantUpdateForm from './RestaurantUpdateForm';
import MenuCreateForm from './MenuCreateForm';
import MenuUpdateForm from './MenuUpdateForm';
import MealCreateForm from './MealCreateForm';

export default function RestaurantForm(props) {
    const [showRestaurantUpdateForm, setShowRestaurantUpdateForm] = useState(null);
    const [showMenuCreateForm, setShowMenuCreateForm] = useState(false);
    const [showMenuUpdateForm, setShowMenuUpdateForm] = useState(null);
    const [showMealCreateForm, setShowMealCreateForm] = useState(false);
    const [menus, setMenus] = useState([]);
    const [menu, setMenu] = useState(null);

    function DeleteRestaurant(restaurantId) {
        const url = 'http://localhost:5095/api/restaurants/' + restaurantId;

        fetch(url, {
            method: 'DELETE'
        })
            .then(onRestaurantDeleted())
            .catch(error => {
                console.log(error)
            });
    }

    function GetMenus() {
        const url = 'http://localhost:5095/api/restaurants/' + props.restaurant.id + '/menus';

        fetch(url, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(menusFromSource => {
                setMenus(menusFromSource);
            })
            .catch(error => {
                console.log(error);
            });
    }

    function DeleteMenu(menuId) {
        const url = 'http://localhost:5095/api/restaurants/' + props.restaurant.id + '/menus/' + menuId;

        fetch(url, {
            method: 'DELETE'
        })
            .then(onMenuDeleted())
            .catch(error => {
                console.log(error)
            });
    }

    useEffect(() => {
        GetMenus()
    }, []);

    return (
        <div>
            <div>
                {(showRestaurantUpdateForm === null && showMenuCreateForm === false && showMenuUpdateForm === null && showMealCreateForm === false) && (
                    <div>
                        <div className="d-flex justify-content-start">
                            <h1><b><i>{props.restaurant.name}</i></b></h1>
                            <div className="px-4 pt-2">
                                <button onClick={() => setShowRestaurantUpdateForm(props.restaurant)} className="btn btn-success">Redaguoti kavinę</button>
                            </div>
                            <div className="px-0 pt-2">
                                <button onClick={() => { if (window.confirm(`Ar tikrai norite pašalinti kavinę "${props.restaurant.name}"?`)) DeleteRestaurant(props.restaurant.id) }} className="btn btn-danger">Pašalinti kavinę</button>
                            </div>
                        </div>
                        <h4 className="pb-4">{props.restaurant.description}</h4>
                        <Modal restaurant={props.restaurant} />
                        <h4><b>Virtuvė:</b> {props.restaurant.cuisineType}</h4>
                        <h4><b>Miestas:</b> {props.restaurant.city}</h4>
                        <h4><b>Adresas:</b> {props.restaurant.address}</h4>
                        <div className="pt-4 d-flex justify-content-start">
                            <h1><b>Meniu:</b></h1>
                            <div className="px-4 pt-2">
                                <button onClick={() => setShowMenuCreateForm(true)} className="btn btn-success">Pridėti meniu</button>
                            </div>

                        </div>
                    </div>
                )}

                {(menus.length > 0 && showMenuCreateForm === false && showRestaurantUpdateForm === null && showMenuUpdateForm === null && showMealCreateForm === false) && RenderMenusTable()}

                {showRestaurantUpdateForm !== null && <RestaurantUpdateForm restaurant={showRestaurantUpdateForm} onRestaurantUpdated={onRestaurantUpdated} />}

                {showMenuCreateForm && <MenuCreateForm restaurant={props.restaurant} onMenuCreated={onMenuCreated} />}

                {showMenuUpdateForm !== null && <MenuUpdateForm restaurant={props.restaurant} menu={showMenuUpdateForm} onMenuUpdated={onMenuUpdated} />}

                {showMealCreateForm && <MealCreateForm restaurant={props.restaurant} menu={menu} onMealCreated={onMealCreated} />}
            </div>
        </div>
    );

    function RenderMenusTable() {
        return (
            <div className="table-responsive pt-4">
                <table>
                    <tbody>
                        {menus.map(menu => (
                            <tr>
                                <td className="w-50">
                                    <MealsModal restaurant={props.restaurant} menu={menu} />
                                </td>
                                <td className="w-0 px-0">
                                    <button onClick={() => setShowMenuUpdateForm(menu)} className="btn btn-success">Redaguoti meniu</button>
                                </td>
                                <td className="w-0 px-2">
                                    <button onClick={() => { if (window.confirm(`Ar tikrai norite pašalinti meniu "${menu.type}"?`)) DeleteMenu(menu.id) }} className="btn btn-danger">Pašalinti meniu</button>
                                </td>
                                <td>
                                    <button onClick={() => { setShowMealCreateForm(true); setMenu(menu) }} className="btn btn-success">Pridėti patiekalą</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div >
        );
    }

    function onRestaurantUpdated(code, updatedRestaurant) {
        let errorsString = "";

        if (code === 422) {
            if (updatedRestaurant.Name !== "") {
                errorsString += updatedRestaurant.Name + "\n";
            }
            if (updatedRestaurant.Description !== "") {
                errorsString += updatedRestaurant.Description + "\n";
            }
            if (updatedRestaurant.CuisineType !== "") {
                errorsString += updatedRestaurant.CuisineType + "\n";
            }
            if (updatedRestaurant.City !== "") {
                errorsString += updatedRestaurant.City + "\n";
            }
            if (updatedRestaurant.Address !== "") {
                errorsString += updatedRestaurant.Address + "\n";
            }
            if (updatedRestaurant.PhoneNumber !== "") {
                errorsString += updatedRestaurant.PhoneNumber + "\n";
            }

            if (errorsString !== "") {
                alert(`${errorsString}`)
            }
        }
        else {
            setShowRestaurantUpdateForm(null);

            alert(`Kavinė buvo atnaujinta. Po patvirtinimo, "${updatedRestaurant.Name}" atnaujinta informacija bus kavinių sąraše.`);

            props.onRestaurantUpdatedOrDeleted();
        }
    }

    function onRestaurantDeleted() {
        alert(`Pašalinimas sėkmingas.`);

        props.onRestaurantUpdatedOrDeleted();
    }

    function onMenuCreated(code, createdMenu) {
        let errorsString = "";

        if (code === 422) {
            if (createdMenu.Type !== "") {
                errorsString += createdMenu.Type + "\n";
            }

            if (errorsString !== "") {
                alert(`${errorsString}`)
            }
        }
        else {
            setShowMenuCreateForm(false);

            alert(`Meniu buvo sukurtas. Po patvirtinimo, "${createdMenu.Type}" bus meniu sąraše.`);

            GetMenus();
        }
    }

    function onMenuUpdated(code, updatedMenu) {
        let errorsString = "";

        if (code === 422) {
            if (updatedMenu.Type !== "") {
                errorsString += updatedMenu.Type + "\n";
            }

            if (errorsString !== "") {
                alert(`${errorsString}`)
            }
        }
        else {
            setShowMenuUpdateForm(null);

            alert(`Meniu buvo atnaujintas. Po patvirtinimo, "${updatedMenu.Type}" atnaujinta informacija bus meniu sąraše.`);

            GetMenus();
        }
    }

    function onMenuDeleted() {
        alert(`Pašalinimas sėkmingas.`);

        GetMenus();
    }

    function onMealCreated(code, createdMeal) {
        let errorsString = "";

        if (code === 422) {
            if (createdMeal.Name !== "") {
                errorsString += createdMeal.Name + "\n";
            }
            if (createdMeal.Description !== "") {
                errorsString += createdMeal.Description + "\n";
            }
            if (createdMeal.Price !== "") {
                errorsString += createdMeal.Price + "\n";
            }

            if (errorsString !== "") {
                alert(`${errorsString}`)
            }
        }
        else {
            setShowMealCreateForm(false);

            alert(`Patiekalas buvo sukurtas. Po patvirtinimo, "${createdMeal.Name}" bus patiekalų sąraše.`);
        }
    }
}