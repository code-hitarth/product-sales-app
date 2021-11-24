const express = require('express');
const Product = require('../models/productModel');
const constants = require('../constant.js');
const productRoute = express.Router();
const url = require('url');
const { createProduct, findProductByTitle, getAllProducts } = require('../controller/product.controller.js')




productRoute.post('/products', createProduct)

productRoute.get('/products', getAllProducts)

productRoute.get('/products/search/:title', getProductByTitle)


module.exports = productRoute