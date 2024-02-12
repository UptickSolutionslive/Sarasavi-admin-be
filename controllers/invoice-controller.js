"use strict";
var InvoiceService = require("../services/invoice-service");
var response = require("../utils/response-utils");

async function getAllInvoices(req, res) {
    try {
        const result = await InvoiceService.getAllInvoices();
        if (result.status === 200) {
            return response.sendSuccessResponse("Invoices retrieved successfully", result, res);
        }
        else {
            return response.sendBadRequestResponse("Error while retrieving invoices", null, result.error, res);
        }
    }
    catch (err) {
        return response.sendServerErrorResponse("Error while retrieving invoices", null, err, res);
    }
}

async function updateInvoice(req, res) {
    try {
        const result = await InvoiceService.updateInvoice(req);
        if (result.status === 200) {
            return response.sendSuccessResponse("Invoice updated successfully", result, res);
        }
        else {
            return response.sendBadRequestResponse("Error while updating invoice", null, result.error, res);
        }
    }
    catch (err) {
        return response.sendServerErrorResponse("Error while updating invoice", null, err, res);
    }
}

module.exports = {
    getAllInvoices,
    updateInvoice,
}
