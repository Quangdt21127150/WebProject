const Category = require("../models/category.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");

function mergeProducts(p_root, p_temp) {
  let products = [];
  for (let r of p_root) {
    for (let t of p_temp) {
      if (r.title === t.title) {
        products.push(r);
      }
    }
  }
  return products;
}

async function getProducts(req, res, next) {
  try {
    const categories = await Category.findAll();
    const name = req.query.name || "";
    const cateID = req.query.cateID || "all";
    const price = req.query.price || "all";

    /* Get bestseller */
    let quantityOfProducts = new Map();
    const orders = await Order.findAll();
    for (let order of orders) {
      if (order.status === "fulfilled") {
        for (let item of order.productData.items) {
          if (!quantityOfProducts.has(item.product.title)) {
            quantityOfProducts.set(item.product.title, 0);
          }
          quantityOfProducts.set(
            item.product.title,
            quantityOfProducts.get(item.product.title) + item.quantity
          );
        }
      }
    }
    quantityOfProducts = Array.from(quantityOfProducts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    for (let i = quantityOfProducts.length; i < 5; ++i) {
      quantityOfProducts.push(["-1", 0]);
    }
    const bestseller = [
      await Product.findByName(quantityOfProducts[0][0]),
      await Product.findByName(quantityOfProducts[1][0]),
      await Product.findByName(quantityOfProducts[2][0]),
      await Product.findByName(quantityOfProducts[3][0]),
      await Product.findByName(quantityOfProducts[4][0]),
    ];

    /*Search and filter*/
    let products = await Product.findAll();
    if (name !== "") {
      products = mergeProducts(products, await Product.findByInputString(name));
    }
    if (cateID !== "all") {
      products = mergeProducts(products, await Product.findByCateId(cateID));
    }
    if (price === "cheap") {
      products = mergeProducts(products, await Product.findLowerPrice(100000));
    } else if (price === "medium") {
      products = mergeProducts(
        products,
        await Product.findInPriceRange(100000, 500000)
      );
    } else if (price === "expensive") {
      products = mergeProducts(
        products,
        await Product.findGreaterPrice(500000)
      );
    }

    /*Pagination*/
    let page = parseInt(req.query.page) || 1,
      per_page = 6,
      total_page = Math.ceil(products.length / per_page),
      start = (page - 1) * per_page,
      end = page * per_page;
    if (page === total_page || products.length === 0) {
      end = products.length;
    }

    res.render("customer/products/all-products", {
      bestseller: bestseller,
      categories: categories,
      products: products,
      page: page,
      name: name,
      cateID: cateID,
      price: price,
      start: start,
      end: end,
      total_page: total_page,
    });
  } catch (error) {
    next(error);
  }
}

async function getProductDetails(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    const products_cateID = await Product.findByCateId(product.cateId);
    let related_products = [];
    products_cateID.forEach((element) => {
      if (element.id !== product.id) {
        related_products.push(element);
      }
    });

    res.render("customer/products/product-details", {
      product: product,
      related_products: related_products,
      number_product: related_products.length,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts: getProducts,
  getProductDetails: getProductDetails,
};
