const { Schema, model } = require("mongoose");

const dogSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is require"],
    },
    price: {
      type: String,
      required: [true, "Price is required"],
    },
    stock: {
      type: String,
      required: [true, "Stock is require"],
    },
    description: {
      type: String,
      required: [true, "description is require"],
    },
    image: {
      public_id: String,
      url: String,
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

const Dog = model("Dog", dogSchema);
module.exports = Dog;
