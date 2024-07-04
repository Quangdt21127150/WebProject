const Order = require("../models/order.model");
const User = require("../models/user.model");
const Pay_Account = require("../models/pay.model");
const sessionFlash = require("../util/session-flash");

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
  try {
    const cart = res.locals.cart;
    const customerDocument = await User.findById(res.locals.uid);
    const newOrder = new Order(cart, customerDocument);
    const customer_username = customerDocument.username;
    const customer_surplus = (
      await Pay_Account.findByUsername(customer_username)
    ).surplus;
    let pending_order = await Order.findByPendingStatus(res.locals.uid);

    if (pending_order && customer_surplus < cart.totalPrice) {
      sessionFlash.flashDataToSession(
        req,
        {
          message: "You have an order that have not been paid for yet.",
          isError: true,
        },
        function () {
          res.redirect("/cart");
        }
      );
      return;
    }

    if (customer_surplus >= cart.totalPrice) {
      req.session.cart = null;
      newOrder.status = "fulfilled";
      await newOrder.save();

      res.redirect(
        `https://localhost:5000/transfer?username=${customer_username}&price=${cart.totalPrice}`
      );

      return;
    }

    if (!pending_order) {
      await newOrder.save();
    }
    sessionFlash.flashDataToSession(
      req,
      {
        message: `Your current account balance is ${customer_surplus}, not enough to pay. Order added to history with status pending.`,
        isError: true,
      },
      function () {
        res.redirect("/cart");
      }
    );
  } catch (error) {
    next(error);
    return;
  }
}

module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
};
