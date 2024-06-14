const { UploadCloudinary } = require("../../utility/uploadImage");
const Category = require("../models/CategoryModel");

class categoryServices {
  all = async () => {
    return await Category.find().sort({ createdAt: -1 });
  };
  create = async (data) => {
    const url = await UploadCloudinary(data?.cat_img, "ecom/dog");
    return await Category.create({
      name: data.name,
      cat_img: {
        public_id: url?.public_id,
        url: url?.url,
      },
    });
  };
}

module.exports = new categoryServices();
