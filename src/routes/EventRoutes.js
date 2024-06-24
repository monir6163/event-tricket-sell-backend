const { Router } = require("express");
const EventController = require("../controllers/EventController");
const middleware = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");
const router = Router();

router.post(
  "/create",
  middleware.auth,
  upload.single("event_img"),
  EventController.createEvent
);
router.get(
  "/get/:pageNo/:perPage/:searchkeyword",
  middleware.auth,
  EventController.getEvents
);
router.get(
  "/getall/:pageNo/:perPage/:searchkeyword",
  EventController.getEvents
);
router.get("/getId/:id", middleware.auth, EventController.getEventsId);
router.get("/upcoming", EventController.upComingEvents);
router.patch(
  "/update/:id",
  middleware.auth,
  upload.single("event_img"),
  EventController.eventUpdate
);
router.put("/update/status/:id", middleware.auth, EventController.eventStatus);
router.delete("/delete/:id", middleware.auth, EventController.eventDelete);

module.exports = router;
