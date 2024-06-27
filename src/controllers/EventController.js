const EventServices = require("../services/EventServices");

class eventController {
  createEvent = async (req, res, next) => {
    try {
      const {
        title,
        description,
        date,
        totalSeat,
        location,
        price,
        qty,
        category,
      } = req.body;
      const filepath = req?.file?.path;
      await EventServices.createEvent({
        title,
        description,
        date,
        totalSeat,
        location,
        price: parseInt(price),
        qty,
        category,
        event_img: filepath,
      });
      res
        .status(201)
        .json({ status: true, message: "Event created successfully" });
    } catch (error) {
      next(error);
    }
  };

  getEvents = async (req, res) => {
    try {
      const pageNo = Number(req.params.pageNo);
      const perPage = Number(req.params.perPage);
      const searchValue = req.params.searchkeyword;
      const skipRow = (pageNo - 1) * perPage;

      const events = await EventServices.getEvents(
        perPage,
        skipRow,
        searchValue
      );

      res.status(200).json({ status: true, data: events });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  getEventsIdAdmin = async (req, res, next) => {
    try {
      const { id } = req.params;
      const event = await EventServices.getEventsIdAdmin(id);
      res.status(200).json({ status: true, data: event });
    } catch (error) {
      next(error);
    }
  };

  getEventsId = async (req, res, next) => {
    try {
      const { id } = req.params;
      const event = await EventServices.getEventsId(id);
      res.status(200).json({ status: true, data: event });
    } catch (error) {
      next(error);
    }
  };

  upComingEvents = async (req, res, next) => {
    try {
      const events = await EventServices.upComingEvents();
      res.status(200).json({ status: true, data: events });
    } catch (error) {
      next(error);
    }
  };

  eventUpdate = async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        date,
        totalSeat,
        location,
        price,
        qty,
        category,
      } = req.body;
      const filepath = req?.file?.path;
      await EventServices.updateEvent(id, {
        title,
        description,
        date,
        totalSeat,
        location,
        price: parseInt(price),
        qty,
        category,
        event_img: filepath,
      });
      res
        .status(200)
        .json({ status: true, message: "Event updated successfully" });
    } catch (error) {
      next(error);
    }
  };

  eventStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await EventServices.eventStatus(id, status);
      res
        .status(200)
        .json({ status: true, message: "Event status updated successfully" });
    } catch (error) {
      next(error);
    }
  };

  eventDelete = async (req, res, next) => {
    try {
      const { id } = req.params;
      await EventServices.deleteEvent(id);
      res
        .status(200)
        .json({ status: true, message: "Event deleted successfully" });
    } catch (error) {
      next(error);
    }
  };

  eventReview = async (req, res, next) => {
    try {
      const { id } = req.params;
      const reviewData = req.body;
      await EventServices.eventReview(id, reviewData);
      res
        .status(200)
        .json({ status: true, message: "Review added successfully" });
    } catch (error) {
      next(error);
    }
  };

  getReviews = async (req, res, next) => {
    try {
      const { id } = req.params;
      const reviews = await EventServices.getReviews(id);
      res.status(200).json({ status: true, data: reviews });
    } catch (error) {
      next(error);
    }
  };

  categoryWiseEvent = async (req, res, next) => {
    try {
      const { id } = req.params;
      const events = await EventServices.categoryWiseEvent(id);
      res
        .status(200)
        .json({ status: true, count: events.length, data: events });
    } catch (error) {
      next(error);
    }
  };
}
module.exports = new eventController();
