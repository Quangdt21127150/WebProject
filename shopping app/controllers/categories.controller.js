const Category = require("../models/category.model");
const Product = require("../models/product.model");

async function getAllCategories(req, res, next) {
  try {
    const categories = await Category.findAll();
    let page = parseInt(req.query.page) || 1,
      per_page = 5,
      total_page = Math.ceil(categories.length / per_page),
      start = (page - 1) * per_page,
      end = page * per_page;
    if (page === total_page || categories.length === 0) {
      end = categories.length;
    }
    res.render("admin/categories/all-categories", {
      categories: categories,
      page: page,
      start: start,
      end: end,
      total_page: total_page,
    });
  } catch (error) {
    next(error);
  }
}

async function getProductsOfCategory(req, res, next) {
  try {
    const products = await Product.findByCateId(req.params.cateID);
    res.render("admin/products/all-products", { products: products });
  } catch (error) {
    next(error);
    return;
  }
}

module.exports = {
  getAllCategories: getAllCategories,
  getProductsOfCategory: getProductsOfCategory,
};
