import "./ReservationList.css";
import { formatDate } from "../utils/formatDate";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const { getAccessTokenSilently } = useAuth0();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAccessTokenSilently();
      const fetchUrl = `${process.env.REACT_APP_API_URL}/reservations`;
      const responce = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      });
      const data = await responce.json();
      setReservations(data);
      setIsLoading(false);
    };
    fetchData();
  }, [getAccessTokenSilently]);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (reservations.length === 0) {
    return (
      <div className="reservation-list-container">
        <h1 className="reservation-list-header">Upcoming reservations</h1>
        <p>You don't have any reservations.</p>
        <Link to="/" className="link-view-details">
          View the restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="reservation-list-container">
      <h1 className="reservation-list-header">Upcoming reservations</h1>
      <ul className="list">
        {reservations.map((reservation) => {
          const linkToSingleReservation = "/reservations/" + reservation.id;
          return (
            <li key={reservation.id} className="reservation-list-item">
              <h2>{reservation.restaurantName}</h2>
              <p className="reservation-date">{formatDate(reservation.date)}</p>
              <Link to={linkToSingleReservation} className="link-view-details">
                View details &rarr;
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ReservationList;
