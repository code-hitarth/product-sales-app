const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        lowercase: true
    },
    price: {
        type: Number,
        trim: true,
        required: true,
    },
    estimatedSalesPerWeek: {
        type: Number,
        trim: true,
        required: true,
    }

}, { timestamps: true })


const Product = mongoose.model("Product", productSchema)

module.exports = Product