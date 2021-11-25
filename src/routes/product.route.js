const express = require('express');
const productRoute = express.Router();
const { createProduct, getProductByTitle, getAllProducts } = require('../controller/product.controller.js')




productRoute.post('/products', createProduct)

productRoute.get('/products', getAllProducts)

productRoute.get('/products/search/:title', getProductByTitle)


module.exports = productRoute