const {
  UploadCloudinary,
  DestroyCloudinary,
} = require("../../utility/uploadImage");
const User = require("../models/userModel");
const { TokenCreate } = require("../../utility/TokenCreate");

class userServices {
  getUserEmail = async (email) => {
    return await User.findOne({ email: email });
  };
  getUserId = async (id) => {
    return await User.findById(id);
  };

  updateUser = async (data) => {
    const user = await User.findById(data.id);
    if (user?.avater?.public_id) {
      await DestroyCloudinary(user?.avater?.public_id);
    }
    const url = await UploadCloudinary(data?.img, "ecom/user");
    const userData = {
      name: data?.name,
      phone: data?.phone,
      role: data?.role,
      email: data?.email,
      avater: {
        public_id: url?.public_id,
        url: url?.url,
      },
    };

    // update token data
    const token = TokenCreate({
      name: userData.name,
      email: userData.email,
      id: user._id,
      role: userData.role,
      avater: userData.avater.url,
    });
    await User.findByIdAndUpdate(data?.id, userData);
    return token;
  };
}

module.exports = new userServices();
