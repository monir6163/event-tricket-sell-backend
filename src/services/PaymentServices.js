const SSLCommerzPayment = require("sslcommerz-lts");
const error = require("../../utility/error");
const Event = require("../models/EventModel");
const Order = require("../models/OrderModel");
const sendMail = require("../../utility/MailSend");
let store_id = process.env.SSLCOMMERZ_STORE_ID;
let store_passwd = process.env.SSLCOMMERZ_STORE_PASSWD;
let is_live = false; //true for live, false for sandbox
class paymentServices {
  createOrder = async (order) => {
    const findEvent = await Event.findOne({ _id: order?.event_id }).populate(
      "category"
    );
    if (!findEvent) {
      throw error("Not Found", 400);
    }
    const tran_id = "REF" + Math.floor(Math.random() * 100000000 + 1);
    const data = {
      total_amount: findEvent?.price,
      currency: order?.currency || "BDT",
      tran_id: tran_id, // use unique tran_id for each api call
      success_url: `${process.env.URL}/payment/ssl-payment-success`,
      fail_url: `${process.env.URL}/payment/ssl-payment-fail`,
      cancel_url: `${process.env.URL}/payment/ssl-payment-cancel`,
      ipn_url: `${process.env.URL}/payment/ssl-payment-ipn`,
      shipping_method: "Courier",
      product_name: findEvent?.title,
      product_category: findEvent?.category?.name,
      product_profile: "general",
      cus_name: order?.name,
      cus_email: order?.email,
      cus_add1: order?.address,
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: order?.postcode,
      cus_country: "Bangladesh",
      cus_phone: order?.phone,
      cus_fax: "01711111111",
      ship_name: "Customer Name",
      ship_add1: "Dhaka",
      ship_add2: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
    };
    if (order?.currency === "0") {
      const newOrder = new Order({
        tran_id: tran_id,
        val_id: "0",
        amount: findEvent?.price,
        card_type: "0",
        store_amount: "0",
        tran_date: new Date().toISOString(),
        paymentStatus: "complete",
        currency: "Free",
        event_id: findEvent?._id,
        order: order,
      });

      // also totalseat -1
      const event = await Event.findOne({ _id: order?.event_id });
      event.totalSeat = event.totalSeat - 1;
      event.qty = event.qty - 1;

      await event.save();

      await newOrder.save();

      await sendMail(
        order?.email,
        `Event Management System : ${tran_id}`,
        `Your Event is Booked Successfully : ${findEvent?.title}`
      );

      return `${process.env.CLIENT_URL}/payment/success/${tran_id}`;
    }
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    let apiResponse = await sslcz.init(data);
    let finalOrder = {
      tran_id: tran_id,
      val_id: "0",
      amount: findEvent?.price,
      card_type: "0",
      store_amount: "0",
      tran_date: new Date().toISOString(),
      paymentStatus: "pending",
      currency: order?.currency,
      event_id: findEvent?._id,
      order: order,
    };
    // Save the order to the database
    const newOrder = new Order(finalOrder);
    await newOrder.save();

    return apiResponse.GatewayPageURL;
  };

  //success
  paymentSuccess = async (data) => {
    const { tran_id, val_id, amount, card_type, store_amount, tran_date } =
      data;
    const findOrder = await Order.findOne({ tran_id: tran_id });
    if (!findOrder) {
      throw error("Not Found", 400);
    }
    findOrder.paymentStatus = "success";
    findOrder.val_id = val_id;
    findOrder.amount = amount;
    findOrder.card_type = card_type;
    findOrder.store_amount = store_amount;
    findOrder.tran_date = tran_date;
    await findOrder.save();
    // also totalseat -1
    const event = await Event.findOne({ _id: findOrder?.event_id });
    event.totalSeat = event.totalSeat - 1;
    event.qty = event.qty - 1;
    await event.save();

    await sendMail(
      findOrder?.order?.email,
      `Event Management System : ${tran_id}`,
      `Your Event is Booked Successfully : ${event?.title}`
    );

    return {
      tran_id,
      val_id,
      amount,
      card_type,
      store_amount,
      tran_date,
    };
  };

  //fail
  paymentFail = async (data) => {
    const { tran_id, val_id, amount, card_type, store_amount, tran_date } =
      data;
    const findOrder = await Order.findOne({ tran_id: tran_id });
    if (!findOrder) {
      throw error("Not Found", 400);
    }
    findOrder.paymentStatus = "fail";
    findOrder.val_id = val_id;
    findOrder.amount = amount;
    findOrder.card_type = card_type;
    findOrder.store_amount = store_amount;
    findOrder.tran_date = tran_date;
    await findOrder.save();
    return {
      tran_id,
      val_id,
      amount,
      card_type,
      store_amount,
      tran_date,
    };
  };

  //cancel
  paymentCancel = async (data) => {
    const { tran_id, val_id, amount, card_type, store_amount, tran_date } =
      data;
    const findOrder = await Order.findOne({ tran_id: tran_id });
    if (!findOrder) {
      throw error("Not Found", 400);
    }
    findOrder.paymentStatus = "cancel";
    findOrder.val_id = val_id;
    findOrder.amount = amount;
    findOrder.card_type = card_type;
    findOrder.store_amount = store_amount;
    findOrder.tran_date = tran_date;
    await findOrder.save();
    return {
      tran_id,
      val_id,
      amount,
      card_type,
      store_amount,
      tran_date,
    };
  };

  paymentIPN = async (data) => {
    console.log("ipn data", data);
    const { tran_id, val_id, amount, card_type, store_amount, tran_date } =
      data;
    const findOrder = await Order.findOne({ tran_id: tran_id });
    if (!findOrder) {
      throw error("Not Found", 400);
    }
    findOrder.paymentStatus = data?.status;
    findOrder.val_id = val_id;
    findOrder.amount = amount;
    findOrder.card_type = card_type;
    findOrder.store_amount = store_amount;
    findOrder.tran_date = tran_date;
    await findOrder.save();
    // also totalseat -1
    if (data?.status === "VALID") {
      const event = await Event.findOne({ _id: findOrder?.event_id });
      event.totalSeat = event.totalSeat - 1;
      event.qty = event.qty - 1;
      await event.save();
    }

    return {
      tran_id,
      val_id,
      amount,
      card_type,
      store_amount,
      tran_date,
    };
  };
}

module.exports = new paymentServices();
