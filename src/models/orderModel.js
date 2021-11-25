const mongoose = require('mongoose');
const orderSchema = mongoose.Schema({

    quantity: {
        type: Number,
        required: true,
        trim: true,
        default: 0
    },
    date: {
        type: Number,
        trim: true,
        default: Date.now(),
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "products"
    }
})




const Order = mongoose.model('Order', orderSchema);
module.exports = Order