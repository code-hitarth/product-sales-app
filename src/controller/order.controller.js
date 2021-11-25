const Order = require("../models/orderModel.js");
const orderRoute = require("../routes/order.route.js");
const constants = require("../constant.js");

const createOrder = async (req, res) => {
  if (!req.body.quantity || !req.body.productId) {
    return res
      .status(constants.WebStatusCode.BADREQUEST)
      .send({ message: "Please enter valid input fields" });
  } else {
    try {
      if (req.body.date) {
        req.body.date = new Date(req.body.date).getTime();
      }
      const order = new Order(req.body);

      const response = await Order.insertMany(order);
      if (response) {
        res
          .status(constants.WebStatusCode.SUCCESS)
          .send({ message: "Order created", data: response });
      } else {
        return res
          .status(constants.WebStatusCode.BADREQUEST)
          .send({ message: "Order refused to create" });
      }
    } catch (error) {
      console.log(error);
      return res.status(constants.WebStatusCode.BADREQUEST).send(error);
    }
  }
};

module.exports = { createOrder };
