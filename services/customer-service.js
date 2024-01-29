let customer = require("../models/customerModel")

async function SaveCustomer(req) {

    const { name, mobileNo, email, address, cPerson, cMobileNo, remark, creditLimit } = req.body;
    const newCustomer = new customer({
        name,
        mobileNo,
        email,
        address,
        cPerson,
        cMobileNo,
        remark,
        creditLimit
    })
    try {
        const result = await newCustomer.save();
        console.log(result);
        if (result) {
            return { status: 200, message: "Customer saved successfully", data: result };
        }
        else {
            return { status: 400, message: "Error while saving customer", data: null, error: result.error };
        }

    } catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyValue) {
            return { status: 400, message: `Duplicate key error ${JSON.stringify(err.keyValue)}`, error: err };
        } else {
            return { status: 500, message: `Error while saving customer ${err}`, error: err };
        }
    }
}


module.exports = {
    SaveCustomer,

}