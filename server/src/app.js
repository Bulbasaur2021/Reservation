const express = require("express");
const cors = require("cors");
const app = express();
const RestaurantModel = require("./models/RestaurantModel");
const ReservationModel = require("./models/ReservationModel");
const formatRestaurantId = require("./utils/formatRestaurantId");
const validId = require("./utils/validId");
const { celebrate, Joi, errors, Segments } = require("celebrate");

const { auth } = require("express-oauth2-jwt-bearer");

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: "https://bookaparty.com",
  issuerBaseURL: `https://dev-rgckxv3c.us.auth0.com/`
});

app.use(cors());
app.use(express.json());
app.get("/restaurants", async (request, responce) => {
  const restaurants = await RestaurantModel.find({});
  const formattedRestaurants = restaurants.map((restaurant) =>
    formatRestaurantId(restaurant)
  );
  return responce.status(200).send(formattedRestaurants);
});

app.get("/restaurants/:id", async (request, responce) => {
  const id = request.params.id;
  if (validId(id)) {
    const restaurant = await RestaurantModel.findById(id);
    if (restaurant === undefined || restaurant === null) {
      return responce.status(404).send({ error: "restaurant not found" });
    }
    const formattedRestaurant = formatRestaurantId(restaurant);
    return responce.status(200).send(formattedRestaurant);
  }
  return responce.status(400).send({ error: "invalid id provided" });
});

app.post(
  "/reservations",
  checkJwt,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      partySize: Joi.number().integer().min(1).max(120).required(),
      date: Joi.string().max(125).required(),
      restaurantName: Joi.string().max(125).required()
    })
  }),
  async (request, responce, next) => {
    try {
      const { body, auth } = request;
      const document = {
        userId: auth.payload.sub,
        ...body
      };

      const reservation = new ReservationModel(document);
      await reservation.save();
      return responce.status(201).send(reservation);
    } catch (error) {
      error.status = 400;
      next(error);
    }
  }
);
app.get("/reservations", checkJwt, async (request, responce) => {

  const theUserId = request.auth.payload.sub;

const reservations = await ReservationModel.find({userId: theUserId});
  return responce.status(200).send(reservations);
});

app.get("/reservations/:id", checkJwt, async (request, responce) => {
  const id = request.params.id;
  const userId = request.auth.payload.sub;
  if (validId(id)) {
    const reservation = await ReservationModel.findById(id);

    if (reservation === undefined || reservation === null) {
      return responce.status(404).send({ error: "not found" });
    }

    if (reservation.userId !== userId) {
      return responce.status(403).send({
        error: "user does not have permission to access this reservation"
      });
    }

    return responce.status(200).send(reservation);
  }
  return responce.status(400).send({ error: "invalid id provided" });
});

app.use(errors());
module.exports = app;
