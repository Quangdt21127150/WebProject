const Order = require("../models/order.model");
const User = require("../models/user.model");

async function getOrders(req, res) {
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render("customer/orders/all-orders", {
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
}

async function addOrder(req, res, next) {
  const cart = res.locals.cart;

  let userDocument;
  try {
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }

  const order = new Order(cart, userDocument);

  try {
    await order.save();
  } catch (error) {
    next(error);
    return;
  }

  req.session.cart = null;

  const orders = await Order.findAllPendingForUser(res.locals.uid);
  const customer = orders[0].userData.username;
  let price = 0;
  for (let order of orders) {
    price += order.productData.totalPrice;
  }

  if (price !== 0) {
    res.redirect(
      `https://localhost:5000/transfer?username=${customer}&price=${price}`
    );
    return;
  }

  res.redirect("/orders");
}

module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
};
