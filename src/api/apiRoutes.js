const userRoutes = require("../routes/UserRoutes");
const authRoutes = require("../routes/AuthRoutes");
const catRoutes = require("../routes/CatRoutes");
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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

module.exports = router;
