const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter event title"],
    },
    description: {
      type: String,
      required: [true, "Please enter event description"],
    },
    event_img: {
      public_id: String,
      url: String,
    },
    date: {
      type: String,
      required: [true, "Please enter event date"],
    },
    totalSeat: {
      type: Number,
      required: [true, "Please enter totalSeat"],
    },
    location: {
      type: String,
      required: [true, "Please enter event location"],
    },
    price: {
      type: Number,
      default: 0,
    },
    qty: {
      type: Number,
      default: 1,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Please select event category"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      default: true,
    },
    reviews: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        eventId: {
          type: Schema.Types.ObjectId,
          ref: "Event",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    versionKey: false,
  }
);
const Event = model("Event", eventSchema);
module.exports = Event;
