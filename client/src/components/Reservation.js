import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import "./Reservation.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

const Reservation = () => {
  const { id } = useParams();
  const [reservation, setReservation] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAccessTokenSilently();
      const fetchUrl = await fetch(
        `${process.env.REACT_APP_API_URL}/reservations/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (fetchUrl.ok === false) {
        setIsNotFound(true);
        return;
      }
      const data = await fetchUrl.json();
      setReservation(data);
      setIsLoading(false);
    };
    fetchData();
  }, [getAccessTokenSilently, id]);

  if (isNotFound) {
    return (
      <div className="reservation-container">
        <p className="color">
          <strong>Sorry! We can't find that reservation</strong>
        </p>
        <Link to="/reservations" className="link-back-to-reservations">
          &larr;Back to reservations
        </Link>
      </div>
    );
  }
  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="reservation-container">
      <div className="single-reservation">
        <h1 className="h1-reservation">{reservation.restaurantName}</h1>
        <p>{formatDate(reservation.date)}</p>
        <p>
          <strong>Party size: </strong>
          {reservation.partySize}
        </p>
      </div>
      <Link to="/reservations" className="link-back-to-reservations">
        &larr;Back to reservations
      </Link>
    </div>
  );
};

export default Reservation;
