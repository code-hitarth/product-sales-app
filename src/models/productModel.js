const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
      min: 10,
      max: 1000,
      validate(price) {
        if (price < 10 || price > 1000) {
          throw new Error("Please enter price between 10 and 1000");
        }
      },
    },
    estimatedSalesPerWeek: {
      type: Number,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
