const Product = require("../models/productModel.js");
const Order = require("../models/orderModel.js");
const constants = require("../constant.js");
const moment = require("moment");

const createProduct = async (req, res) => {
  //check if body is valid or not
  if (!req.body.title || !req.body.price || !req.body.estimatedSalesPerWeek) {
    return res
      .status(constants.WebStatusCode.BADREQUEST)
      .send({ message: "Please enter valid input fields" });
  } else {
    const product = new Product(req.body);
    try {
      //Check if product already exists or not
      const result = await Product.findOne({ title: req.body.title });
      if (result) {
        return res
          .status(constants.WebStatusCode.BADREQUEST)
          .send({ message: "Product already exists" });
      } else {
        const response = await product.save();
        res
          .status(constants.WebStatusCode.SUCCESS)
          .send({ message: "Product created successfully!", data: response });
      }
    } catch (error) {
      return res
        .status(constants.WebStatusCode.BADREQUEST)
        .send({ message: error });
    }
  }
};

const getAllProducts = async (req, res) => {
  try {
    const response = await Product.find();
    if (response) {
      res
        .status(constants.WebStatusCode.SUCCESS)
        .send({ message: "Here are your products", data: response });
    } else {
      return res
        .status(constants.WebStatusCode.BADREQUEST)
        .send({ message: "No products found", data: {} });
    }
  } catch (error) {
    return res.status(constants.WebStatusCode.BADREQUEST).send({ error });
  }
};

const getProductByTitle = async (req, res) => {
  if (!req.params.title) {
    return res
      .status(constants.WebStatusCode.BADREQUEST)
      .sendDate({ message: "Please enter product name" });
  } else {
    try {
      const title = req.params.title;
      const response = await Product.findOne({
        title: { $regex: `^${title}$`, $options: "i" },
      });
      if (response) {
        res
          .status(constants.WebStatusCode.SUCCESS)
          .send({ message: "Here are your product details", data: response });
      } else {
        return res
          .status(constants.WebStatusCode.BADREQUEST)
          .send({ message: "No product found", data: {} });
      }
    } catch (error) {
      return res.status(constants.WebStatusCode.BADREQUEST).send(error);
    }
  }
};


function getLastSeven() {
  const a = Date.now();
  const prev = moment(a).subtract(7, "days").format("YYYY-MM-DD");
  return new Date(prev).getTime();
}

const calcPercentage = (a, b) => {
  if (a > b) {
    return "a should be greater than b";
  } else {
    const c = (b - a) / b;
    return c * 100;
  }
};

const newPrice = (price, percent) => {
  const updated = price - price * percent;
  return updated;
};

const mainApi = async (req, res) => {
  console.log(req.params.title);
  try {
    const productList = await Product.find().lean();
    if (productList) {
      const finalArr = [];
      for (let i = 0; i < productList.length; i++) {
        const lastseven = getLastSeven();
        const orderList = await Order.find({
          productId: productList[i]._id,
          date: {
            $gte: lastseven,
            $lte: Date.now(),
          },
        });


        if (orderList) {
          if (orderList.length) {
            orderList.forEach((x) => (x.date = new Date(x.date)));
            
            const allQuantity = orderList.map((data) => data.quantity);

            const lastWeekSales = allQuantity.reduce(
              (acc, curr) => acc + curr,
              0
            );

            if (lastWeekSales < productList[i].estimatedSalesPerWeek) {
              const percentageLess = calcPercentage(
                lastWeekSales,
                productList[i].estimatedSalesPerWeek
              );
           
              let updatePrice;
              const price = productList[i].price;
              if (percentageLess > 0 && percentageLess < 10) {
                updatePrice = newPrice(price, 0.1);
              } else if (percentageLess >= 10 && percentageLess < 25) {
                updatePrice = newPrice(price, 0.1);
              } else if (percentageLess >= 25) {
                updatePrice = newPrice(price, 0.1);
              }


              //updatingdatabase
              const final = await Product.findByIdAndUpdate(
                productList[i]._id,
                { price: updatePrice.toFixed(2) },
                { new: true }
              );

              if (final) {
                finalArr.push(final);
              }
            } else {
              console.log(
                `Your products are up to date! no need to update price ${productList[i].title}`
              );
            }
          } else {
            return res
              .status(constants.WebStatusCode.BADREQUEST)
              .send({ message: "No last week order data found" });
          }
        } else {
          return res
            .status(constants.WebStatusCode.BADREQUEST)
            .send({ message: "No  order data found" });
        }
      }
      res
        .status(constants.WebStatusCode.SUCCESS)
        .send({ message: "Here are your products", data:finalArr });
    } else {
      return res
        .status(constants.WebStatusCode.BADREQUEST)
        .send({ message: "No products found", data: {} });
    }
  } catch (error) {
    return res.status(constants.WebStatusCode.BADREQUEST).send(error);
  }
};

const updateProduct = async (req, res) => {
  if (!req.params.id) {
    return res
      .status(constants.WebStatusCode.BADREQUEST)
      .send({ message: "Please enter product id" });
  } else {
    try {
      const _id = req.params.id;
      const response = await Product.findByIdAndUpdate(
        { _id },
        {
          title: req.body.title,
          price: req.body.price,
          estimatedSalesPerWeek: req.body.estimatedSalesPerWeek,
        },
        { new: true }
      );

      if (response) {
        res
          .status(constants.WebStatusCode.SUCCESS)
          .send({ message: "Here is your data", data: response });
      } else {
        return res
          .status(constants.WebStatusCode.BADREQUEST)
          .send({ message: "No product found" });
      }
    } catch (error) {
      return res.status(constants.WebStatusCode.BADREQUEST).send(error);
    }
  }
};

module.exports = {
  createProduct,
  getProductByTitle,
  getAllProducts,
  mainApi,
  updateProduct,
};
