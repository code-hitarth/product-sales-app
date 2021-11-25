const express = require('express');
const orderRoute = express.Router();
const {createOrder} = require('../controller/order.controller.js')

orderRoute.post('/orders', createOrder);




module.exports = orderRoute