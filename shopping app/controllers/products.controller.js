const Category = require("../models/category.model");
const Product = require("../models/product.model");

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
    let products = await Product.findAll();
    if (name !== "") {
      products = mergeProducts(products, await Product.findByName(name));
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

    let page = parseInt(req.query.page) || 1,
      per_page = 6,
      total_page = Math.ceil(products.length / per_page),
      start = (page - 1) * per_page,
      end = page * per_page;
    if (page === total_page || products.length === 0) {
      end = products.length;
    }

    console.log(req.query);
    console.log(page + " " + name + " " + cateID + " " + price);
    res.render("customer/products/all-products", {
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
