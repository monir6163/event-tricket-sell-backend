const userRoutes = require("../routes/UserRoutes");
const authRoutes = require("../routes/AuthRoutes");
const catRoutes = require("../routes/CatRoutes");
const eventRoutes = require("../routes/EventRoutes");
const paymentRoutes = require("../routes/PaymentRoutes");
const bookingRoutes = require("../routes/GetBookingRoutes");
const { Router } = require("express");
const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },

  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/category",
    route: catRoutes,
  },
  {
    path: "/event",
    route: eventRoutes,
  },
  {
    path: "/payment",
    route: paymentRoutes,
  },
  {
    path: "/booking",
    route: bookingRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

module.exports = router;
