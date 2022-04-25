const formatRestaurantId = require("../utils/formatRestaurantId");
const restaurantMongoDB = {
  _id: "616005cae3c8e880c13dc0b9",
  name: "Curry Place",
  description:
    "Bringing you the spirits of India in the form of best authentic grandma's recipe dishes handcrafted with love by our chefs!",
  image: "https://i.ibb.co/yftcRcF/indian.jpg"
};
const expectedReservation = {
  id: "616005cae3c8e880c13dc0b9",
  name: "Curry Place",
  description:
    "Bringing you the spirits of India in the form of best authentic grandma's recipe dishes handcrafted with love by our chefs!",
  image: "https://i.ibb.co/yftcRcF/indian.jpg"
};
describe("format _id to id", () => {
  it("should change _id to id", () => {
    const received = formatRestaurantId(restaurantMongoDB);
    expect(received).toEqual(expectedReservation);
  });
});
