const express = require("express");

const vouchersController = require("../controllers/vouchers.controller");

const router = express.Router();

router.get("/vouchers", vouchersController.getAllVouchers);

router.get("/vouchers/avaiable", vouchersController.getAvaiableVouchers);

module.exports = router;
