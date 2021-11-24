const express = require('express');
const mongoose = require('mongoose')
const productRoute = require('./routes/product.route.js')
const bodyParser = require('body-parser');
require('./db/mongoose.js')


const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(productRoute)


app.listen(PORT, () => {
    console.log("Server is up and running at " + PORT)
})



