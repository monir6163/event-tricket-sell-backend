const { Router } = require("express");
const CatController = require("../controllers/CategoryController");
const middleware = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");
const router = Router();

router.post(
  "/create",
  middleware.auth,
  upload.single("cat_img"),
  CatController.create
);
router.get("/all", CatController.all);

module.exports = router;
