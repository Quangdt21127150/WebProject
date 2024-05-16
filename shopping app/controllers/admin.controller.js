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

  res.redirect("/categories");
}

//Products Manage
async function getNewProduct(req, res) {
  const category = await Category.findById(req.params.cateId);
  res.render("admin/products/new-product", { category: category });
}

async function createNewProduct(req, res, next) {
  const product = new Product({
    ...req.body,
    image: req.file.filename,
  });
  console.log(req.body.title)

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
    const category = await Category.findById(product.cateId);
    res.render("admin/products/update-product", {
      product: product,
      category: category,
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

  res.redirect(`/categories/${product.cateId}`);
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
    const users = await Account.findByUsername(req.body.username);
    if (users.length === 0) await user.signup(false);
    else {
      res.redirect("/admin/accounts/new");
      return;
    }
  } catch (error) {
    next(error);
    return;
  }

  res.redirect(
    `https://localhost:5000/?username=${req.body.username}&login=true`
  );
}

async function deleteAccount(req, res, next) {
  let account;
  try {
    account = await Account.findById(req.params.id);
    await account.remove();
  } catch (error) {
    return next(error);
  }

  const username = account.username;
  res.redirect(
    `https://localhost:5000/pay_accounts/delete?username=${username}`
  );
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

//Statistic
async function getDataStatistic(req, res, next) {
  const today = new Date();
  const year = today.getFullYear();
  let revenue = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let max = 0;

  try {
    const orders = await Order.findAll();
    for (let order of orders) {
      revenue[order.date.getMonth()] += order.productData.totalPrice;
    }

    for (let i = 0; i < 12; ++i) {
      if (max < revenue[i]) {
        max = revenue[i];
      }
    }
  } catch (error) {
    next(error);
  }

  res.render("admin/statistic/admin-statistic", {
    year: year,
    max: max,
  });
}

async function postStatistic(req, res, next) {
  let revenue = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  try {
    const orders = await Order.findAll();
    for (let order of orders) {
      if (order.status === "fulfilled") {
        revenue[order.date.getMonth()] += order.productData.totalPrice;
      }
    }

    res.status(200).send({ data: revenue });
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

  getDataStatistic: getDataStatistic,
  postStatistic: postStatistic,
};
