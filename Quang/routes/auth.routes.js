const express = require("express");

const authController = require("../controllers/auth.controller");

const router = express.Router();

router.get("/signup", authController.getSignup);

router.post("/signup", authController.signup);

router.get("/login", authController.getLogin);

router.post("/login", authController.login);

router.get("/gg", authController.google);

router.get("/gg/auth", async (req, res) => {
  res.redirect("/products");
});

router.post("/logout", authController.logout);

module.exports = router;
