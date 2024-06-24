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

  getEventsId = async (id) => {
    const event = await Event.findById(id).populate("category", "name");
    if (!event) {
      throw error("Invalid Credential", 400);
    }
    return event;
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
      // check if event is expired or not
      if (new Date(event.date) < new Date()) {
        event.status = false;
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
}
module.exports = new eventServices();
