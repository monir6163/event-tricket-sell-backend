const { Router } = require("express");
const payController = require("../controllers/PaymentController");
const middleware = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");
const router = Router();

router.post("/create", middleware.auth, payController.createOrder);
router.post("/ssl-payment-success", payController.paymentSuccess);
router.post("/ssl-payment-fail", payController.paymentFail);
router.post("/ssl-payment-cancel", payController.paymentCancel);
router.post("/ssl-payment-ipn", payController.paymentIPN);

module.exports = router;
