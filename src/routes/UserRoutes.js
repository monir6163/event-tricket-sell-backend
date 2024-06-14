const { Router } = require("express");
const UsersController = require("../controllers/UsersController");
const upload = require("../middleware/multer");
const middleware = require("../middleware/authMiddleware");
const router = Router();

router.get("/userEmail", middleware.auth, UsersController.getUserEmail);
router.get("/userId", UsersController.getUserId);
router.patch(
  "/userUpdate",
  middleware.auth,
  upload.single("profileImage"),
  UsersController.updateUser
);

module.exports = router;
