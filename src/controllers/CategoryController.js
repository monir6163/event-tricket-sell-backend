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

  getAcategory = async (req, res, next) => {
    try {
      const { id } = req.query;
      const cat = await CategoryServices.getAcategory(id);
      return res.status(200).json({ status: true, data: cat });
    } catch (error) {
      next(error);
    }
  };
  update = async (req, res, next) => {
    try {
      const { id } = req.query;
      const { name } = req.body;
      const filepath = req?.file?.path || "";
      await CategoryServices.update({
        id,
        name,
        cat_img: filepath,
      });
      return res
        .status(200)
        .json({ status: true, message: "Category updated" });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.query;
      await CategoryServices.delete(id);
      return res
        .status(200)
        .json({ status: true, message: "Category deleted" });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new categoryController();
