const Category = require("../models/category.model");
const Product = require("../models/product.model");

async function getAllCategories(req, res, next) {
  try {
    const categories = await Category.findAll();
    res.render("customer/categories/all-categories", {
      categories: categories,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllCategories: getAllCategories,
};
