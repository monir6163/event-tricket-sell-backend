const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
  {
    tran_id: {
      type: String,
      required: true,
    },
    val_id: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    card_type: {
      type: String,
      required: true,
    },
    store_amount: {
      type: Number,
      required: true,
    },
    tran_date: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
    },
    currency: {
      type: String,
      required: true,
    },
    event_id: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    order: {
      type: Object,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

const Order = model("Order", orderSchema);
module.exports = Order;
