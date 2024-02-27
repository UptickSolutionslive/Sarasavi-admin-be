const chequeModel = require('../models/cheque-model');

async function getAllCheques() {
    try {
        const result = await chequeModel.find().sort({ createdAt: -1 });
        if (result) {
            return {
                status: 200,
                message: "Cheques fetched successfully",
                data: result,
            };
        } else {
            return {
                status: 400,
                message: "Error while fetching cheque",
                data: null,
                error: result.error,
            };
        }
    } catch (err) {
        return {
            status: 500,
            message: `Error while fetching cheque ${err}`,
            error: err,
        };
    }
}

module.exports = {
    getAllCheques,
}
