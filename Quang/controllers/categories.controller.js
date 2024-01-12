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
