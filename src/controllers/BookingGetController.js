const bookingGetServices = require("../services/bookingGetServices");

class bookingGetController {
  getBooking = async (req, res, next) => {
    try {
      const booking = await bookingGetServices.getBooking();
      res.status(200).json({ status: true, data: booking });
    } catch (error) {
      next(error);
    }
  };
  getBookingUser = async (req, res, next) => {
    try {
      const { email } = req.userInfo;
      if (!email) {
        return res.status(400).json({ status: false, message: "Login Please" });
      }
      const booking = await bookingGetServices.getBookingUser(email);
      return res.status(200).json({ status: true, data: booking });
    } catch (error) {
      next(error);
    }
  };
}
module.exports = new bookingGetController();
