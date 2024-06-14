const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const error = require("../../utility/error");
const { TokenCreate } = require("../../utility/TokenCreate");

class authServices {
  registration = async (data) => {
    const registerData = await User.create(data);
    return registerData;
  };

  login = async (email, password) => {
    const user = await User.findOne({ email: email }).select("+password");
    if (!user) throw error("Invalid Credential", 400);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw error("Invalid Credential", 400);
    const token = TokenCreate({
      name: user.name,
      email: user.email,
      id: user._id,
      role: user.role,
      avater: user.avater.url,
    });
    return token;
  };

  changePassword = async (data) => {
    const { id, newPassword, oldPassword } = data;
    const user = await User.findById(id).select("+password");
    if (!user) throw error("User not found", 404);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw error("Invalid Credential", 400);
    user.password = newPassword;
    await user.save();
    return user;
  };
}

module.exports = new authServices();
