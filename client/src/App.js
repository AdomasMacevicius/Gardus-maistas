import { useState, useEffect } from 'react'
import { useAnimate, usePresence } from 'framer-motion'
import { AlignJustify, X } from 'lucide-react'
import './App.css';
import logo from './assets/logo.svg'
import image from './assets/image.png'
import RestaurantForm from './components/RestaurantForm';
import RestaurantCreateForm from './components/RestaurantCreateForm';

export default function App() {
  const [isPresent, safeToRemove] = usePresence();
  const [scope, animate] = useAnimate();
  const [isOpen, setIsOpen] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [showRestaurantForm, setShowRestaurantForm] = useState(null);
  const [showRestaurantCreateForm, setShowRestaurantCreateForm] = useState(false);

  const Logo = () => {
    return <img src={logo} className="Logo" />
  }

  const ToggleNavBar = () => {
    setIsOpen(!isOpen);
  }

  function GetRestaurants() {
    const url = 'http://localhost:5095/api/restaurants';

    fetch(url, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(restaurantsFromSource => {
        setRestaurants(restaurantsFromSource);
      })
      .catch(error => {
        console.log(error);
      });
  }

  useEffect(() => {
    GetRestaurants()

    if (isPresent) {
      const enterAnimation = async () => {
        await animate(scope.current, { opacity: [0, 1] }, { duration: 1.5 })
      }
      enterAnimation()
    }
  }, []);

  return (
    <div className="CustomGradient min-vh-100">
      <header className="bg-dark border-bottom border-secondary d-flex justify-content-between align-items-start mb-5 px-4 py-1">
        <Logo />
        <button onClick={() => {
          setShowRestaurantForm(null);
          setShowRestaurantCreateForm(false);
          if (isPresent) {
            const enterAnimation = async () => {
              await animate(scope.current, { opacity: [0, 1] }, { duration: 1.5 })
            }
            enterAnimation()
          }
          GetRestaurants();
        }} className="btn btn-dark btn-md pt-3 CustomText">Gardus maistas</button>
        <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
        <div className="d-none d-md-block d-lg-block d-xl-block">
          <button onClick={() => { setShowRestaurantCreateForm(true); setShowRestaurantForm(null); }} className="btn btn-dark btn-md pt-3 CustomText">Pridėti kavinę</button>
          <button className="btn btn-dark btn-md pt-3 CustomText">Prisijungti</button>
          <button className="btn btn-dark btn-md pt-3 CustomText">Registruotis</button>
        </div>
        <div className="d-block d-sm-block d-md-none pt-3">
          <button onClick={ToggleNavBar} className="btn d-flex justify-content-end btn-dark pt-1 mx-5">{isOpen ? <X /> : <AlignJustify />}</button>
          {isOpen && (
            <div className="d-flex flex-column">
              <button onClick={() => { setShowRestaurantCreateForm(true); setShowRestaurantForm(null); }} className="btn btn-dark btn-md pt-3 CustomText">Pridėti kavinę</button>
              <button className="btn btn-dark btn-md pt-3 CustomText">Prisijungti</button>
              <button className="btn btn-dark btn-md pt-3 CustomText">Registruotis</button>
            </div>
          )}
        </div>
      </header>
      <div className="container" ref={scope}>
        {(showRestaurantCreateForm === false && showRestaurantForm === null) && (
          <div>
            <h1>Kavinių sąrašas</h1>
            <div className="mt-3 col d-flex flex-column justify-content-center align-items-center">
            </div>
          </div>
        )}
        {(restaurants.length > 0 && showRestaurantCreateForm === false && showRestaurantForm === null) && RenderRestaurantsTable()}
        {(showRestaurantCreateForm === false && showRestaurantForm === null) && <img src={image} className="img-fluid Image" />}

        {showRestaurantForm !== null && <RestaurantForm restaurant={showRestaurantForm} onRestaurantUpdatedOrDeleted={onRestaurantUpdatedOrDeleted} />}

        {showRestaurantCreateForm && <RestaurantCreateForm onRestaurantCreated={onRestaurantCreated} />}
      </div>
    </div>
  );

  function RenderRestaurantsTable() {
    return (
      <div className="table-responsive rounded">
        <table className="table table-bordered border-dark table-hover">
          <thead className="table-dark">
            <tr className="text-center">
              <th scope="col">Pavadinimas</th>
              <th scope="col">Virtuvės tipas</th>
              <th scope="col">Miestas</th>
              <th scope="col">Kainų įvertinimas</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map(restaurant => (
              <tr>
                <td className="p-0">
                  <button onClick={() => setShowRestaurantForm(restaurant)} className="btn btn-md w-100 CustomButton">{restaurant.name}</button>
                </td>
                <td className="p-0">
                  <button onClick={() => setShowRestaurantForm(restaurant)} className="btn btn-md w-100 CustomButton">{restaurant.cuisineType}</button>
                </td>
                <td className="p-0">
                  <button onClick={() => setShowRestaurantForm(restaurant)} className="btn btn-md w-100 CustomButton">{restaurant.city}</button>
                </td>
                <td className="p-0">
                  <button onClick={() => setShowRestaurantForm(restaurant)} className="btn btn-md w-100 CustomButton">{restaurant.priceRating}</button>
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

      if (errorsString !== "") {
        alert(`${errorsString}`)
      }
    }
    else {
      setShowRestaurantCreateForm(false);

      alert(`Kavinė buvo sukurta. Po patvirtinimo, "${createdRestaurant.Name}" bus kavinių sąraše.`);

      GetRestaurants();
    }
  }

  function onRestaurantUpdatedOrDeleted() {
    setShowRestaurantForm(null);

    GetRestaurants();
  }
}