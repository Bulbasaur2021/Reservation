import "./RestaurantList.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const responce = await fetch(
        `${process.env.REACT_APP_API_URL}/restaurants`
      );
      const data = await responce.json();
      setRestaurants(data);
    };
    fetchData();
  }, []);
  return (
    <>
      <h1>Restaurants</h1>
      <ul className="restaurnats-list list">
        {restaurants.map((restaurant) => {
          return (
            <li key={restaurant.id} className="restaurant-list-item">
              <img
                src={restaurant.image}
                alt="Plates fool of food"
                className="image"
              ></img>
              <div className="restaurant-description">
                <h2>{restaurant.name}</h2>
                <p className="description">{restaurant.description}</p>
                <Link
                  to={`/restaurants/${restaurant.id}`}
                  className="link-reserve-now btn-colour-shape"
                >
                  Reserve now &rarr;
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default RestaurantList;
