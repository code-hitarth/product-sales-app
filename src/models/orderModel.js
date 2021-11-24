const mongoose = require('mongoose');
const orderSchea = mongoose.Schema({
    product: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        trim: true,
        default: 0
    },
    date: {
        type: Date,
        trim: true,
        default: new Date(Date.now()).toLocaleDateString()
    },
}, {
    timestamps: true
})



const Order = mongoose.model('Order', orderSchea);
module.exports = Order