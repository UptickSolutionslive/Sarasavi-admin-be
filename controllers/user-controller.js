"use strict";
const UserService = require('../services/user-service');
var response = require("../utils/response-utils");


async function Login(req, res) {
    try {
        const result = await UserService.login(req);
        if (result.status === 200) {
            return response.sendSuccessResponse("User Login successfully", result, res);
        }
        else {
            return response.sendBadRequestResponse("Error while login userss", null, result.error, res);
        }
    }
    catch (err) {
        return response.sendServerErrorResponse("Error while login users", null, err, res);
    }
}



module.exports = {
   Login
}


