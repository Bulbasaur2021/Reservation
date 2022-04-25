const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
  id: { type: String, required: true },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
});
const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant;
