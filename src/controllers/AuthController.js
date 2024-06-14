const User = require("../models/userModel");
const AuthServices = require("../services/AuthServices");

class authController {
  registration = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({
          status: false,
          message: "Name, Email and Password is required",
        });
      }
      //check user exist email
      const existUser = await User.findOne({ email: email });
      if (existUser) {
        return res.status(200).json({ status: true, message: "already exist" });
      }
      await AuthServices.registration({ name, email, password });
      return res
        .status(201)
        .json({ status: true, message: "User Register Success" });
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ status: false, message: "Email and Password is required" });
      }
      const token = await AuthServices.login(email, password);
      return res
        .status(200)
        .json({ status: true, message: "login success", token });
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req, res, next) => {
    try {
      const { id } = req.query;
      const { newPassword, oldPassword } = req.body;
      await AuthServices.changePassword({ id, newPassword, oldPassword });
      return res
        .status(200)
        .json({ status: true, message: "Password Change Success" });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new authController();
