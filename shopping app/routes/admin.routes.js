const express = require("express");

const adminController = require("../controllers/admin.controller");
const imageUploadMiddleware = require("../middlewares/image-upload");

const router = express.Router();

// admin/categories
router.post("/categories", adminController.createNewCategory);

router.get("/categories/:id", adminController.getUpdateCategory);

router.post("/categories/:id", adminController.updateCategory);

router.post("/categories/delete/:id", adminController.deleteCategory);

// admin/products
router.post(
  "/products",
  imageUploadMiddleware,
  adminController.createNewProduct
);

router.post(
  "/products/:id",
  imageUploadMiddleware,
  adminController.updateProduct
);

router.post("/products/delete/:id", adminController.deleteProduct);

// admin/accounts
router.post("/accounts", adminController.createNewAccount);

router.post("/accounts/delete/:id", adminController.deleteAccount);

// admin/orders
router.get("/orders", adminController.getAllOrders);

// admin/vouchers
router.post(
  "/vouchers",
  imageUploadMiddleware,
  adminController.createNewVoucher
);

router.post(
  "/vouchers/:id",
  imageUploadMiddleware,
  adminController.updateVoucher
);

router.post("/vouchers/delete/:id", adminController.deleteVoucher);

// admin/statistic
router.get("/statistic", adminController.getStatistic);

router.post("/revenue", adminController.postRevenueByMonth);

router.post("/revenue2", adminController.postRevenue10Year);

router.post("/quantity", adminController.postQuantityByMonth);

router.post("/quantity2", adminController.postQuantity10Year);

module.exports = router;
