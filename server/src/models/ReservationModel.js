const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reservationSchema = new Schema(
  {
    partySize: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    restaurantName: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);
const Reservation = mongoose.model("Reservation", reservationSchema);
module.exports = Reservation;
