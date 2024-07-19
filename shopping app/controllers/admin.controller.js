const Category = require("../models/category.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const Order = require("../models/order.model");
const Voucher = require("../models/voucher.model");
const sessionFlash = require("../util/session-flash");
const fs = require("fs");
const path = require("path");

//Categories Manage
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
async function createNewProduct(req, res, next) {
  try {
    const product = new Product({
      ...req.body,
      image: req.file.filename,
      date: new Date(),
    });

    await product.save();

    res.redirect(`/categories/${product.cateId}`);
  } catch (error) {
    return next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = new Product({
      _id: req.params.id,
      ...req.body,
      date: new Date(),
    });

    if (req.file) {
      product.replaceImage(req.file.filename);
    }
    await product.save();

    res.redirect(`/categories/${product.cateId}`);
  } catch (error) {
    return next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    const filePath = path.join(__dirname, product.image);
    await product.remove();

    res.redirect(`/categories/${product.cateId}`);
  } catch (error) {
    return next(error);
  }
}

//Accounts Manage
async function createNewAccount(req, res, next) {
  const enteredData = {
    ...req.body,
    cityID: req.body.city,
    districtID: req.body.district,
    wardID: req.body.ward,
  };

  if (enteredData.password !== enteredData.confirmPassword) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: "Password confirmation failed",
        ...enteredData,
      },
      function () {
        res.redirect("/accounts");
      }
    );
    return;
  }

  const user = new User({
    ...enteredData,
    address: `${enteredData.street}, ${enteredData.ward}, ${enteredData.district}, ${enteredData.city}`,
    image: "user.png",
    GoogleOrFacebookUsername: "",
  });

  try {
    const existsAlready = await user.getWithSameUsername();

    if (existsAlready) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: `The username "${enteredData.username}" already exists`,
          ...enteredData,
        },
        function () {
          res.redirect("/accounts");
        }
      );
      return;
    }

    await user.signup(false);
  } catch (error) {
    return next(error);
  }

  res.redirect(
    `https://localhost:5000/?username=${enteredData.username}&login=2`
  );
}

async function deleteAccount(req, res, next) {
  const user = await User.findById(req.params.id);

  try {
    await user.remove();
  } catch (error) {
    return next(error);
  }

  res.redirect(`https://localhost:5000/delete?username=${user.username}`);
}

//Orders Manage
async function getAllOrders(req, res, next) {
  try {
    const orders = await Order.findAll();
    res.render("shared/orders/order-list", {
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
}

//Vouchers Manage
async function createNewVoucher(req, res, next) {
  const voucher = new Voucher({
    ...req.body,
    image: req.file.filename,
    isSpecial: false,
  });

  try {
    await voucher.save();
  } catch (error) {
    return next(error);
  }

  res.redirect("/vouchers");
}

async function updateVoucher(req, res, next) {
  const voucher = new Voucher({
    _id: req.params.id,
    ...req.body,
    isSpecial: false,
  });

  if (req.file) {
    voucher.replaceImage(req.file.filename);
  }

  try {
    await voucher.save();
  } catch (error) {
    return next(error);
  }

  res.redirect("/vouchers");
}

async function deleteVoucher(req, res, next) {
  try {
    const voucher = await Voucher.findById(req.params.id);
    const filePath = path.join(__dirname, voucher.image);
    await voucher.remove();
  } catch (error) {
    return next(error);
  }

  res.redirect("/vouchers");
}

//Statistic
async function getStatistic(req, res, next) {
  res.render("admin/statistic/admin-statistic");
}

async function postRevenueByMonth(req, res, next) {
  const currentYear = new Date().getFullYear();
  let revenue = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  try {
    const orders = await Order.findAll();
    const orderInYear = orders.filter(
      (order) => order.date.getFullYear() === currentYear
    );

    for (let order of orderInYear) {
      if (order.status === "fulfilled") {
        revenue[order.date.getMonth()] += order.productData.totalPrice;
      }
    }

    res.status(200).send({ data: revenue });
  } catch (error) {
    next(error);
  }
}

async function postRevenue10Year(req, res, next) {
  const currentYear = new Date().getFullYear();
  let revenue = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  try {
    const orders = await Order.findAll();
    const orderByYear = orders.filter(
      (order) =>
        order.date.getFullYear() >= currentYear - 9 &&
        order.date.getFullYear() <= currentYear
    );

    for (let order of orderByYear) {
      if (order.status === "fulfilled") {
        revenue[9 - (currentYear - order.date.getFullYear())] +=
          order.productData.totalPrice;
      }
    }

    res.status(200).send({ data: revenue });
  } catch (error) {
    next(error);
  }
}

async function postQuantityByMonth(req, res, next) {
  const currentYear = new Date().getFullYear();
  let products = new Map();

  try {
    const orders = await Order.findAll();
    const orderInYear = orders.filter(
      (order) => order.date.getFullYear() === currentYear
    );

    for (let order of orderInYear) {
      if (order.status === "fulfilled") {
        for (let item of order.productData.items) {
          if (!products.has(item.product.title)) {
            products.set(
              item.product.title,
              [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            );
          }
          products.get(item.product.title)[order.date.getMonth()] +=
            item.quantity;
        }
      }
    }

    const quantity = Array.from(products.entries()).sort((a, b) => {
      return a[0].localeCompare(b[0]);
    });

    res.status(200).send({ data: quantity });
  } catch (error) {
    next(error);
  }
}

async function postQuantity10Year(req, res, next) {
  const currentYear = new Date().getFullYear();
  let products = new Map();

  try {
    const orders = await Order.findAll();
    const orderInYear = orders.filter(
      (order) =>
        order.date.getFullYear() >= currentYear - 9 &&
        order.date.getFullYear() <= currentYear
    );

    for (let order of orderInYear) {
      if (order.status === "fulfilled") {
        for (let item of order.productData.items) {
          if (!products.has(item.product.title)) {
            products.set(item.product.title, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
          }
          products.get(item.product.title)[
            9 - (currentYear - order.date.getFullYear())
          ] += item.quantity;
        }
      }
    }

    const quantity = Array.from(products.entries()).sort((a, b) => {
      return a[0].localeCompare(b[0]);
    });

    res.status(200).send({ data: quantity });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createNewCategory: createNewCategory,
  getUpdateCategory: getUpdateCategory,
  updateCategory: updateCategory,
  deleteCategory: deleteCategory,

  createNewProduct: createNewProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct,

  createNewAccount: createNewAccount,
  deleteAccount: deleteAccount,

  getAllOrders: getAllOrders,

  createNewVoucher: createNewVoucher,
  updateVoucher: updateVoucher,
  deleteVoucher: deleteVoucher,

  getStatistic: getStatistic,
  postRevenueByMonth: postRevenueByMonth,
  postRevenue10Year: postRevenue10Year,
  postQuantityByMonth: postQuantityByMonth,
  postQuantity10Year: postQuantity10Year,
};
