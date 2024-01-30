let customer = require("../models/customer-model")

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

async function getAllCustomers() {
    try {
        const result = await customer.find();
        if (result) {
            return { status: 200, message: "Customers fetched successfully", data: result };
        }
        else {
            return { status: 400, message: "Error while fetching customer", data: null, error: result.error };
        }

    } catch (err) {
        return { status: 500, message: `Error while fetching customer ${err}`, error: err };
    }
}

async function updateCustomer(req){
    let cusId = req.params.id;
    const { name, mobileNo, email, address, cPerson, cMobileNo, remark, creditLimit } = req.body;
    
    const update = {
        name,
        mobileNo,
        email,
        address,
        cPerson,
        cMobileNo,
        remark,
        creditLimit
    }
    try{
        const result = await customer.findByIdAndUpdate(cusId, update);

        if(result){
            return {status:200,message:"Customer updated successfully",data:result};
        }else{
            return {status:400,message:"Error while fetching customer",data:null,error:result.error};
        }
    }catch(err){
        return { status: 500, message: `Error while updating customer ${err}`, error: err };
    }
}

async function deleteCustomer(req) {
    let userId = req.params.id;
    const result = await customer.findByIdAndDelete(userId);

    try {
        if(result){
            return {status:200,message:"Customer deleted successfully",data:result};
        }else{
            return {status:400,message:"Error while deleting customer",data:null,error:result.error};
        }
    } catch (err) {
        return { status: 500, message: `Error while deleting customer ${err}`, error: err };
    }
}


module.exports = {
    SaveCustomer,
    getAllCustomers,
    updateCustomer,
    deleteCustomer

}