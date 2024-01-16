const Category = require("../models/category.model");
const Product = require("../models/product.model");
const Account = require("../models/account.model");
const User = require("../models/user.model");
const Order = require("../models/order.model");

//Categories Manage
function getNewCategory(req, res) {
  res.render("admin/categories/new-category");
}

async function createNewCategory(req, res, next) {
  const category = new Category({
    ...req.body,
  });

  try {
    await category.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/categories");
}

async function getUpdateCategory(req, res, next) {
  try {
    const category = await Category.findById(req.params.id);
    res.render("admin/categories/update-category", { category: category });
  } catch (error) {
    next(error);
  }
}

async function updateCategory(req, res, next) {
  const category = new Category({
    ...req.body,
    _id: req.params.id,
  });

  try {
    await category.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/categories");
}

async function deleteCategory(req, res, next) {
  let category, products;
  try {
    products = await Product.findByCateId(req.params.id);
    category = await Category.findById(req.params.id);
    products.forEach((element) => {
      element.remove();
    });
    await category.remove();
  } catch (error) {
    return next(error);
  }

  res.json({ message: "Deleted category!" });
}

//Products Manage
async function getNewProduct(req, res) {
  const categories = await Category.findAll();
  res.render("admin/products/new-product", { categories: categories });
}

async function createNewProduct(req, res, next) {
  const product = new Product({
    ...req.body,
    image: req.file.filename,
  });

  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect(`/categories/${product.cateId}`);
}

async function getUpdateProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    const categories = await Category.findAll();
    res.render("admin/products/update-product", {
      product: product,
      categories: categories,
    });
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  const product = new Product({
    ...req.body,
    _id: req.params.id,
  });

  if (req.file) {
    product.replaceImage(req.file.filename);
  }

  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect(`/categories/${product.cateId}`);
}

async function deleteProduct(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.id);
    await product.remove();
  } catch (error) {
    return next(error);
  }

  res.json({ message: "Deleted product!" });
}

//Accounts Manage
function getNewAccount(req, res) {
  res.render("admin/accounts/new-account");
}

async function createNewAccount(req, res, next) {
  const user = new User(
    req.body.username,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city
  );

  try {
    await user.signup();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/accounts");
}

async function deleteAccount(req, res, next) {
  let account;
  try {
    account = await Account.findById(req.params.id);
    await account.remove();
  } catch (error) {
    return next(error);
  }

  res.redirect("/accounts");
}

//Order Manage
async function getOrders(req, res, next) {
  try {
    const orders = await Order.findAll();
    res.render("admin/orders/admin-orders", {
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
}

async function updateOrder(req, res, next) {
  const orderId = req.params.id;
  const newStatus = req.body.newStatus;

  try {
    const order = await Order.findById(orderId);

    order.status = newStatus;

    await order.save();

    res.json({ message: "Order updated", newStatus: newStatus });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getNewCategory: getNewCategory,
  createNewCategory: createNewCategory,
  getUpdateCategory: getUpdateCategory,
  updateCategory: updateCategory,
  deleteCategory: deleteCategory,

  getNewProduct: getNewProduct,
  createNewProduct: createNewProduct,
  getUpdateProduct: getUpdateProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct,

  getNewAccount: getNewAccount,
  createNewAccount: createNewAccount,
  deleteAccount: deleteAccount,

  getOrders: getOrders,
  updateOrder: updateOrder,
};
