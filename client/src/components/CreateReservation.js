import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { useAuth0 } from "@auth0/auth0-react";
import "react-datepicker/dist/react-datepicker.css";
import "./CreateReservation.css";
const CreateReservation = ({ restaurantName }) => {
  const [partySize, setPartySize] = useState("2");
  const [date, setDate] = useState(new Date());
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  const handleSubmit = async (event) => {
    const accessToken = await getAccessTokenSilently();
    event.preventDefault();
    const reservation = {
      partySize,
      date,
      restaurantName
    };
    setIsPending(true);
    await fetch(`${process.env.REACT_APP_API_URL}/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(reservation)
    });
    setIsPending(false);
    navigate("/reservations");
  };

  return (
    <>
      <h2 className="h2-center">Reserve {restaurantName}</h2>
      <form onSubmit={handleSubmit} className="create-reservation-container">
        <label htmlFor="partySize">Number of guests</label>
        <input
          id="partySize"
          className="input"
          type="number"
          min={1}
          max={120}
          step="1"
          required
          value={partySize}
          onChange={(element) => setPartySize(element.target.value)}
        />

        <label htmlFor="date">Date</label>
        <DatePicker
          id="date"
          className="input date-picker"
          selected={date}
          value={date}
          showTimeSelect
          dateFormat="Pp"
          onChange={(date) => setDate(date)}
        />

        {!isPending && (
          <button className="submitt-button btn-colour-shape">Submit</button>
        )}
        {isPending && <button disabled>Adding</button>}
      </form>
    </>
  );
};

export default CreateReservation;
