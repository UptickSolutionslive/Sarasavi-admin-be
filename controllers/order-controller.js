"use strict";
var OrderService = require("../services/order-service");
var response = require("../utils/response-utils");

async function createOrder(req, res) {
    try {
        const result = await OrderService.createOrder(req);
        if (result.status === 200) {
            
            return response.sendSuccessResponse("Order saved successfully", result, res);
        }
        else {
            if (result.error.code == 11000) {
                return response.sendBadRequestResponse("Order already exist", null, result.error, res)
            }
            return response.sendBadRequestResponse("Error while saving order", null, result.error, res);
        }
    }
    catch (err) {
        console.log(err)    
        return response.sendServerErrorResponse("Error while catch saving order", null, err, res);
    }
}

async function getAllOrders (req, res) {
    try {
        const result = await OrderService.getAllOrders(req);
        if (result.status === 200) {
            return response.sendSuccessResponse("Orders retrieved successfully", result, res);
        }

        else {
            return response.sendBadRequestResponse("Error while retrieving orders", null, result.error, res);
        }
    }
    catch (err) {
        return response.sendServerErrorResponse("Error while retrieving orders", null, err, res);
    }
}

module.exports = {
    createOrder,
    getAllOrders,
}