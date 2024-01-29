"use strict";
const CustomerService = require("../services/customer-service");
var response = require("../utils/response-utils");


async function CreateCustomer(req, res) {
    try {
        const result = await CustomerService.SaveCustomer(req);
        if (result.status === 200) {
            return response.sendSuccessResponse("Customer saved successfully", result, res);
        }
        else {
            return response.sendBadRequestResponse("Error while saving customer", null, result.error, res);
        }
    }
    catch (err) {
        return response.sendServerErrorResponse("Error while saving customer", null, err, res);
    }
}

module.exports = {
    CreateCustomer,
}


