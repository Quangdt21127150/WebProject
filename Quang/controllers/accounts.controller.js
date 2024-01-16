const Account = require("../models/account.model");

async function getAllAccounts(req, res, next) {
  try {
    const accounts = await Account.findAll();
    res.render("admin/accounts/all-accounts", {
      accounts: accounts,
    });
  } catch (error) {
    next(error);
  }
}

async function getAccount(req, res, next) {
  try {
    const account = await Account.findById(req.session.uid);
    res.render("customer/account/profile", {
      account: account,
    });
  } catch (error) {
    next(error);
  }
}

async function getUpdateAccount(req, res, next) {
  try {
    const account = await Account.findById(req.session.uid);
    res.render("customer/account/update-account", { account: account });
  } catch (error) {
    next(error);
  }
}

async function updateAccount(req, res, next) {
  const account = new Account({
    _id: req.params.id,
    username: req.body.username,
    password: "",
    name: req.body.fullname,
    address: {
      street: req.body.street,
      postalCode: req.body.postal,
      city: req.body.city,
    },
    isAdmin: false,
  });

  try {
    await account.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/profile");
}

module.exports = {
  getAllAccounts: getAllAccounts,
  getAccount: getAccount,
  getUpdateAccount: getUpdateAccount,
  updateAccount: updateAccount,
};
