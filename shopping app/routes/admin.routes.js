const express = require("express");

const adminController = require("../controllers/admin.controller");
const imageUploadMiddleware = require("../middlewares/image-upload");

const router = express.Router();

// /admin/categories
router.get("/categories/new", adminController.getNewCategory);

router.post("/categories", adminController.createNewCategory);

router.get("/categories/:id", adminController.getUpdateCategory);

router.post("/categories/:id", adminController.updateCategory);

router.post("/categories/delete/:id", adminController.deleteCategory);

// /admin/products
router.get("/products/new", adminController.getNewProduct);

router.post(
  "/products",
  imageUploadMiddleware,
  adminController.createNewProduct
);

router.get("/products/:id", adminController.getUpdateProduct);

router.post(
  "/products/:id",
  imageUploadMiddleware,
  adminController.updateProduct
);

router.post("/products/delete/:id", adminController.deleteProduct);

// /admin/accounts
router.get("/accounts/new", adminController.getNewAccount);

router.post("/accounts", adminController.createNewAccount);

router.post("/accounts/delete/:id", adminController.deleteAccount);

// /admin/orders
router.get("/orders", adminController.getOrders);

router.patch("/orders/:id", adminController.updateOrder);

// /admin/statistic
router.get("/statistic", adminController.getDataStatistic);

router.post("/statistic", adminController.postStatistic);

module.exports = router;
