const express = require("express");
const productRoute = express.Router();
const {
  createProduct,
  getProductByTitle,
  getAllProducts,
  mainApi,
  updateProduct,
} = require("../controller/product.controller.js");

productRoute.post("/products", createProduct);

productRoute.get("/products", getAllProducts);

productRoute.get("/products/search/:title", getProductByTitle);

productRoute.get("/products/mainapi", mainApi);

productRoute.get("/products/:id", updateProduct);

module.exports = productRoute;
