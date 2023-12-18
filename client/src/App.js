import { useState, useEffect } from 'react'
import logo from './logo.svg';
import './App.css';
import RestaurantCreateForm from './components/RestaurantCreateForm';
import RestaurantUpdateForm from './components/RestaurantUpdateForm';

export default function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [showingCreateRestaurantForm, setShowingCreateRestaurantForm] = useState(false);
  const [restaurantIsBeingUpdated, setRestaurantIsBeingUpdated] = useState(null);

  function GetRestaurants() {
    const url = 'http://localhost:5095/api/restaurants';

    fetch(url, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(restaurantsFromSource => {
        setRestaurants(restaurantsFromSource);
      })
      .catch((error) => {
        alert(error);
      });
  }

  function DeleteRestaurant(restaurantId) {
    const url = 'http://localhost:5095/api/restaurants/' + restaurantId;

    fetch(url, {
      method: 'DELETE'
    })
      .then(onRestaurantDeleted())
      .catch((error) => {
        console.log(error)
      });
  }

  useEffect(() => {
    GetRestaurants()
  }, []);

  return (
    <div className="bg-secondary min-vh-100">
      <div className="container">
        <div className="mb-5">
          MENU
        </div>
        {(showingCreateRestaurantForm === false && restaurantIsBeingUpdated === null) && (
          <div>
            <h1>Kavinių sąrašas</h1>
            <button onClick={() => setShowingCreateRestaurantForm(true)} className="btn btn-dark btn-md mt-4 CustomText">Pridėti naują kavinę</button>
            <div className="mt-2 col d-flex flex-column justify-content-left align-items-left">
            </div>
          </div>
        )}
        {(restaurants.length > 0 && showingCreateRestaurantForm === false && restaurantIsBeingUpdated === null) && RenderRestaurantsTable()}

        {showingCreateRestaurantForm && <RestaurantCreateForm onRestaurantCreated={onRestaurantCreated} />}

        {restaurantIsBeingUpdated !== null && <RestaurantUpdateForm restaurant={restaurantIsBeingUpdated} onRestaurantUpdated={onRestaurantUpdated} />}

        {/* <img src={logo} className="Logo" /> */}
      </div>
    </div>
  );

  function RenderRestaurantsTable() {
    return (
      <div className="table-responsive rounded">
        <table className="table table-bordered border-dark table-hover" >
          <thead className="table-dark">
            <tr className="text-center">
              <th scope="col">Pavadinimas</th>
              <th scope="col">Virtuvės tipas</th>
              <th scope="col">Miestas</th>
              <th scope="col">Kainų įvertinimas</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((restaurant) => (
              <tr>
                <td className="p-0">
                  <button onClick={() => setRestaurantIsBeingUpdated(restaurant)} className="btn btn-md w-100 CustomButton">{restaurant.name}</button>
                </td>
                <td className="p-0">
                  <button onClick={() => { if (window.confirm(`Ar tikrai norite pašalinti kavinę "${restaurant.name}"?`)) DeleteRestaurant(restaurant.id) }} className="btn btn-md w-100 CustomButton">{restaurant.cuisineType}</button>
                </td>
                <td className="p-0">
                  <button className="btn btn-md w-100 CustomButton">{restaurant.city}</button>
                </td>
                <td className="p-0">
                  <button className="btn btn-md w-100 CustomButton">{restaurant.priceRating}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function onRestaurantCreated(code, createdRestaurant) {
    let errorsString = "";
    if (code === 422) {
      if (createdRestaurant.Name !== "") {
        errorsString += createdRestaurant.Name + "\n";
      }
      if (createdRestaurant.Description !== "") {
        errorsString += createdRestaurant.Description + "\n";
      }
      if (createdRestaurant.CuisineType !== "") {
        errorsString += createdRestaurant.CuisineType + "\n";
      }
      if (createdRestaurant.City !== "") {
        errorsString += createdRestaurant.City + "\n";
      }
      if (createdRestaurant.Address !== "") {
        errorsString += createdRestaurant.Address + "\n";
      }
      if (createdRestaurant.PhoneNumber !== "") {
        errorsString += createdRestaurant.PhoneNumber + "\n";
      }
      if (createdRestaurant.PriceRating !== "") {
        errorsString += createdRestaurant.PriceRating + "\n";
      }

      if (errorsString !== "") {
        alert(`"${errorsString}"`)
      }
    }
    else {
      setShowingCreateRestaurantForm(false);

      alert(`Kavinė buvo sukurta. Po patvirtinimo, "${createdRestaurant.Name}" bus kavinių sąraše.`);

      GetRestaurants();
    }
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
      if (updatedRestaurant.PriceRating !== "") {
        errorsString += updatedRestaurant.PriceRating + "\n";
      }

      if (errorsString !== "") {
        alert(`"${errorsString}"`)
      }
    }
    else {
      setRestaurantIsBeingUpdated(null);

      alert(`Kavinė buvo atnaujinta. Po patvirtinimo, "${updatedRestaurant.Name}" atnaujinta informacija bus kavinių sąraše.`);

      GetRestaurants();
    }
  }

  function onRestaurantDeleted() {

    alert(`Pašalinimas sėkmingas`)

    GetRestaurants();
  }
}