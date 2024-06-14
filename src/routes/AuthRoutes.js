const { Router } = require("express");
const AuthController = require("../controllers/AuthController");
const middleware = require("../middleware/authMiddleware");
const router = Router();

router.post("/register", AuthController.registration);
router.post("/login", AuthController.login);
router.put("/change-password", middleware.auth, AuthController.changePassword);

module.exports = router;
