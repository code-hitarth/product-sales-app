const Order = require('../models/orderModel.js')
const orderRoute = require('../routes/order.route.js')
const constants = require('../constant.js')
const mongoose = require('mongoose')

const createOrder = async(req,res)=>{
    if(!req.body.productName || !req.body.quantity){
        return res.status(constants.WebStatusCode.BADREQUEST).send({message:"Please enter valid input fields"})
    }else{
        const order = new Order(req.body)
        try{
            
        const response = await Order.insertMany(order);
        if(response){
            res.status(constants.WebStatusCode.SUCCESS).send({message:"Order created", data:response})
        }
        else{
           return res.status(constants.WebStatusCode.BADREQUEST).send({message:'Order refused to create'})
        }
    }catch(error){
        console.log(error)
        return res.status(constants.WebStatusCode.BADREQUEST).send(error);
    }
    }
}


module.exports = {createOrder}