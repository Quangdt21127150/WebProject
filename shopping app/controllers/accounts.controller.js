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
  const enteredData = {
    username: req.body.username,
    fullname: req.body.fullname,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city,
  };

  const account = new Account({
    _id: req.params.id,
    username: enteredData.username,
    password: "",
    name: enteredData.fullname,
    address: {
      street: enteredData.street,
      postalCode: enteredData.postal,
      city: enteredData.city,
    },
    isAdmin: false,
  });

  const staticAcc = await Account.findById(req.params.id);

  try {
    const existsAlready = await Account.findExisted(
      enteredData.username,
      req.params.id
    );

    if (existsAlready.length !== 0) {
      res.redirect(`/accounts/${req.params.id}`);
      return;
    }

    account.isAdmin = staticAcc.isAdmin;
    await account.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect(
    `https://localhost:5000/pay_accounts/update?username=${staticAcc.username}&new=${enteredData.username}`
  );
}

module.exports = {
  getAllAccounts: getAllAccounts,
  getAccount: getAccount,
  getUpdateAccount: getUpdateAccount,
  updateAccount: updateAccount,
};
