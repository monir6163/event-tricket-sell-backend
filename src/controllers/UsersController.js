const User = require("../models/userModel");
const UsersServices = require("../services/UsersServices");
const { formidable } = require("formidable");

class usersController {
  getUserEmail = async (req, res, next) => {
    try {
      const email = req.query.email;
      const user = await UsersServices.getUserEmail(email);
      return res.status(200).json({ status: true, user });
    } catch (error) {
      next(error);
    }
  };

  getUserId = async (req, res, next) => {
    try {
      const id = req.query.id;
      const user = await UsersServices.getUserId(id);
      return res.status(200).json({ status: true, user });
    } catch (error) {
      next(error);
    }
  };
  updateUser = async (req, res, next) => {
    try {
      const { id } = req.query;
      const filepath = req?.file?.path || "";
      const { name, phone, role, email } = req.body;
      if (!filepath)
        return res
          .status(400)
          .json({ status: false, message: "Image is required" });

      const token = await UsersServices.updateUser({
        id,
        name,
        phone,
        role,
        email,
        img: filepath,
      });
      return res
        .status(200)
        .json({ status: true, message: "User updated", token });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new usersController();
