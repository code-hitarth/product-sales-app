const Product = require("../models/productModel.js");
const Order = require("../models/orderModel.js");
const constants = require("../constant.js");
const moment = require("moment");
const momentDate = moment();

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
  console.log(req.params.title);
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

function getPreviousMonday() {
  var date = new Date();
  var day = date.getDay();
  var prevMonday = new Date();
  if (date.getDay() == 0) {
    prevMonday = prevMonday.setDate(date.getDate() - 7);
  } else {
    prevMonday = prevMonday.setDate(date.getDate() - (day - 1) - 8);
  }

  return prevMonday;
}

function getLastSunday() {
  var t = new Date();
  t = t.setDate(t.getDate() - t.getDay());
  return t;
}

const calcPercentage = (a, b) => {
  if (a > b) {
    return "a should be greater than b";
  } else {
    const c = (b - a) / b;
    return c * 100;
  }
};


const newPrice = (price,percent)=>{
  const updated = price -(price*percent)
  return updated
}

const mainApi = async (req, res) => {

  console.log(req.params.title);
  
  if (!req.params.title) {
  
    return res
      .status(constants.WebStatusCode.BADREQUEST)
      .send({ message: "Please enter product name" });
  
    } else {
  
      try {
  
        const title = req.params.title;
        const response = await Product.findOne({
        title: { $regex: `${title}$`, $options: "i" },
        });
        
        if (response) {
        
          if(response.price>10&&response.price<1000){
          const getOrdersByProductId = await Order.find({
          productId: response._id,
          });
        
          // res.send({ findOrders })
        console.log(getOrdersByProductId)
        
        
        if (getOrdersByProductId) {
          const mon = getPreviousMonday();
          const sun = getLastSunday();
          let lastWeeksData = await Order.find({
            date: {
              $gte: mon,
              $lte: sun,
            },
          }).lean();
        
          if (lastWeeksData.length!=0) {
        
            lastWeeksData.forEach((x) => (x.date = new Date(x.date)));
            console.log(lastWeeksData.map((e) => e.quantity));

            const allQuantity = lastWeeksData.map((data) => data.quantity);

            const lastWeekSales = allQuantity.reduce(
              (acc, curr) => acc + curr,
              0
            );
              console.log(lastWeekSales)
        
              if (lastWeekSales < response.estimatedSalesPerWeek) {
        
                const percentageLess = calcPercentage(
                lastWeekSales,
                response.estimatedSalesPerWeek
              );
              console.log(percentageLess);
                console.log(getOrdersByProductId)
                console.log(response)
        
                if (percentageLess > 0 && percentageLess < 10) {
                const price = response.price
                const updatePrice = newPrice(price,0.1)
                // const updatePrice = response.price - response.price * 0.1;
                console.log(response.price);
        
                const final = await Product.findByIdAndUpdate(
                  { _id: response._id },
                  { price: updatePrice }
                );
        
                if (final) {
                  res
                    .status(constants.WebStatusCode.SUCCESS)
                    .send({ message: "Product price updated", data: final });
                } else {
                  return res.status(constants.WebStatusCode.BADREQUEST).send({
                    message: "Unable to find proudct and update it",
                    data: {},
                  });
                }
                } else if (percentageLess >= 10 && percentageLess < 25) {
                  const price = response.price
                  const updatePrice = newPrice(price,0.1)
                  console.log(response.price);

                const final = await Product.findByIdAndUpdate(
                  { _id: response._id },
                  { price: updatePrice }
                );
                
                if (final) {
                  res
                    .status(constants.WebStatusCode.SUCCESS)
                    .send({ message: "Product price updated", data: final });
                } else {
                  return res.status(constants.WebStatusCode.BADREQUEST).send({
                    message: "Unable to find proudct and update it",
                    data: {},
                  });
                }
                } else if (percentageLess >= 25) {
                const price = response.price
                const updatePrice = newPrice(price,0.1)
                console.log(updatePrice);

                const final = await Product.findByIdAndUpdate(
                  { _id: response._id },
                  { price: updatePrice }
                );
                if (final) {
                  res
                    .status(constants.WebStatusCode.SUCCESS)
                    .send({ message: "Product price updated", data: final });
                } else {
                  return res.status(constants.WebStatusCode.BADREQUEST).send({
                    message: "Unable to find proudct and update it",
                    data: {},
                  });
                }
              }
            } else {
              return res.status(constants.WebStatusCode.SUCCESS).send({
                message:
                  "Your products are up to date! no need to update price",
                  data:response
              });
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

        // res.send(lastWeeksData)
      }
      else{
        res.status(constants.WebStatusCode.BADREQUEST).send({message:"Price should be in between 10 and 1000"})
      }
      } else {
        return res
          .status(constants.WebStatusCode.BADREQUEST)
          .send({ message: "No products found" });
      }
    } catch (error) {
      console.log(error);
      return res.status(constants.WebStatusCode.BADREQUEST).send(error);
    }
  }
};

module.exports = { createProduct, getProductByTitle, getAllProducts, mainApi };
