const { Router } = require("express");
const bookingController = require("../controllers/BookingGetController");
const middleware = require("../middleware/authMiddleware");
const router = Router();

router.get("/get-all", middleware.auth, bookingController.getBooking);
router.get("/get/email", middleware.auth, bookingController.getBookingUser);

module.exports = router;
