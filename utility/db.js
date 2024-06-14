const mongoose = require("mongoose");
const db_connect = async () => {
  try {
    if (process.env.MODE === "production") {
      await mongoose.connect(
        `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.r1nyd.mongodb.net/event?retryWrites=true&w=majority&appName=Cluster0`
      );
      console.log("production db connected");
    } else {
      await mongoose.connect(
        `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.r1nyd.mongodb.net/event?retryWrites=true&w=majority&appName=Cluster0`
      );
      console.log("local db connected");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = db_connect;
