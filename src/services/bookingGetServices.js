const Order = require("../models/OrderModel");

class bookingGetServices {
  getBooking = async () => {
    return await Order.find().populate("event_id", "title date time location");
  };
  getBookingUser = async (email) => {
    return await Order.find({ "order.email": email }).populate(
      "event_id",
      "title date time location"
    );
  };
}
module.exports = new bookingGetServices();
