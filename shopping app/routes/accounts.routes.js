const express = require("express");

const accountsController = require("../controllers/accounts.controller");

const router = express.Router();

router.get("/accounts", accountsController.getAllAccounts);

router.get("/profile", accountsController.getAccount);

router.get("/accounts/:id", accountsController.getUpdateAccount);

router.post("/accounts/:id", accountsController.updateAccount);

module.exports = router;
