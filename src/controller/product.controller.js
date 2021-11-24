const Product = require('../models/productModel.js')
const constants = require('../constant.js')

const createProduct = async (req, res) => {

    //check if body is valid or not
    if (!req.body.title || !req.body.price || !req.body.estimatedSalesPerWeek) {
        return res.status(constants.WebStatusCode.BADREQUEST).send({ message: "Please enter valid input fields" })
    } else {
        const product = new Product(req.body)
        try {

            //Check if product already exists or not
            const result = await Product.findOne({ title: req.body.title })
            if (result) {
                return res.status(constants.WebStatusCode.BADREQUEST).send({ message: 'Product already exists' })
            }
            else {
                const response = await product.save();
                res.status(constants.WebStatusCode.SUCCESS).send({ message: "Product created successfully!", data: response })
            }
        } catch (error) {
            return res.status(constants.WebStatusCode.BADREQUEST).send({ message: error })
        }
    }
}


const getAllProducts = async (req, res) => {
    try {
        const response = await Product.find();
        if (response) {
            res.status(constants.WebStatusCode.SUCCESS).send({ message: "Here are your products", data: response })
        }
        else {
            return res.status(constants.WebStatusCode.BADREQUEST).send({ message: 'No products found', data: {} })
        }
    } catch (error) {
        return res.status(constants.WebStatusCode.BADREQUEST).send({ error })
    }
}


const getProductByTitle = async (req, res) => {
    console.log(req.params.title)
    if (!req.params.title) {
        return res.status(constants.WebStatusCode.BADREQUEST).sendDate({ message: "Please enter product name" })
    } else {
        try {
            const title = req.params.title;
            const response = await Product.findOne({ title: { '$regex': `^${title}$`, '$options': 'i' } })
            if (response) {
                res.status(constants.WebStatusCode.SUCCESS).send({ message: "Here are your product details", data: response })
            }
            else {
                return res.status(constants.WebStatusCode.BADREQUEST).send({ message: "No product found", data: {} })
            }
        } catch (error) {
            return res.status(constants.WebStatusCode.BADREQUEST).send(error)
        }
    }
}


module.exports = { createProduct, getProductByTitle, getAllProducts }