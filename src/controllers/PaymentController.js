const PaymentServices = require("../services/PaymentServices");
class paymentController {
  createOrder = async (req, res, next) => {
    try {
      const bodyData = req.body;
      const url = await PaymentServices.createOrder(bodyData);
      return res.status(200).json({ status: true, url });
    } catch (error) {
      next(error);
    }
  };

  paymentSuccess = async (req, res, next) => {
    try {
      const data = req.body;
      const success = await PaymentServices.paymentSuccess(data);
      return res.redirect(
        `${process.env.CLIENT_URL}/payment/success/${success?.tran_id}`
      );
    } catch (error) {
      next(error);
    }
  };
  paymentFail = async (req, res, next) => {
    try {
      const data = req.body;
      const fail = await PaymentServices.paymentFail(data);
      return res.redirect(
        `${process.env.CLIENT_URL}/payment/fail/${fail?.tran_id}`
      );
    } catch (error) {
      next(error);
    }
  };
  paymentCancel = async (req, res, next) => {
    try {
      const data = req.body;
      const cancel = await PaymentServices.paymentCancel(data);
      return res.redirect(
        `${process.env.CLIENT_URL}/payment/cancel/${cancel?.tran_id}`
      );
    } catch (error) {
      next(error);
    }
  };
  paymentIPN = async (req, res, next) => {
    try {
      const data = req.body;
      const ipn = await PaymentServices.paymentIPN(data);
      console.log("ipn", ipn);
      return res.status(200).json({ status: true, ipn });
    } catch (error) {
      next(error);
    }
  };
}
module.exports = new paymentController();
