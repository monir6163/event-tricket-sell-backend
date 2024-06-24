const {
  UploadCloudinary,
  DestroyCloudinary,
} = require("../../utility/uploadImage");
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
  getAcategory = async (id) => {
    return await Category.findById(id);
  };
  update = async (data) => {
    const category = await Category.findById(data.id);
    if (!category) {
      throw new Error("Category not found");
    }
    if (data?.cat_img) {
      //remove the previous image
      if (category.cat_img.public_id) {
        await DestroyCloudinary(category.cat_img.public_id);
      }
      const url = await UploadCloudinary(data?.cat_img, "ecom/dog");
      category.cat_img = {
        public_id: url?.public_id,
        url: url?.url,
      };
    }
    category.name = data.name;
    await category.save();
    return category;
  };
  delete = async (id) => {
    const category = await Category.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    if (category.cat_img.public_id) {
      await DestroyCloudinary(category.cat_img.public_id);
    }
    await category.deleteOne();
    return category;
  };
}

module.exports = new categoryServices();
