import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CreateReservation from "./CreateReservation";
import "./Restaurant.css";
import { useAuth0 } from "@auth0/auth0-react";

const Restaurant = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      const fetchUrl = await fetch(
        `${process.env.REACT_APP_API_URL}/restaurants/${id}`
      );

      if (fetchUrl.ok === false) {
        setIsNotFound(true);
        return;
      }
      const data = await fetchUrl.json();
      setRestaurant(data);
      setIsLoading(false);
    };
    fetchData();
  }, [getAccessTokenSilently, id]);

  if (isNotFound) {
    return (
      <>
        <p>Sorry! We can't find restaurant with ID {id}</p>
      </>
    );
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="restaurant-container">
      <div className="restaurant">
        <img
          src={restaurant.image}
          alt="Plates fool of food"
          className="image"
        ></img>
        <div>
          <h2>{restaurant.name}</h2>
          <p>{restaurant.description}</p>
        </div>
      </div>
      <CreateReservation restaurantName={restaurant.name} />
    </div>
  );
};

export default Restaurant;
