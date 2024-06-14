const CategoryServices = require("../services/CategoryServices");

class categoryController {
  create = async (req, res, next) => {
    try {
      const { name } = req.body;
      const filepath = req?.file?.path || "";
      if (!name || !filepath) {
        return res
          .status(400)
          .json({ status: false, message: "All fields are required" });
      }

      await CategoryServices.create({ name, cat_img: filepath });
      return res
        .status(201)
        .json({ status: true, message: "Category created" });
    } catch (error) {
      next(error);
    }
  };

  all = async (req, res, next) => {
    try {
      const cat = await CategoryServices.all();
      return res.status(200).json({ status: true, data: cat });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new categoryController();
