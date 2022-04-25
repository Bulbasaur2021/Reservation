const request = require("supertest");
const app = require("../app");
const expectedRestaurants = [
  {
    id: "616005cae3c8e880c13dc0b9",
    name: "Curry Place",
    description:
      "Bringing you the spirits of India in the form of best authentic grandma's recipe dishes handcrafted with love by our chefs!",
    image: "https://i.ibb.co/yftcRcF/indian.jpg"
  },
  {
    id: "616005e26d59890f8f1e619b",
    name: "Thai Isaan",
    description:
      "We offer guests a modern dining experience featuring the authentic taste of Thailand. Food is prepared fresh from quality ingredients and presented with sophisticated elegance in a stunning dining setting filled with all the richness of Thai colour, sound and art.",
    image: "https://i.ibb.co/HPjd2jR/thai.jpg"
  },
  {
    id: "616bd284bae351bc447ace5b",
    name: "Italian Feast",
    description:
      "From the Italian classics, to our one-of-a-kind delicious Italian favourites, all of our offerings are handcrafted from the finest, freshest ingredients available locally. Whether you're craving Italian comfort food like our Ravioli, Pappardelle or something with a little more Flavour like our famous Fettuccine Carbonara.",
    image: "https://i.ibb.co/0r7ywJg/italian.jpg"
  }
];
const expectedReservations = [
  {
    id: "507f1f77bcf86cd799439011",
    partySize: 4,
    date: "2023-11-17T06:30:00.000Z",
    userId: "mock-user-id",
    restaurantName: "Island Grill"
  },
  {
    id: "614abf0a93e8e80ace792ac6",
    partySize: 2,
    date: "2023-12-03T07:00:00.000Z",
    userId: "mock-user-id",
    restaurantName: "Green Curry"
  },
  {
    id: "61679189b54f48aa6599a7fd",
    partySize: 2,
    date: "2023-12-03T07:00:00.000Z",
    userId: "another-user-id",
    restaurantName: "Green Curry"
  }
];

describe("test Reservationizr Application (happy path)", () => {
  it("should GET /restaurants returns all restaurants with 200 status", async () => {
    await request(app)
      .get("/restaurants")
      .expect((request) => {
        expect(request.body).toEqual(expectedRestaurants);
      })
      .expect(200);
  });

  it("should GET /reservations returns all reservations with 200 status", async () => {
    await request(app)
      .get("/reservations")
      .expect((request) => {
        expect(request.body).toEqual([
          expectedReservations[0],
          expectedReservations[1]
        ]);
      })
      .expect(200);
  });

  it(`should GET /restaurants/${expectedRestaurants[0].id} returns one resraurant with 200 status`, async () => {
    await request(app)
      .get(`/restaurants/${expectedRestaurants[0].id}`)
      .expect((request) => {
        expect(request.body).toEqual(expectedRestaurants[0]);
      })
      .expect(200);
  });

  it(`should GET /reservations/${expectedReservations[0].id} returns one reservation with 200 status`, async () => {
    await request(app)
      .get(`/reservations/${expectedReservations[0].id}`)
      .expect((request) => {
        expect(request.body).toEqual(expectedReservations[0]);
      })
      .expect(200);
  });

  it("should POST /reservations creates a new reservation and returns status 201", async () => {
    const expectedStatus = 201;
    const body = {
      partySize: 4,
      date: "2023-11-17T06:30:00.000Z",
      restaurantName: "Island Grill"
    };

    await request(app)
      .post("/reservations")
      .send(body)
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toEqual(expect.objectContaining(body));
        expect(response.body.id).toBeTruthy();
      });
  });
});
describe("test Reservationizr Application (unhappy path)", () => {
  it(`should GET /restaurants/1 returns code "400 BAD REQUEST", error message "invalid id provided" `, async () => {
    await request(app)
      .get("/restaurants/1")
      .expect((request) => {
        expect(request.status).toEqual(400);
        expect(request.body).toEqual({ error: "invalid id provided" });
      });
  });
  it(`should GET /restaurants/616005cae3c8e880c13dc0b5 returns code "404 NOT FOUND", error message "restaurant not found" `, async () => {
    await request(app)
      .get("/restaurants/616005cae3c8e880c13dc0b5")
      .expect((request) => {
        expect(request.status).toEqual(404);
        expect(request.body).toEqual({ error: "restaurant not found" });
      });
  });
  it("should POST /reservations returns status 400 when client provides invalid request body", async () => {
    const expectedStatus = 400;
    const errorBody = {
      statusCode: 400,
      error: "Bad Request",
      message: "Validation failed"
    };

    const body = {
      partySize: 4,
      date: "2023-11-17T06:30:00.000Z",
      restaurantName: 4
    };

    await request(app)
      .post("/reservations")
      .send(body)
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toEqual(expect.objectContaining(errorBody));
      });
  });
  it(`should GET /reservations/623ac04a10d84a2a15a4bd18 returns code "404 NOT FOUND", error message "not found" `, async () => {
    await request(app)
      .get("/reservations/623ac04a10d84a2a15a4bd18")
      .expect((request) => {
        expect(request.status).toEqual(404);
        expect(request.body).toEqual({ error: "not found" });
      });
  });
  it(`should GET reservations/1 returns code "400 BAD REQUEST", error message "invalid id provided" `, async () => {
    await request(app)
      .get("/reservations/1")
      .expect((request) => {
        expect(request.status).toEqual(400);
        expect(request.body).toEqual({ error: "invalid id provided" });
      });
  });
  it(`should GET reservations/61679189b54f48aa6599a7fd returns code "403 Forbidden" , error message "user does not have permission to access this reservation" `, async () => {
    await request(app)
      .get("/reservations/61679189b54f48aa6599a7fd")
      .expect((request) => {
        expect(request.status).toEqual(403);
        expect(request.body).toEqual({
          error: "user does not have permission to access this reservation"
        });
      });
  });
});
