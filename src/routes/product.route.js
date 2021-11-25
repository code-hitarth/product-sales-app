const express = require('express');
const productRoute = express.Router();
const { createProduct, getProductByTitle, getAllProducts, mainApi } = require('../controller/product.controller.js')




productRoute.post('/products', createProduct)

productRoute.get('/products', getAllProducts)

productRoute.get('/products/search/:title', getProductByTitle)

productRoute.get('/products/mainapi/:title', mainApi)


module.exports = productRoute