const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/ProductSales").then(() => {
    console.log("Connected to database")
}).catch((err) => { console.log("Couldnot connect to database") })