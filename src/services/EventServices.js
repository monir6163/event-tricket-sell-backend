const error = require("../../utility/error");
const Event = require("../models/EventModel");

const {
  UploadCloudinary,
  DestroyCloudinary,
} = require("../../utility/uploadImage");
class eventServices {
  createEvent = async (eventData) => {
    const url = await UploadCloudinary(eventData?.event_img, "event");
    const event = await Event.create({
      title: eventData.title,
      description: eventData.description,
      event_img: {
        public_id: url?.public_id,
        url: url?.url,
      },
      date: eventData.date,
      totalSeat: eventData.totalSeat,
      location: eventData.location,
      price: eventData.price,
      qty: eventData.qty,
      category: eventData.category,
    });
    return event;
  };

  getEvents = async (perPage, skipRow, searchValue) => {
    let events;
    if (searchValue !== "0") {
      let searchRegex = { $regex: searchValue, $options: "i" };
      let searchQuery = { $or: [{ title: searchRegex }] };
      events = await Event.aggregate([
        {
          $facet: {
            Total: [{ $match: searchQuery }, { $count: "count" }],
            Rows: [
              { $match: searchQuery },
              { $sort: { createdAt: -1 } },
              { $skip: skipRow },
              { $limit: perPage },
              {
                $lookup: {
                  from: "categories",
                  localField: "category",
                  foreignField: "_id",
                  as: "category",
                },
              },
              {
                $unwind: {
                  path: "$category",
                  preserveNullAndEmptyArrays: true,
                },
              },
            ],
          },
        },
      ]);
    } else {
      events = await Event.aggregate([
        {
          $facet: {
            Total: [{ $count: "count" }],
            Rows: [
              { $sort: { createdAt: -1 } },
              { $skip: skipRow },
              { $limit: perPage },
              {
                $lookup: {
                  from: "categories",
                  localField: "category",
                  foreignField: "_id",
                  as: "category",
                },
              },
              {
                $unwind: {
                  path: "$category",
                  preserveNullAndEmptyArrays: true,
                },
              },
            ],
          },
        },
      ]);
    }
    return events;
  };
  getEventsIdAdmin = async (id) => {
    const event = await Event.findById(id).populate("category", "name");
    if (!event) {
      throw error("Invalid Credential", 400);
    }
    return event;
  };

  getEventsId = async (id) => {
    const event = await Event.findById(id).populate("category", "name");
    if (!event) {
      throw error("Invalid Credential", 400);
    }

    //check status false or true
    if (event.status === "false") {
      throw error("Event is not available", 400);
    } else {
      return event;
    }
  };

  upComingEvents = async () => {
    const events = await Event.find({
      date: {
        $gte: new Date().toISOString(),
      },
      status: true,
    })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    events?.map((event) => {
      //make auto status false if event date is passed away
      // 2024-06-27T06:50:52.566Z
      // :52.566Z => remove this part

      const newDate = new Date();
      let formattedDate =
        newDate.getFullYear() +
        "-" +
        ("0" + (newDate.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + newDate.getDate()).slice(-2) +
        "T" +
        ("0" + newDate.getHours()).slice(-2) +
        ":" +
        ("0" + newDate.getMinutes()).slice(-2);

      // check if event date is passed away or not if passed away then make status false
      if (event.date < formattedDate) {
        event.status = false;
        event.save();
      } else {
        event.status = true;
        event.save();
      }
    });

    return events;
  };

  updateEvent = async (id, eventData) => {
    const event = await Event.findById(id);
    if (!event) {
      throw error("Invalid Credential", 400);
    }

    //
    const newDate = new Date();
    let formattedDate =
      newDate.getFullYear() +
      "-" +
      ("0" + (newDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + newDate.getDate()).slice(-2) +
      "T" +
      ("0" + newDate.getHours()).slice(-2) +
      ":" +
      ("0" + newDate.getMinutes()).slice(-2);

    // check if event date is passed away or not if passed away then make status false
    if (event.date < formattedDate) {
      console.log(event.date < formattedDate);
      event.status = false;
    } else {
      event.status = true;
    }

    if (eventData?.event_img) {
      if (event?.event_img?.public_id) {
        await DestroyCloudinary(event.event_img.public_id);
      }
      const url = await UploadCloudinary(eventData?.event_img, "event");
      event.event_img = {
        public_id: url?.public_id,
        url: url?.url,
      };
    } else {
      event.event_img = event?.event_img;
    }
    event.title = eventData.title;
    event.description = eventData.description;
    event.date = eventData.date;
    event.totalSeat = eventData.totalSeat;
    event.location = eventData.location;
    event.price = eventData.price;
    event.qty = eventData.qty;
    event.category = eventData.category;
    await event.save();
    return event;
  };

  eventStatus = async (id, status) => {
    const event = await Event.findById(id);
    if (!event) {
      throw error("Invalid Credential", 400);
    }
    event.status = status;
    await event.save();
    return event;
  };

  deleteEvent = async (id) => {
    const event = await Event.findById(id);
    if (!event) {
      throw error("Invalid Credential", 400);
    }
    await DestroyCloudinary(event?.event_img?.public_id);
    await Event.findByIdAndDelete(id);
  };

  eventReview = async (id, reviewData) => {
    const event = await Event.findById(id);
    if (!event) {
      throw error("Invalid Credential", 400);
    }
    // check if user already reviewed the event same day or not
    const isReviewed = event.reviews.find(
      (r) =>
        r.userId.toString() === reviewData.userId.toString() &&
        r.createdAt.toDateString() === new Date().toDateString()
    );
    if (isReviewed) {
      throw error("You already reviewed this event", 400);
    }

    const newReview = {
      userId: reviewData.userId,
      name: reviewData.name,
      rating: reviewData.rating,
      comment: reviewData.comment,
    };
    event.reviews.push(newReview);
    await event.save();
    return event;
  };

  getReviews = async (id) => {
    const event = await Event.findById(id).populate("reviews.userId", [
      "name",
      "avater",
    ]);
    if (!event) {
      throw error("Invalid Credential", 400);
    }
    return event.reviews;
  };

  categoryWiseEvent = async (id) => {
    const events = await Event.find({ category: id }).populate("category", [
      "name",
    ]);
    if (!events) {
      throw error("Invalid Credential", 400);
    }
    return events;
  };
}
module.exports = new eventServices();
